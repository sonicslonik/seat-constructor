const COLORS = [
  { name: 'Черный', value: '00black' },
  { name: 'Серый', value: '01grey' },
  { name: 'Белый', value: '02white' },
  { name: 'Бежевый', value: '03beige' },
  { name: 'Коричневый', value: '04brown' },
  { name: 'Красный', value: '05red' }
];

const defaultPattern = 'lines';

const selects = {
  baseColor: document.getElementById('baseColorSelect'),
  pattern: document.getElementById('patternSelect'),
  sidesColor: document.getElementById('sidesColorSelect'),
};

const layers = {
  base: document.getElementById('base'),
  headrest: document.getElementById('headrest'),
  center: document.getElementById('center'),
  sides: document.getElementById('sides'),
  stitch: document.getElementById('stitch'),
};

function preloadImage(path) {
  const img = new Image();
  img.src = path;
  return new Promise(resolve => {
    img.onload = resolve;
  });
}

function preloadAllImages() {
  const promises = [];

  for (let color of COLORS) {
    for (let pattern of ['lines', 'rhomb-large', 'rhomb-small']) {
      promises.push(preloadImage(`img/center-w-perforation/${pattern}/${color.value}.webp`));
    }

    promises.push(preloadImage(`img/headrest/${color.value}.webp`));
    promises.push(preloadImage(`img/sides/${color.value}.webp`));
  }

  for (let pattern of ['lines', 'rhomb-large', 'rhomb-small', 'hexagon', 'rhomb-double']) {
    promises.push(preloadImage(`img/stitch/${pattern}/02white.webp`));
  }

  return Promise.all(promises);
}

function saveToLocalStorage() {
  const data = {
    baseColor: selects.baseColor.value,
    pattern: selects.pattern.value,
    sidesColor: selects.sidesColor.value
  };
  localStorage.setItem('seatConfig', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem('seatConfig'));
  if (!data) return;
  selects.baseColor.value = data.baseColor;
  selects.pattern.value = data.pattern;
  selects.sidesColor.value = data.sidesColor;
}

function updateImages() {
  const baseColor = selects.baseColor.value;
  const pattern = selects.pattern.value;
  const sidesColor = selects.sidesColor.value;

  const centerPath = `img/center-w-perforation/${pattern}/${baseColor}.webp`;
  const headrestPath = `img/headrest/${baseColor}.webp`;
  const sidesPath = `img/sides/${sidesColor}.webp`;
  const stitchPath = `img/stitch/${pattern}/02white.webp`;

  Promise.all([
    preloadImage(centerPath),
    preloadImage(headrestPath)
  ]).then(() => {
    layers.center.src = centerPath;
    layers.headrest.src = headrestPath;
  });

  layers.sides.src = sidesPath;
  layers.stitch.src = stitchPath;

  saveToLocalStorage();
}

function setupSelectors() {
  for (let color of COLORS) {
    const opt1 = new Option(color.name, color.value);
    const opt2 = new Option(color.name, color.value);
    selects.baseColor.add(opt1);
    selects.sidesColor.add(opt2);
  }

  selects.baseColor.addEventListener('change', updateImages);
  selects.pattern.addEventListener('change', updateImages);
  selects.sidesColor.addEventListener('change', updateImages);
}

document.addEventListener('DOMContentLoaded', () => {
  setupSelectors();
  loadFromLocalStorage();
  preloadAllImages().then(updateImages);
});
