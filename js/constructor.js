function initConstructor() {
  // === Константы справочников ===
  const ASSET_BASE = '/';
  const IMAGE_FORMAT = 'png';

  const COLORS = [
    { name: "Черный",   value: "00black" },
    { name: "Серый",    value: "01grey" },
    { name: "Белый",    value: "02white" },
    { name: "Бежевый",  value: "03beige" },
    { name: "Коричневый", value: "04brown" },
    { name: "Красный",  value: "05red" },
  ];

  const PATTERNS = [
    { name: "Линии",        value: "lines" },
    { name: "Мелкий ромб",  value: "rhomb-small" },
    { name: "Крупный ромб", value: "rhomb-large" },
    { name: "Двойной ромб", value: "rhomb-double" },
    { name: "Соты",     value: "cells" },
  ];

  const MATERIALS = [
    { name: "Без перфорации", value: "smooth" },
    { name: "С перфорацией",  value: "perforated" },
    { name: "Алькантара",     value: "alcantara" },
  ];

  // === Селекты ===
  const selects = {
    baseColor:   document.getElementById("baseColorSelect"),
    centerColor: document.getElementById("centerColorSelect"),
    wedgesColor: document.getElementById("wedgesColorSelect"),
    pattern:     document.getElementById("patternSelect"),
    material:    document.getElementById("materialSelect"),
  };

  // === Слои ===
  const layers = {
    base:     document.getElementById("base"),
    headrest: document.getElementById("headrest"),
    center:   document.getElementById("center"),
    wedges:   document.getElementById("wedges"),
    stitch:   document.getElementById("stitch"),
  };

  // === Helpers ===
  function preload(path) {
    return new Promise((resolve) => {
      const i = new Image();
      i.onload = resolve;
      i.onerror = resolve;
      i.src = path;
    });
  }

  function save() {
    const data = Object.fromEntries(
      Object.entries(selects).map(([k, s]) => [k, s?.value])
    );
    try { localStorage.setItem("seatConfigV2", JSON.stringify(data)); } catch(e){}
  }

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem("seatConfigV2"));
      if (data) {
        for (const k in selects) if (selects[k] && data[k]) selects[k].value = data[k];
        return;
      }
    } catch(e){}
    setDefaults();
  }

  function setDefaults() {
    if (selects.baseColor)   selects.baseColor.value = "00black";
    if (selects.centerColor) selects.centerColor.value = "00black";
    if (selects.wedgesColor) selects.wedgesColor.value = "00black";
    if (selects.pattern)     selects.pattern.value = "lines";
    if (selects.material)    selects.material.value = "smooth";
  }

  // === Собираем пути к ассетам по правилам ===
  function buildPaths() {
    const baseColor   = selects.baseColor?.value;
    const centerColor = selects.centerColor?.value;
    const wedgesColor = selects.wedgesColor?.value;
    const pattern     = selects.pattern?.value;
    const material    = selects.material?.value;

    return {
      base:     `img/base/${baseColor}.${IMAGE_FORMAT}`,                 // база ← Базовый цвет
      headrest: `img/headrest/${centerColor}.${IMAGE_FORMAT}`,           // подголовник ← Цвет центральной вставки
      center:   `img/center/${material}/${pattern}/${centerColor}.${IMAGE_FORMAT}`, // центр ← Материал + Узор + Цвет центральной вставки
      wedges:   `img/wedges/${wedgesColor}.${IMAGE_FORMAT}`,             // клинья ← Цвет клиньев
      stitch:   `img/stitch/${pattern}/${baseColor}.${IMAGE_FORMAT}`,    // прострочка ← Узор + Базовый цвет
    };
  }

  function updateImages() {
    const p = buildPaths();

    // грузим параллельно, чтобы не мигало
    Promise.all([preload(p.base), preload(p.headrest), preload(p.center), preload(p.wedges), preload(p.stitch)])
      .then(() => {
        if (layers.base)     layers.base.src = p.base;
        if (layers.headrest) layers.headrest.src = p.headrest;
        if (layers.center)   layers.center.src = p.center;
        if (layers.wedges)   layers.wedges.src = p.wedges;
        if (layers.stitch)   layers.stitch.src = p.stitch;
      });

    save();
    updatePrice();       // опционально — если нужна цена
    syncSquareOnDesktop();
  }

  // === Цена (пример, подправь под свои правила) ===
function updatePrice() {
  const baseColor   = selects.baseColor?.value;
  const wedgesColor = selects.wedgesColor?.value;
  const pattern     = selects.pattern?.value;
  const material    = selects.material?.value;

  let price = 7500; // базовая цена, всё чёрное

  // Цветные клинья (если не чёрные)
  if (wedgesColor !== "00black") {
    price += 2000;
  }

  // Материал
  if (material === "perforated") {
    price += 500;
  } else if (material === "alcantara") {
    price += 2000;
  }

  // Узор
  switch (pattern) {
    case "rhomb-large": price += 1800; break;
    case "rhomb-small": price += 2100; break;
    case "rhomb-double": price += 2000; break;
    case "cells": price += 5000; break;
    // lines = 0
  }

  const priceEl = document.getElementById("totalPrice");
  if (priceEl) priceEl.textContent = `${price.toLocaleString('ru-RU')} ₽`;
}

  function wireSelectors() {
    COLORS.forEach(c => {
      selects.baseColor?.append(new Option(c.name, c.value));
      selects.centerColor?.append(new Option(c.name, c.value));
      selects.wedgesColor?.append(new Option(c.name, c.value));
    });
    PATTERNS.forEach(p => selects.pattern?.append(new Option(p.name, p.value)));
    MATERIALS.forEach(m => selects.material?.append(new Option(m.name, m.value)));

    Object.values(selects).forEach(s => s?.addEventListener('change', updateImages));
  }

  function wireReset() {
    const reset = document.getElementById('resetBtn');
    reset?.addEventListener('click', () => {
      try { localStorage.removeItem('seatConfigV2'); } catch(e){}
      setDefaults();
      updateImages();
    });
  }

  function syncSquareOnDesktop() {
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;
    const cfg = document.querySelector('.config-wrapper');
    const img = document.querySelector('.image-container');
    if (cfg && img) {
      const h = cfg.offsetHeight;
      img.style.height = `${h}px`;
      img.style.width  = `${h}px`;
    }
  }

  // INIT
  wireSelectors();
  wireReset();
  load();
  updateImages();
  window.addEventListener('resize', syncSquareOnDesktop);
}
