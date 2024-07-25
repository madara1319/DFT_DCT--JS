//import {Controller} from './Controller.js';
//import {SignalComposer} from './SignalComposer.js';
import { ChartDrawer } from './ChartDrawer.js'
//import { SignalGenerator } from './SignalGenerator.js';

class View {
  constructor() {
    //tbc_____________________________

    this.sampleChart=null;
    //tbc_____________________________
    console.log('odpalam konstruktor view')
    //przyciski wyboru tryby wprowadzania danych
    this.baseFuncButton = document.querySelector('.showSelection')
    this.enterProbesButton = document.querySelector('.enterProbes')
    this.composerButton = document.querySelector('.showComposer')

    //tryby wprowadzania danych
    this.optionsDisplay = document.querySelector('.options')
    this.enterBox = document.querySelector('.entering')
    this.composerBox = document.querySelector('.composer')

    this.toggleButtons = [this.optionsDisplay, this.enterBox, this.composerBox]

    //wybor baseFunction
    this.selectedOption = document.querySelector('.selection')

    //podpiecie sliderow
    this.amplitudeSlider = document.querySelector('.amplitudeSlider')
    this.frequencySlider = document.querySelector('.frequencySlider')

    //przeniesienie z signalComposer
    this.list = document.querySelector('.composerList')

    this.textArea=document.querySelector('.textArea');

    this.composerSaveButton=document.querySelector('.composerSaveButton');
    this.composerLoadButton=document.querySelector('.composerLoadButton');

    this.enteringSaveButton=document.querySelector('.enteringSaveButton');
    this.enteringLoadButton=document.querySelector('.enteringLoadButton');
    //uruchomienie eventListenerow do Toggle FloatingDiv i CombineSignals
    //wywolanie w konstrutorze controllera
    // this.initialize()
  }
  //________________________________________________________________________________
  //koniec konstruktora
  //TOGGLE EVENTlISTENERY FLOATINGDIV COMBINEDSIGNALGUZIK
  initialize() {
    let clickCount = 0
    //toggle do do przyciskow wprowadzania
    this.baseFuncButton.addEventListener('click', (event) => {
      clickCount++
      console.log('baseFuncButton klikniety', clickCount)
      this.toggleElement(event, this.optionsDisplay)
    })
    this.enterProbesButton.addEventListener('click', (event) => {
      clickCount++
      console.log('enterProbesButton klikniety', clickCount)
      this.toggleElement(event, this.enterBox)
    })
    this.composerButton.addEventListener('click', (event) => {
      clickCount++
      console.log('composerButton klikniety', clickCount)
      this.toggleElement(event, this.composerBox)
    })

    //podpiecie naslichiwania rusowanie po zmianie
    this.selectedOption.addEventListener(
      'click',
      this.handleOptionChange.bind(this),
    )

    //nasluchiwanie sliderow i rysowanie z nich baseFunction
    this.frequencySlider.addEventListener(
      'change',
      this.handleSlider.bind(this),
    )
    this.amplitudeSlider.addEventListener(
      'change',
      this.handleSlider.bind(this),
    )
    //dodanie do rysowania z trybu wprowadzania tablicy
    this.enterBox
      .querySelector('.textArea')
      .addEventListener('keydown', this.handleTextArea.bind(this))

    //wywal initial elementy z composera
    this.removeInitialElement()
    //do composera przcysiki
    document
      .querySelector('.composerAddButton')
      .addEventListener('click', () => {
        this.showFloatingDiv()
      })

    document
      .querySelector('.generateCombinedSignalButton')
      .addEventListener('click', () => {
        this.controller.generateCombinedSignal()
      })

    this.enteringSaveButton.addEventListener('click',()=>{

      this.controller.saveSamples();
    })
    this.enteringLoadButton.addEventListener('click',()=>{
      this.controller.loadSamples();
    })

    this.composerSaveButton.addEventListener('click',()=>{
      this.controller.saveSignals();
    })
    this.composerLoadButton.addEventListener('click',()=>{
      this.controller.loadSignals();
    })
    //jak strona sie zaladuje odpal funkcje setupCharts
    document.addEventListener('DOMContentLoaded', this.setupCharts.bind(this))
    console.log('wewnetrzna initializacja')
  }
  //________________________________________________________________________________

  setController(controller) {
    this.controller = controller
  }

  //funkcja wyswietlanie ukrywanie opcji wprowadzania danych
  toggleElement(event, chosenButton) {
    event.preventDefault()
    console.log(' toggle start')
    console.log('Chosen button:', chosenButton)
    console.log('Initial state:', chosenButton.className)
    const openButton = chosenButton.classList.contains('open')
    console.log('Is open?', openButton)

    this.toggleButtons.forEach((element) => {
      element.classList.add('hidden')
      element.classList.remove('open')
      console.log('Toggled off: ', element.className)
    })
    if (!openButton) {
      chosenButton.classList.remove('hidden')
      chosenButton.classList.add('open')
      console.log('powinien byc open')
      console.log('toggled on: ', chosenButton.className)
    }
    console.log(' toggle end')
    console.log('Final state:', chosenButton.className)

    this.toggleButtons.forEach((element, index) => {
      console.log(`Button ${index} final state: ${element.className}`)
    })
  }

