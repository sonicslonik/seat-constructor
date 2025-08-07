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

window.addEventListener("DOMContentLoaded", updateView);
