
// Aplica a transformação de escala na imagem, interpolando pelo mais próximo:
function scaleNearest(ratio) {
    // Pixels da imagem original:
    let data2 = [...pixels.data];

    // Calculando a largura e altura da nova imagem:
    let larguraOriginal = canvas.width;
    let alturaOriginal = canvas.height;

    let larguraNova = ratio * larguraOriginal;
    let alturaNova = ratio * alturaOriginal;

    // Atualizando o tamanho do canvas de exibição:
    canvas.width = larguraNova;
    canvas.height = alturaNova;

    // Criando um novo objeto ImageData:
    const imageData = context.createImageData(larguraNova, alturaNova);
    let data3 = imageData.data;

    // Laço que percorre a nova imagem preenchendo com base na anterior:
    for (i = 0; i < data3.length; i = i + 4) {

        // Calculando a linha e coluna do elemento atual da nova imagem:
        let linhaAtual = Math.floor( i / (larguraNova*4) );
        let colunaAtual = Math.round( (i % (larguraNova*4)) / 4 );

        // Interpolando a linha e coluna correspondente na imagem original:
        let linhaNaOriginal = Math.round( linhaAtual / ratio );
        let colunaNaOriginal = Math.round( colunaAtual / ratio );

        // Calculando o índice na imagem original:
        let i2 = linhaNaOriginal*larguraOriginal*4 + colunaNaOriginal*4;

        // Atribuindo o valor do pixel:
        data3[i] = data2[i2];
        data3[i+1] = data2[i2+1];
        data3[i+2] = data2[i2+2];
        data3[i+3] = data2[i2+3];
    }

    context.putImageData(imageData, 0, 0);
    pixels = context.getImageData(0,0,canvas.width,canvas.height);
    getFrequencies();
    drawHistogram();
}

// Aplica a transformação de escala na imagem, interpolando pelo mais próximo:
function scaleBilinear(ratio) {

    // Pixels da imagem original:
    let data2 = [...pixels.data];

    // Calculando a largura e altura da nova imagem:
    let larguraOriginal = canvas.width;
    let alturaOriginal = canvas.height;

    let larguraNova = ratio * larguraOriginal;
    let alturaNova = ratio * alturaOriginal;

    // Atualizando o tamanho do canvas de exibição:
    canvas.width = larguraNova;
    canvas.height = alturaNova;

    // Criando um novo objeto ImageData:
    const imageData = context.createImageData(larguraNova, alturaNova);
    let data3 = imageData.data;

    // Laço que percorre a nova imagem preenchendo com base na anterior:
    for (i = 0; i < data3.length; i = i + 4) {

        // Calculando a linha e coluna do elemento atual da nova imagem:
        let linhaAtual = Math.floor( i / (larguraNova*4) );
        let colunaAtual = Math.round( (i % (larguraNova*4)) / 4 );

        // Interpolando a linha e coluna correspondente na imagem original:
        let l1 = Math.floor( linhaAtual / ratio );
        let l2 = Math.ceil( linhaAtual / ratio );
        let c1 = Math.floor( colunaAtual / ratio );
        let c2 = Math.ceil( colunaAtual / ratio );

        let deltax = (colunaAtual / ratio) - c1;
        let deltay = (linhaAtual / ratio) - l1;

        // Calculando os índices na imagem original:
        let i1 = l1*larguraOriginal*4 + c1*4;
        let i2 = l1*larguraOriginal*4 + c2*4;
        let i3 = l2*larguraOriginal*4 + c1*4;
        let i4 = l2*larguraOriginal*4 + c2*4;

        // Calculando o r:
        // Interpolando em x:
        rInt1 = data2[i1] * (1-deltax) + data2[i2] * deltax;
        rInt2 = data2[i3] * (1-deltax) + data2[i4] * deltax;
        // Interpolando em y:
        rFinal = rInt1 * (1-deltay) + rInt2 * deltay;

        // Calculando o g:
        // Interpolando em x:
        gInt1 = data2[i1+1] * (1-deltax) + data2[i2+1] * deltax;
        gInt2 = data2[i3+1] * (1-deltax) + data2[i4+1] * deltax;
        // Interpolando em y:
        gFinal = gInt1 * (1-deltay) + gInt2 * deltay;

        // Calculando o b:
        // Interpolando em x:
        bInt1 = data2[i1+2] * (1-deltax) + data2[i2+2] * deltax;
        bInt2 = data2[i3+2] * (1-deltax) + data2[i4+2] * deltax;
        // Interpolando em y:
        bFinal = bInt1 * (1-deltay) + bInt2 * deltay;

        // Calculando o alpha:
        // Interpolando em x:
        aInt1 = data2[i1+3] * (1-deltax) + data2[i2+3] * deltax;
        aInt2 = data2[i3+3] * (1-deltax) + data2[i4+3] * deltax;
        // Interpolando em y:
        aFinal = aInt1 * (1-deltay) + aInt2 * deltay;

        // Atribuindo o valor do pixel:
        data3[i] = Math.round( rFinal );
        data3[i+1] = Math.round( gFinal );
        data3[i+2] = Math.round( bFinal );
        data3[i+3] = Math.round( aFinal );
    }

    context.putImageData(imageData, 0, 0);
    pixels = context.getImageData(0,0,canvas.width,canvas.height);
    getFrequencies();
    drawHistogram();
}

