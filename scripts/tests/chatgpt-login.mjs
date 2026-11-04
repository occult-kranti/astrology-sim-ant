// Deterministic signed-JWT/HTTP fixtures; no real sign-in, credentials or inference.
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign, createHash } from 'node:crypto';
import { mkdtemp, readFile, stat, chmod, rm, writeFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createChatGPTLogin } from '../../local-rag/chatgpt-login.mjs';

const ROOT = await mkdtemp(join(tmpdir(), 'workbench-siwc-test-'));
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const other = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'test-rsa-1', use: 'sig', alg: 'RS256' };
const ISS = 'https://auth.openai.com', BASE = 'http://127.0.0.1:8765';
const CLIENT = 'oaiapp_fixture123', NOW = Date.UTC(2026, 10, 4, 12);
const metadata = { issuer: ISS, authorization_endpoint: `${ISS}/api/accounts/authorize`, token_endpoint: `${ISS}/api/accounts/oauth/token`, revocation_endpoint: `${ISS}/api/accounts/oauth/revoke`, jwks_uri: `${ISS}/.well-known/jwks.json`, code_challenge_methods_supported: ['S256'], id_token_signing_alg_values_supported: ['RS256'] };
let assertions = 0, scenarios = 0;
const ok = (value, message) => { assertions++; assert.ok(value, message); };
const eq = (a, b, message) => { assertions++; assert.deepEqual(a, b, message); };
async function rejects(work, code) { assertions++; await assert.rejects(work, error => error.code === code); }
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const encode = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
function jwt(claims, options = {}) {
  const head = { alg: 'RS256', kid: 'test-rsa-1', typ: 'JWT', ...(options.header || {}) };
  const text = `${encode(head)}.${encode(claims)}`;
  return `${text}.${sign('RSA-SHA256', Buffer.from(text), options.wrongKey ? other.privateKey : privateKey).toString('base64url')}`;
}
async function fixture(options = {}) {
  scenarios++;
  const dir = await mkdtemp(join(ROOT, 'case-')), hostPath = join(dir, 'host.json');
  const calls = []; let clock = NOW, authURL, refreshCount = 0, onRefresh = options.onRefresh;
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    if (url === `${ISS}/.well-known/openid-configuration`) return json(options.metadata || metadata);
    if (url === `${ISS}/.well-known/jwks.json`) return json({ keys: options.keys || [jwk] });
    if (url === `${ISS}/api/accounts/oauth/revoke`) return new Response('', { status: options.revokeStatus || 200 });
    if (url === 'https://api.openai.com/v1/models') return json({ models: [{ slug: 'fixture-model', display_name: 'Fixture model', visibility: 'list' }, { slug: 'hidden-model', display_name: 'Hidden', visibility: 'hide' }] });
    assert.equal(url, `${ISS}/api/accounts/oauth/token`);
    const body = new URLSearchParams(init.body);
    if (body.get('grant_type') === 'refresh_token') {
      refreshCount++;
      if (onRefresh) await onRefresh();
      if (options.refreshError) return json({ error: options.refreshError }, 400);
      return json({ access_token: 'TEST_ACCESS_RENEWED', refresh_token: 'TEST_REFRESH_RENEWED', token_type: 'Bearer', expires_in: 3600, ...(options.refreshScope ? { scope: options.refreshScope } : {}) });
    }
    if (options.onCode) await options.onCode();
    if (options.tokenError) return json({ error: options.tokenError }, 400);
    const claims = { iss: ISS, sub: 'fixture-subject', aud: CLIENT, exp: clock / 1000 + 3600, iat: clock / 1000, nonce: authURL.searchParams.get('nonce'), email: 'fixture@example.test', ...(options.claims || {}) };
    return json({ access_token: 'TEST_ACCESS_ONLY', refresh_token: 'TEST_REFRESH_ONLY', token_type: 'Bearer', expires_in: options.expiresIn || 3600, scope: options.scope ?? 'openid profile email offline_access resource.invoke chatgpt.tokens.use.direct', id_token: jwt(claims, options.jwt || {}) });
  };
  const api = createChatGPTLogin({ fetchImpl, baseURL: BASE, hostPath, now: () => clock });
  async function begin(opts) { const result = await api.beginLogin(opts); authURL = new URL(result.authorizationUrl); return result; }
  const callback = (extra = {}) => {
    const u = new URL(`${BASE}/auth/callback`);
    for (const [key, value] of Object.entries({ code: 'TEST_CODE', state: authURL.searchParams.get('state'), client_id: CLIENT, ...extra })) { if (value != null) u.searchParams.set(key, value); }
    return u;
  };
  return { api, calls, hostPath, fetchImpl, begin, callback, auth: () => authURL, setClock: value => { clock = value; }, refreshCount: () => refreshCount };
}

