const version = '1.5';
document.getElementById('version').textContent = version;

// Элементы управления
const centerSelect = document.getElementById('center-color');
const sideSelect = document.getElementById('side-color');
const patternSelect = document.getElementById('pattern');
const stitchSelect = document.getElementById('stitch-pattern');

// Слои
const layerSides = document.getElementById('layer-sides');
const layerCenter = document.getElementById('layer-center');
const layerHeadrest = document.getElementById('layer-headrest');
const layerStitch = document.getElementById('layer-stitch');

// Прелоадер изображений
const imageCache = {};

function preloadImage(path) {
  if (!imageCache[path]) {
    const img = new Image();
    img.src = path;
    imageCache[path] = img;
  }
}

function updateLayers() {
  const centerColor = centerSelect.value;
  const sideColor = sideSelect.value;
  const pattern = patternSelect.value;
  const stitch = stitchSelect.value;

  const centerPath = `img/center-w-perforation/${pattern}/${centerColor}.webp`;
  const headrestPath = `img/headrest/${centerColor}.webp`;
  const sidesPath = `img/sides/${sideColor}.webp`;

  layerCenter.src = centerPath;
  layerHeadrest.src = headrestPath;
  layerSides.src = sidesPath;

  // Прострочка
  if (stitch !== 'none') {
    const stitchPath = `img/stitch/${stitch}/02white.webp`;
    layerStitch.style.display = 'block';
    layerStitch.src = stitchPath;
  } else {
    layerStitch.style.display = 'none';
  }

  // Сохраняем в localStorage
  localStorage.setItem('config', JSON.stringify({ centerColor, sideColor, pattern, stitch }));
}

// Загрузка сохранённой конфигурации
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('config');
  if (saved) {
    try {
      const { centerColor, sideColor, pattern, stitch } = JSON.parse(saved);
      centerSelect.value = centerColor;
      sideSelect.value = sideColor;
      patternSelect.value = pattern;
      stitchSelect.value = stitch;
    } catch (e) {
      console.warn('Ошибка загрузки конфигурации:', e);
    }
  }

  updateLayers();
  preloadAllImages();
});

// Обработчики событий
centerSelect.addEventListener('change', updateLayers);
sideSelect.addEventListener('change', updateLayers);
patternSelect.addEventListener('change', updateLayers);
stitchSelect.addEventListener('change', updateLayers);

// Предзагрузка всех изображений
function preloadAllImages() {
  const colors = ['00black', '01grey', '02white', '03beige', '04brown', '05red'];
  const patterns = ['lines', 'rhomb-small', 'rhomb-large'];
  const stitches = ['lines', 'rhomb-small', 'rhomb-large', 'rhomb-double', 'hexagon'];

  for (const pattern of patterns) {
    for (const color of colors) {
      preloadImage(`img/center-w-perforation/${pattern}/${color}.png`);
    }
  }

  for (const color of colors) {
    preloadImage(`img/sides/${color}.png`);
    preloadImage(`img/headrest/${color}.png`);
  }

  for (const stitch of stitches) {
    preloadImage(`img/stitch/${stitch}/02white.webp`);
  }

  preloadImage('img/base.webp');
}
