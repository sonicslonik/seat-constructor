const VERSION = "v1.4";
const colors = ["00black", "01gray", "02white", "03beige", "04brown", "05red"];
const patterns = ["lines", "rhomb-small", "rhomb-large"];
const stitches = ["lines", "rhomb-small", "rhomb-large", "rhomb-double", "hexagon"];

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

  stitches.forEach(stitch => {
    images.push(`${basePath}stitch/${stitch}/02white.webp`);
  });

  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  console.log(`✅ Предзагружено ${images.length} изображений`);
}

function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.src = src;
  });
}

async function updateView() {
  const color = document.getElementById("center-color").value;
  const sideColor = document.getElementById("side-color").value;
  const pattern = document.getElementById("pattern").value;
  const stitch = document.getElementById("stitch-pattern")?.value || "none";

  // сохраняем настройки в localStorage
  localStorage.setItem("config", JSON.stringify({
    centerColor: color,
    sideColor: sideColor,
    pattern: pattern,
    stitch: stitch
  }));

  const basePath = "img/";
  const ext = ".webp";

  const centerSrc = `${basePath}center-w-perforation/${pattern}/${color}${ext}`;
  const sideSrc = `${basePath}sides/${sideColor}${ext}`;
  const headrestSrc = `${basePath}headrest/${color}${ext}`;
  const stitchSrc = stitch !== "none" ? `${basePath}stitch/${stitch}/02white.webp` : null;

  const promises = [
    loadImage(centerSrc),
    loadImage(sideSrc),
    loadImage(headrestSrc),
    stitchSrc ? loadImage(stitchSrc) : Promise.resolve(null)
  ];

  const [center, sides, headrest, stitchImage] = await Promise.all(promises);

  document.getElementById("layer-center").src = center;
  document.getElementById("layer-sides").src = sides;
  document.getElementById("layer-headrest").src = headrest;

  const stitchLayer = document.getElementById("layer-stitch");
  if (stitchImage) {
    stitchLayer.src = stitchImage;
    stitchLayer.style.display = "block";
  } else {
    stitchLayer.style.display = "none";
  }
}

function restoreSavedConfig() {
  const saved = JSON.parse(localStorage.getItem("config"));
  if (saved) {
    const center = document.getElementById("center-color");
    const side = document.getElementById("side-color");
    const pattern = document.getElementById("pattern");
    const stitch = document.getElementById("stitch-pattern");

    if (center && saved.centerColor) center.value = saved.centerColor;
    if (side && saved.sideColor) side.value = saved.sideColor;
    if (pattern && saved.pattern) pattern.value = saved.pattern;
    if (stitch && saved.stitch) stitch.value = saved.stitch;
  }
}

document.querySelectorAll("select").forEach(select => {
  select.addEventListener("change", updateView);
});

window.addEventListener("DOMContentLoaded", () => {
  restoreSavedConfig();
  preloadImages();
  updateView();

  const versionSpan = document.getElementById("version");
  if (versionSpan) versionSpan.textContent = VERSION;
});
