var histR = new Array(256).fill(0);
var histG = new Array(256).fill(0);
var histB = new Array(256).fill(0);
var histI = new Array(256).fill(0);
var max_frequencyR = 0;
var max_frequencyG = 0;
var max_frequencyB = 0;
var max_frequencyI = 0;

function getFrequencies(){
    //receber pixels
    histR = new Array(256).fill(0);
    histG = new Array(256).fill(0);
    histB = new Array(256).fill(0);
    histI = new Array(256).fill(0);
    max_frequencyR = 0;
    max_frequencyG = 0;
    max_frequencyB = 0;
    max_frequencyI = 0;

    const pixel =  new Uint32Array(pixels.data.buffer);
    for (let i = 0; i<pixel.length;i++){
        const r = pixel[i] & 0xff;  // Calc de intensidades
        const g = (pixel[i] >> 8) & 0xff;
        const b = (pixel[i] >> 16) & 0xff;
        const mean = Math.round((r+g+b)/3)
        histR[r] = histR[r] + 1; // Calc de Frequencias
        histG[g] = histG[g] + 1; 
        histB[b] = histB[b] + 1; 
        histI[mean] = histI[mean] + 1

    }
    
    for (let i = 0;i<256;i++){
        if (histR[i]>max_frequencyR){
            max_frequencyR = histR[i];
        }
    }
    for (let i = 0;i<256;i++){
            if (histG[i]>max_frequencyG){
                max_frequencyG = histG[i];
        }
        }
    for (let i = 0;i<256;i++){
        if (histB[i]>max_frequencyB){
                max_frequencyB = histB[i];
        }
    }
    for (let i = 0;i<256;i++){
        if (histI[i]>max_frequencyI){
                max_frequencyI = histI[i];
        }
    }
    
    
}

var canvashistR = document.getElementById("histogramR"); // criar canvas (representa desenho)
var canvashistG = document.getElementById("histogramG");
var canvashistB = document.getElementById("histogramB");
var canvashistI = document.getElementById("histogramI");
var contexthistR = canvashistR.getContext("2d");         // estrutura que recebe dados para desenho
var contexthistG = canvashistG.getContext("2d");
var contexthistB = canvashistB.getContext("2d");
var contexthistI = canvashistI.getContext("2d");


function drawHistogram(){
    if(pixels){
        contexthistR.clearRect(0,0,canvashistR.width,canvashistR.height);
        const sizebar= 10;
        const starty = canvashistR.height - sizebar;
        const pixelx = canvashistR.width/255;
        const pixely = canvashistR.height/max_frequencyR;
        for (let i = 0;i<256;i++){
          const x = i*pixelx;
          contexthistR.strokeStyle = "red";
          contexthistR.beginPath();
          contexthistR.moveTo(x,starty);                 //linha daqui
          contexthistR.lineTo(x,starty-histR[i]*pixely)   //ate aqui
          contexthistR.closePath();
          contexthistR.stroke();
            
        }
        contexthistR.fillStyle = "white";
        contexthistR.font = "normal 12px Arial";
        contexthistR.fillText("0",0,canvashistR.height);
        contexthistR.fillText("255",canvashistR.width-20,canvashistR.height);
    
    }
    if(pixels){
        contexthistG.clearRect(0,0,canvashistG.width,canvashistG.height);
        const sizebar= 10;
        const starty = canvashistG.height - sizebar;
        const pixelx = canvashistG.width/255;
        const pixely = canvashistG.height/max_frequencyG;
        for (let i = 0;i<256;i++){
          const x = i*pixelx;
          contexthistG.strokeStyle = "green";
          contexthistG.beginPath();
          contexthistG.moveTo(x,starty);                 //linha daqui
          contexthistG.lineTo(x,starty-histG[i]*pixely)   //ate aqui
          contexthistG.closePath();
          contexthistG.stroke();
            
        }
        contexthistG.fillStyle = "white";
        contexthistG.font = "normal 12px Arial";
        contexthistG.fillText("0",0,canvashistG.height);
        contexthistG.fillText("255",canvashistG.width-20,canvashistG.height);
    
    }
    if(pixels){
        contexthistB.clearRect(0,0,canvashistB.width,canvashistB.height);
        const sizebar= 10;
        const starty = canvashistB.height - sizebar;
        const pixelx = canvashistB.width/255;
        const pixely = canvashistB.height/max_frequencyB;
        for (let i = 0;i<256;i++){
          const x = i*pixelx;
          contexthistB.strokeStyle = "blue";
          contexthistB.beginPath();
          contexthistB.moveTo(x,starty);                 //linha daqui
          contexthistB.lineTo(x,starty-histB[i]*pixely)   //ate aqui
          contexthistB.closePath();
          contexthistB.stroke();
            
        }
        contexthistB.fillStyle = "white";
        contexthistB.font = "normal 12px Arial";
        contexthistB.fillText("0",0,canvashistB.height);
        contexthistB.fillText("255",canvashistB.width-20,canvashistB.height);
    
    }
    if(pixels){
        contexthistB.clearRect(0,0,canvashistB.width,canvashistB.height);
        const sizebar= 10;
        const starty = canvashistB.height - sizebar;
        const pixelx = canvashistB.width/255;
        const pixely = canvashistB.height/max_frequencyB;
        for (let i = 0;i<256;i++){
          const x = i*pixelx;
          contexthistB.strokeStyle = "blue";
          contexthistB.beginPath();
          contexthistB.moveTo(x,starty);                 //linha daqui
          contexthistB.lineTo(x,starty-histB[i]*pixely)   //ate aqui
          contexthistB.closePath();
          contexthistB.stroke();
            
        }
        contexthistB.fillStyle = "white";
        contexthistB.font = "normal 12px Arial";
        contexthistB.fillText("0",0,canvashistB.height);
        contexthistB.fillText("255",canvashistB.width-20,canvashistB.height);
    
    }
    if(pixels){
        contexthistI.clearRect(0,0,canvashistI.width,canvashistI.height);
        const sizebar= 10;
        const starty = canvashistI.height - sizebar;
        const pixelx = canvashistI.width/255;
        const pixely = canvashistI.height/max_frequencyI;
        for (let i = 0;i<256;i++){
          const x = i*pixelx;
          contexthistI.strokeStyle = "black";
          contexthistI.beginPath();
          contexthistI.moveTo(x,starty);                 //linha daqui
          contexthistI.lineTo(x,starty-histI[i]*pixely)   //ate aqui
          contexthistI.closePath();
          contexthistI.stroke();
            
        }
        contexthistI.fillStyle = "white";
        contexthistI.font = "normal 12px Arial";
        contexthistI.fillText("0",0,canvashistI.height);
        contexthistI.fillText("255",canvashistI.width-20,canvashistI.height);
    
    }
    
}