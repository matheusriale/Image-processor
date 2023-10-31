function undo() {
  canvas.width = original_width;
  canvas.height = original_height;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

function rgb2gray() {
  const data = pixels.data;
  for (let i = 0; i < data.length; i = i + 4) {
    const mean = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = mean;
    data[i + 1] = mean;
    data[i + 2] = mean;
  }
  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

function rgb2grayWeighted() {
  const data = pixels.data;
  for (let i = 0; i < data.length; i = i + 4) {
    const mean = 0.3 * data[i] + 0.6 * data[i + 1] + 0.1 * data[i + 2];
    data[i] = mean;
    data[i + 1] = mean;
    data[i + 2] = mean;
  }
  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

function toNegative() {
  const data = pixels.data;
  for (i = 0; i < data.length; i = i + 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

function logTransformation() {
  let copypixels = pixels; //copiar valores, novo array
  let data = copypixels.data;
  for (i = 0; i < data.length; i = i + 4) {
    data[i] = 255 * Math.log2(1 + data[i] / 255.0);
    data[i + 1] = 255 * Math.log2(1 + data[i + 1] / 255.0);
    data[i + 2] = 255 * Math.log2(1 + data[i + 2] / 255.0);
  }
  pixels = copypixels;

  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

function gammaTransformation(gamma) {
  let copypixels = pixels; //copiar valores, novo array
  let data = copypixels.data;
  for (i = 0; i < data.length; i = i + 4) {
    data[i] = 255 * Math.pow(original_copy[i] / 255.0, gamma);
    data[i + 1] = 255 * Math.pow(original_copy[i + 1] / 255.0, gamma);
    data[i + 2] = 255 * Math.pow(original_copy[i + 2] / 255.0, gamma);
  }
  //pixels = copypixels;

  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

function piecewiseLinear(r1, s1, r2, s2) {
  let copypixels = pixels; //copiar valores, novo array
  //variaveis das funcoes lineares

  const pf_x = 255,
    pf_y = 255,
    a_i = s1 / r1,
    b_i = 0;
  const a = (s2 - s1) / (r2 - r1),
    b = s1 - a * r1,
    a_f = (pf_y - s2) / (pf_x - r2),
    b_f = s2 - a_f * r2;

  //se r<r1: primeira funcao linear, se r>=r1 e r<=r2 segunda, se r>r2 terceira.
  let data = copypixels.data;
  for (i = 0; i < data.length; i = i + 4) {
    //intensidade do vermelho
    if (original_copy[i] < r1) {
      data[i] = a_i * original_copy[i] + b_i;
    } else if (original_copy[i] >= r1 && original_copy[i] <= r2) {
      data[i] = a * original_copy[i] + b;
    } else {
      data[i] = a_f * original_copy[i] + b_f;
    }

    //intensidade do verde
    if (original_copy[i + 1] < r1) {
      data[i + 1] = a_i * original_copy[i + 1] + b_i;
    } else if (original_copy[i + 1] >= r1 && original_copy[i + 1] <= r2) {
      data[i + 1] = a * original_copy[i + 1] + b;
    } else {
      data[i + 1] = a_f * original_copy[i + 1] + b_f;
    }

    //intensidade do azul
    if (original_copy[i + 2] < r1) {
      data[i + 2] = a_i * original_copy[i + 2] + b_i;
    } else if (original_copy[i + 2] >= r1 && original_copy[i + 2] <= r2) {
      data[i + 2] = a * original_copy[i + 2] + b;
    } else {
      data[i + 2] = a_f * original_copy[i + 2] + b_f;
    }
  }

  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

function histEqualize() {
  let copypixels = pixels;
  let probabilitiesR = histR;
  let probabilitiesG = histG;
  let probabilitiesB = histB;
  let skR = Array(256).fill(0.0);
  let skG = Array(256).fill(0.0);
  let skB = Array(256).fill(0.0);
  let mn = canvas.width * canvas.height;
  let data = copypixels.data;

  for (let i = 0; i < 256; i = i + 1) {
    probabilitiesR[i] = histR[i] / mn;
    probabilitiesG[i] = histG[i] / mn;
    probabilitiesB[i] = histB[i] / mn;
  }
  //probabilidades acumuladas
  for (let i = 1; i < probabilitiesR.length; i = i + 1) {
    probabilitiesR[i] = probabilitiesR[i] + probabilitiesR[i - 1];
    probabilitiesG[i] = probabilitiesG[i] + probabilitiesG[i - 1];
    probabilitiesB[i] = probabilitiesB[i] + probabilitiesB[i - 1];
  }

  for (let i = 0; i < probabilitiesR.length; i = i + 1) {
    skR[i] = Math.round(255.0 * probabilitiesR[i]);
    skG[i] = Math.round(255.0 * probabilitiesG[i]);
    skB[i] = Math.round(255.0 * probabilitiesB[i]);
  }
  
  for (let i = 0; i < pixels.data.length; i = i + 4) {
    data[i] = skR[original_copy[i]];
    data[i + 1] = skG[original_copy[i+1]];
    data[i + 2] = skB[original_copy[i+2]];
  }
  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

function histEqualizeHSI() {
  let copypixels = pixels;
  let probabilitiesI = histI;
  let skI = Array(256).fill(0.0);
  let mn = canvas.width * canvas.height;
  let data = copypixels.data;

  for (let i = 0; i < 256; i = i + 1) {
    probabilitiesI[i] = histI[i] / mn;
  }
  //probabilidades acumuladas
  for (let i = 1; i < probabilitiesI.length; i = i + 1) {
    probabilitiesI[i] = probabilitiesI[i] + probabilitiesI[i - 1];
  }

  for (let i = 0; i < probabilitiesI.length; i = i + 1) {
    skI[i] = Math.round(255.0 * probabilitiesI[i]);
  }
  
  for (let i = 0; i < pixels.data.length; i = i + 4) {
    data[i] = skI[original_copy[i]];
    data[i + 1] = skI[original_copy[i+1]];
    data[i + 2] = skI[original_copy[i+2]];
  }
  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}



//Limiarizacao
function thresholding(t) {
  let copypixels = pixels; //copiar valores, novo array
  let data = copypixels.data;
  for (i = 0; i < data.length; i = i + 4) {
    if (original_copy[i] > t) {
      data[i] = 255;
    } else {
      data[i] = 0;
    }
    if (original_copy[i + 1] > t) {
      data[i + 1] = 255;
    } else {
      data[i + 1] = 0;
    }
    if (original_copy[i + 2] > t) {
      data[i + 2] = 255;
    } else {
      data[i + 2] = 0;
    }
  }

  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

function sepia() {
  const data = pixels.data;
  let inputRed = 0;
  let inputGreen = 0;
  let inputBlue = 0;
  for (let i = 0; i < data.length; i = i + 4) {
    inputRed = data[i];
    inputGreen = data[i + 1];
    inputBlue = data[i + 2];

    data[i] = Math.min(
      255,
      inputRed * 0.393 + inputGreen * 0.769 + inputBlue * 0.189
    );
    data[i + 1] = Math.min(
      255,
      inputRed * 0.349 + inputGreen * 0.686 + inputBlue * 0.168
    );
    data[i + 2] = Math.min(
      255,
      inputRed * 0.272 + inputGreen * 0.534 + inputBlue * 0.131
    );
  }
  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
}

