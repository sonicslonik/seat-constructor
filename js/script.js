// Версия проекта (обновляй вручную при каждом изменении)
const VERSION = "v1.0";

// Возможные значения
const colors = ["00black", "01grey", "02white", "03beige", "04brown", "05red"];
const patterns = ["lines", "rhomb-small", "rhomb-large"];

// Предзагрузка всех изображений
function preloadImages() {
  const basePath = "img/";
  const ext = ".webp";
  const images = [];

  images.push(`${basePath}base.webp`);

  colors.forEach(color => {
    images.push(`${basePath}sides/${color}${ext}`);
    images.push(`${basePath}headrest/${color}${ext}`);
  });

  patterns.forEach(pattern => {
    colors.forEach(color => {
      images.push(`${basePath}center-w-perforation/${pattern}/${color}${ext}`);
    });
  });

  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  console.log(`✅ Предзагружено ${images.length} изображений`);
}

// Загрузка одного изображения (обёртка в Promise)
function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.src = src;
  });
}

// Обновление отображения (с ожиданием загрузки всех слоёв)
async function updateView() {
  const color = document.getElementById("center-color").value;
  const sideColor = document.getElementById("side-color").value;
  const pattern = document.getElementById("pattern").value;

  const basePath = "img/";
  const ext = ".webp";

  const centerSrc = `${basePath}center-w-perforation/${pattern}/${color}${ext}`;
  const sideSrc = `${basePath}sides/${sideColor}${ext}`;
  const headrestSrc = `${basePath}headrest/${color}${ext}`;

  // Дожидаемся загрузки всех нужных слоёв
  const [center, sides, headrest] = await Promise.all([
    loadImage(centerSrc),
    loadImage(sideSrc),
    loadImage(headrestSrc)
  ]);

  // Меняем изображения одновременно
  document.getElementById("layer-center").src = center;
  document.getElementById("layer-sides").src = sides;
  document.getElementById("layer-headrest").src = headrest;
}

// Назначаем события
document.querySelectorAll("select").forEach(select => {
  select.addEventListener("change", updateView);
});

// Инициализация
window.addEventListener("DOMContentLoaded", () => {
  preloadImages();
  updateView();

  // Отображение версии
  const versionSpan = document.getElementById("version");
  if (versionSpan) versionSpan.textContent = VERSION;
});