try {
  for (const baseURL of ['https://127.0.0.1:8765', 'http://localhost:8765', 'http://0.0.0.0:8765', 'http://127.0.0.1:8765/path']) {
    assertions++; assert.throws(() => createChatGPTLogin({ baseURL }), error => error.code === 'local_origin_required');
  }
  const f = await fixture();
  const invalidations = []; const unsubscribe = f.api.subscribeSessionInvalidation(event => invalidations.push(event));
  eq(f.api.getSessionRevision(), 0);
  eq(f.api.status().state, 'disconnected'); eq(f.calls.length, 0, 'No automatic remote requests');
  await rejects(() => f.api.getAccessToken(), 'plan_permission_required');
  await f.begin();
  eq(f.auth().origin, ISS); eq(f.auth().pathname, '/api/accounts/authorize');
  eq(f.auth().searchParams.get('client_id'), 'dynamic_agent_client');
  eq(f.auth().searchParams.get('redirect_uri'), `${BASE}/auth/callback`);
  eq(f.auth().searchParams.get('resource'), 'https://api.openai.com/v1');
  eq(f.auth().searchParams.get('code_challenge_method'), 'S256');
  ok(f.auth().searchParams.get('scope').includes('chatgpt.tokens.use.direct'));
  const storedBefore = JSON.parse(await readFile(f.hostPath, 'utf8'));
  ok(storedBefore.hostId.startsWith('urn:uuid:')); eq((await stat(f.hostPath)).mode & 0o777, 0o600);
  await rejects(() => f.api.handleCallback(f.callback({ state: 'not-the-state' })), 'invalid_state');
  ok(f.api.status().pending, 'Wrong state cannot consume the legitimate transaction');
  const duplicate = f.callback(); duplicate.searchParams.append('code', 'duplicate');
  await rejects(() => f.api.handleCallback(duplicate), 'invalid_callback');
  const accepted = await f.api.handleCallback(f.callback());
  eq(accepted.state, 'authorized'); eq(accepted.inferenceVerified, false);
  eq(f.api.getSessionRevision(), 1); eq(invalidations.at(-1).reason, 'authorized-session-replaced');
  eq(await f.api.getAccessToken(), 'TEST_ACCESS_ONLY');
  const exchange = f.calls.find(call => call.url.endsWith('/oauth/token'));
  const form = new URLSearchParams(exchange.init.body);
  eq(form.get('client_id'), CLIENT); eq(form.get('redirect_uri'), `${BASE}/auth/callback`);
  eq(createHash('sha256').update(form.get('code_verifier')).digest('base64url'), f.auth().searchParams.get('code_challenge'));
  eq(form.has('client_secret'), false); eq(exchange.init.redirect, 'error');
  ok(!JSON.stringify(accepted).includes('TEST_ACCESS')); ok(!JSON.stringify(accepted).includes('TEST_REFRESH'));
  eq(await f.api.listModels(), [{ slug: 'fixture-model', displayName: 'Fixture model' }]);
  await rejects(() => f.api.handleCallback(f.callback()), 'invalid_state');
  const persisted = await readFile(f.hostPath, 'utf8');
  ok(!/TEST_ACCESS|TEST_REFRESH|id_token|access_token|refresh_token/.test(persisted), 'No tokens persist');
  eq(JSON.parse(persisted).registration.clientId, CLIENT);
  const loggedOut = await f.api.logout(); eq(loggedOut.connected, false); eq(loggedOut.revocationConfirmed, true);
  eq(f.api.getSessionRevision(), 2); eq(invalidations.at(-1).reason, 'signed-out'); unsubscribe();
  await rejects(() => f.api.getAccessToken(), 'plan_permission_required');
  await f.begin(); eq(f.auth().searchParams.get('client_id'), CLIENT); eq(f.auth().searchParams.has('agent_name_hint'), false);
  eq(f.auth().searchParams.get('ext_agent_host_id'), storedBefore.hostId);
  const reopened = createChatGPTLogin({ fetchImpl: f.fetchImpl, baseURL: BASE, hostPath: f.hostPath, now: () => NOW });
  const resume = new URL((await reopened.beginLogin()).authorizationUrl);
  eq(resume.searchParams.get('client_id'), CLIENT); eq(reopened.status().connected, false, 'Restart requires login despite retained client ID');

  for (const options of [
    { claims: { iss: 'https://attacker.test' } }, { claims: { aud: 'oaiapp_wrong' } },
    { claims: { exp: NOW / 1000 - 1 } }, { claims: { nonce: 'wrong-nonce' } },
    { claims: { iat: NOW / 1000 + 1000 } }, { claims: { sub: '' } },
    { claims: { aud: [CLIENT, 'another'], azp: 'another' } },
    { jwt: { header: { alg: 'none' } } }, { jwt: { wrongKey: true } },
    { keys: [{ ...jwk, kid: 'unknown-key' }] }
  ]) {
    const x = await fixture(options); await x.begin();
    await rejects(() => x.api.handleCallback(x.callback()), 'invalid_id_token');
    eq(x.api.status().connected, false); await rejects(() => x.api.getAccessToken(), 'plan_permission_required');
  }
  const noScope = await fixture({ scope: 'openid profile email' }); await noScope.begin(); await noScope.api.handleCallback(noScope.callback());
  eq(noScope.api.status().state, 'signed-in-without-plan-permission');
  await rejects(() => noScope.api.getAccessToken(), 'plan_permission_required');
  const expired = await fixture(); await expired.begin(); expired.setClock(NOW + 601000);
  await rejects(() => expired.api.handleCallback(expired.callback()), 'expired_login'); eq(expired.api.status().pending, false);
  const denied = await fixture(); await denied.begin(); await rejects(() => denied.api.handleCallback(denied.callback({ error: 'access_denied' })), 'authorization_denied');
  eq(denied.calls.some(call => call.url.endsWith('/oauth/token')), false);
  const wrongClient = await fixture(); await wrongClient.begin();
  await rejects(() => wrongClient.api.handleCallback(wrongClient.callback({ client_id: 'dynamic_agent_client' })), 'invalid_callback');
  const badDiscovery = await fixture({ metadata: { ...metadata, token_endpoint: 'https://attacker.test/token' } });
  await rejects(() => badDiscovery.begin(), 'unsupported_discovery');
  const failedToken = await fixture({ tokenError: 'invalid_grant' }); await failedToken.begin();
  await rejects(() => failedToken.api.handleCallback(failedToken.callback()), 'invalid_grant'); eq(failedToken.api.status().connected, false);
  await failedToken.begin(); eq(failedToken.auth().searchParams.get('client_id'), CLIENT, 'Expired initial code retries with its issued client ID');
  ok(!JSON.parse(await readFile(failedToken.hostPath, 'utf8')).registration, 'Unverified registration is not persisted');

  const rotating = await fixture({ expiresIn: 120 }); await rotating.begin(); await rotating.api.handleCallback(rotating.callback()); rotating.setClock(NOW + 61000);
  eq(await Promise.all(Array.from({ length: 8 }, () => rotating.api.getAccessToken())), Array(8).fill('TEST_ACCESS_RENEWED'));
  eq(rotating.refreshCount(), 1, 'Concurrent renewals serialize');
  const refreshCall = rotating.calls.find(call => String(call.init.body).includes('grant_type=refresh_token'));
  eq(new URLSearchParams(refreshCall.init.body).get('client_id'), CLIENT); eq(new URLSearchParams(refreshCall.init.body).has('scope'), false);
  await rotating.api.logout();
  const revocations = rotating.calls.filter(call => call.url.endsWith('/revoke'));
  eq(new URLSearchParams(revocations.at(-1).init.body).get('token'), 'TEST_REFRESH_RENEWED');
  const invalidRefresh = await fixture({ expiresIn: 120, refreshError: 'invalid_grant' }); await invalidRefresh.begin(); await invalidRefresh.api.handleCallback(invalidRefresh.callback()); invalidRefresh.setClock(NOW + 61000);
  await rejects(() => invalidRefresh.api.getAccessToken(), 'invalid_grant'); eq(invalidRefresh.api.status().connected, false);
  const revokeFail = await fixture({ revokeStatus: 503 }); await revokeFail.begin(); await revokeFail.api.handleCallback(revokeFail.callback());
  const ended = await revokeFail.api.logout(); eq(ended.revocationConfirmed, false); eq(ended.connected, false); ok(ended.notice.includes('not confirmed'));
  eq(revokeFail.calls.filter(call => call.url.endsWith('/revoke')).length, 2, 'Revocation retry is bounded');

  const replaced = await fixture(); await replaced.begin(); const old = replaced.callback(); await replaced.begin();
  await rejects(() => replaced.api.handleCallback(old), 'invalid_state');
  const cancelled = await fixture(); await cancelled.begin(); const abandoned = cancelled.callback(); await cancelled.api.logout();
  await rejects(() => cancelled.api.handleCallback(abandoned), 'invalid_state');
  const insecure = await fixture(); await insecure.begin(); await chmod(insecure.hostPath, 0o644);
  const insecureReopen = createChatGPTLogin({ baseURL: BASE, fetchImpl: insecure.fetchImpl, hostPath: insecure.hostPath });
  await rejects(() => insecureReopen.beginLogin(), 'unsafe_host_file');
  const symlinkPath = join(ROOT, 'linked.json'); await symlink(f.hostPath, symlinkPath);
  const linked = createChatGPTLogin({ baseURL: BASE, fetchImpl: f.fetchImpl, hostPath: symlinkPath });
  await rejects(() => linked.beginLogin(), 'unsafe_host_file');
  const corruptedPath = join(ROOT, 'corrupt.json'); await writeFile(corruptedPath, '{"schemaVersion":1,"hostId":"not-uuid"}', { mode: 0o600 });
  const corrupted = createChatGPTLogin({ baseURL: BASE, fetchImpl: f.fetchImpl, hostPath: corruptedPath });
  await rejects(() => corrupted.beginLogin(), 'invalid_host_file');

  let releaseCode, codeEntered;
  const codeGate = new Promise(resolve => { releaseCode = resolve; });
  const codeStarted = new Promise(resolve => { codeEntered = resolve; });
  const codeRace = await fixture({ onCode: async () => { codeEntered(); await codeGate; } }); await codeRace.begin();
  const codePending = codeRace.api.handleCallback(codeRace.callback()); await codeStarted;
  const codeLogout = await codeRace.api.logout(); eq(codeLogout.revocationConfirmed, false); eq(codeLogout.pendingRevocation, true); releaseCode();
  await rejects(() => codePending, 'superseded_login'); eq(codeRace.api.status().connected, false, 'Late code exchange cannot undo sign-out');
  ok(codeRace.calls.some(call => call.url.endsWith('/revoke') && new URLSearchParams(call.init.body).get('token') === 'TEST_REFRESH_ONLY'), 'Cancelled code exchange revokes its newly issued renewable grant');

  let releaseRefresh, refreshEntered;
  const refreshGate = new Promise(resolve => { releaseRefresh = resolve; });
  const refreshStarted = new Promise(resolve => { refreshEntered = resolve; });
  const refreshRace = await fixture({ expiresIn: 120, onRefresh: async () => { refreshEntered(); await refreshGate; } });
  await refreshRace.begin(); await refreshRace.api.handleCallback(refreshRace.callback()); refreshRace.setClock(NOW + 61000);
  const refreshPending = refreshRace.api.getAccessToken(); await refreshStarted;
  await refreshRace.api.logout(); releaseRefresh();
  await rejects(() => refreshPending, 'cancelled_session'); eq(refreshRace.api.status().connected, false);
  ok(refreshRace.calls.some(call => call.url.endsWith('/revoke') && new URLSearchParams(call.init.body).get('token') === 'TEST_REFRESH_RENEWED'), 'Late rotated credential is revoked after sign-out');

  const huge = await fixture({ metadata: { ...metadata, padding: 'x'.repeat(100 * 1024) } });
  await rejects(() => huge.begin(), 'response_too_large');

  const differentIdentity = {};
  const identityChange = await fixture(differentIdentity); await identityChange.begin(); await identityChange.api.handleCallback(identityChange.callback()); await identityChange.api.logout();
  differentIdentity.claims = { sub: 'different-subject' }; await identityChange.begin();
  await rejects(() => identityChange.api.handleCallback(identityChange.callback()), 'invalid_id_token'); eq(identityChange.api.status().connected, false);

  function responseRecorder() { return { code: null, body: null, writeHead(code, headers) { this.code = code; this.headers = headers; }, end(body) { this.body = JSON.parse(body); } }; }
  const route = await fixture();
  const deniedResponse = responseRecorder();
  eq(await route.api.handleRequest({ url: '/api/chatgpt/login', method: 'POST', headers: { origin: 'https://attacker.test', 'x-workbench-request': '1' } }, deniedResponse), true);
  eq(deniedResponse.code, 400); eq(deniedResponse.body.error, 'origin_required'); eq(route.calls.length, 0);
  const noHeader = responseRecorder(); await route.api.handleRequest({ url: '/api/chatgpt/login', method: 'POST', headers: { origin: BASE } }, noHeader); eq(noHeader.code, 400);
  const loginResponse = responseRecorder(); await route.api.handleRequest({ url: '/api/chatgpt/login', method: 'POST', headers: { origin: BASE, 'x-workbench-request': '1' } }, loginResponse);
  eq(loginResponse.code, 200); ok(loginResponse.body.authorizationUrl.startsWith(`${ISS}/api/accounts/authorize?`));
  eq(loginResponse.headers['Cache-Control'], 'no-store');
  eq(await route.api.handleRequest({ url: '/unrelated', method: 'GET', headers: {} }, responseRecorder()), false);
  console.log(JSON.stringify({ status: 'PASS', scenarios, assertions, realOAuthPerformed: false, realInferencePerformed: false, signedJWTAlgorithm: 'RS256', fixtureKeyBits: 2048, tokenPersistence: false }));
} finally { await rm(ROOT, { recursive: true, force: true }); }
