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
      const phase = Number((i % period).toFixed(3))
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
//dodanie handlera tutaj od razu rysuje sinusa 
    //this.handleOptionChange({ target: this.selectedOption })
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
    amplitudeArray = [1],
    frequencyArray = [10],
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
          //array with zeros
          data=new Array(100).fill(0);
          labels=Array.from({length:100},(_,i)=>(i/99).toFixed(5));
          amplitudeArray.forEach((amplitude,index)=>{
            const frequency=frequencyArray[index];
            const wave=Array.from(SignalGenerator.generateSineWave(frequency,amplitude,99,100)).values().map(value=>parseFloat(Number(value).toFixed(5)));

            //sum data
          data=data.map((value,i)=>value+wave[i]);
          });
        break;
//dodac pozostale funckje

        default:
          break
      }
    }
    return { labels, data }
  }



//  calculateInput(
//    optionValue,
//    amplitudeValue = 1,
//    frequencyValue = 10,
//    customData = [],
//  ) {
//    let labels = []
//    let data = []
//
//    if (customData.length > 0) {
//      labels = Array.from({ length: customData.length }, (_, i) => i.toString())
//      data = customData
//    } else {
//      switch (optionValue) {
//        case 'Sine function':
//          data = Array.from(
//            SignalGenerator.generateSineWave(
//              frequencyValue,
//              amplitudeValue,
//              99,
//              100,
//            ).values(),
//          ).map((value) => parseFloat(Number(value).toFixed(5)))
//          labels = Array.from(
//            SignalGenerator.generateSineWave(
//              frequencyValue,
//              amplitudeValue,
//              99,
//              100,
//            ).keys(),
//          ).map((key) => parseFloat(Number(key).toFixed(5)))
//          break
//
//        case 'Quadratic function':
//          //this doesnt work properly
//          data = Array.from(
//            SignalGenerator.generateSquareWave(
//              frequencyValue,
//              amplitudeValue,
//              99,
//              100,
//            ).values(),
//          ).map((value) => parseFloat(Number(value).toFixed(5)))
//          labels = Array.from(
//            SignalGenerator.generateSquareWave(
//              frequencyValue,
//              amplitudeValue,
//              99,
//              100,
//            ).keys(),
//          ).map((key) => parseFloat(Number(key).toFixed(5)))
//          break
//        case 'Triangle function':
//          data = Array.from(
//            SignalGenerator.generateTriangleWave(
//              frequencyValue,
//              amplitudeValue,
//              99,
//              100,
//            ).values(),
//          ).map((value) => parseFloat(Number(value).toFixed(5)))
//          labels = Array.from(
//            SignalGenerator.generateTriangleWave(
//              frequencyValue,
//              amplitudeValue,
//              99,
//              100,
//            ).keys(),
//          ).map((key) => parseFloat(Number(key).toFixed(5)))
//          break
//
//        default:
//          break
//      }
//    }
//    return { labels, data }
//  }

  
}

