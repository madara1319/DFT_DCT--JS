//import { Controller } from './pattern.js'; 
//import { View } from './pattern.js'; 
//import { Model } from './pattern.js'; 
//import * as dftFile from '../DFT_DCT--JS.js';

class SignalGenerator{
  static generateSineWave(frequency, amplitude=1,sampleRate,length){
    //const wave=[];
    const wave= new Map();
    const angularFrequency=2*Math.PI*frequency;
    const timeIncrement=1/sampleRate;
    for(let i=0; i<length; i++){
      const time=i*timeIncrement;
      //wave.push(amplitude*Math.sin(angularFrequency*time));

      wave.set(time,amplitude*Math.sin(angularFrequency*time));
    }
    return wave;
  }
  static generateSquareWave(frequency,amplitude=1, sampleRate, length){
    //const wave=[];
    const wave=new Map();
    const period=Math.floor(sampleRate/frequency);
    const halfPeriod=Math.floor(period/2);
    const timeIncrement=1/sampleRate;
    for (let i=0; i<length; i++){
      const phase = i% period;
      const time=i*timeIncrement;
      wave.set(time,phase<halfPeriod ? amplitude : -amplitude);
    }
    return wave;
  }
  static generateTriangleWave(frequency, amplitude=1,sampleRate, length){
    //const wave=[];
    const wave=new Map();
    const period=Math.floor(sampleRate/frequency);
    const halfPeriod=Math.floor(period/2);
    const timeIncrement=1/sampleRate;
    for(let i=0; i<length; i++){
      const phase = i%period;
      const time=i*timeIncrement;
      wave.set(time,(2/halfPeriod)*(Math.abs(phase-halfPeriod)-halfPeriod)*amplitude);
    }
    return wave;
  }
}
//console.log(SignalGenerator.generateSineWave(10,1,400,100).keys());
//console.log(Array.from(SignalGenerator.generateSineWave(10,1,400,100).keys()).toFixed());

const testWave=SignalGenerator.generateSineWave(10,1,400,100);
const keysy=(Array.from(testWave.keys()).map(key=>parseFloat(Number(key).toFixed(5))));
//const keysArray=keysy.forEach((element)=>Number(element));
console.log(keysy);
console.log('test');

class View{
  constructor(){
    //przyciski wyboru tryby wprowadzania danych
    this.baseFuncButton=document.querySelector(".showSelection");
    this.enterProbesButton=document.querySelector(".enterProbes");
   
    //tryby wprowadzania danych
    this.optionsDisplay=document.querySelector(".options");
    this.enterBox=document.querySelector(".entering");

    
    //toggle do do przyciskow wprowadzania 
    this.baseFuncButton.addEventListener('click',(event)=>this.toggleElement(this.optionsDisplay,this.enterBox,event));  
    this.enterProbesButton.addEventListener('click',(event)=>this.toggleElement(this.enterBox,this.optionsDisplay,event));  
    

    this.selectedOption=document.querySelector(".selection");
    this.selectedOption.addEventListener('change',this.handleOptionChange.bind(this));

    //do slidera
    this.amplitudeSlider=document.querySelector(".amplitudeSlider");
    this.frequencySlider=document.querySelector(".frequencySlider");
    this.frequencySlider.addEventListener('change',this.handleSlider.bind(this));
    this.amplitudeSlider.addEventListener('change',this.handleSlider.bind(this));
    //this.amplitudeSlider.addEventListener('change',this.handleUserChange.bind(this)); 
    //zlaczone
    //this.selectedOption.addEventListener('change',this.handleOptionChange.bind(this));
    this.enterBox.querySelector(".textArea").addEventListener('keydown',this.handleTextArea.bind(this));
    document.addEventListener('DOMContentLoaded',this.setupCharts.bind(this));
  }
  //wyswietlanie ukrywanie opcji wprowadzania danych
  toggleElement(firstElement,secondElement, event){
    event.preventDefault();
    //console.log(firstElement);

    const isFirstOpen=firstElement.classList.contains("open");
    const isSecondOpen=secondElement.classList.contains("open");

    if(isFirstOpen){
      firstElement.classList.add("hidden");
      firstElement.classList.remove("open");
      
    }
    else{
      if(isSecondOpen){
        secondElement.classList.remove("open");
        secondElement.classList.add("hidden");
      }
      firstElement.classList.remove("hidden");
      firstElement.classList.add("open");
    }
  }
//cos nie tak 
//  handleOptionChange(event){
//    const selectedOption=event.target.value;
//    if(this.isFunctionOpen(selectedOption)){
//      const amplitudeValue=parseFloat(this.amplitudeSlider.value);
//      this.drawChart(selectedOption,amplitudeValue);
//    }
//    else{
//      this.drawChart(selectedOption);
//    }
//  }

