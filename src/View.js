import { ChartDrawer } from './ChartDrawer.js'

class View {
  constructor() {
    this.sampleChart = null
    this.amplitudeChart = null
    this.phaseChart = null
    //buttons for different entering signal modules
    this.baseFuncButton = document.querySelector('.showSelection')
    this.enterProbesButton = document.querySelector('.enterProbes')
    this.composerButton = document.querySelector('.showComposer')
    this.clearStorageButton = document.querySelector('.clearLocalStorage')
    this.signalSampleButton = document.querySelector('.signalSampleRate')

    //entering signal modules
    this.optionsDisplay = document.querySelector('.options')
    this.enterBox = document.querySelector('.entering')
    this.composerBox = document.querySelector('.composer')

    this.signalSampleBox = document.querySelector('.signalSampleBox')

    this.toggleButtons = [
      this.optionsDisplay,
      this.enterBox,
      this.composerBox,
      this.signalSampleBox,
    ]

    //first module basefunction selection
    this.selectedOption = document.querySelector('.selection')

    this.signalSampleInput = document.querySelector('.signalSampleInput')

    //sliders for first module
    this.amplitudeSlider = document.querySelector('.amplitudeSlider')
    this.frequencySlider = document.querySelector('.frequencySlider')

    //composerList for next signal entering module
    this.list = document.querySelector('.composerList')

    //used for entering array of probes as entering signal
    this.textArea = document.querySelector('.textArea')

    this.composerSaveButton = document.querySelector('.composerSaveButton')
    this.composerLoadButton = document.querySelector('.composerLoadButton')

    this.enteringSaveButton = document.querySelector('.enteringSaveButton')
    this.enteringLoadButton = document.querySelector('.enteringLoadButton')
  }
  //________________________________________________________________________________
  //Activate buttons like toggle eventlisteners floatingDiv and combineSignal
  initialize() {
    //display toggle on entrance buttons
    this.baseFuncButton.addEventListener('click', (event) => {
      this.toggleElement(event, this.optionsDisplay)
    })
    this.enterProbesButton.addEventListener('click', (event) => {
      this.toggleElement(event, this.enterBox)
    })
    this.composerButton.addEventListener('click', (event) => {
      this.toggleElement(event, this.composerBox)
    })

    this.signalSampleButton.addEventListener('click', (event) => {
      this.toggleElement(event, this.signalSampleBox)
    })
    this.selectedOption.addEventListener(
      'click',
      this.handleOptionChange.bind(this),
    )

    this.frequencySlider.addEventListener(
      'change',
      this.handleSlider.bind(this),
    )
    this.amplitudeSlider.addEventListener(
      'change',
      this.handleSlider.bind(this),
    )
    //probes array entering function module
    this.enterBox
      .querySelector('.textArea')
      .addEventListener('keydown', this.handleTextArea.bind(this))

    document
      .querySelector('.signalSampleInput')
      .addEventListener('keydown', this.handleSampleRate.bind(this))

    //remove Initial elements from composer
    this.removeInitialElement()
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

    this.enteringSaveButton.addEventListener('click', () => {
      this.controller.saveSamples()
    })
    this.enteringLoadButton.addEventListener('click', () => {
      this.controller.loadSamples()
    })

    this.composerSaveButton.addEventListener('click', () => {
      this.controller.saveSignals()
    })
    this.composerLoadButton.addEventListener('click', () => {
      this.controller.loadSignals()
    })

    this.clearStorageButton.addEventListener('click', () => {
      this.controller.clearStorage()
    })
    //launch setupCharts after loading all DOM
    document.addEventListener('DOMContentLoaded', this.setupCharts.bind(this))
  }
  //________________________________________________________________________________

  setController(controller) {
    this.controller = controller
  }

  //displayig toggle method
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

