/* Apply only the public appearance preference before the first styled paint.
   This deliberately does not inspect any saved studies or provider settings. */
(() => {
  let theme = 'midnight';
  try {
    const value = JSON.parse(localStorage.getItem('wb:appearance:v1'));
    if (value && ['parchment', 'midnight', 'mineral'].includes(value.theme)) theme = value.theme;
  } catch { /* Storage unavailable or malformed: readable default. */ }
  document.documentElement.dataset.uiTheme = theme;
})();
