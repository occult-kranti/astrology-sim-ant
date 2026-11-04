// Optional, explicitly initiated SIWC flow for an open-source LOCAL companion.
// Official protocol reviewed 2026-11-04: docs/2026-11-workbench-rag-integrations.md.
// Tokens remain in process memory. This module never reads Codex/browser sessions.
import { randomBytes, randomUUID, createHash, createPublicKey, verify, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile, lstat, rename, unlink, link } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

const ISSUER = 'https://auth.openai.com';
const RESOURCE = 'https://api.openai.com/v1';
const AUTHORIZE = `${ISSUER}/api/accounts/authorize`;
const TOKEN = `${ISSUER}/api/accounts/oauth/token`;
const REVOKE = `${ISSUER}/api/accounts/oauth/revoke`;
const JWKS = `${ISSUER}/.well-known/jwks.json`;
const DISCOVERY = `${ISSUER}/.well-known/openid-configuration`;
const SCOPE = 'openid profile email offline_access resource.invoke chatgpt.tokens.use.direct';
const TTL = 10 * 60 * 1000;
const LIMIT = 96 * 1024;
const CLIENT = /^oaiapp_[A-Za-z0-9_-]{1,190}$/;
const opaque = () => randomBytes(32).toString('base64url');
const same = (a, b) => typeof a === 'string' && typeof b === 'string' && Buffer.byteLength(a) === Buffer.byteLength(b) && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const fail = (code, message) => Object.assign(new Error(message), { code });

async function boundedText(response) {
  if (!response.body?.getReader) {
    const text = await response.text();
    if (Buffer.byteLength(text) > LIMIT) throw fail('response_too_large', 'The authentication response exceeded its size limit.');
    return text;
  }
  const reader = response.body.getReader(); const parts = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > LIMIT) { await reader.cancel(); throw fail('response_too_large', 'The authentication response exceeded its size limit.'); }
      parts.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(parts).toString('utf8');
}

function parseJWT(token) {
  if (typeof token !== 'string' || token.length > 24000) throw fail('invalid_id_token', 'The identity token is invalid.');
  const parts = token.split('.');
  if (parts.length !== 3 || parts.some(x => !/^[A-Za-z0-9_-]+$/.test(x))) throw fail('invalid_id_token', 'The identity token is invalid.');
  try {
    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (!header || typeof header !== 'object' || !claims || typeof claims !== 'object') throw new Error();
    return { header, claims, signed: `${parts[0]}.${parts[1]}`, signature: Buffer.from(parts[2], 'base64url') };
  } catch { throw fail('invalid_id_token', 'The identity token is invalid.'); }
}

/** baseURL is the companion's actual http://127.0.0.1:port origin.
 * fetchImpl must retain the environment's supported proxy/CA configuration.
 * hostPath persists ONLY host ID and validated registration metadata, never tokens.
 */