// Aplica a transformação de rotação na imagem, interpolando pelo mais próximo:
function rotationNearest(angle) {

    // Pixels da imagem original:
    let data2 = [...pixels.data];

    // Calculando a largura e altura da nova imagem:
    let larguraOriginal = canvas.width;
    let alturaOriginal = canvas.height;

    let angleRadians = parseFloat(((parseFloat(angle) * Math.PI) / 180).toFixed(2));

    x1 = larguraOriginal*Math.cos(angleRadians) - 0*Math.sin(angleRadians);
    y1 = larguraOriginal*Math.sin(angleRadians) + 0*Math.cos(angleRadians);

    x2 = larguraOriginal*Math.cos(angleRadians) - alturaOriginal*Math.sin(angleRadians);
    y2 = larguraOriginal*Math.sin(angleRadians) + alturaOriginal*Math.cos(angleRadians);

    x3 = 0*Math.cos(angleRadians) - alturaOriginal*Math.sin(angleRadians);
    y3 = 0*Math.sin(angleRadians) + alturaOriginal*Math.cos(angleRadians);

    let larguraNova = Math.ceil( Math.max(0, x1, x2, x3) - Math.min(0, x1, x2, x3) );
    let alturaNova = Math.ceil( Math.max(0, y1, y2, y3) - Math.min(0, y1, y2, y3) );

    // Atualizando o tamanho do canvas de exibição:
    canvas.width = larguraNova;
    canvas.height = alturaNova;

    // Criando um novo objeto ImageData:
    const imageData = context.createImageData(larguraNova, alturaNova);
    let data3 = imageData.data;

    // Laço que percorre a nova imagem preenchendo com base na anterior:
    for (i = 0; i < data3.length; i = i + 4) {

        // Calculando a linha e coluna do elemento atual da nova imagem:
        let linhaAtual = Math.floor( i / (larguraNova*4) );
        let colunaAtual = Math.round( (i % (larguraNova*4)) / 4 );

        // Interpolando a linha e coluna correspondente na imagem original:
        let linhaNaOriginal = Math.round( (colunaAtual+Math.min(0, x1, x2, x3))*Math.sin(0-angleRadians) + (linhaAtual+Math.min(0, y1, y2, y3))*Math.cos(0-angleRadians) )
        let colunaNaOriginal = Math.round( (colunaAtual+Math.min(0, x1, x2, x3))*Math.cos(0-angleRadians) - (linhaAtual+Math.min(0, y1, y2, y3))*Math.sin(0-angleRadians) )

        if (linhaNaOriginal < 0 || colunaNaOriginal < 0 || linhaNaOriginal >= alturaOriginal || colunaNaOriginal >= larguraOriginal) {
            data3[i] = 0;
            data3[i+1] = 0;
            data3[i+2] = 0;
            data3[i+3] = 255;
        }
        else {
            // Calculando o índice na imagem original:
            let i2 = linhaNaOriginal*larguraOriginal*4 + colunaNaOriginal*4;

            // Atribuindo o valor do pixel:
            data3[i] = data2[i2];
            data3[i+1] = data2[i2+1];
            data3[i+2] = data2[i2+2];
            data3[i+3] = data2[i2+3];
        }
    }

    context.putImageData(imageData, 0, 0);
    pixels = context.getImageData(0,0,canvas.width,canvas.height);
    getFrequencies();
    drawHistogram();
}