    this.toggleButtons.forEach((element, index) => {})
  }

  //calculate and draw baseFunctions using values from sliders
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
    this.controller.updateChart(selectedOption, amplitudeArray, frequencyArray)
  }
  //________________________________________________________________________________
  //listen for changes in baseFunctions, calculate and draw updated Chart
  handleOptionChange(event) {
    const selectedValue = event.target.value

    const amplitudeValue = parseFloat(this.amplitudeSlider.value)
    const frequencyValue = parseFloat(this.frequencySlider.value)

    this.controller.updateChart(
      selectedValue,
      [amplitudeValue],
      [frequencyValue],
    )
  }

  //________________________________________________________________________________

  setupCharts() {
    this.sampleChart = new Chart(
      document.getElementById('sampleChart').getContext('2d'),
    )
    this.sampleChart.canvas.width = 400
    this.sampleChart.canvas.height = 400
  }

  //________________________________________________________________________________
  //probes array entering function module/
  handleTextArea(event) {
    if (event.key === 'Enter') {
      const data = event.target.value.trim()

      const dataArray = data.split(',').map((value) => parseFloat(value.trim()))
      const areNumbers = dataArray.every((value) => !isNaN(value))
      if (areNumbers) {
        this.controller.updateChart('Custom', [], [], dataArray)
      } else {
        window.alert('INCORRECT TYPE OF INPUT PLEASE CORRECT')
      }
    }
  }

  //________________________________________________________________________________
  //update entering Signal SampleRate
  handleSampleRate(event) {
    if (event.key === 'Enter') {
      const data = event.target.value.trim()
      console.log('uruchamiam handleSampleRate')
      this.controller.sampleRateHandler(data)
    }
  }

  //________________________________________________________________________________
  showTransformationButtons() {
    let parentDiv = document.querySelector('.boxofboxes--js')
    let amplitudeChartContainer = document.querySelector(
      '#amplitudeChartContainer',
    )
    let transformationButtonsDiv = document.querySelector(
      '.transformationButtonsDiv',
    )
    if (!transformationButtonsDiv) {
      transformationButtonsDiv = document.createElement('div')
      transformationButtonsDiv.className = 'transformationButtonsDiv'
      transformationButtonsDiv.innerHTML = `
        <div class="transformationButtonsBox">
        <button class="selectButtons">Do DFT</button>
        <button class="selectButtons">Do DCT</button>
        </div>
        `
      parentDiv.insertBefore(transformationButtonsDiv, amplitudeChartContainer)
    }

    const dftButton = transformationButtonsDiv.querySelector(
      'button:nth-child(1)',
    )
    const dctButton = transformationButtonsDiv.querySelector(
      'button:nth-child(2)',
    )

    dftButton.addEventListener('click', () => {
      this.controller.setTransformationType('DFT')
      this.controller.handleDFT()
    })
    dctButton.addEventListener('click', () => {
      this.controller.setTransformationType('DCT')
      this.controller.handleDCT()
    })
  }

  //________________________________________________________________________________
  addDFTButtonListener(handler) {
    const dftButton = document.querySelector(
      '.transformationButtonsDiv .selectButtons:nth-child(1)',
    )
    dftButton.addEventListener('click', handler)
  }

  //________________________________________________________________________________
  addDCTButtonListener(handler) {
    const dctButton = document.querySelector(
      '.transformationButtonsDiv .selectButtons:nth-child(2)',
    )
    dctButton.addEventListener('click', handler)
  }
  //________________________________________________________________________________
  showModificationButtons() {
    let parentDiv = document.querySelector('.boxofboxes--js')

    let amplitudeChartContainer = document.querySelector(
      '#amplitudeChartContainer',
    )
    let reverseChartContainer = document.querySelector('#reverseChartContainer')
    let modificationsButtonsDiv = document.querySelector(
      '.modificationsButtonsDiv',
    )
    if (!modificationsButtonsDiv) {
      modificationsButtonsDiv = document.createElement('div')
      modificationsButtonsDiv.className = 'modificationsButtonsDiv'
      modificationsButtonsDiv.innerHTML = `
        <div class="modificationsButtonsBox">
        <button class="selectButtons">Time Shift</button>
        <button class="selectButtons">Amplitude Scale</button>
        <button class="selectButtons clearModifications">Clear Modifications</button>
        </div>
        `

      parentDiv.insertBefore(modificationsButtonsDiv, amplitudeChartContainer)
    }
    const timeShiftButton = modificationsButtonsDiv.querySelector(
      'button:nth-child(1)',
    )
    const amplitudeScaleButton = modificationsButtonsDiv.querySelector(
      'button:nth-child(2)',
    )
    const clearModButton = modificationsButtonsDiv.querySelector(
      'button:nth-child(3)',
    )
    //________________________________________________________________________________
    //working on
    timeShiftButton.addEventListener('click', () => {
      const shiftValue = parseFloat(prompt('Enter time shift value'))
      this.controller.timeShiftViewHandler(shiftValue)
    })

    amplitudeScaleButton.addEventListener('click', () => {
      const scaleFactor = parseFloat(prompt('Enter amplitude scale factor'))
      this.controller.amplitudeScaleViewHandler(scaleFactor)
    })

    //________________________________________________________________________________
    //    timeShiftButton.addEventListener('click', () => {
    //      this.handleTimeShiftInput()
    //    })
    //
    //    amplitudeScaleButton.addEventListener('click', () => {
    //      this.handleAmplitudeScaleInput()
    //    })
    clearModButton.addEventListener('click', () => {
      this.controller.clearModSignal()
    })
  }
  //________________________________________________________________________________
  killModificationButtons() {
    let modificationsButtonsDiv = document.querySelector(
      '.modificationsButtonsDiv',
    )
    if (modificationsButtonsDiv) {
      modificationsButtonsDiv.remove()
    }
  }

  //________________________________________________________________________________
