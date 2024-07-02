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
    //dodac funkcje pokazujaca guzik do transformacji
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
    //console.log(data)
   ChartDrawer.drawChart(labels, data, 'line')
    //dodac funkcje pokazujaca guzik do transformacji
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
    //dodac funkcje pokazujaca guzik do transformacji
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
    //console.log(data);
    return { labels, data };
  }

  // podaje funkcje z generatora amp i freq
  //do poprawy ta funkcja
generateSignal(generatorFunction, amplitudeArray, frequencyArray) {
    const labels = [];
    const data = [];
    const sampleRate = 100; // 100 samples per second
    const duration = 1; // 1 second
    const length = sampleRate * duration;
    console.log("jestem tu")
    // Generate the signals for all amplitudes and frequencies
    let waveMapArray = amplitudeArray.map((amplitude, index) => {
        return generatorFunction(frequencyArray[index], amplitude, sampleRate, length);
    });

    // Sum the values at each time point
    for (let i = 0; i < length; i++) {
        const t = Number((i / sampleRate).toFixed(3));
        let value = 0;
        waveMapArray.forEach(waveMap => {
            if (waveMap.has(t)) {
                value += waveMap.get(t);
              //console.log(value);
            }
        });
        labels.push(t.toFixed(3));
        data.push(value);
      //console.log(data);
    }

    return { labels, data };
}



}



function main() {
  const test = new SignalComposer()
  const view = new View()
}
main()
