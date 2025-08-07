document.addEventListener("DOMContentLoaded", () => {
  const state = {
    centerColor: "00black",
    sidesColor: "00black",
    pattern: "lines",
    perforation: "yes",
    stitch: true,
  };

  const elements = {
    centerColor: document.getElementById("center-color"),
    sidesColor: document.getElementById("sides-color"),
    pattern: document.getElementById("pattern"),
    perforation: document.getElementById("perforation"),
    stitchEnabled: document.getElementById("stitch-enabled"),
    center: document.getElementById("center"),
    sides: document.getElementById("sides"),
    headrest: document.getElementById("headrest"),
    stitch: document.getElementById("stitch"),
  };

  // Загрузка из localStorage
  if (localStorage.getItem("seatConfig")) {
    Object.assign(state, JSON.parse(localStorage.getItem("seatConfig")));
    elements.centerColor.value = state.centerColor;
    elements.sidesColor.value = state.sidesColor;
    elements.pattern.value = state.pattern;
    elements.perforation.value = state.perforation;
    elements.stitchEnabled.checked = state.stitch;
  }

  function updateImages() {
    const { centerColor, sidesColor, pattern, perforation, stitch } = state;

    // Центр
    const centerPath = perforation === "yes"
      ? `img/center-w-perforation/${pattern}/${centerColor}.webp`
      : "";
    elements.center.src = centerPath;

    // Боковины
    elements.sides.src = `img/sides/${sidesColor}.webp`;

    // Подголовник = цвет центра
    elements.headrest.src = `img/headrest/${centerColor}.webp`;

    // Прострочка
    if (stitch) {
      const stitchPath = `img/stitch/${pattern}/${centerColor}.webp`;
      elements.stitch.src = stitchPath;
      elements.stitch.style.display = "block";
    } else {
      elements.stitch.style.display = "none";
    }

    // Сохраняем конфиг
    localStorage.setItem("seatConfig", JSON.stringify(state));
  }

  Object.values(elements).forEach((el) => {
    if (el.tagName === "SELECT") {
      el.addEventListener("change", () => {
        state[el.id.replace("-", "")] = el.value;
        updateImages();
      });
    }
  });

  elements.stitchEnabled.addEventListener("change", () => {
    state.stitch = elements.stitchEnabled.checked;
    updateImages();
  });

  updateImages();
});
