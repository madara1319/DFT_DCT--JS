import { SignalGenerator } from './SignalGenerator.js'
import { View } from './View.js'
import { Model } from './Model.js'
import { DFT } from './DFT.js'
import { DCT } from './DCT.js'
import { ReverseDFT } from './ReverseDFT.js'
import { ReverseDCT } from './ReverseDCT.js'

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
    this.model.clearModDCT()
    this.model.clearModDFT()
    this.model.clearModDCTSamples()
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
    const numberOfPeriods = 5
    const maxFrequency = Math.max(...frequencyArray)
    const period = 1 / maxFrequency
    const duration = numberOfPeriods * period
    //const duration=numberOfPeriods/maxFrequency
    const length = Math.floor(this.model.getSampleRate() * duration)

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
        const snappedTime = parseFloat(t)
        //  const snappedTime = parseFloat(t)
        if (waveMap.has(snappedTime)) {
          value += waveMap.get(snappedTime)
        }
      })
      labels.push(t.toFixed(5))
      //data.push(value.toFixed(6))
      data.push(value)
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

    this.model.clearModDCT()
    this.model.clearModDFT()
    this.model.clearModDCTSamples()
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
    //console.log('to idzie do modelu ' + result)
    // console.log(result)
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
    this.view.showModificationButtons()
    this.view.showReverseTransformationButton()
    //this.view.killModificationButtons()
    //this.view.killReverseTransformationButton()
  }

  //________________________________________________________________________________
  //  handleTimeShift(timeShiftValue) {
  //    const N = this.model.getSamplesCount()
  //    const kArray = Array.from({ length: N }, (_, k) => k)
  //    const actualDFT =
  //      this.model.getModifiedDFT().length > 0
  //        ? this.model.getModifiedDFT()
  //        : this.model.getDFTResults()
  //    const originalDFT = this.model.getDFTResults()
  //    const shiftedDFT = actualDFT.map((X_k, k) => {
  //      const angle = (-2 * Math.PI * k * timeShiftValue) / N
  //      return {
  //        real: X_k.real * Math.cos(angle) - X_k.imag * Math.sin(angle),
  //        imag: X_k.real * Math.sin(angle) + X_k.imag * Math.cos(angle),
  //      }
  //    })
  //    this.model.saveModifiedDFT(shiftedDFT)
  //    const amplitudeOriginal = originalDFT.map((X_k) =>
  //      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
  //    )
  //    const amplitudeShifted = shiftedDFT.map((X_k) =>
  //      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
  //    )
  //    const phaseOriginal = originalDFT.map((X_k) =>
  //      Math.atan2(X_k.imag, X_k.real),
  //    )
  //    const phaseShifted = shiftedDFT.map((X_k) => Math.atan2(X_k.imag, X_k.real))
  //    const amplitudeOriginalPoints = amplitudeOriginal.map(
  //      this.convertToPointFormat(amplitudeOriginal),
  //    )
  //    const phaseOriginalPoints = phaseOriginal.map(
  //      this.convertToPointFormat(phaseOriginal),
  //    )
  //    const amplitudeShiftedPoints = amplitudeShifted.map(
  //      this.convertToPointFormat(amplitudeShifted),
  //    )
  //    const phaseShiftedPoints = phaseShifted.map(
  //      this.convertToPointFormat(phaseShifted),
  //    )
  //    this.view.drawShiftedDFTChart(
  //      kArray,
  //      { amplitude: amplitudeOriginalPoints, phase: phaseOriginalPoints },
  //      { amplitude: amplitudeShiftedPoints, phase: phaseShiftedPoints },
  //    )
  //  }
  //testing
  //dodatkowe handlery modfyikacji zeby view nie mial dostepu do modelu

  timeShiftViewHandler(shiftValue) {
    if (this.model.getCurrentTransformation() === 'DFT') {
      this.handleDFTTimeShift(shiftValue)
    } else {
      this.handleDCTTimeShift(shiftValue)
    }
  }

  amplitudeScaleViewHandler(scaleFactor) {
    if (this.model.getCurrentTransformation() === 'DFT') {
      this.handleDFTAmplitudeScaling(scaleFactor)
    } else {
      this.handleDCTAmplitudeScaling(scaleFactor)
    }
  }

  //to zrobic handleDFTTimeShift!!
  //handleTimeShift(timeShiftValue) {

  handleDFTTimeShift(timeShiftValue) {
    const N = this.model.getSamplesCount()
    const kArray = Array.from({ length: N }, (_, k) => k)
    const actualDFT =
      this.model.getModifiedDFT().length > 0
        ? this.model.getModifiedDFT()
        : this.model.getDFTResults()
    const originalDFT = this.model.getDFTResults()

    // Poprawiona implementacja przesunięcia czasowego
    const shiftedDFT = actualDFT.map((X_k, k) => {
      const angle = (-2 * Math.PI * k * timeShiftValue) / N
      const magnitude = Math.sqrt(X_k.real ** 2 + X_k.imag ** 2)
      const phase = Math.atan2(X_k.imag, X_k.real)
      const newPhase = phase - angle
      return {
        real: magnitude * Math.cos(newPhase),
        imag: magnitude * Math.sin(newPhase),
      }
    })

    this.model.saveModifiedDFT(shiftedDFT)

    // Obliczanie amplitudy i fazy dla oryginalnego i przesuniętego sygnału
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

    // Konwersja do formatu punktów
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

    // Aktualizacja wykresu
    this.view.drawShiftedDFTChart(
      kArray,
      { amplitude: amplitudeOriginalPoints, phase: phaseOriginalPoints },
      { amplitude: amplitudeShiftedPoints, phase: phaseShiftedPoints },
    )
  }

  //________________________________________________________________________________
  //working on
  //_________________________________
  handleDCTTimeShift(shiftValue) {
    const samples = this.model.getSamples()
    if (!samples || samples.length === 0) return

    const actualDCTSamples =
      this.model.getDCTSamples().length > 0
        ? this.model.getDCTSamples()
        : this.model.getSamples()

    const shiftedSamples = actualDCTSamples.map((_, index) => {
      const newIndex = (index + shiftValue) % samples.length
      return samples[newIndex]
    })
    this.model.saveDCTSamples(shiftedSamples)

    const N = this.model.getDCTSamplesCount()
    const kArray = Array.from({ length: N }, (_, k) => k)

    // DCT for original and shifted signals
    const dctOriginal = new DCT(samples)
    const dctShifted = new DCT(shiftedSamples)
    const originalDCT = dctOriginal.transform()
    const shiftedDCT = dctShifted.transform()

    this.model.saveModifiedDCT(shiftedDCT)
    const amplitudeOriginal = dctOriginal.getAmplitude(originalDCT)
    const amplitudeShifted = dctShifted.getAmplitude(shiftedDCT)

    // Points for plotting
    const amplitudeOriginalPoints = amplitudeOriginal.map(
      this.convertToPointFormat(amplitudeOriginal),
    )
    const amplitudeShiftedPoints = amplitudeShifted.map(
      this.convertToPointFormat(amplitudeShifted),
    )

    // Draw the chart
    this.view.drawShiftedDCTChart(
      kArray,
      { amplitude: amplitudeOriginalPoints },
      { amplitude: amplitudeShiftedPoints },
    )
  }
  //_______________________________________________
  //working on
  //________________________________
  // _____________________________
  handleDCTAmplitudeScaling(scaleFactor) {
    const samples = this.model.getSamples()
    if (!samples || samples.length === 0) return

    // Scaled samples

    const actualDCTSamples =
      this.model.getDCTSamples().length > 0
        ? this.model.getDCTSamples()
        : this.model.getSamples()

    const scaledSamples = actualDCTSamples.map((sample) => sample * scaleFactor)
    this.model.saveDCTSamples(scaledSamples)

    const N = this.model.getDCTSamplesCount()
    const kArray = Array.from({ length: N }, (_, k) => k)

    // DCT for original and scaled signals
    const dctOriginal = new DCT(samples)
    const dctScaled = new DCT(scaledSamples)

    const originalDCT = dctOriginal.transform()
    const scaledDCT = dctScaled.transform()

    this.model.saveModifiedDCT(scaledDCT)
    const amplitudeOriginal = dctOriginal.getAmplitude(originalDCT)
    const amplitudeScaled = dctScaled.getAmplitude(scaledDCT)

    // Points for plotting
    const amplitudeOriginalPoints = amplitudeOriginal.map(
      this.convertToPointFormat(amplitudeOriginal),
    )
    const amplitudeScaledPoints = amplitudeScaled.map(
      this.convertToPointFormat(amplitudeScaled),
    )

    // Draw the chart
    this.view.drawShiftedDCTChart(
      kArray,
      { amplitude: amplitudeOriginalPoints },
      { amplitude: amplitudeScaledPoints },
    )
  }
  ___________________
  //to zrobic handleDCTAmpscale!!
  //  handleAmplitudeScaling(scaleFactor) {
  handleDFTAmplitudeScaling(scaleFactor) {
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
    this.model.clearModDCT()
    this.model.clearModDCTSamples()
  }

  //________________________________________________________________________________

  clearStorage() {
    this.model.clearLocalStorage()
    //this.model.logStorageInfo()
  }

  //________________________________________________________________________________
  handleReverseTransform() {
    if (this.model.getCurrentTransformation() === 'DFT') {
      this.handleReverseDFT()
    } else {
      this.handleReverseDCT()
    }
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
    // console.log('tu cos powinienem wyciagnac z modelu ')
    // console.log(this.model.getDFTResults())
    const reverseDFT = new ReverseDFT(dftResults)

    const reverseDFTResults = reverseDFT.reverseTransform()

    const labels = Array.from({ length: reverseDFTResults.length }, (_, i) =>
      (i / this.model.getSampleRate()).toString(),
    )
    this.model.saveReverseDFT(reverseDFTResults)
    //console.log(reverseDFTResults)
    this.view.drawTimeDomainChart(labels, reverseDFTResults)
  }

  //________________________________________________________________________________
  handleReverseDCT() {
    console.log(this.model.getModifiedDCT())
    const dctResults =
      this.model.getModifiedDCT().length > 0
        ? this.model.getModifiedDCT()
        : this.model.getDCTResults()
    if (!dctResults || dctResults.length === 0) {
      return
    }

    const reverseDCT = new ReverseDCT(dctResults)
    const reverseDCTResults = reverseDCT.reverseTransform()

    const labels = Array.from({ length: reverseDCTResults.length }, (_, i) =>
      (i / this.model.getSampleRate()).toString(),
    )
    this.model.saveReverseDCT(reverseDCTResults)

    this.view.drawTimeDomainChart(labels, reverseDCTResults)
  }
  //________________________________________________________________________________

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
  setTransformationType(type) {
    this.model.setCurrentTransformation(type)
  }

  //________________________________________________________________________________

  handleLowPassFilter(cutoffFrequency) {
    const N = this.model.getSamplesCount()
    const sampleRate = this.model.getSampleRate()
    const originalDFT = this.model.getDFTResults()

    const filteredDFT = originalDFT.map((X_k, k) => {
      const frequency = (k * sampleRate) / N
      if (frequency > cutoffFrequency) {
        return { real: 0, imag: 0 } // Zero out frequencies above cutoff
      }
      return X_k
    })

    this.model.saveModifiedDFT(filteredDFT)
    this.handleReverseTransform()
  }

  //________________________________________________________________________________

  handleHighPassFilter(cutoffFrequency) {
    const N = this.model.getSamplesCount()
    const sampleRate = this.model.getSampleRate()
    const originalDFT = this.model.getDFTResults()
    const nyquistFrequency = sampleRate / 2
    const kArray = Array.from({ length: N }, (_, k) => k)

    const filteredDFT = originalDFT.map((X_k, k) => {
      const frequency = (k * sampleRate) / N
      const mirroredK = k > N / 2 ? N - k : k
      const mirroredFreq = (mirroredK * sampleRate) / N

      if (frequency <= cutoffFrequency && frequency < nyquistFrequency) {
        const transitionWidth = cutoffFrequency * 0.1
        if (frequency > cutoffFrequency - transitionWidth) {
          const ratio =
            (frequency - (cutoffFrequency - transitionWidth)) / transitionWidth
          const gain = (1 - Math.cos(Math.PI * ratio)) / 2
          return {
            real: X_k.real * gain,
            imag: X_k.imag * gain,
          }
        }
        return { real: 0, imag: 0 }
      }
      return X_k
    })

    this.model.saveModifiedDFT(filteredDFT)

    // Obliczanie amplitudy i fazy dla oryginalnego i przefiltrowanego sygnału
    const amplitudeOriginal = originalDFT.map((X_k) =>
      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
    )
    const amplitudeFiltered = filteredDFT.map((X_k) =>
      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
    )
    const phaseOriginal = originalDFT.map((X_k) =>
      Math.atan2(X_k.imag, X_k.real),
    )
    const phaseFiltered = filteredDFT.map((X_k) =>
      Math.atan2(X_k.imag, X_k.real),
    )

    // Konwersja do formatu punktów
    const amplitudeOriginalPoints = amplitudeOriginal.map(
      this.convertToPointFormat(amplitudeOriginal),
    )
    const phaseOriginalPoints = phaseOriginal.map(
      this.convertToPointFormat(phaseOriginal),
    )
    const amplitudeFilteredPoints = amplitudeFiltered.map(
      this.convertToPointFormat(amplitudeFiltered),
    )
    const phaseFilteredPoints = phaseFiltered.map(
      this.convertToPointFormat(phaseFiltered),
    )

    // Wyświetlanie porównania widm
    this.view.drawShiftedDFTChart(
      kArray,
      { amplitude: amplitudeOriginalPoints, phase: phaseOriginalPoints },
      { amplitude: amplitudeFilteredPoints, phase: phaseFilteredPoints },
    )
  }
  //________________________________________________________________________________

  handleBandPassFilter(lowCutoff, highCutoff) {
    const N = this.model.getSamplesCount()
    const sampleRate = this.model.getSampleRate()
    const originalDFT = this.model.getDFTResults()
    const nyquistFrequency = sampleRate / 2
    const kArray = Array.from({ length: N }, (_, k) => k)

    const lowerFreq = Math.min(lowCutoff, highCutoff)
    const upperFreq = Math.max(lowCutoff, highCutoff)

    const filteredDFT = originalDFT.map((X_k, k) => {
      const frequency = (k * sampleRate) / N
      const mirroredK = k > N / 2 ? N - k : k
      const mirroredFreq = (mirroredK * sampleRate) / N

      if (
        frequency >= lowerFreq &&
        frequency <= upperFreq &&
        frequency < nyquistFrequency
      ) {
        const lowerTransitionWidth = lowerFreq * 0.1
        const upperTransitionWidth = upperFreq * 0.1

        if (frequency < lowerFreq + lowerTransitionWidth) {
          const ratio = (frequency - lowerFreq) / lowerTransitionWidth
          const gain = (1 - Math.cos(Math.PI * ratio)) / 2
          return {
            real: X_k.real * gain,
            imag: X_k.imag * gain,
          }
        } else if (frequency > upperFreq - upperTransitionWidth) {
          const ratio = (upperFreq - frequency) / upperTransitionWidth
          const gain = (1 - Math.cos(Math.PI * ratio)) / 2
          return {
            real: X_k.real * gain,
            imag: X_k.imag * gain,
          }
        }
        return X_k
      }
      return { real: 0, imag: 0 }
    })

    this.model.saveModifiedDFT(filteredDFT)

    // Obliczanie amplitudy i fazy
    const amplitudeOriginal = originalDFT.map((X_k) =>
      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
    )
    const amplitudeFiltered = filteredDFT.map((X_k) =>
      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
    )
    const phaseOriginal = originalDFT.map((X_k) =>
      Math.atan2(X_k.imag, X_k.real),
    )
    const phaseFiltered = filteredDFT.map((X_k) =>
      Math.atan2(X_k.imag, X_k.real),
    )

    // Konwersja do formatu punktów
    const amplitudeOriginalPoints = amplitudeOriginal.map(
      this.convertToPointFormat(amplitudeOriginal),
    )
    const phaseOriginalPoints = phaseOriginal.map(
      this.convertToPointFormat(phaseOriginal),
    )
    const amplitudeFilteredPoints = amplitudeFiltered.map(
      this.convertToPointFormat(amplitudeFiltered),
    )
    const phaseFilteredPoints = phaseFiltered.map(
      this.convertToPointFormat(phaseFiltered),
    )

    // Wyświetlanie porównania widm
    this.view.drawShiftedDFTChart(
      kArray,
      { amplitude: amplitudeOriginalPoints, phase: phaseOriginalPoints },
      { amplitude: amplitudeFilteredPoints, phase: phaseFilteredPoints },
    )
  } //________________________________________________________________________________

  //____________________
  handleNotchFilter(centerFrequency, bandwidth) {
    const N = this.model.getSamplesCount()
    const sampleRate = this.model.getSampleRate()
    const originalDFT = this.model.getDFTResults()
    const nyquistFrequency = sampleRate / 2
    const kArray = Array.from({ length: N }, (_, k) => k)

    const halfBandwidth = bandwidth / 2
    const lowerFreq = centerFrequency - halfBandwidth
    const upperFreq = centerFrequency + halfBandwidth

    const filteredDFT = originalDFT.map((X_k, k) => {
      const frequency = (k * sampleRate) / N
      const mirroredK = k > N / 2 ? N - k : k
      const mirroredFreq = (mirroredK * sampleRate) / N

      if (
        frequency >= lowerFreq &&
        frequency <= upperFreq &&
        frequency < nyquistFrequency
      ) {
        const transitionWidth = bandwidth * 0.1

        if (frequency < lowerFreq + transitionWidth) {
          const ratio = (frequency - lowerFreq) / transitionWidth
          const gain = (1 + Math.cos(Math.PI * ratio)) / 2
          return {
            real: X_k.real * gain,
            imag: X_k.imag * gain,
          }
        } else if (frequency > upperFreq - transitionWidth) {
          const ratio = (upperFreq - frequency) / transitionWidth
          const gain = (1 + Math.cos(Math.PI * ratio)) / 2
          return {
            real: X_k.real * gain,
            imag: X_k.imag * gain,
          }
        }
        return { real: 0, imag: 0 }
      }
      return X_k
    })

    this.model.saveModifiedDFT(filteredDFT)

    // Obliczanie amplitudy i fazy
    const amplitudeOriginal = originalDFT.map((X_k) =>
      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
    )
    const amplitudeFiltered = filteredDFT.map((X_k) =>
      Math.sqrt(X_k.real ** 2 + X_k.imag ** 2),
    )
    const phaseOriginal = originalDFT.map((X_k) =>
      Math.atan2(X_k.imag, X_k.real),
    )
    const phaseFiltered = filteredDFT.map((X_k) =>
      Math.atan2(X_k.imag, X_k.real),
    )

    // Konwersja do formatu punktów
    const amplitudeOriginalPoints = amplitudeOriginal.map(
      this.convertToPointFormat(amplitudeOriginal),
    )
    const phaseOriginalPoints = phaseOriginal.map(
      this.convertToPointFormat(phaseOriginal),
    )
    const amplitudeFilteredPoints = amplitudeFiltered.map(
      this.convertToPointFormat(amplitudeFiltered),
    )
    const phaseFilteredPoints = phaseFiltered.map(
      this.convertToPointFormat(phaseFiltered),
    )

    // Wyświetlanie porównania widm
    this.view.drawShiftedDFTChart(
      kArray,
      { amplitude: amplitudeOriginalPoints, phase: phaseOriginalPoints },
      { amplitude: amplitudeFilteredPoints, phase: phaseFilteredPoints },
    )
  }
  ____________________________________________________________
}
export { Controller }
