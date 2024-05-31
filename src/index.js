//import { Controller } from './pattern.js';
//import { View } from './pattern.js';
//import { Model } from './pattern.js';
//import * as dftFile from '../DFT_DCT--JS.js';

//dodac mozliwosc generowania sygnalow zlozonych z kilku sinusow roznych
class SignalCompositor {}
class SignalGenerator {
  static generateSineWave(frequency, amplitude = 1, sampleRate, length) {
    //const wave=[];
    const wave = new Map()
    const angularFrequency = 2 * Math.PI * frequency
    const timeIncrement = 1 / sampleRate
    for (let i = 0; i < length; i++) {
      const time = i * timeIncrement
      //wave.push(amplitude*Math.sin(angularFrequency*time));

      wave.set(time, amplitude * Math.sin(angularFrequency * time))
    }
    return wave
  }
  static generateSquareWave(frequency, amplitude = 1, sampleRate, length) {
    //const wave=[];
    const wave = new Map()
    //const period=Math.floor(sampleRate/frequency);
    //const halfPeriod=Math.floor(period/2);
    const period = Number((sampleRate / frequency).toFixed(6))
    const halfPeriod = period / 2
    const timeIncrement = 1 / sampleRate
    for (let i = 0; i < length; i++) {
      //const phase = (i% period);
      const time = Number((i * timeIncrement).toFixed(3))
      console.log('amplitude = ' + amplitude)
      const phase = Number(((i % period) * timeIncrement).toFixed(6))
      console.log(`phase to ${phase} a halfPeriod to ${halfPeriod}`)
      wave.set(time, phase < halfPeriod ? amplitude : -amplitude)
      console.log(wave)
    }
    return wave
  }
  static generateTriangleWave(frequency, amplitude = 1, sampleRate, length) {
    //const wave=[];
    const wave = new Map()
    const period = Math.floor(sampleRate / frequency)
    const halfPeriod = Math.floor(period / 2)
    const timeIncrement = 1 / sampleRate
    for (let i = 0; i < length; i++) {
      const phase = i % period
      const time = i * timeIncrement
      wave.set(
        time,
        (2 / halfPeriod) *
          (Math.abs(phase - halfPeriod) - halfPeriod) *
          amplitude,
      )
    }
    return wave
  }
}

//const testWave=SignalGenerator.generateSineWave(10,1,400,100);
//const keysy=(Array.from(testWave.keys()).map(key=>parseFloat(Number(key).toFixed(5))));
//const keysArray=keysy.forEach((element)=>Number(element));
//console.log(keysy);
//console.log('test');

class View {
  constructor() {
    //przyciski wyboru tryby wprowadzania danych
    this.baseFuncButton = document.querySelector('.showSelection')
    this.enterProbesButton = document.querySelector('.enterProbes')
    this.composerButton = document.querySelector('.showComposer')

    //tryby wprowadzania danych
    this.optionsDisplay = document.querySelector('.options')
    this.enterBox = document.querySelector('.entering')
    this.composerBox = document.querySelector('.composer')

    this.toggleButtons = [this.optionsDisplay, this.enterBox, this.composerBox]

    //toggle do do przyciskow wprowadzania
    this.baseFuncButton.addEventListener('click', (event) =>
      this.toggleElement(event, this.optionsDisplay),
    )
    this.enterProbesButton.addEventListener('click', (event) =>
      this.toggleElement(event, this.enterBox),
    )
    this.composerButton.addEventListener('click', (event) =>
      this.toggleElement(event, this.composerBox),
    )

    this.selectedOption = document.querySelector('.selection')
    this.selectedOption.addEventListener(
      'click',
      this.handleOptionChange.bind(this),
    )

    //do slidera
    this.amplitudeSlider = document.querySelector('.amplitudeSlider')
    this.frequencySlider = document.querySelector('.frequencySlider')
    this.frequencySlider.addEventListener(
      'change',
      this.handleSlider.bind(this),
    )
    this.amplitudeSlider.addEventListener(
      'change',
      this.handleSlider.bind(this),
    )
    //this.amplitudeSlider.addEventListener('change',this.handleUserChange.bind(this));
    //zlaczone
    //this.selectedOption.addEventListener('change',this.handleOptionChange.bind(this));
    this.enterBox
      .querySelector('.textArea')
      .addEventListener('keydown', this.handleTextArea.bind(this))
    document.addEventListener('DOMContentLoaded', this.setupCharts.bind(this))

    this.handleOptionChange({ target: this.selectedOption })
  }
  //wyswietlanie ukrywanie opcji wprowadzania danych
  toggleElement(event, chosenButton) {
    event.preventDefault()

    const openButton = chosenButton.classList.contains('open')

    this.toggleButtons.forEach((element) => {
      element.classList.add('hidden')
      element.classList.remove('open')
    })
    if (!openButton) {
      chosenButton.classList.remove('hidden')
      chosenButton.classList.add('open')
    }
  }

