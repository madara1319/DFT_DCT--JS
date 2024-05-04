//import { Controller } from './pattern.js'; 
//import { View } from './pattern.js'; 
//import { Model } from './pattern.js'; 
//import * as dftFile from '../DFT_DCT--JS.js';

//te funkcje do poprawy zeby czestotliwosc faktycznie sie dalo i moze zageszczenie ilosci probek teraz jest zle
//to do fix 
console.log('signal');
class SignalGenerator{
  static generateSineWave(amplitude=1,length){
    const wave=[];
    for(let i=0; i<length; i++){
      wave.push(amplitude*Math.sin(i));
    }
    return wave;
  }
  static generateSquareWave(period,amplitude=1, length){
    const wave=[];
    const halfPeriod=Math.floor(period/2);
    for (let i=0; i<length; i++){
      const phase = i% period;
      wave.push(phase<halfPeriod ? amplitude : -amplitude);
    }
    return wave;
  }
  static generateTriangleWave(period, amplitude=1, length){
    const wave=[];
    const halfPeriod=Math.floor(period/2);
    for(let i=0; i<length; i++){
      const phase = i%period;
      wave.push((2/halfPeriod)*(Math.abs(phase-halfPeriod)-halfPeriod)*amplitude);
    }
    return wave;
  }
}

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
    const selectedValue = event.target.value;
    console.log(selectedValue);
    this.drawChart(selectedValue);
    
  }
//daj wykres jak sie strona zaladuje
  setupCharts(){
    this.sampleChart = new Chart(document.getElementById('sampleChart').getContext('2d'));
    this.sampleChart.canvas.width=400;
    this.sampleChart.canvas.height=400;
  }
//czy wprowadzona tablica git
  handleTextArea(event){
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

      data=SignalGenerator.generateSineWave(amplitudeValue,frequencyValue);
      labels=Array.from({length:10},(_,i)=>i.toString());
      break;

      case "Quadratic function":
      
      data=SignalGenerator.generateSquareWave(4,amplitudeValue,frequencyValue);
      labels=Array.from({length:10},(_,i)=>i.toString());
        break;
        case "Triangle function":
      
      data=SignalGenerator.generateTriangleWave(4,amplitudeValue,frequencyValue);
      labels=Array.from({length:10},(_,i)=>i.toString());
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
        label: 'Waveform',
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
  window.alert("test");
}

main();
