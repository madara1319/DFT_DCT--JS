import { SignalGenerator } from './SignalGenerator.js'
import { View } from './View.js'
import { Model } from './Model.js'
import { DFT } from './DFT.js'
import { DCT } from './DCT.js'
import { ReverseDFT } from './ReverseDFT.js'

class Controller {
  constructor(view, model) {
    this.view = view
    this.model = model
    this.view.setController(this)
    this.view.initialize()
  }

  sampleRateHandler(value) {
    const parsedValue = parseFloat(value)
    if (!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue > 0) {
      this.model.setSampleRate(parseFloat(value))
      const selectedOption = this.view.selectedOption.value
      const amplitudeValue = parseFloat(this.view.amplitudeSlider.value)
      const frequencyValue = parseFloat(this.view.frequencySlider.value)
      this.updateChart(selectedOption, [amplitudeValue], [frequencyValue])
    } else {
      console.error('Wrong type of input!')
      window.alert('Wrong Type of input!')
    }
  }

  updateChart(
    selectedOption,
    amplitudeArray = [1],
    frequencyArray = [10],
    customData = [],
  ) {
    const { labels, data } = this.calculateInput(
      selectedOption,
      amplitudeArray,
      frequencyArray,
      customData,
    )
    this.model.saveSamples(data)
    this.view.drawChart(
      'sampleChart',
      labels,
      data,
      customData.length > 0 ? 'bar' : 'line',
      'Entrance Signal',
    )
    this.view.showTransformationButtons()
  }