  isFunctionOpen(option) {
    return [
      'Sine function',
      'Quadratic function',
      'Triangle function',
    ].includes(option)
  }
  //need to handle multiple sliders events
  handleSlider(event) {
    let amplitudeValue
    let frequencyValue

    console.log('event to ' + event)
    console.log('id to ' + event.target.id)

    if (event.target.id === 'amplitudeSlider') {
      amplitudeValue = event.target.value
      frequencyValue = this.frequencySlider.value
    } else if (event.target.id === 'frequencySlider') {
      amplitudeValue = this.amplitudeSlider.value
      frequencyValue = event.target.value
    }
    const selectedOption = this.selectedOption.value
    console.log(
      'amplituda wynosi: ' +
        amplitudeValue +
        ' czestotliwosc wynosi: ' +
        frequencyValue +
        ' wybrana funkcja to ' +
        selectedOption,
    )

    //nowe
    const { labels, data } = this.calculateInput(
      selectedOption,
      amplitudeValue,
      frequencyValue,
    )
    ChartDrawer.drawChart(labels, data, 'line')

    //this.calculateInput(selectedOption, amplitudeValue, frequencyValue);
  }

  //rysuj jeden z wykresow z listy
  handleOptionChange(event) {
    console.log(`this w handleOptionChange to ${this}`)
    const selectedValue = event.target.value
    console.log(selectedValue)
    const { labels, data } = this.calculateInput(
      selectedValue,
      this.amplitudeSlider.value,
      this.frequencySlider.value,
    )
    ChartDrawer.drawChart(labels, data, 'line')
    //this.calculateInput(selectedValue);
  }
  //daj wykres jak sie strona zaladuje
  setupCharts() {
    this.sampleChart = new Chart(
      document.getElementById('sampleChart').getContext('2d'),
    )
    this.sampleChart.canvas.width = 400
    this.sampleChart.canvas.height = 400
  }
  //do rysowania charta z array
  handleTextArea(event) {
    if (event.key === 'Enter') {
      const data = event.target.value.trim()
      const dataArray = data.split(',')
      const areNumbers = dataArray.every((value) => !isNaN(value.trim()))
      if (areNumbers) {
        //this.drawChart("Custom",dataArray.map(Number));
        const numberArray = dataArray.map((value) => parseFloat(value.trim()))

        console.log('liczby', numberArray)
        //this.calculateInput("Custom",undefined,undefined, numberArray);
        const { labels, data } = this.calculateInput(
          'Custom',
          undefined,
          undefined,
          numberArray,
        )
        ChartDrawer.drawChart(labels, data, 'bar')
      } else {
        console.log('nieprowadilowe dane')
      }
    }
  }
  calculateInput(
    optionValue,
    amplitudeValue = 1,
    frequencyValue = 10,
    customData = [],
  ) {
    let labels = []
    let data = []

    if (customData.length > 0) {
      labels = Array.from({ length: customData.length }, (_, i) => i.toString())
      data = customData
    } else {
      switch (optionValue) {
        case 'Sine function':
          data = Array.from(
            SignalGenerator.generateSineWave(
              frequencyValue,
              amplitudeValue,
              99,
              100,
            ).values(),
          ).map((value) => parseFloat(Number(value).toFixed(5)))
          labels = Array.from(
            SignalGenerator.generateSineWave(
              frequencyValue,
              amplitudeValue,
              99,
              100,
            ).keys(),
          ).map((key) => parseFloat(Number(key).toFixed(5)))
          break

        case 'Quadratic function':
          //this doesnt work properly
          data = Array.from(
            SignalGenerator.generateSquareWave(
              frequencyValue,
              amplitudeValue,
              99,
              100,
            ).values(),
          ).map((value) => parseFloat(Number(value).toFixed(5)))
          labels = Array.from(
            SignalGenerator.generateSquareWave(
              frequencyValue,
              amplitudeValue,
              99,
              100,
            ).keys(),
          ).map((key) => parseFloat(Number(key).toFixed(5)))
          break
        case 'Triangle function':
          data = Array.from(
            SignalGenerator.generateTriangleWave(
              frequencyValue,
              amplitudeValue,
              99,
              100,
            ).values(),
          ).map((value) => parseFloat(Number(value).toFixed(5)))
          labels = Array.from(
            SignalGenerator.generateTriangleWave(
              frequencyValue,
              amplitudeValue,
              99,
              100,
            ).keys(),
          ).map((key) => parseFloat(Number(key).toFixed(5)))
          break

        default:
          break
      }
    }
    return { labels, data }
  }
}