  //funkcja oblusgujaca rysowanie ze sliderow
  handleSlider(event) {
    let amplitudeValue
    let frequencyValue

    if (event.target.id === 'amplitudeSlider') {
      amplitudeValue = event.target.value
      frequencyValue = this.frequencySlider.value
    } else if (event.target.id === 'frequencySlider') {
      amplitudeValue = this.amplitudeSlider.value
      frequencyValue = event.target.value
    }
    const selectedOption = this.selectedOption.value

    const amplitudeArray = [parseFloat(amplitudeValue)]
    const frequencyArray = [parseFloat(frequencyValue)]
    //oblicz dane ze sladjerow i narsysuj nowego charta
    this.controller.updateChart(selectedOption, amplitudeArray, frequencyArray)
    //dodac funkcje pokazujaca guzik do transformacji
    console.log('czy handleSlider dziala?')
  }
  //________________________________________________________________________________
  //funckja obslugujaca rysowanie defaultowych wykresow po zmianie base function
  handleOptionChange(event) {
    console.log(' handleOptionChange start')
    const selectedValue = event.target.value
    console.log('Selected value:', selectedValue)

    const amplitudeValue = parseFloat(this.amplitudeSlider.value)
    const frequencyValue = parseFloat(this.frequencySlider.value)

    //oblicz dane ze sladjerow i narsysuj nowego charta
    this.controller.updateChart(
      selectedValue,
      [amplitudeValue],
      [frequencyValue],
    )
    console.log(' handleOptionChange end')
    //dodac funkcje pokazujaca guzik do transformacji
  }

  //________________________________________________________________________________
  //daj wykres jak sie strona zaladuje

  //wymiary do przemyslania pod katem designu
  setupCharts() {
    console.log('czy setupCharts dziala? 1')
    this.sampleChart = new Chart(
      document.getElementById('sampleChart').getContext('2d'),
    )
    this.sampleChart.canvas.width = 400
    this.sampleChart.canvas.height = 400

    console.log(' setupCharts dziala')
  }

  //________________________________________________________________________________
  //funkcja oblusgujaca rysowanie wykresu z probek
  handleTextArea(event) {
    if (event.key === 'Enter') {
      const data = event.target.value.trim()

      const dataArray = data.split(',').map((value) => parseFloat(value.trim()))
      const areNumbers = dataArray.every((value) => !isNaN(value))
      if (areNumbers) {
        //dane probki  i narsysuj nowego charta
        this.controller.updateChart('Custom', [], [], dataArray)
      } else {
        console.log('nieprowadilowe dane')
      }
    }
  }
  //________________________________________________________________________________
    showTransformationButtons(){
      let parentDiv=document.querySelector('.boxofboxes--js')
      let transformChartContainer=document.querySelector('#transformChartContainer');
      let transformationButtonsDiv=document.querySelector('.transformationButtonsDiv')
      if (!transformationButtonsDiv){
        transformationButtonsDiv=document.createElement('div')
        transformationButtonsDiv.className='transformationButtonsDiv'
        transformationButtonsDiv.innerHTML=`
        <div class="transformationButtonsBox">
        <button class="selectButtons">Do DFT</button>
        <button class="selectButtons">Do DCT</button>
        </div>
        `
        parentDiv.insertBefore(transformationButtonsDiv,transformChartContainer);
      }

    //  this.addDFTButtonListener(()=>this.controller.handleDFT());
    //  this.addDCTButtonListener(()=>this.controller.handleDCT());

    const dftButton = transformationButtonsDiv.querySelector('button:nth-child(1)');
    const dctButton = transformationButtonsDiv.querySelector('button:nth-child(2)');

    dftButton.addEventListener('click', () => {
        console.log('Sample chart when DFT button is clicked:', this.sampleChart);
        this.controller.handleDFT();
    });
    dctButton.addEventListener('click', () => {
        console.log('Sample chart when DCT button is clicked:', this.sampleChart);
        this.controller.handleDCT();
    });
    }

  //________________________________________________________________________________
  addDFTButtonListener(handler){
    const dftButton=document.querySelector('.transformationButtonsDiv .selectButtons:nth-child(1)');
    dftButton.addEventListener('click',handler);
  }

