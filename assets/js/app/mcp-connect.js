const byId = id => document.getElementById(id);
let catalogue = [];
function render() {
  const query = byId('mcpFilter').value.trim().toLowerCase();
  const tools = catalogue.filter(t => `${t.name} ${t.description}`.toLowerCase().includes(query));
  byId('mcpTools').replaceChildren(...tools.map(tool => {
    const article = document.createElement('article'), title = document.createElement('h3'), description = document.createElement('p');
    title.textContent = tool.name; description.textContent = tool.description; article.append(title, description);
    const required = document.createElement('p'); required.className = 'small muted';
    required.textContent = `Required inputs: ${tool.inputSchema.required.length ? tool.inputSchema.required.join(', ') : 'none; optional settings available'}.`;
    article.append(required); return article;
  }));
  byId('mcpCatalogueStatus').textContent = `${tools.length} of ${catalogue.length} tools shown.${tools.length ? '' : ' Try a broader search.'}`;
}
byId('mcpCopyEndpoint').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(byId('mcpEndpoint').value); byId('mcpConnectionStatus').textContent = 'Endpoint copied. Complete OAuth in your MCP client; this page has not connected.'; }
  catch { byId('mcpEndpoint').focus(); byId('mcpEndpoint').select(); byId('mcpConnectionStatus').textContent = 'Select and copy the endpoint above. Clipboard access is unavailable.'; }
});
byId('mcpFilter').addEventListener('input', render);
try {
  const response = await fetch(new URL('../../data/mcp-catalogue.json', import.meta.url));
  if (!response.ok) throw new Error('Catalogue unavailable');
  const data = await response.json();
  if (!Array.isArray(data.tools) || data.tools.some(t => !t.name || typeof t.description !== 'string' || !Array.isArray(t.inputSchema?.required))) throw new Error('Catalogue invalid');
  catalogue = data.tools; render();
} catch { byId('mcpCatalogueStatus').textContent = 'The catalogue could not load. The setup instructions and source tool list remain available above.'; }
