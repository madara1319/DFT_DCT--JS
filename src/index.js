//import { Controller } from './pattern.js';
//import { View } from './pattern.js';
//import { Model } from './pattern.js';
//import * as dftFile from '../DFT_DCT--JS.js';

//dodac mozliwosc generowania sygnalow zlozonych z kilku sinusow roznych


//
import {SignalComposer} from './SignalComposer.js';
// rysujaca input 
import {ChartDrawer} from './ChartDrawer.js';
//do generowania sygnalu
import { SignalGenerator } from './SignalGenerator.js';
class SignalCompositor {}

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

    //wybor baseFunction i dodanie funckji rysowania wybranej
    this.selectedOption = document.querySelector('.selection')
    this.selectedOption.addEventListener(
      'click',
        this.handleOptionChange.bind(this),

    )

    //nasluchiwanie sliderow i rysowanie z nich baseFunction
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

    //dodanie do rysowania z trybu wprowadzania tablicy
    this.enterBox
      .querySelector('.textArea')
      .addEventListener('keydown', this.handleTextArea.bind(this))

    //jak strona sie zaladuje odpal funkcje setupCharts
    document.addEventListener('DOMContentLoaded', this.setupCharts.bind(this))
  }
  //________________________________________________________________________________
  //koniec konstruktora

  //funkcja wyswietlanie ukrywanie opcji wprowadzania danych
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
  //niepotrzebna??
  //  isFunctionOpen(option) {
  //    return [
  //      'Sine function',
  //      'Quadratic function',
  //      'Triangle function',
  //    ].includes(option)
  //  }

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
    //nowe
    const { labels, data } = this.calculateInput(
      selectedOption,
      [amplitudeValue],
      [frequencyValue]
     // amplitudeArray,
     // frequencyArray,
    )
    ChartDrawer.drawChart(labels, data, 'line')
  }
//________________________________________________________________________________
  //funckja obslugujaca rysowanie defaultowych wykresow po zmianie base function
  handleOptionChange(event) {
    const selectedValue = event.target.value
    console.log(selectedValue);

   // const amplitudeArray = [parseFloat(this.amplitudeSlider.value)]
   // const frequencyArray = [parseFloat(this.frequencySlider.value)]

    const amplitudeValue = parseFloat(this.amplitudeSlider.value)
    const frequencyValue = parseFloat(this.frequencySlider.value)
    const { labels, data } = this.calculateInput(
      selectedValue,
      [amplitudeValue],
      [frequencyValue],

      //this.amplitudeSlider.value,
      //this.frequencySlider.value,
    )
    //tu jest cos zdupione panie kolego
    console.log(data);
    ChartDrawer.drawChart(labels, data, 'line')
    //this.calculateInput(selectedValue);
  }

  //________________________________________________________________________________
  //daj wykres jak sie strona zaladuje

  //przygotuj chart jak strona sie zaladuje
  setupCharts() {
    this.sampleChart = new Chart(
      document.getElementById('sampleChart').getContext('2d'),
    )
    this.sampleChart.canvas.width = 400
    this.sampleChart.canvas.height = 400
  }

  //________________________________________________________________________________
  //funkcja oblusgujaca rysowanie wykresu z probek
  handleTextArea(event) {
    if (event.key === 'Enter') {
      const data = event.target.value.trim()

      const dataArray = data.split(',').map((value) => parseFloat(value.trim()))
      const areNumbers = dataArray.every((value) => !isNaN(value))
      if (areNumbers) {
        const { labels, data } = this.calculateInput(
          'Custom',
          undefined,
          undefined,
          dataArray,
        )
        ChartDrawer.drawChart(labels, data, 'bar')
      } else {
        console.log('nieprowadilowe dane')
      }
    }
  }
//________________________________________________________________________________
  //funckja do obliczania sygnalu
  calculateInput(optionValue, amplitudeArray = [1], frequencyArray = [10], customData = []) {
    let labels = [];
    let data = [];

    if (customData.length > 0) {
      labels = Array.from({ length: customData.length }, (_, i) => i.toString());
      data = customData;
    } else {
      switch (optionValue) {
        case 'Sine function':
          ({ labels, data } = this.generateSignal(SignalGenerator.generateSineWave, amplitudeArray, frequencyArray));
          break;
        case 'Square function':
          ({ labels, data } = this.generateSignal(SignalGenerator.generateSquareWave, amplitudeArray, frequencyArray));
          break;
        case 'Triangle function':
          ({ labels, data } = this.generateSignal(SignalGenerator.generateTriangleWave, amplitudeArray, frequencyArray));
          break;
        default:
          labels = Array.from({ length: customData.length }, (_, i) => i.toString());
          data = customData;
          break;
      }
    }
    return { labels, data };
  }

  // Helper function to generate signal and labels
  generateSignal(generatorFunction, amplitudeArray, frequencyArray) {
    const labels = [];
    const data = [];
    const sampleRate = 100; // 100 samples per second
    const duration = 1; // 1 second

    for (let t = 0; t <= duration; t += 1 / sampleRate) {
      let value = 0;
      for (let i = 0; i < amplitudeArray.length; i++) {
        value += generatorFunction(frequencyArray[i], amplitudeArray[i], t);
      }
      labels.push(t.toFixed(3));
      data.push(value);
    }
    return { labels, data };
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



function main() {
  const test = new SignalComposer()
  const view = new View()
}
main()
