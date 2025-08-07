const colors = ["00black", "01gray", "02white", "03beige", "04brown", "05red"];
const patterns = ["lines", "rhomb-small", "rhomb-large"];

function preloadImages() {
  const basePath = "img/";
  const ext = ".webp";
  const images = [];

  // Базовое кресло
  images.push(`${basePath}base.webp`);

  // Боковины
  colors.forEach(color => {
    images.push(`${basePath}sides/${color}${ext}`);
  });

  // Подголовники
  colors.forEach(color => {
    images.push(`${basePath}headrest/${color}${ext}`);
  });

  // Центр (узоры + цвета)
  patterns.forEach(pattern => {
    colors.forEach(color => {
      images.push(`${basePath}center-w-perforation/${pattern}/${color}${ext}`);
    });
  });

  // Загружаем все изображения в кэш
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  console.log(`✅ Предзагружено ${images.length} изображений`);
}

function updateView() {
  const color = document.getElementById("center-color").value;
  const sideColor = document.getElementById("side-color").value;
  const pattern = document.getElementById("pattern").value;

  const basePath = "img/";
  const ext = ".webp";

  document.getElementById("layer-center").src =
    `${basePath}center-w-perforation/${pattern}/${color}${ext}`;

  document.getElementById("layer-sides").src =
    `${basePath}sides/${sideColor}${ext}`;

  document.getElementById("layer-headrest").src =
    `${basePath}headrest/${color}${ext}`;
}

document.querySelectorAll("select").forEach(select => {
  select.addEventListener("change", updateView);
});

window.addEventListener("DOMContentLoaded", () => {
  preloadImages();
  updateView();
});
