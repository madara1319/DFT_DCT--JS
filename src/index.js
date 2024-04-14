//import { Controller } from './pattern.js'; 
//import { View } from './pattern.js'; 
//import { Model } from './pattern.js'; 
//import * as dftFile from '../DFT_DCT--JS.js';
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



class View{
  constructor(){
    //przyciski wyboru tryby wprowadzania danych
    this.baseFuncButton=document.querySelector(".showSelection");
    this.enterProbesButton=document.querySelector(".enterProbes");
   
    //tryby wprowadzania danych
    this.optionsDisplay=document.querySelector(".options");
    this.enterBox=document.querySelector(".entering");

    this.baseFuncButton.addEventListener('click',this.toggleElement.bind(this,this.optionsDisplay));
    this.enterProbesButton.addEventListener('click',this.toggleElement.bind(this,this.enterBox));
    
    this.selectedOption=document.querySelector(".selection");
   // this.selectedOption.addEventListener('change',this.handleOptionChange.bind(this));
    //this.selectedOption.addEventListener('change',this.handleUserChange.bind(this));
    //do slidera
    this.amplitudeSlider=document.querySelector(".amplitudeSlider");
    this.frequencySlider=document.querySelector(".frequencySlider");
    //this.amplitudeSlider.addEventListener('change',this.handleSlider.bind(this));
    //this.amplitudeSlider.addEventListener('change',this.handleUserChange.bind(this)); 
    this.selectedOption.addEventListener('change',this.handleOptionChange.bind(this));
    this.enterBox.querySelector(".textArea").addEventListener('keydown',this.handleTextArea.bind(this));
    document.addEventListener('DOMContentLoaded',this.setupCharts.bind(this));
  }
  //wyswietlanie ukrywanie opcji wprowadzania danych
  toggleElement(element, event){
    event.preventDefault();
    console.log(element);

    const isOpen=element.classList.contains("open");

    if(isOpen){
      element.classList.add("hidden");
      element.classList.remove("open");
    }
    else{
      element.classList.remove("hidden");
      element.classList.add("open");
    }
  }

  handleOptionChange(event){
    const selectedOption=event.target.value;
    if(this.isFunctionOpen(selectedOption)){
      const amplitudeValue=parseFloat(this.amplitudeSlider.value);
      this.drawChart(selectedOption,amplitudeValue);
    }
    else{
      this.drawChart(selectedOption);
    }
  }

  isFunctionOpen(option){
    return["Sine function", "Quadratic function", "Triangle function"].includes(option);
  }
//  handleSlider(event){
//    const amplitudeValue=event.target.value;
//    const selectedOption=this.selectedOption.value;
//    this.drawChart(selectedOption, amplitudeValue);
//  }

//rysuj jeden z wykresow z listy
//  handleOptionChange(event){
//    const selectedValue = event.target.value;
//    console.log(selectedValue);
//    this.drawChart(selectedValue);
//    
//  }
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
        console.log("liczby",dataArray);
        this.drawChart("Custom",dataArray.map(Number));

      }
      else{
        console.log("nieprowadilowe dane");
      }
    }
  }
//rysuj wykres
  drawChart(optionValue, amplitudeValue, customData=[]){
    let labels=[];
    let data=[];

    if (customData.length>0){
      
      labels=Array.from({length:customData.length},(_,i)=>i.toString());
      data=customData;
    }
    else{
    switch (optionValue){
      case "Sine function": 
      data=SignalGenerator.generateSineWave(amplitudeValue,10);
      labels=Array.from({length:10},(_,i)=>i.toString());
      break;
      case "Quadratic function":
      
      data=SignalGenerator.generateSquareWave(4,amplitudeValue,10);
      labels=Array.from({length:10},(_,i)=>i.toString());
        break;
        case "Triangle function":
      
      data=SignalGenerator.generateTriangleWave(4,amplitudeValue,10);
      labels=Array.from({length:10},(_,i)=>i.toString());
      break;
        default:
        break;
      }
    }

    //nie wiem czy one na siebie nie nachodza
  //  if(this.sampleChart){
  //    this.sampleChart.destroy();
  //  }

    const chartType=customData.length > 0 ? 'bar' : 'line';

    const myChart=new Chart(this.sampleChart,{
      type:chartType,
      data:{
        labels:labels,
        datasets:[{
          label:"Custom",
          data:data,
          fill:false,

        backgroundColor:'rgba(255,99,132,0.5)',
          borderColor:'rgb(255,99,132,1)',
          tension:0.1
        }]
      },
      options:{
        scales:{
          x:{
            title:{
              display:true,
              text:'X'
            }
          },
          y:{
            title:{
              display:true,
              text:'Y'
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
