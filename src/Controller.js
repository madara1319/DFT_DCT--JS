import { SignalGenerator } from './SignalGenerator.js'
//import { ChartDrawer } from './ChartDrawer.js';
import { View } from './View.js'
import { Model } from './Model.js'
import { DFT } from './DFT.js'
import { DCT } from './DCT.js'
import {ReverseDFT} from './ReverseDFT.js'

class Controller {
  constructor(view, model) {
    //console.log('odpalam konstriktor kontrolera')
    this.view = view
    this.model = model
    this.view.setController(this)
    //ok to powodowalo podwojny nasluch:w
    this.sampleRate=1000;
    this.view.initialize()
    //console.log('przeszelm inicjalizacje')

    //tbc_________________________
    //   this.view.setupCharts()
    //   this.view.showTransformationButtons()
    //tbc___________________
  }

  updateChart(
    selectedOption,
    amplitudeArray = [1],
    frequencyArray = [10],
    customData = [],
  ) {
    //console.log('updateChart start')
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
    )
    this.view.showTransformationButtons()
    // this.view.showModificationButtons();
    //tu dodac metode ktora bedzie w view i bedzie odzpowiedzialna za wyswietlanie guzikow do DCT/DFT
    //console.log('updateChart end')
  }

  //________________________________________________________________________________
  //funckja do obliczania sygnalu
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
    //console.log('Calculated input data:', data)
    return { labels, data }
  }
  //________________________________________________________________________________
  //funckja do poprawy
  generateSignal(generatorFunction, amplitudeArray, frequencyArray) {
    const labels = []
    const data = []
    const duration = 1 // 1 second
    const length = this.sampleRate * duration
    //console.log('generateSignal start ')

 //   console.log(
 //     ` generatorFunction ${generatorFunction}, amplitudeArray ${amplitudeArray}, frequencyArray ${frequencyArray} `,
 //   )
    // Generate the signals for all amplitudes and frequencies
    let waveMapArray = amplitudeArray.map((amplitude, index) => {
      return generatorFunction(
        frequencyArray[index],
        amplitude,
        this.sampleRate,
        length,
      )
    })

    // Sum the values at each time point
    for (let i = 0; i < length; i++) {
      const t = Number((i / this.sampleRate).toFixed(3))
      let value = 0
      waveMapArray.forEach((waveMap) => {
        if (waveMap.has(t)) {
          value += waveMap.get(t)
          //console.log(value);
        }
      })
      labels.push(t.toFixed(3))
      data.push(value.toFixed(6))

      //console.log(data);
    }

    //console.log('generateSignal end ')
    return { labels, data }
  }

  //________________________________________________________________________________
  //do weryfikacji
  //przekazuje parametry do metody view ktora dodaje punkt do listy HTML
  addElementToList(selectedOption, amplitude, frequency) {
    //console.log('addElementToList start ')
    const element = {
      selectedOption,
      amplitude: parseFloat(amplitude),
      frequency: parseFloat(frequency),
    }
    this.view.addElementToListView(element)

 //   console.log(
 //     'addElementToList end ' + element.selectedOption + element.amplitude,
 //   )
  }

  //________________________________________________________________________________

  addElementToListHandler() {
    const selectedOption = document.querySelector('.composerSelect').value
    const amplitude = document.querySelector('.amplitudeComposerInput').value
    const frequency = document.querySelector('.frequencyComposerInput').value
   // console.log(`test metodu addElementToListHandler amplitude ${amplitude}`)
    this.addElementToList(selectedOption, amplitude, frequency)
  }

  //________________________________________________________________________________
  //to nie dziala
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
    const length = this.sampleRate * duration

    let combinedWave = new Map()
    signals.forEach((signal) => {
      let wave
      switch (signal.selectedOption) {
        case 'Sine function':
          wave = SignalGenerator.generateSineWave(
            signal.frequency,
            signal.amplitude,
            this.sampleRate,
            length,
          )
          break
        case 'Square function':
          wave = SignalGenerator.generateSquareWave(
            signal.frequency,
            signal.amplitude,
            this.sampleRate,
            length,
          )
          break
        case 'Triangle function':
          wave = SignalGenerator.generateTriangleWave(
            signal.frequency,
            signal.amplitude,
            this.sampleRate,
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
    let fixedLabels=[]
    let fixedData=[]
    labels.forEach((label)=>fixedLabels.push(label))
    data.forEach((element)=>fixedData.push(element))

    this.model.saveSamples(data)
  this.view.drawChart('sampleChart', labels, data, 'line')

    //this.view.drawChart('sampleChart', fixedLabels, fixedLabels, 'line')

    this.view.showTransformationButtons()
  }

  //________________________________________________________________________________
  addCloseEventListeners(item) {
    item.querySelector('.close').addEventListener('click', (event) => {
      const div = event.target.parentElement
      //div.style.display = 'none'
      div.remove()
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
   // console.log('Samples for DFT:', samples)

    if (!samples || samples.length === 0) {
      //console.error('No data available for DFT transformation.')
      return
    }

    const dft = new DFT(samples)
    const result = dft.transform()
    this.model.saveDFT(result)
    //console.log('result to ' + result[1].real)

    const amplitude = dft.getAmplitude(result)
    const phase = dft.getPhase(result)
    const labels = Array.from({ length: result.length }, (_, i) => i.toString())
    //console.log('amplitudy' + amplitude[1])

    //console.log('fazy' + phase)

    const amplitudePoints = amplitude.map(this.convertToPointFormat(amplitude))

    const phasePoints = phase.map(this.convertToPointFormat(phase))

//  const amplitudeLines = amplitude.map((amp, i) => ({ x: i, y: amp }));
// const phaseLines = phase.map((ph, i) => ({ x: i, y: ph }));

    phasePoints.forEach((phase)=>{
      //console.log(`faza ` + phase.y)
    })
   // this.view.drawAmplitudeAndPhaseChart(labels, amplitude, phase)

      this.view.drawAmplitudeAndPhaseChart(labels, amplitudePoints,phasePoints);

      //this.view.drawAmplitudeAndPhaseChart(labels, amplitudePoints,phasePoints);
    this.view.showModificationButtons()

    this.view.showReverseTransformationButton()
  }

  handleDCT() {
    const samples = this.model.samples
    //console.log('Samples for DCT:', samples)

    if (!samples || samples.length === 0) {
      //console.error('No data available for DCT transformation.')
      return
    }

    const dct = new DCT(samples)
    const result = dct.transform()
    this.model.saveDCT(result)

    const amplitude = dct.getAmplitude(result)
    const labels = Array.from({ length: result.length }, (_, i) => i.toString())

    const amplitudePoints = amplitude.map(this.convertToPointFormat(amplitude))

    amplitudePoints.forEach((amp)=>{
      //console.log(`faza ` + amp.y)
    })

    this.view.drawAmplitudeAndPhaseChart(labels, amplitudePoints, false)

    //   this.view.drawChart(
    //     'amplitudeChart',
    //     Array.from({ length: result.length }, (_, i) => i.toString()),
    //     result,
    //     'line',
    //   )

    this.view.killModificationButtons()
    this.view.killReverseTransformationButton()
  }

  //________________________________________________________________________________
  //need to fix it to draw on both charts
  handleTimeShift(timeShiftValue) {
    const N = this.model.getSamplesCount()
    const kArray = Array.from({ length: N }, (_, k) => k)
    const actualDFT=this.model.getModifiedDFT().length > 0 ? this.model.getModifiedDFT() : this.model.getDFTResults();
    const originalDFT=this.model.getDFTResults();
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


    const amplitudeOriginalPoints = amplitudeOriginal.map(this.convertToPointFormat(amplitudeOriginal))
    const phaseOriginalPoints = phaseOriginal.map(this.convertToPointFormat(phaseOriginal))

    const amplitudeShiftedPoints = amplitudeShifted.map(this.convertToPointFormat(amplitudeShifted))
    const phaseShiftedPoints = phaseShifted.map(this.convertToPointFormat(phaseShifted))

    this.view.drawShiftedDFTChart(
      kArray,
      { amplitude: amplitudeOriginalPoints, phase: phaseOriginalPoints },
      { amplitude: amplitudeShiftedPoints, phase: phaseShiftedPoints },
    )

    //this.view.drawShiftedDFTChart(kArray, magnitudeOriginal, magnitudeShifted)
  }

  handleAmplitudeScaling(scaleFactor) {
    const N = this.model.getSamplesCount()
    const kArray = Array.from({ length: N }, (_, k) => k)
    const originalDFT=this.model.getDFTResults(); 

    const actualDFT=this.model.getModifiedDFT().length > 0 ? this.model.getModifiedDFT() : this.model.getDFTResults();
    const scaledDFT = actualDFT.map((X_k) => ({
      real: X_k.real * scaleFactor,
      imag: X_k.imag * scaleFactor,
    })
    )
    

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
    const phaseShifted = scaledDFT.map((X_k) =>
      Math.atan2(X_k.imag, X_k.real),
    )


    const amplitudeOriginalPoints = amplitudeOriginal.map(this.convertToPointFormat(amplitudeOriginal))
    const phaseOriginalPoints = phaseOriginal.map(this.convertToPointFormat(phaseOriginal))

    const amplitudeShiftedPoints = amplitudeShifted.map(this.convertToPointFormat(amplitudeShifted))
    const phaseShiftedPoints = phaseShifted.map(this.convertToPointFormat(phaseShifted))



    this.view.drawShiftedDFTChart(
      kArray,
      { amplitude: amplitudeOriginalPoints, phase: phaseOriginalPoints },
      { amplitude: amplitudeShiftedPoints, phase: phaseShiftedPoints },
    )

    //console.log('amp scale')
  }

  //________________________________________________________________________________

  clearModSignal(){
    this.model.clearModDFT()
  }
  
  //________________________________________________________________________________

  clearStorage(){
    this.model.clearLocalStorage()
  }

  //________________________________________________________________________________
  handleReverseDFT() {
    //console.log('reverseTransform')

    const dftResults=this.model.getModifiedDFT().length > 0 ? this.model.getModifiedDFT() : this.model.getDFTResults();
    if (!dftResults || dftResults.length === 0) {
      //console.error('No DFT data available for inverse transformation.')
      return
    }

    const reverseDFT = new ReverseDFT(dftResults)
    const reverseDFTResults = reverseDFT.reverseTransform()

    const labels = Array.from({ length: reverseDFTResults.length }, (_, i) =>(i/this.sampleRate).toString())
    //console.log(labels);
    this.model.saveReverseDFT(reverseDFTResults)

    this.view.drawTimeDomainChart(labels,reverseDFTResults)
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

  loadSamples() {
    const samples = this.model.loadSamplesFromLocalStorage()
    this.view.textArea.value = samples.join('\n')
  }

  //________________________________________________________________________________
}
export { Controller }
