function initConstructor() {
  const COLORS = [
    { name: "Черный", value: "00black" },
    { name: "Серый", value: "01grey" },
    { name: "Белый", value: "02white" },
    { name: "Бежевый", value: "03beige" },
    { name: "Коричневый", value: "04brown" },
    { name: "Красный", value: "05red" },
  ];

  const PATTERNS = [
    { name: "Линии", value: "01lines" },
    { name: "Мелкий ромб", value: "02rhomb-small" },
    { name: "Крупный ромб", value: "03rhomb-large" },
    { name: "Двойной ромб", value: "04rhomb-double" },
    { name: "Гексагон", value: "05hexagon" },
  ];

  const PERFORATION = [
    { name: "Без перфорации", value: "wo-perforation" },
    { name: "С перфорацией", value: "w-perforation" },
  ];

  const selects = {
    baseColor: document.getElementById("baseColorSelect"),
    sidesColor: document.getElementById("sidesColorSelect"),
    stitchColor: document.getElementById("stitchColorSelect"),
    pattern: document.getElementById("patternSelect"),
    perforation: document.getElementById("perforationSelect"),
  };

  const layers = {
    base: document.getElementById("base"),
    headrest: document.getElementById("headrest"),
    center: document.getElementById("center"),
    sides: document.getElementById("sides"),
    stitch: document.getElementById("stitch"),
  };

  function preloadImage(path) {
    const img = new Image();
    img.src = path;
    return new Promise((resolve) => (img.onload = resolve));
  }

  function saveToLocalStorage() {
    const data = Object.fromEntries(
      Object.entries(selects).map(([k, s]) => [k, s.value])
    );
    localStorage.setItem("seatConfig", JSON.stringify(data));
  }

  function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("seatConfig"));
    if (data) {
      for (const key in selects) {
        if (data[key]) selects[key].value = data[key];
      }
    } else {
      setDefaults();
    }
  }

  function setDefaults() {
    selects.baseColor.value = "00black";
    selects.sidesColor.value = "00black";
    selects.stitchColor.value = "00black";
    selects.pattern.value = "01lines";
    selects.perforation.value = "wo-perforation";
  }

  function updateImages() {
    const baseColor = selects.baseColor.value;
    const sidesColor = selects.sidesColor.value;
    const stitchColor = selects.stitchColor.value;
    const pattern = selects.pattern.value;
    const perforation = selects.perforation.value;

    const centerPath = `img/center/${perforation}/${pattern}/${baseColor}.webp`;
    const headrestPath = `img/headrest/${baseColor}.webp`;
    const sidesPath = `img/sides/${sidesColor}.webp`;
    const stitchPath = `img/stitch/${pattern}/${stitchColor}.webp`;

    // Base не зависит от настроек — просто добавляем
    layers.base.src = "img/base.webp";

    Promise.all([
      preloadImage(centerPath),
      preloadImage(headrestPath),
      preloadImage(sidesPath),
      preloadImage(stitchPath),
    ]).then(() => {
      layers.center.src = centerPath;
      layers.headrest.src = headrestPath;
      layers.sides.src = sidesPath;
      layers.stitch.src = stitchPath;
    });

    saveToLocalStorage();
    calculatePrice();
    syncImageHeightToConfig();
  }

  function calculatePrice() {
    const pattern = selects.pattern.value;
    const perforation = selects.perforation.value;

    let price = 15000 + 4000;

    if (["02rhomb-small", "03rhomb-large"].includes(pattern)) {
      price += 1500;
    } else if (["04rhomb-double", "05hexagon"].includes(pattern)) {
      price += 2500;
    }

    if (perforation === "w-perforation") {
      price += 2000;
    }

    const priceEl = document.getElementById("totalPrice");
    if (priceEl) priceEl.textContent = `${price.toLocaleString()} ₽`;
  }

  function setupSelectors() {
    COLORS.forEach((c) => {
      selects.baseColor?.append(new Option(c.name, c.value));
      selects.sidesColor?.append(new Option(c.name, c.value));
      selects.stitchColor?.append(new Option(c.name, c.value));
    });

    PATTERNS.forEach((p) => {
      selects.pattern?.append(new Option(p.name, p.value));
    });

    PERFORATION.forEach((p) => {
      selects.perforation?.append(new Option(p.name, p.value));
    });

    Object.values(selects).forEach((s) =>
      s?.addEventListener("change", () => {
        updateImages();
        calculatePrice();
      })
    );
  }

  function setupResetButton() {
    const resetBtn = document.getElementById("resetBtn");
    resetBtn?.addEventListener("click", () => {
      localStorage.removeItem("seatConfig");
      setDefaults();
      updateImages();
    });
  }

function syncImageHeightToConfig() {
  const isDesktop = window.innerWidth >= 1024;
  if (!isDesktop) return;

  const config = document.querySelector(".config-wrapper");
  const imageContainer = document.querySelector(".image-container");

  if (config && imageContainer) {
    const height = config.offsetHeight;
    imageContainer.style.height = `${height}px`;
    imageContainer.style.width = `${height}px`;
  }
}
  // === INIT ===
  setupSelectors();
  setupResetButton();
  loadFromLocalStorage();
  updateImages();
window.addEventListener('resize', syncImageHeightToConfig);
}
