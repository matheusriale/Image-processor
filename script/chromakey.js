var imageCK = new Image();
var original_copyCK;

const dist = document.getElementById("distCK");
dist.addEventListener("change", (event) => {
  let value = event.target.value;
  applyChromakey(original_copyCK, value);
});

function applyChromakey(bg_img, d) {
  let copypixels = pixels;
  const data = copypixels.data; //original image = data

  let pix_distance;
  for (let i = 0; i < data.length; i = i + 4) {
    pix_distance = Math.sqrt(
      Math.pow(0 - original_copy[i], 2)+
      Math.pow(255 - original_copy[i + 1], 2)+
      Math.pow(0 - original_copy[i + 2], 2)
    );

    if (pix_distance <= d) {
      data[i] = bg_img[i];
      data[i + 1] = bg_img[i + 1];
      data[i + 2] = bg_img[i + 2];
    } else {
      data[i] = original_copy[i];
      data[i + 1] = original_copy[i + 1];
      data[i + 2] = original_copy[i + 2];
    }
  }
  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

function uploadChromaKey(event) {
  // função chamada
  imageCK.src = URL.createObjectURL(event.target.files[0]); //Pegar link da imageCKm
  imageCK.addEventListener("load", () => {
    // Força tag a ter certo comportamento
    const cv = document.createElement("canvas");
    const ct = cv.getContext("2d");
    cv.width = canvas.width;
    cv.height = (canvas.width / imageCK.width) * imageCK.height;
    ct.drawImage(imageCK, 0, 0, cv.width, cv.height);

    const pixelsck = ct.getImageData(0, 0, cv.width, cv.height); // Captura pixels da imageCKm

    original_copyCK = [...pixelsck.data];
    applyChromakey(original_copyCK);
    getFrequencies();
    drawHistogram();
    imageCK.style.display = "none"; // Não mostrar a imagem
    cv.remove();
  });
}
