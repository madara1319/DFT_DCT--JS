//import {Controller} from './Controller.js';
//import {SignalComposer} from './SignalComposer.js';
import { ChartDrawer } from './ChartDrawer.js'
//import { SignalGenerator } from './SignalGenerator.js';

class View {
  constructor() {
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
    this.removeInitialElement();
    //do composera przcysiki
    document
      .querySelector('.composerAddButton')
      .addEventListener('click', () => {
        this.showFloatingDiv()
      })

    document
      .querySelector('.generateCombinedSignalButton')
      .addEventListener('click', () => {
        this.generateCombinedSignal()
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
      console.log("Toggled off: ",element.className);
    })
    if (!openButton) {
      chosenButton.classList.remove('hidden')
      chosenButton.classList.add('open')
      console.log('powinien byc open')
      console.log("toggled on: ",chosenButton.className);
    }
    console.log(' toggle end')
    console.log('Final state:', chosenButton.className)


  this.toggleButtons.forEach((element, index) => {
    console.log(`Button ${index} final state: ${element.className}`);
  });
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
        .addEventListener('click', () => {
          const selectedOption = document.querySelector('.composerSelect').value
          const amplitude = document.querySelector(
            '#amplitudeComposerInput',
          ).value
          const frequency = document.querySelector(
            '#frequencyComposerInput',
          ).value
          this.controller.addElementToList(selectedOption, amplitude, frequency)
        })

      document
        .querySelector('.closeFloatingDiv')
        .addEventListener('click', () => {
          floatingDiv.remove()
        })
    }
  }

  //________________________________________________________________________________
  //nowa metoda przerobka z addElementToList()
  addElementToListView(element) {
    const li = document.createElement('li')
    li.className = 'signalElement'
    //tu jest cos nie tak z przypiswaniem do ogarniecia  
    li.textContent = `${this.selectedOption} - Amplitude: ${this.amplitude}, Frequency: ${this.frequency}`
    this.list.appendChild(li)

  // this.controller.addCloseButtons()
  //  this.controller.addCloseEventListeners()
  }

  getSignalListElements() {
    return document.getElementsByClassName('signalElement')
  }

  getCloseButtons() {
    return document.getElementsByClassName('close')
  }

  drawChart(labels, data, type) {
    ChartDrawer.drawChart(labels, data, type)
  }

  //________________________________________________________________________________
  removeInitialElement() {
    const initialElements = document.querySelectorAll('.signalListElement');
    initialElements.forEach((element) => {
      element.remove();
    });
  }

}

export { View }