//  handleTimeShiftInput() {
//    let modificationsButtonsDiv = document.querySelector(
//      '.modificationsButtonsDiv',
//    )
//
//    let timeShiftInput = document.querySelector('.timeShiftInput')
//
//    if (!timeShiftInput) {
//      timeShiftInput = document.createElement('input')
//      timeShiftInput.type = 'number'
//      timeShiftInput.placeholder = 'Enter time shift value'
//      timeShiftInput.className = 'timeShiftInput'
//
//      modificationsButtonsDiv.appendChild(timeShiftInput)
//      timeShiftInput.focus()
//
//      timeShiftInput.addEventListener('keydown', (event) => {
//        if (event.key === 'Enter') {
//          const shiftValue = parseFloat(timeShiftInput.value)
//          if (!isNaN(shiftValue)) {
//            this.controller.handleTimeShift(shiftValue)
//            timeShiftInput.remove()
//          }
//        }
//      })
//    }
//  }
  //________________________________________________________________________________
//  handleAmplitudeScaleInput() {
//    let modificationsButtonsDiv = document.querySelector(
//      '.modificationsButtonsDiv',
//    )
//
//    let amplitudeScaleInput = document.querySelector('.amplitudeScaleInput')
//
//    if (!amplitudeScaleInput) {
//      amplitudeScaleInput = document.createElement('input')
//      amplitudeScaleInput.type = 'number'
//      amplitudeScaleInput.placeholder = 'Enter amplitude scale value'
//      amplitudeScaleInput.className = 'amplitudeScaleInput'
//
//      modificationsButtonsDiv.appendChild(amplitudeScaleInput)
//      amplitudeScaleInput.focus()
//
//      amplitudeScaleInput.addEventListener('keydown', (event) => {
//        if (event.key === 'Enter') {
//          const scaleValue = parseFloat(amplitudeScaleInput.value)
//          if (!isNaN(scaleValue)) {
//            this.controller.handleAmplitudeScaling(scaleValue)
//            amplitudeScaleInput.remove()
//          }
//        }
//      })
//    }
//  }
//  //________________________________________________________________________________

  killReverseTransformationButton() {
    let reverseTransformButtonDiv = document.querySelector(
      '.reverseTransformButtonDiv',
    )
    if (reverseTransformButtonDiv) {
      reverseTransformButtonDiv.remove()
    }
  }
  //________________________________________________________________________________
  drawShiftedDFTChart(labels, originalData, shiftedData) {
    ChartDrawer.drawMultipleDataChart(
      'amplitudeChart',
      labels,
      [
        {
          label: 'Original Amplitude (scatter)',
          data: originalData.amplitude,
          borderColor: 'rgb(255,99,132)',
          backgroundColor: 'rgba(255,99,132,0.5)',
          type: 'scatter',
        },
        {
          label: 'Shifted Amplitude (scatter)',
          data: shiftedData.amplitude,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          type: 'scatter',
        },
        {
          label: 'Original Amplitude (bar)',
          data: originalData.amplitude.map((point) => point.y),
          borderColor: 'rgb(255,99,132)',
          backgroundColor: 'rgba(255,99,132,0.5)',
          type: 'bar',
        },
        {
          label: 'Shifted Amplitude (bar)',
          data: shiftedData.amplitude.map((point) => point.y),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          type: 'bar',
        },
      ],

      'scatter',
      'Amplitude Spectrum',
      '|X(f)|',
    )

    ChartDrawer.drawMultipleDataChart(
      'phaseChart',
      labels,
      [
        {
          label: 'Original Phase (scatter)',
          data: originalData.phase,
          borderColor: 'rgb(255,99,132)',
          backgroundColor: 'rgba(255,99,132,0.5)',
          type: 'scatter',
        },
        {
          label: 'Shifted Phase (scatter)',
          data: shiftedData.phase,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          type: 'scatter',
        },
        {
          label: 'Original Phase (bar)',
          data: originalData.phase.map((point) => point.y),
          borderColor: 'rgb(255,99,132)',
          backgroundColor: 'rgba(255,99,132,0.5)',
          type: 'bar',
        },
        {
          label: 'Shifted Phase (bar)',
          data: shiftedData.phase.map((point) => point.y),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          type: 'bar',
        },
      ],

      'scatter',
      'Phase Spectrum',
      '\u03C6[°]',
    )
  }

  //________________________________________________________________________________
  drawShiftedDCTChart(labels, originalData, shiftedData) {
    ChartDrawer.drawMultipleDataChart(
      'amplitudeChart',
      labels,
      [
        {
          label: 'Original Amplitude (scatter)',
          data: originalData.amplitude,
          borderColor: 'rgb(255,99,132)',
          backgroundColor: 'rgba(255,99,132,0.5)',
          type: 'scatter',
        },
        {
          label: 'Shifted Amplitude (scatter)',
          data: shiftedData.amplitude,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          type: 'scatter',
        },
        {
          label: 'Original Amplitude (bar)',
          data: originalData.amplitude.map((point) => point.y),
          borderColor: 'rgb(255,99,132)',
          backgroundColor: 'rgba(255,99,132,0.5)',
          type: 'bar',
        },
        {
          label: 'Shifted Amplitude (bar)',
          data: shiftedData.amplitude.map((point) => point.y),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          type: 'bar',
        },
      ],

      'scatter',
      'Amplitude Spectrum',
      '|X(f)|',
    )

  }

  //________________________________________________________________________________
  drawAmplitudeAndPhaseChart(
    labels,
    amplitudeData,
    phaseData,
    amplitudeLines,
    phaseLines,
  ) {
    ChartDrawer.drawScatterWithVerticalLines(
      'amplitudeChart',
      labels,
      amplitudeData,
      'Amplitude Spectrum',
      '|X(f)|',
    )

    ChartDrawer.killChart('phaseChart')
    if (phaseData && phaseData.length > 0) {
      ChartDrawer.drawScatterWithVerticalLines(
        'phaseChart',
        labels,
        phaseData,
        'Phase Spectrum',
        '\u03C6[°]',
      )
    }
  }

  //________________________________________________________________________________

  //________________________________________________________________________________
  showReverseTransformationButton() {
    let parentDiv = document.querySelector('.boxofboxes--js')

    let transformChartContainer = document.querySelector('#phaseChartContainer')
    let reverseChartContainer = document.querySelector('#reverseChartContainer')
    let reverseTransformButtonDiv = document.querySelector(
      '.reverseTransformButtonDiv',
    )
    if (!reverseTransformButtonDiv) {
      reverseTransformButtonDiv = document.createElement('div')
      reverseTransformButtonDiv.className = 'reverseTransformButtonDiv'
      reverseTransformButtonDiv.innerHTML = `
        <div class="reverseTransformButtonBox">
        <button class="selectButtons reverseTransform">Reverse Transform</button>
        </div>
        `
      parentDiv.insertBefore(reverseTransformButtonDiv, reverseChartContainer)
    }
    const reverseTransform = reverseTransformButtonDiv.querySelector(
      'button:nth-child(1)',
    )

    reverseTransform.addEventListener('click', () => {
      this.controller.handleReverseTransform()
      //this.controller.handleReverseDFT()
    })
  }

  //________________________________________________________________________________
  drawTimeDomainChart(labels, reverseDFTResults) {
    if (ChartDrawer.charts['sampleChart'].config.type === 'line') {
      ChartDrawer.drawChart(
        'reverseChart',
        labels,
        reverseDFTResults,
        'line',
        'Output Signal',
      )
    } else if (ChartDrawer.charts['sampleChart'].config.type === 'bar') {
      ChartDrawer.drawChart(
        'reverseChart',
        labels,
        reverseDFTResults,
        'bar',
        'Output Signal',
      )
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

      //desktop mouse event listeners
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

      //mobile event listeners
      floatingDiv.addEventListener('touchstart', (event) => {
        const touch = event.touches[0]
        offsetX = touch.clientX - floatingDiv.getBoundingClientRect().left
        offsetY = touch.clientY - floatingDiv.getBoundingClientRect().top

        function moveFloatingDivTouch(event) {
          const touch = event.touches[0]
          floatingDiv.style.left = `${touch.clientX - offsetX}px`
          floatingDiv.style.top = `${touch.clientY - offsetY}px`
        }

        document.addEventListener('touchmove', moveFloatingDivTouch)
        document.addEventListener(
          'touchend',
          () => {
            document.removeEventListener('touchmove', moveFloatingDivTouch)
          },
          { once: true },
        )
      })

      //buttons acions
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
    }
  }
  //________________________________________________________________________________
  addElementToListView(element) {
    const li = document.createElement('li')
    li.className = 'signalElement'
    li.textContent = `${element.selectedOption} - Amplitude: ${element.amplitude}, Frequency: ${element.frequency}`
    this.list.appendChild(li)

    this.controller.addCloseButton(li)
    this.controller.addCloseEventListeners(li)
  }

  getSignalListElements() {
    return document.getElementsByClassName('signalElement')
  }

  getCloseButtons() {
    return document.getElementsByClassName('close')
  }

  drawChart(chartId, labels, data, type, title) {
    ChartDrawer.drawChart(chartId, labels, data, type, title)
  }

  //________________________________________________________________________________
  clearSignalList() {
    while (this.list.firstChild) {
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
