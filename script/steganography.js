const message = document.getElementById("steganographyMessage");
const decryptedMessage = document.getElementById("steganographyDecrypt");

function binaryToBinaryList(binary) {
  //retorna lista de 0s e 1s do numero binario em cada posicao, para passarmos a imagem.
  let n_len = binary;
  n_len = n_len.toString().length;
  bin_vector = [];
  bin_string = binary.toString();
  for (let i = 0; i < n_len; i++) {
    let bin_number = parseInt(bin_string.charAt(i));
    bin_vector.push(bin_number);
  }
  return bin_vector;
}

function decimalToBinary(number) {
  binary = 0;
  cont = 1;
  while (number >= 1) {
    let resto = number % 2;
    number = Math.floor(number / 2);
    binary = binary + resto * cont;
    cont = cont * 10;
  }
  return binary;
}

function encrypt() {
  const data = pixels.data;
  const msg = message.value;
  let msg_len = msg.length;
  let img_counter = 0;
  for (let i = 0; i < msg_len + 1; i++) {
    //pegar caracteres
    ascii_number = msg.charCodeAt(i);
    binary_number = decimalToBinary(ascii_number);
    binList = binaryToBinaryList(binary_number); //lista de 0s e 1s do char para adicionarmos a imagem

    while (binList.length < 7) {
      //caso em que temos 0s à esquerda do binario
      binList.unshift(0);
    }

    for (let j = 0; j < binList.length; j++) {
      if (data[img_counter + j] % 2 == 1 && binList[j] == 1) {
        continue;
      } else if (data[img_counter + j] % 2 == 1 && binList[j] == 0) {
        data[img_counter + j] = data[img_counter + j] - 1;
      } else if (data[img_counter + j] % 2 == 0 && binList[j] == 0) {
        continue;
      } else if (data[img_counter + j] % 2 == 0 && binList[j] == 1) {
        data[img_counter + j] = data[img_counter + j] + 1;
      }
    }
    img_counter = img_counter + 7;
  }
  for (let j = 0; j < 7; j++) {
    if (data[img_counter + j] % 2 == 1) {
      data[img_counter + j] = data[img_counter + j] - 1;
    } else if (data[img_counter + j] % 2 == 0) {
      continue;
    }
  }
  context.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);
  getFrequencies();
  drawHistogram();
  message.value = "";
  closeModal();
}

function decrypt() {
  decryptedMessage.innerHTML = "";
  let counter = Math.pow(10, 6);
  let msg = "";
  let char_bin = 0;
  let next_char = "";
  const data = pixels.data;
  
  let reset_counter = false;
  for (let i = 0; i < data.length; i++) {
    reset_counter = false;
    char_bin = char_bin + (data[i] % 2) * counter;
    if (
      data[i] % 2 == 0 &&
      counter == 0 && //1//bom por pra testar, se nao analisa imagem toda
      data[i + 1] % 2 == 0 &&
      data[i + 2] % 2 == 0 &&
      data[i + 3] % 2 == 0 &&
      data[i + 4] % 2 == 0 &&
      data[i + 5] % 2 == 0 &&
      data[i + 6] % 2 == 0
    ) {
      counter = Math.pow(10, 6);
      let decimal_code = parseInt(char_bin, 2);

      msg = msg.concat(String.fromCharCode(decimal_code));
      break;
    }
    if (counter == 1) {
      //ultimo bit do caractere
      reset_counter = true;
      let decimal_code = parseInt(char_bin, 2);
      msg = msg.concat(String.fromCharCode(decimal_code)); //concatenar mensagem com ultimo caractere descriptografado
      char_bin = 0;
      next_char = "";
    }
    counter = counter / 10;
    if (reset_counter) {
      counter = Math.pow(10, 6);
    }
  }
  decryptedMessage.innerHTML = msg;
  openModal("steganographyModalDecrypt");
}