  //________________________________________________________________________________
  addDCTButtonListener(handler){
    const dctButton=document.querySelector('.transformationButtonsDiv .selectButtons:nth-child(2)');
    dctButton.addEventListener('click',handler);
  }
  //________________________________________________________________________________
//to be done
    showModificationButtons(){
      let parentDiv=document.querySelector('.boxofboxes--js')
      let reverseChartContainer=document.querySelector('#reverseChartContainer');
      let modificationsButtonsDiv=document.querySelector('.modificationsButtonsDiv')
      if (!modificationsButtonsDiv){
        modificationsButtonsDiv=document.createElement('div')
        modificationsButtonsDiv.className='modificationsButtonsDiv'
        modificationsButtonsDiv.innerHTML=`
        <div class="modificationsButtonsBox">
        <button class="selectButtons">Time Shift</button>
        <button class="selectButtons">Amplitude Scale</button>
        <button class="selectButtons">Rotate</button>
        <button class="reverseTransform">Reverse Transform</button>
        </div>
        `
        parentDiv.appendChild(modificationsButtonsDiv,reverseChartContainer);
}
    const timeShiftButton = modificationsButtonsDiv.querySelector('button:nth-child(1)');
    const amplitudeScaleButton = modificationsButtonsDiv.querySelector('button:nth-child(2)');
    const rotateButton = modificationsButtonsDiv.querySelector('button:nth-child(2)');
    const reverseTransform = modificationsButtonsDiv.querySelector('button:nth-child(2)');

    timeShiftButton.addEventListener('click', () => {
        console.log('timeShiftButton button is clicked:', this.reverseTransformChart);
        this.controller.handleTimeShift();
    });

    amplitudeScaleButton.addEventListener('click', () => {
        console.log('timeShiftButton button is clicked:', this.reverseTransformChart);
        this.controller.handleAmplitudeScaling();
    });
    rotateButton.addEventListener('click', () => {
        console.log('rotateButton button is clicked:', this.reverseTransformChart);
        this.controller.handleRotation();
    });
    reverseTransform.addEventListener('click', () => {
        console.log('reverseTransform button is clicked:', this.reverseTransformChart);
        this.controller.handleReverseTransform();
    });
    
    }
  //________________________________________________________________________________
  //to be done
    showInverseTransformationButtons(){}

  //________________________________________________________________________________
  showFloatingDiv() {
    let floatingDiv = document.querySelector('.showDiv')
    if (!floatingDiv) {
      floatingDiv = document.createElement('div')
      floatingDiv.className = 'showDiv'
      floatingDiv.innerHTML = `<div class="composerFloatingDiv">
        <div class="composerInputInsideDiv">
          <select class="composerSelect">
            <option value="Sine function">Sine function</option>
            <option value="Square function">Square function</option>
            <option value="Triangle function">Triangle function</option>
          </select>
          <input type="text" id="amplitudeComposerInput" class="amplitudeComposerInput" placeholder="Enter amplitude...">
          <input type="text" id="frequencyComposerInput" class="frequencyComposerInput" placeholder="Enter frequency...">
        </div>
        <span class="composerAddToList">Enter</span>
        <button class="closeFloatingDiv">\u00D7</button>
      </div>`
      document.body.appendChild(floatingDiv)
      floatingDiv.style.display = 'block'
      floatingDiv.style.top = '50%'
      floatingDiv.style.left = '50%'

      let offsetX, offsetY
      floatingDiv.addEventListener('mousedown', (event) => {
        offsetX = event.clientX - floatingDiv.getBoundingClientRect().left
        offsetY = event.clientY - floatingDiv.getBoundingClientRect().top

        function moveFloatingDiv(event) {
          floatingDiv.style.left = `${event.clientX - offsetX}px`
          floatingDiv.style.top = `${event.clientY - offsetY}px`
        }

        document.addEventListener('mousemove', moveFloatingDiv)
        document.addEventListener(
          'mouseup',
          () => {
            document.removeEventListener('mousemove', moveFloatingDiv)
          },
          { once: true },
        )
      })

      document
        .querySelector('.composerAddToList')
        .addEventListener('click', () =>
          this.controller.addElementToListHandler(),
        )

      document
        .querySelector('.amplitudeComposerInput')
        .addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            this.controller.addElementToListHandler()
          }
        })
      document
        .querySelector('.frequencyComposerInput')
        .addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            this.controller.addElementToListHandler()
          }
        })
      document
        .querySelector('.closeFloatingDiv')
        .addEventListener('click', () => {
          floatingDiv.remove()
        })

      // this.controller.addCloseEventListeners()
    }
  }
  //________________________________________________________________________________
  //nowa metoda przerobka z addElementToList()
  //tu cos nie tak
  //dodaj punkt listy HTML
  addElementToListView(element) {
    const li = document.createElement('li')
    li.className = 'signalElement'
    //tu jest cos nie tak z przypiswaniem do ogarniecia
    li.textContent = `${element.selectedOption} - Amplitude: ${element.amplitude}, Frequency: ${element.frequency}`
    this.list.appendChild(li)
    console.log('addElementToListView i textConent ' + li.textContent)

    this.controller.addCloseButton(li)
    this.controller.addCloseEventListeners(li)
  }

  getSignalListElements() {
    return document.getElementsByClassName('signalElement')
  }

  getCloseButtons() {
    return document.getElementsByClassName('close')
  }

  drawChart(chartId,labels, data, type) {
    ChartDrawer.drawChart(chartId,labels, data, type)
  }


  //________________________________________________________________________________
  clearSignalList(){
    while(this.list.firstChild){
      this.list.removeChild(this.list.firstChild)
    }
  }


  //________________________________________________________________________________
  removeInitialElement() {
    const initialElements = document.querySelectorAll('.signalListElement')
    initialElements.forEach((element) => {
      element.remove()
    })
  }
}

export { View }