class ChartDrawer {
  static drawChart(labels, data, type) {
    //nie wiem czy one na siebie nie nachodza
    if (this.sampleChart) {
      this.sampleChart.destroy()
    }
    this.sampleChart = new Chart(
      document.getElementById('sampleChart').getContext('2d'),
      {
        //type: data.length > 0 ? 'bar' : 'line',
        type: type,
        data: {
          labels,
          datasets: [
            {
              label: 'Signal',
              data,
              fill: false,
              backgroundColor: 'rgba(255,99,132,0.5)',
              borderColor: 'rgb(255,99,132,1)',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'X',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Y',
              },
            },
          },
        },
      },
    )
  }
}

class SignalComposer{
  constructor(){
  this.signalsList=document.querySelector('.signalListElement');
  this.signalsList.innerHTML="kutas";
    for (const i=0; i<=this.signalsList.length; i++){
      const span=document.createElement("SPAN");
      const txt=document.createTextNode("\u00D7");
      span.className="close";
      span.appendChild(txt);
      signalsList[i].appendChild(span);
    }
    const close = document.querySelector(".close");
    for (const i=0; i<close.length; i++){
      close[i].onclick=function(){
        const div=this.parentElement;
        div.style.display="none";
      }
    }
    this.list=document.querySelector('.composerList');
    this.list.addEventListener('click',function(event){
      if(event.target.tagName==="LI"){
        event.target.classList.toggle('checked');
      }
    },false);

    this.newElement=function(){
      const li=document.createElement("li");
      const inputValue=document.querySelector('.composerInput').value;
      const t=document.createTextNode(inputValue);
      li.appendChild(t);
      if(inputValue===''){
        alert("You must write sth");

      }
      else{
        document.querySelector(".composerList").appendChild(li);
      }
      document.querySelector('.composerList').value="";
      const span=document.createElement("SPAN");
      const txt=document.createTextNode("\u00D7");
      span.className="close";
      span.appendChild(txt);
      li.appendChild(span);
      for(const i=0; i<close.length; i++){
        close[i].onclick=function(){
          const div=this.parentElement;
          div.style.display="none";
        }
      }
    }
}
}
function main() {
  const test=new SignalComposer();
  const view = new View()
}
main()