// Aplica a transformação de rotação na imagem, interpolando bilinearmente:
// Aplica a transformação de rotação na imagem, interpolando bilinearmente:
function rotationBilinear(angle) {
    // Pixels da imagem original:
    let data2 = [...pixels.data];

    // Calculando a largura e altura da nova imagem:
    let larguraOriginal = canvas.width;
    let alturaOriginal = canvas.height;

    let angleRadians = parseFloat(((parseFloat(angle) * Math.PI) / 180).toFixed(2));

    x1 = larguraOriginal*Math.cos(angleRadians) - 0*Math.sin(angleRadians);
    y1 = larguraOriginal*Math.sin(angleRadians) + 0*Math.cos(angleRadians);

    x2 = larguraOriginal*Math.cos(angleRadians) - alturaOriginal*Math.sin(angleRadians);
    y2 = larguraOriginal*Math.sin(angleRadians) + alturaOriginal*Math.cos(angleRadians);

    x3 = 0*Math.cos(angleRadians) - alturaOriginal*Math.sin(angleRadians);
    y3 = 0*Math.sin(angleRadians) + alturaOriginal*Math.cos(angleRadians);

    let larguraNova = Math.ceil( Math.max(0, x1, x2, x3) - Math.min(0, x1, x2, x3) );
    let alturaNova = Math.ceil( Math.max(0, y1, y2, y3) - Math.min(0, y1, y2, y3) );

    // Atualizando o tamanho do canvas de exibição:
    canvas.width = larguraNova;
    canvas.height = alturaNova;

    // Criando um novo objeto ImageData:
    const imageData = context.createImageData(larguraNova, alturaNova);
    let data3 = imageData.data;

    // Laço que percorre a nova imagem preenchendo com base na anterior:
    for (i = 0; i < data3.length; i = i + 4) {

        // Calculando a linha e coluna do elemento atual da nova imagem:
        let linhaAtual = Math.floor( i / (larguraNova*4) );
        let colunaAtual = Math.round( (i % (larguraNova*4)) / 4 );

        // Interpolando a linha e coluna correspondente na imagem original:
        let linhaNaOriginal = Math.round( (colunaAtual+Math.min(0, x1, x2, x3))*Math.sin(0-angleRadians) + (linhaAtual+Math.min(0, y1, y2, y3))*Math.cos(0-angleRadians) )
        let colunaNaOriginal = Math.round( (colunaAtual+Math.min(0, x1, x2, x3))*Math.cos(0-angleRadians) - (linhaAtual+Math.min(0, y1, y2, y3))*Math.sin(0-angleRadians) )

        if (linhaNaOriginal < 0 || colunaNaOriginal < 0 || linhaNaOriginal >= alturaOriginal || colunaNaOriginal >= larguraOriginal) {
            data3[i] = 0;
            data3[i+1] = 0;
            data3[i+2] = 0;
            data3[i+3] = 255;
        }
        else {

            // Interpolando a linha e coluna correspondente na imagem original:
            let l1 = Math.floor( linhaNaOriginal );
            let l2 = Math.ceil( linhaNaOriginal );
            let c1 = Math.floor( colunaNaOriginal );
            let c2 = Math.ceil( colunaNaOriginal );

            let deltax =  colunaNaOriginal - c1;
            let deltay = linhaNaOriginal - l1;

            // Calculando os índices na imagem original:
            let i1 = l1*larguraOriginal*4 + c1*4;
            let i2 = l1*larguraOriginal*4 + c2*4;
            let i3 = l2*larguraOriginal*4 + c1*4;
            let i4 = l2*larguraOriginal*4 + c2*4;

            // Calculando o r:
            // Interpolando em x:
            rInt1 = data2[i1] * (1-deltax) + data2[i2] * deltax;
            rInt2 = data2[i3] * (1-deltax) + data2[i4] * deltax;
            // Interpolando em y:
            rFinal = rInt1 * (1-deltay) + rInt2 * deltay;

            // Calculando o g:
            // Interpolando em x:
            gInt1 = data2[i1+1] * (1-deltax) + data2[i2+1] * deltax;
            gInt2 = data2[i3+1] * (1-deltax) + data2[i4+1] * deltax;
            // Interpolando em y:
            gFinal = gInt1 * (1-deltay) + gInt2 * deltay;

            // Calculando o b:
            // Interpolando em x:
            bInt1 = data2[i1+2] * (1-deltax) + data2[i2+2] * deltax;
            bInt2 = data2[i3+2] * (1-deltax) + data2[i4+2] * deltax;
            // Interpolando em y:
            bFinal = bInt1 * (1-deltay) + bInt2 * deltay;

            // Calculando o alpha:
            // Interpolando em x:
            aInt1 = data2[i1+3] * (1-deltax) + data2[i2+3] * deltax;
            aInt2 = data2[i3+3] * (1-deltax) + data2[i4+3] * deltax;
            // Interpolando em y:
            aFinal = aInt1 * (1-deltay) + aInt2 * deltay;

            // Atribuindo o valor do pixel:
            data3[i] = Math.round( rFinal );
            data3[i+1] = Math.round( gFinal );
            data3[i+2] = Math.round( bFinal );
            data3[i+3] = Math.round( aFinal );
        }
    }

    context.putImageData(imageData, 0, 0);
    pixels = context.getImageData(0,0,canvas.width,canvas.height);
    getFrequencies();
    drawHistogram();
}