export function createChatGPTLogin({ fetchImpl = globalThis.fetch, baseURL, hostPath = join(homedir(), '.config', 'astrologers-workbench', 'chatgpt-host.json'), now = Date.now, timeoutMs = 15000 } = {}) {
  const originURL = new URL(baseURL);
  if (originURL.protocol !== 'http:' || originURL.hostname !== '127.0.0.1' || originURL.username || originURL.password || originURL.search || originURL.hash || originURL.pathname !== '/') {
    throw fail('local_origin_required', 'ChatGPT plan sign-in requires this companion on an HTTP 127.0.0.1 loopback origin.');
  }
  const origin = originURL.origin, callbackURI = `${origin}/auth/callback`;
  let metadata = null, host = null, pending = null, session = null, retryRegistration = null, attemptId = 0, generation = 0, refreshing = null;
  const invalidationListeners = new Set(), activeCodeExchanges = new Set();
  let lastNotice = 'Sign in explicitly to authorize this local companion. Credentials remain in memory.';

  function invalidate(reason) {
    generation++;
    for (const listener of invalidationListeners) { try { listener({ revision: generation, reason }); } catch { /* Observers cannot interrupt credential cleanup. */ } }
  }
  function subscribeSessionInvalidation(listener) {
    if (typeof listener !== 'function') throw new TypeError('A session listener must be a function.');
    invalidationListeners.add(listener); return () => invalidationListeners.delete(listener);
  }

  async function requestJSON(url, init = {}) {
    const response = await fetchImpl(url, { ...init, redirect: 'error', signal: AbortSignal.timeout(timeoutMs) });
    const text = await boundedText(response);
    let data;
    try { data = JSON.parse(text); } catch { throw fail('invalid_auth_response', 'The authentication service returned an invalid response.'); }
    if (!response.ok) {
      const code = typeof data?.error === 'string' && /^[a-z0-9_]{1,80}$/.test(data.error) ? data.error : 'authentication_request_failed';
      throw fail(code, `The authentication request failed (HTTP ${response.status}).`);
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw fail('invalid_auth_response', 'The authentication service returned an invalid response.');
    return data;
  }

  async function discover() {
    if (metadata) return metadata;
    const value = await requestJSON(DISCOVERY);
    if (value.issuer !== ISSUER || value.authorization_endpoint !== AUTHORIZE || value.token_endpoint !== TOKEN || value.jwks_uri !== JWKS || value.revocation_endpoint !== REVOKE || !value.code_challenge_methods_supported?.includes('S256') || !value.id_token_signing_alg_values_supported?.includes('RS256')) {
      throw fail('unsupported_discovery', 'OpenAI discovery differs from the reviewed authentication contract. Update this companion before signing in.');
    }
    metadata = value; return value;
  }

  async function readHost() {
    const stat = await lstat(hostPath);
    if (!stat.isFile() || stat.isSymbolicLink() || (stat.mode & 0o077) !== 0 || (process.getuid && stat.uid !== process.getuid())) throw fail('unsafe_host_file', 'The companion host file must be an owner-only regular file.');
    if (stat.size > 4096) throw fail('invalid_host_file', 'The companion host file is invalid.');
    const value = JSON.parse(await readFile(hostPath, 'utf8'));
    if (value.schemaVersion !== 1 || !/^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.hostId)) throw fail('invalid_host_file', 'The companion host identifier is invalid.');
    if (value.registration && (!CLIENT.test(value.registration.clientId) || typeof value.registration.subject !== 'string' || !value.registration.subject || value.registration.subject.length > 500)) throw fail('invalid_host_file', 'The saved client registration is invalid.');
    return { schemaVersion: 1, hostId: value.hostId, ...(value.registration ? { registration: { clientId: value.registration.clientId, subject: value.registration.subject } } : {}) };
  }

  async function ensureHost() {
    if (host) return host;
    try { host = await readHost(); return host; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    await mkdir(dirname(hostPath), { recursive: true, mode: 0o700 });
    const fresh = { schemaVersion: 1, hostId: `urn:uuid:${randomUUID()}` };
    const temp = `${hostPath}.${randomUUID()}.tmp`;
    try {
      await writeFile(temp, `${JSON.stringify(fresh)}\n`, { flag: 'wx', mode: 0o600 });
      try { await link(temp, hostPath); } catch (error) { if (error.code !== 'EEXIST') throw error; }
    } finally { await unlink(temp).catch(() => {}); }
    host = await readHost(); return host;
  }

  async function saveRegistration(clientId, subject) {
    await readHost(); // Refuse symlink or permission changes rather than following them.
    const next = { schemaVersion: 1, hostId: host.hostId, registration: { clientId, subject } };
    const temp = `${hostPath}.${randomUUID()}.tmp`;
    try { await writeFile(temp, `${JSON.stringify(next)}\n`, { flag: 'wx', mode: 0o600 }); await rename(temp, hostPath); }
    finally { await unlink(temp).catch(() => {}); }
    host = next;
  }

  async function verifyIdentity(idToken, clientId, nonce, expectedSubject = null) {
    const jwt = parseJWT(idToken);
    if (jwt.header.alg !== 'RS256' || typeof jwt.header.kid !== 'string' || jwt.header.kid.length > 200 || jwt.header.crit != null) throw fail('invalid_id_token', 'The identity token uses an unsupported signature.');
    const jwks = await requestJSON(JWKS);
    if (!Array.isArray(jwks.keys) || jwks.keys.length > 100) throw fail('invalid_jwks', 'The signing-key response is invalid.');
    const candidates = jwks.keys.filter(key => key.kid === jwt.header.kid && key.kty === 'RSA' && (!key.use || key.use === 'sig') && (!key.alg || key.alg === 'RS256'));
    if (candidates.length !== 1) throw fail('invalid_id_token', 'The identity token signing key was not found.');
    let key;
    try { key = createPublicKey({ key: candidates[0], format: 'jwk' }); } catch { throw fail('invalid_jwks', 'The signing-key response is invalid.'); }
    if (key.asymmetricKeyDetails?.modulusLength < 2048 || !verify('RSA-SHA256', Buffer.from(jwt.signed), key, jwt.signature)) throw fail('invalid_id_token', 'The identity token signature is invalid.');
    const c = jwt.claims, seconds = now() / 1000, audiences = Array.isArray(c.aud) ? c.aud : [c.aud];
    if (c.iss !== ISSUER || audiences.length > 20 || !audiences.every(aud => typeof aud === 'string') || !audiences.includes(clientId) || (audiences.length > 1 && c.azp !== clientId) || (c.azp != null && c.azp !== clientId) || !Number.isFinite(c.exp) || c.exp <= seconds || !Number.isFinite(c.iat) || c.iat > seconds + 60 || (c.nbf != null && (!Number.isFinite(c.nbf) || c.nbf > seconds + 60)) || typeof c.sub !== 'string' || !c.sub || c.sub.length > 500 || (nonce != null && !same(c.nonce, nonce)) || (expectedSubject != null && c.sub !== expectedSubject)) {
      throw fail('invalid_id_token', 'The identity token did not match this sign-in attempt.');
    }
    return { subject: c.sub, label: typeof c.email === 'string' && c.email.length <= 254 ? c.email : 'ChatGPT account' };
  }

  function parseTokenResponse(data, prior = null) {
    if (typeof data.access_token !== 'string' || data.access_token.length < 1 || data.access_token.length > 24000 || String(data.token_type).toLowerCase() !== 'bearer' || !Number.isFinite(data.expires_in) || data.expires_in <= 0 || data.expires_in > 86400 * 7 || (data.refresh_token != null && (typeof data.refresh_token !== 'string' || !data.refresh_token || data.refresh_token.length > 24000))) throw fail('invalid_token_response', 'The token response is invalid.');
    const scopes = data.scope == null && prior ? prior.scopes : typeof data.scope === 'string' && data.scope.length < 2000 ? data.scope.split(/\s+/).filter(Boolean) : [];
    return { accessToken: data.access_token, refreshToken: data.refresh_token ?? prior?.refreshToken ?? null, scopes, expiresAt: now() + data.expires_in * 1000 };
  }

  function status() {
    const authenticated = Boolean(session), enabled = Boolean(session?.scopes.includes('chatgpt.tokens.use.direct'));
    return { provider: 'chatgpt', authenticated, connected: enabled, planUsageEnabled: enabled, state: enabled ? 'authorized' : authenticated ? 'signed-in-without-plan-permission' : 'disconnected', accountLabel: session?.identity.label ?? null, pending: Boolean(pending && pending.expiresAt > now()), expiresAt: session?.expiresAt ?? null, inferenceVerified: false, credentialStorage: 'process-memory', notice: lastNotice };
  }

  async function beginLogin({ newAccount = false } = {}) {
    const id = ++attemptId; pending = null;
    await discover(); const saved = await ensureHost();
    if (id !== attemptId) throw fail('superseded_login', 'A newer sign-in attempt replaced this one.');
    if (newAccount) retryRegistration = null;
    const registration = newAccount ? null : (saved.registration ?? retryRegistration);
    const tx = { id, state: opaque(), nonce: opaque(), verifier: randomBytes(48).toString('base64url'), expiresAt: now() + TTL, clientId: registration?.clientId ?? null, subject: registration?.subject ?? null };
    const url = new URL(AUTHORIZE);
    const args = { client_id: tx.clientId ?? 'dynamic_agent_client', ext_agent_host_id: saved.hostId, response_type: 'code', redirect_uri: callbackURI, scope: SCOPE, resource: RESOURCE, state: tx.state, nonce: tx.nonce, code_challenge_method: 'S256', code_challenge: createHash('sha256').update(tx.verifier).digest('base64url') };
    if (!tx.clientId) args.agent_name_hint = 'Astrologers Workbench';
    for (const [key, value] of Object.entries(args)) url.searchParams.set(key, value);
    pending = tx; lastNotice = 'Complete sign-in and consent in the OpenAI browser window.';
    return { authorizationUrl: url.href, expiresAt: tx.expiresAt };
  }

  async function handleCallback(value) {
    const url = value instanceof URL ? value : new URL(value, origin);
    if (url.origin !== origin || url.pathname !== '/auth/callback' || url.href.length > 20000) throw fail('invalid_callback', 'The sign-in callback is invalid.');
    for (const key of ['state', 'code', 'client_id', 'error']) if (url.searchParams.getAll(key).length > 1) throw fail('invalid_callback', 'The sign-in callback contains duplicate fields.');
    const tx = pending;
    if (!tx || !same(url.searchParams.get('state'), tx.state)) throw fail('invalid_state', 'This sign-in callback does not match an active attempt.');
    pending = null; // One use, consumed before any asynchronous token request.
    if (tx.expiresAt <= now()) throw fail('expired_login', 'This sign-in attempt expired. Start again.');
    if (url.searchParams.has('error')) { lastNotice = 'Sign-in was not authorized. No new credentials were accepted.'; throw fail('authorization_denied', lastNotice); }
    const code = url.searchParams.get('code'), issued = url.searchParams.get('client_id') ?? tx.clientId;
    if (!code || code.length > 10000 || !CLIENT.test(issued ?? '') || (tx.clientId && issued !== tx.clientId)) throw fail('invalid_callback', 'The sign-in callback lacks its expected code or issued client ID.');
    activeCodeExchanges.add(tx.id);
    let token = null;
    try {
      let data;
      try {
        data = await requestJSON(TOKEN, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'authorization_code', client_id: issued, code, code_verifier: tx.verifier, redirect_uri: callbackURI, resource: RESOURCE }).toString() });
      } catch (error) {
        // Retain only a registration for a fresh attempt after an expired code.
        if (error.code === 'invalid_grant' && tx.id === attemptId && !host.registration) retryRegistration = { clientId: issued, subject: null };
        throw error;
      }
      token = parseTokenResponse(data);
      const identity = await verifyIdentity(data.id_token, issued, tx.nonce, tx.subject);
      if (tx.id !== attemptId) throw fail('superseded_login', 'This sign-in was replaced or cancelled.');
      await saveRegistration(issued, identity.subject);
      if (tx.id !== attemptId) throw fail('superseded_login', 'This sign-in was replaced or cancelled.');
      session = { ...token, identity, clientId: issued }; retryRegistration = null; invalidate('authorized-session-replaced');
      lastNotice = token.scopes.includes('chatgpt.tokens.use.direct') ? 'This local companion is authorized. A completed model response still needs to be verified.' : 'Signed in, but ChatGPT plan usage was not granted. Inference is disabled.';
      return status();
    } catch (error) {
      if (token?.refreshToken) {
        const confirmed = await revokeToken(token.refreshToken, issued);
        if (!session) lastNotice = confirmed ? 'The incomplete sign-in was cancelled and its renewable credential revoked.' : 'The sign-in was cancelled locally. Remote revocation was not confirmed; disconnect the app in ChatGPT settings.';
      }
      throw error;
    } finally { activeCodeExchanges.delete(tx.id); }
  }

  async function refresh() {
    if (refreshing) return refreshing;
    const saved = session, revision = generation;
    if (!saved?.refreshToken) throw fail('reauthorization_required', 'Sign in again to renew this session.');
    refreshing = (async () => {
      try {
        const data = await requestJSON(TOKEN, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', client_id: saved.clientId, refresh_token: saved.refreshToken, resource: RESOURCE }).toString() });
        const token = parseTokenResponse(data, saved);
        if (data.id_token) await verifyIdentity(data.id_token, saved.clientId, null, saved.identity.subject);
        if (generation !== revision || session !== saved) {
          if (token.refreshToken && token.refreshToken !== saved.refreshToken) await revokeToken(token.refreshToken, saved.clientId);
          throw fail('cancelled_session', 'The selected session changed during renewal.');
        }
        session = { ...saved, ...token };
      } catch (error) {
        if (['invalid_grant', 'invalid_refresh_token', 'token_expired', 'refresh_token_expired', 'refresh_token_invalidated', 'refresh_token_reused'].includes(error.code) && generation === revision) { session = null; invalidate('refresh-invalidated'); lastNotice = 'This session can no longer be renewed. Sign in again.'; }
        throw error;
      } finally { refreshing = null; }
    })();
    return refreshing;
  }

  async function getAccessToken() {
    if (!session?.scopes.includes('chatgpt.tokens.use.direct')) throw fail('plan_permission_required', 'Authorize ChatGPT plan usage before requesting a model response.');
    if (session.expiresAt <= now() + 60000) await refresh();
    if (!session?.scopes.includes('chatgpt.tokens.use.direct') || session.expiresAt <= now()) throw fail('plan_permission_required', 'The session is not authorized for ChatGPT plan usage.');
    return session.accessToken;
  }

  async function listModels() {
    const token = await getAccessToken();
    const data = await requestJSON(`${RESOURCE}/models`, { headers: { Authorization: `Bearer ${token}` } });
    if (!Array.isArray(data.models) || data.models.length > 500) throw fail('invalid_model_catalog', 'The account model catalogue is invalid.');
    return data.models.filter(item => item?.visibility === 'list' && typeof item.slug === 'string' && /^[A-Za-z0-9._:-]{1,160}$/.test(item.slug) && typeof item.display_name === 'string' && item.display_name.length <= 200).map(item => ({ slug: item.slug, displayName: item.display_name }));
  }

  async function revokeToken(refreshToken, clientId) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await discover();
        const response = await fetchImpl(REVOKE, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ token: refreshToken, token_type_hint: 'refresh_token', client_id: clientId }).toString(), redirect: 'error', signal: AbortSignal.timeout(timeoutMs) });
        await boundedText(response);
        if (response.status === 200) return true;
        if (response.status < 500) return false;
      } catch { /* Bounded retry for a temporary request failure; never log tokens. */ }
      if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
  }

  async function logout() {
    const saved = session; session = null; pending = null; retryRegistration = null; ++attemptId; invalidate('signed-out');
    const revision = generation;
    let confirmed = !saved?.refreshToken;
    if (saved?.refreshToken) confirmed = await revokeToken(saved.refreshToken, saved.clientId);
    const pendingRevocation = activeCodeExchanges.size > 0;
    if (revision === generation) lastNotice = pendingRevocation ? 'Signed out locally. A pending sign-in exchange is still being cancelled.' : confirmed ? 'Signed out. Local credentials were cleared.' : 'Signed out locally. Remote revocation was not confirmed; disconnect the app in ChatGPT settings if needed.';
    return { ...status(), revocationConfirmed: confirmed && !pendingRevocation, pendingRevocation };
  }

  async function handleRequest(req, res) {
    const url = new URL(req.url, origin);
    if (!['/api/chatgpt/status', '/api/chatgpt/login', '/api/chatgpt/logout', '/auth/callback'].includes(url.pathname)) return false;
    const reply = (code, payload) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' }); res.end(JSON.stringify(payload)); };
    try {
      if (req.method === 'GET' && url.pathname === '/api/chatgpt/status') reply(200, status());
      else if (req.method === 'GET' && url.pathname === '/auth/callback') reply(200, await handleCallback(url));
      else if (req.method === 'POST' && ['/api/chatgpt/login', '/api/chatgpt/logout'].includes(url.pathname)) {
        if (req.headers.origin !== origin || req.headers['x-workbench-request'] !== '1') throw fail('origin_required', 'Use the companion interface to change this connection.');
        reply(200, url.pathname.endsWith('/login') ? await beginLogin() : await logout());
      } else reply(405, { error: 'method_not_allowed' });
    } catch (error) { reply(400, { error: error.code || 'authentication_failed', message: error.code ? error.message : 'Authentication could not be completed. No credentials are returned to the browser.' }); }
    return true;
  }

  return { status, beginLogin, handleCallback, logout, getAccessToken, listModels, handleRequest, getSessionRevision: () => generation, sessionRevision: () => generation, subscribeSessionInvalidation };
}