  isFunctionOpen(option){
    return["Sine function", "Quadratic function", "Triangle function"].includes(option);
  }
  //need to handle multiple sliders events
  handleSlider(event){

    console.log(`this w handleSlider to ${this}`);
    let amplitudeValue;
    let frequencyValue;
    console.log('event to ' + event);
    console.log('id to ' + event.target.id);
    if(event.target.id==='amplitudeSlider'){
      amplitudeValue=event.target.value;
      frequencyValue=this.frequencySlider.value;
    }
    else if(event.target.id==='frequencySlider'){
      amplitudeValue=this.amplitudeSlider.value;
      frequencyValue=event.target.value;
    }
    const selectedOption=this.selectedOption.value;
    console.log("amplituda wynosi: " + amplitudeValue + " czestotliwosc wynosi: " + frequencyValue + " wybrana funkcja to " + selectedOption);
    this.drawChart(selectedOption, amplitudeValue, frequencyValue);
  }

//rysuj jeden z wykresow z listy
  handleOptionChange(event){

    console.log(`this w handleOptionChange to ${this}`);
    const selectedValue = event.target.value;
    console.log(selectedValue);
    this.drawChart(selectedValue);
    
  }
//daj wykres jak sie strona zaladuje
  setupCharts(){
    console.log(`this w setupCharts to ${this}`);
    this.sampleChart = new Chart(document.getElementById('sampleChart').getContext('2d'));
    this.sampleChart.canvas.width=400;
    this.sampleChart.canvas.height=400;
  }
//czy wprowadzona tablica git
  handleTextArea(event){

    console.log(`this w handleTextArea to ${this}`);
    if(event.key==="Enter"){
      const data=event.target.value.trim();
      const dataArray=data.split(",");
      const areNumbers=dataArray.every(value=>!isNaN(value.trim()));
      if(areNumbers){
        //this.drawChart("Custom",dataArray.map(Number));
        const numberArray=dataArray.map(value=>parseFloat(value.trim()));

        console.log("liczby",numberArray);
        this.drawChart("Custom",undefined,undefined, numberArray);
      }
      else{
        console.log("nieprowadilowe dane");
      }
    }
  }
//rysuj wykres
  drawChart(optionValue, amplitudeValue = 1, frequencyValue = 10, customData=[]){


    console.log(`this w drawChart to ${this} `);
   // if(this.sampleChart){
   //   this.sampleChart.destroy();
   // }
    let labels=[];
    let data=[];

    if (customData.length>0){
      
      labels=Array.from({length:customData.length},(_,i)=>i.toString());
      data=customData;
    }
    else{
    switch (optionValue){

      case "Sine function": 


      data=(Array.from(SignalGenerator.generateSineWave(frequencyValue,amplitudeValue,99,100).values()).map(value=>parseFloat(Number(value).toFixed(5))));
      labels=(Array.from(SignalGenerator.generateSineWave(frequencyValue,amplitudeValue,99,100).keys()).map(key=>parseFloat(Number(key).toFixed(5))));
      break;

      case "Quadratic function":
      
      //this doesnt work properly
      data=(Array.from(SignalGenerator.generateSquareWave(frequencyValue,amplitudeValue,99,100).values()).map(value=>parseFloat(Number(value).toFixed(5))));
      labels=(Array.from(SignalGenerator.generateSquareWave(frequencyValue,amplitudeValue,99,100).keys()).map(key=>parseFloat(Number(key).toFixed(5))));
        break;
        case "Triangle function":
      
      data=(Array.from(SignalGenerator.generateTriangleWave(frequencyValue,amplitudeValue,99,100).values()).map(value=>parseFloat(Number(value).toFixed(5))));
      labels=(Array.from(SignalGenerator.generateTriangleWave(frequencyValue,amplitudeValue,99,100).keys()).map(key=>parseFloat(Number(key).toFixed(5))));
      break;

        default:
        break;
      }
    }
    

    //nie wiem czy one na siebie nie nachodza
    if(this.sampleChart){
      this.sampleChart.destroy();
    }
  this.sampleChart = new Chart(document.getElementById('sampleChart').getContext('2d'), {
    type: customData.length > 0 ? 'bar' : 'line',
    data: {
      labels,
      datasets: [{
        label: 'Signal',
        data,
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.5)',
        borderColor: 'rgb(255,99,132,1)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'X'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Y'
          }
        }
      }
    }
  });
}
}

function main(){
  const view = new View();
}
main();