class ChartDrawer {
  static drawChart(labels, data, type) {
    //nie wiem czy one na siebie nie nachodza
    if (this.sampleChart) {
      this.sampleChart.destroy()
    }

    let existingChartCloseButton=document.querySelector('.chartCloseButton');
    if(existingChartCloseButton){
      existingChartCloseButton.remove();
    }

   let chartCloseButton=document.createElement('button');
    chartCloseButton.className='chartCloseButton';
    chartCloseButton.textContent="\u00D7";
    chartCloseButton.onclick=()=>{

    if (this.sampleChart) {
      this.sampleChart.destroy()
      this.sampleChart.null;
    }
      chartCloseButton.remove();
    }
    //document.body.appendChild(chartCloseButton);
    document.querySelector('.boxofboxes--js').appendChild(chartCloseButton);
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

class SignalComposer {
  constructor() {
    this.signalsList = document.querySelector('.signalListElement')
    this.removeInitialElement()
    this.addCloseButtons()
    this.addCloseEventListeners()

    this.list = document.querySelector('.composerList')

    document.querySelector('.composerAddButton').addEventListener('click',()=>{
      //this.newElement();
      this.showFloatingDiv();
    });

    document.querySelector('.generateCombinedSignalButton').addEventListener('click',()=>{
      this.generateCombinedSignal();
    })
  }

  removeInitialElement() {
    const initialElements = document.querySelectorAll(
      '.signalListElement',
    )
    initialElements.forEach((element) => {
      element.remove()
    })
  }

  generateCombinedSignal(){
    const amplitudeInputs=Array.from(this.list.querySelectorAll('.signalListElement')).map(li=>parseFloat(li.textContent.match(/Amplitude: (\d+\.?\d*)/)[1]));
    const frequencyInputs=Array.from(this.list.querySelectorAll('.signalListElement')).map(li=>parseFloat(li.textContent.match(/Frequency: (\d+\.?\d*)/)[1]));
    const view=new View();
    const {labels,data}=view.calculateInput('Sine function',amplitudeInput,frequencyInput);
    ChartDrawer.drawChart(labels,data,'line');
  }

  addCloseButtons() {
    const items = this.signalsList.getElementsByTagName('LI')
    for (let i = 0; i < items.length; i++) {
      const span = document.createElement('SPAN')
      const txt = document.createTextNode('\u00D7')
      span.appendChild(txt)
      items[i].appendChild(span)
    }
  }

  addCloseEventListeners() {
    const closeButtons = this.signalsList.getElementsByClassName('close')
    for (let i = 0; i < closeButtons.length; i++) {
      closeButtons[i].onclick = function () {
        const div = this.parentElement
        div.style.display = 'none'
      }
    }
  }


  showFloatingDiv(){
    let floatingDiv = document.querySelector('.showDiv')
    if (!floatingDiv) {
      floatingDiv = document.createElement('div')
      floatingDiv.className = 'showDiv'
      floatingDiv.innerHTML=`<div class="composerFloatingDiv">
      <div class="composerInputInsideDiv">
      <select class="composerSelect">
      <option class="sine">Sine function</option>
      <option class="quad">Quadratic function</option>
      <option class="triangle">Triangle function</option>
      </select>

      <input type="text" id=amplitudeComposerInput" class="amplitudeComposerInput" placeholder="Enter amplitude...">
      <input type="text" id="frequencyComposerInput" class="frequencyComposerInput" placeholder="Enter frequency...">
      </div>
      <span class="composerAddToList">Enter </span>
      <button class="closeFloatingDiv">\u00D7</button>
      </div>
      `
      document.body.appendChild(floatingDiv)
      floatingDiv.style.display = 'block'
      floatingDiv.style.top = '50%'
      floatingDiv.style.left = '50%'

      let offsetX, offsetY
      floatingDiv.addEventListener('mousedown', (event) => {
        offsetX = event.clientX - floatingDiv.getBoundingClientRect().left
        offsetY = event.clientY - floatingDiv.getBoundingClientRect().top
        document.addEventListener('mousemove', mouseMoveHandler)
        document.addEventListener('mouseup', mouseUpHandler)
      })
      function mouseMoveHandler(event) {
        floatingDiv.style.left = `${event.clientX - offsetX}px`
        floatingDiv.style.top = `${event.clientY - offsetY}px`
      }
      function mouseUpHandler(event) {
        document.removeEventListener('mousemove', mouseMoveHandler)
        document.removeEventListener('mouseup', mouseUpHandler)
      }
      const input=floatingDiv.querySelector('.amplitudeComposerInput')
      input.addEventListener('keydown',(event)=>{
        if(event.key==='Enter'){
          this.addElementToList(input.value)
          input.value='';
        }
      })

    const closeFloatingDiv=floatingDiv.querySelector('.closeFloatingDiv')
    closeFloatingDiv.addEventListener('click',()=>{
      floatingDiv.remove(); 
    })
      const addButton=floatingDiv.querySelector('.composerAddToList')
      addButton.addEventListener('click',()=>{
        const amplitudeInput=floatingDiv.querySelector('.amplitudeComposerInput').value;
        const frequencyInput=floatingDiv.querySelector('.frequencyComposerInput').value;
        this.addElementToList(amplitudeComposerInput,frequencyArray);
        this.addElementToList(input.value)

        floatingDiv.remove();
        //input.value=''
      })

    } else {
      floatingDiv.style.display =
        floatingDiv.style.display === 'none' ? 'block' : 'none'
    }
  }
  //this.list zaimplementowac jako liste z 2 elementami badz mape
  //tak zeby bylo amplitude i czestotliwosc i zebrac z 2 inputow
  //napisac combinedSignal metode do wyliczania lacznego sygnalu
  //przemyslec klasy
  addElementToList(element){
    if(element.trim()!==''){
      const li=document.createElement('li');
      li.className='signalListElement';
      li.textContent=element;
      const span=document.createElement('SPAN');
      //unicode X sign
      const txt=document.createTextNode('\u00D7');
      span.className='close';
      span.appendChild(txt);
      li.appendChild(span);
      this.list.appendChild(li)
      span.onclick=function(){
        const div = this.parentElement;
        //div.style.display='none';
        div.remove();
      }
    }
  }
  }






function main() {
  const test = new SignalComposer()
  const view = new View()
}
main()