  //________________________________________________________________________________
  //calculating input signal values using generateSignal() method and SignalGenerator class
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
          ;({ labels, data } = this.generateSignal(
            SignalGenerator.generateSineWave,
            amplitudeArray,
            frequencyArray,
          ))
          break
        case 'Square function':
          ;({ labels, data } = this.generateSignal(
            SignalGenerator.generateSquareWave,
            amplitudeArray,
            frequencyArray,
          ))
          break
        case 'Triangle function':
          ;({ labels, data } = this.generateSignal(
            SignalGenerator.generateTriangleWave,
            amplitudeArray,
            frequencyArray,
          ))
          break
        default:
          labels = Array.from({ length: customData.length }, (_, i) =>
            i.toString(),
          )
          data = customData
          break
      }
    }
    return { labels, data }
  }
  //________________________________________________________________________________
  generateSignal(generatorFunction, amplitudeArray, frequencyArray) {
    const labels = []
    const data = []
    //const duration = 1 // 1 second
    //const length = this.model.getSampleRate() * duration

    //testing
    const numberOfPeriods=5;
    const maxFrequency=Math.max(...frequencyArray)
    const period=1/maxFrequency
    const duration=numberOfPeriods * period
    //const duration=numberOfPeriods/maxFrequency
    const length=Math.floor(this.model.getSampleRate()*duration)


    


    // Generate the signals for all amplitudes and frequencies
    let waveMapArray = amplitudeArray.map((amplitude, index) => {
      return generatorFunction(
        frequencyArray[index],
        amplitude,
        this.model.getSampleRate(),
        length,
      )
    })

    //testing
  for (let i = 0; i < length; i++) {
    const t = i / this.model.getSampleRate() // Time value for current sample
    let value = 0
    waveMapArray.forEach((waveMap) => {
      // Snap the time to avoid floating-point precision issues
      const snappedTime = parseFloat(t.toFixed(10))
      if (waveMap.has(snappedTime)) {
        value += waveMap.get(snappedTime)
      }
    })
    labels.push(t.toFixed(3))
    data.push(value.toFixed(6))
  }


    
    // Sum the values at each time point
//    for (let i = 0; i < length; i++) {
//      const t = Number((i / this.model.getSampleRate()).toFixed(3))
//      let value = 0
//      waveMapArray.forEach((waveMap) => {
//        if (waveMap.has(t)) {
//          value += waveMap.get(t)
//        }
//      })
//      labels.push(t.toFixed(3))
//      data.push(value.toFixed(6))
//    }

    return { labels, data }
  }

  //________________________________________________________________________________
  //pass parameters to view method which will add point to HTML list
  addElementToList(selectedOption, amplitude, frequency) {
    const element = {
      selectedOption,
      amplitude: parseFloat(amplitude),
      frequency: parseFloat(frequency),
    }
    this.view.addElementToListView(element)
  }

  //________________________________________________________________________________

  checkIfNumber(value) {
    const stringNumber = String(value).trim()
    const regex = /^(-?(?:0|[1-9]\d*)(?:\.\d+)?)$/
    const parsedNumber = Number(stringNumber)
    if (!isNaN(parsedNumber) && stringNumber === String(parsedNumber)) {
      console.log('Input value is correct number')
      return true
    } else {
      window.alert('Incorrect input! Must provide number')
      throw new Error('Incorrect input! Must provide number')
    }
  }

  //________________________________________________________________________________

  addElementToListHandler() {
    const selectedOption = document.querySelector('.composerSelect').value
    const amplitude = document.querySelector('.amplitudeComposerInput').value
    const frequency = document.querySelector('.frequencyComposerInput').value
    if (
      this.checkIfNumber(parseFloat(amplitude)) &&
      this.checkIfNumber(parseFloat(frequency))
    ) {
      this.addElementToList(selectedOption, amplitude, frequency)
    }
  }

  //________________________________________________________________________________
  addCloseButtons() {
    const items = this.view.getSignalListElements()
    for (let i = 0; i < items.length; i++) {
      const span = document.createElement('SPAN')
      const txt = document.createTextNode('\u00D7')
      span.appendChild(txt)
      items[i].appendChild(span)
    }
  }

  //________________________________________________________________________________
  addCloseButton(item) {
    if (!item.querySelector('.close')) {
      const span = document.createElement('SPAN')
      const txt = document.createTextNode('\u00D7')
      span.className = 'close'
      span.appendChild(txt)
      item.appendChild(span)
    }
  }

  //________________________________________________________________________________
  generateCombinedSignal() {
    const signals = Array.from(
      this.view.list.querySelectorAll('.signalElement'),
    ).map((li) => {
      const parts = li.textContent.split(' - Amplitude: ')
      const selectedOption = parts[0]
      const [amplitude, frequency] = parts[1]
        .split(', Frequency: ')
        .map(parseFloat)
      return {
        selectedOption,
        amplitude,
        frequency,
      }
    })

    const duration = 1
    const length = this.model.getSampleRate() * duration

    let combinedWave = new Map()
    signals.forEach((signal) => {
      let wave
      switch (signal.selectedOption) {
        case 'Sine function':
          wave = SignalGenerator.generateSineWave(
            signal.frequency,
            signal.amplitude,
            this.model.getSampleRate(),
            length,
          )
          break
        case 'Square function':
          wave = SignalGenerator.generateSquareWave(
            signal.frequency,
            signal.amplitude,
            this.model.getSampleRate(),
            length,
          )
          break
        case 'Triangle function':
          wave = SignalGenerator.generateTriangleWave(
            signal.frequency,
            signal.amplitude,
            this.model.getSampleRate(),
            length,
          )
          break
        default:
          return
      }
      wave.forEach((value, key) => {
        if (!combinedWave.has(key)) {
          combinedWave.set(key, 0)
        }
        combinedWave.set(key, combinedWave.get(key) + value)
      })
    })
    const labels = Array.from(combinedWave.keys())
    const data = Array.from(combinedWave.values())
    let fixedLabels = []
    let fixedData = []
    labels.forEach((label) => fixedLabels.push(label))
    data.forEach((element) => fixedData.push(element))

    this.model.saveSamples(data)
    this.view.drawChart('sampleChart', labels, data, 'line', 'Entrance Signal')

    this.view.showTransformationButtons()
  }

  //________________________________________________________________________________
  addCloseEventListeners(item) {
    item.querySelector('.close').addEventListener('click', (event) => {
      const div = event.target.parentElement
      div.remove() //remove element on close button click
    })
  }

  //________________________________________________________________________________
  convertToPointFormat(transformResults) {
    return (value, index) => {
      return {
        x: index,
        y: value,
      }
    }
  }

  //________________________________________________________________________________
  handleDFT() {
    const samples = this.model.samples
    if (!samples || samples.length === 0) {
      return
    }

    const dft = new DFT(samples)
    const result = dft.transform()
    this.model.saveDFT(result)

    const amplitude = dft.getAmplitude(result)
    const phase = dft.getPhase(result)
    const labels = Array.from({ length: result.length }, (_, i) => i.toString())

    const amplitudePoints = amplitude.map(this.convertToPointFormat(amplitude))
    const phasePoints = phase.map(this.convertToPointFormat(phase))

    phasePoints.forEach((phase) => {})

    this.view.drawAmplitudeAndPhaseChart(labels, amplitudePoints, phasePoints)

    this.view.showModificationButtons()

    this.view.showReverseTransformationButton()
  }

  //________________________________________________________________________________
  handleDCT() {
    const samples = this.model.samples

    if (!samples || samples.length === 0) {
      return
    }

    const dct = new DCT(samples)
    const result = dct.transform()
    this.model.saveDCT(result)

    const amplitude = dct.getAmplitude(result)
    const labels = Array.from({ length: result.length }, (_, i) => i.toString())

    const amplitudePoints = amplitude.map(this.convertToPointFormat(amplitude))

    amplitudePoints.forEach((amp) => {})

    this.view.drawAmplitudeAndPhaseChart(labels, amplitudePoints, false)

    this.view.killModificationButtons()
    this.view.killReverseTransformationButton()
  }

  //________________________________________________________________________________
  handleTimeShift(timeShiftValue) {
    const N = this.model.getSamplesCount()
    const kArray = Array.from({ length: N }, (_, k) => k)
    const actualDFT =
      this.model.getModifiedDFT().length > 0
        ? this.model.getModifiedDFT()
        : this.model.getDFTResults()
    const originalDFT = this.model.getDFTResults()
    const shiftedDFT = actualDFT.map((X_k, k) => {
      const angle = (-2 * Math.PI * k * timeShiftValue) / N
      return {
        real: X_k.real * Math.cos(angle) - X_k.imag * Math.sin(angle),
        imag: X_k.real * Math.sin(angle) + X_k.imag * Math.cos(angle),
      }
    })
    this.model.saveModifiedDFT(shiftedDFT)
    const amplitudeOriginal = originalDFT.map((X_k) =>
      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
    )
    const amplitudeShifted = shiftedDFT.map((X_k) =>
      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
    )
    const phaseOriginal = originalDFT.map((X_k) =>
      Math.atan2(X_k.imag, X_k.real),
    )
    const phaseShifted = shiftedDFT.map((X_k) => Math.atan2(X_k.imag, X_k.real))
    const amplitudeOriginalPoints = amplitudeOriginal.map(
      this.convertToPointFormat(amplitudeOriginal),
    )
    const phaseOriginalPoints = phaseOriginal.map(
      this.convertToPointFormat(phaseOriginal),
    )
    const amplitudeShiftedPoints = amplitudeShifted.map(
      this.convertToPointFormat(amplitudeShifted),
    )
    const phaseShiftedPoints = phaseShifted.map(
      this.convertToPointFormat(phaseShifted),
    )
    this.view.drawShiftedDFTChart(
      kArray,
      { amplitude: amplitudeOriginalPoints, phase: phaseOriginalPoints },
      { amplitude: amplitudeShiftedPoints, phase: phaseShiftedPoints },
    )
  }

  //________________________________________________________________________________
  handleAmplitudeScaling(scaleFactor) {
    const N = this.model.getSamplesCount()
    const kArray = Array.from({ length: N }, (_, k) => k)
    const originalDFT = this.model.getDFTResults()
    const actualDFT =
      this.model.getModifiedDFT().length > 0
        ? this.model.getModifiedDFT()
        : this.model.getDFTResults()
    const scaledDFT = actualDFT.map((X_k) => ({
      real: X_k.real * scaleFactor,
      imag: X_k.imag * scaleFactor,
    }))
    this.model.saveModifiedDFT(scaledDFT)
    const amplitudeOriginal = originalDFT.map((X_k) =>
      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
    )
    const amplitudeShifted = scaledDFT.map((X_k) =>
      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
    )
    const phaseOriginal = originalDFT.map((X_k) =>
      Math.atan2(X_k.imag, X_k.real),
    )
    const phaseShifted = scaledDFT.map((X_k) => Math.atan2(X_k.imag, X_k.real))
    const amplitudeOriginalPoints = amplitudeOriginal.map(
      this.convertToPointFormat(amplitudeOriginal),
    )
    const phaseOriginalPoints = phaseOriginal.map(
      this.convertToPointFormat(phaseOriginal),
    )
    const amplitudeShiftedPoints = amplitudeShifted.map(
      this.convertToPointFormat(amplitudeShifted),
    )
    const phaseShiftedPoints = phaseShifted.map(
      this.convertToPointFormat(phaseShifted),
    )
    this.view.drawShiftedDFTChart(
      kArray,
      { amplitude: amplitudeOriginalPoints, phase: phaseOriginalPoints },
      { amplitude: amplitudeShiftedPoints, phase: phaseShiftedPoints },
    )
  }

  //________________________________________________________________________________

  clearModSignal() {
    this.model.clearModDFT()
  }

  //________________________________________________________________________________

  clearStorage() {
    this.model.clearLocalStorage()
  }

  //________________________________________________________________________________
  handleReverseDFT() {
    const dftResults =
      this.model.getModifiedDFT().length > 0
        ? this.model.getModifiedDFT()
        : this.model.getDFTResults()
    if (!dftResults || dftResults.length === 0) {
      return
    }

    const reverseDFT = new ReverseDFT(dftResults)
    const reverseDFTResults = reverseDFT.reverseTransform()

    const labels = Array.from({ length: reverseDFTResults.length }, (_, i) =>
      (i / this.model.getSampleRate()).toString(),
    )
    this.model.saveReverseDFT(reverseDFTResults)

    this.view.drawTimeDomainChart(labels, reverseDFTResults)
  }
  //________________________________________________________________________________
  saveSignals() {
    const signals = Array.from(
      this.view.list.querySelectorAll('.signalElement'),
    ).map((li) => {
      const parts = li.textContent.split(' - Amplitude: ')
      const selectedOption = parts[0]
      const [amplitude, frequency] = parts[1]
        .split(', Frequency: ')
        .map(parseFloat)
      return { selectedOption, amplitude, frequency }
    })
    this.model.saveSignalsToLocalStorage(signals)
  }

  //________________________________________________________________________________
  loadSignals() {
    const signals = this.model.loadSignalsFromLocalStorage()
    this.view.clearSignalList()
    signals.forEach((signal) => {
      this.view.addElementToListView(signal)
    })
  }

  //________________________________________________________________________________
  saveSamples() {
    const samples = this.view.textArea.value
      .split('\n')
      .filter((sample) => sample.trim() !== '')
    this.model.saveSamplesToLocalStorage(samples)
  }

  //________________________________________________________________________________
  loadSamples() {
    const samples = this.model.loadSamplesFromLocalStorage()
    this.view.textArea.value = samples.join('\n')
  }

  //________________________________________________________________________________
}
export { Controller }
