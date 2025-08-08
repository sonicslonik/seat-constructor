function detectPlatform() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width >= 1024) return 'desktop';
  if (width < 768 && height > width) return 'mobile-portrait';
  if (width < 1024 && width > height) return 'mobile-landscape';

  return 'mobile-portrait';
}

function loadCSS(file) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = file;
  document.head.appendChild(link);
}

function loadHTML(templateName) {
  return fetch(`templates/${templateName}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('app').innerHTML = html;
    });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

async function init() {
  const platform = detectPlatform();

  const templateMap = {
    'desktop': {
      css: 'css/desktop.css',
      html: 'desktop'
    },
    'mobile-portrait': {
      css: 'css/mobile-portrait.css',
      html: 'mobile-portrait'
    },
    'mobile-landscape': {
      css: 'css/mobile-landscape.css',
      html: 'mobile-landscape'
    }
  };

  const { css, html } = templateMap[platform];

  loadCSS(css);
  await loadHTML(html);
  await loadScript('js/constructor.js');

  if (typeof initConstructor === 'function') {
    initConstructor();
  } else {
    console.error('initConstructor is not defined');
  }
}

window.addEventListener('DOMContentLoaded', init);
