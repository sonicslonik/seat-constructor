function updateView() {
  const color = document.getElementById("center-color").value;
  const sideColor = document.getElementById("side-color").value;
  const pattern = document.getElementById("pattern").value;

  const basePath = "img/";
  const centerImage = `${basePath}center-w-perforation/${pattern}/${color}.png`;
  const sideImage = `${basePath}sides/${sideColor}.png`;
  const headrestImage = `${basePath}headrest/${color}.png`;

  document.getElementById("layer-center").src = centerImage;
  document.getElementById("layer-sides").src = sideImage;
  document.getElementById("layer-headrest").src = headrestImage;
}

document.querySelectorAll("select").forEach(select => {
  select.addEventListener("change", updateView);
});

window.addEventListener("DOMContentLoaded", updateView);
