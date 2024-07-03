
import { SignalGenerator } from './SignalGenerator.js';
//import { ChartDrawer } from './ChartDrawer.js';
import {View} from './View.js';

class Controller{
  constructor(view){
    console.log('odpalam konstriktor kontrolera')
    this.view=view;
    this.view.setController(this);
    this.view.initialize();
    console.log('przeszelm inicjalizacje')
  }

  updateChart(selectedOption, amplitudeArray=[1], frequencyArray=[10],customData=[]){
    const {labels,data}=this.calculateInput(selectedOption,amplitudeArray,frequencyArray, customData);
   this.view.drawChart(labels, data, customData.length > 0 ? 'bar' : 'line'); 
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
//________________________________________________________________________________
  //funckja do poprawy 
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

//________________________________________________________________________________
  //do weryfikacji
addElementToList(selectedOption,amplitude,frequency){
  const element={
    selectedOption,
    amplitude:parseFloat(amplitude),
    frequency:parseFloat(frequency),
  };
  this.view.addElementToListView(element);
}
  //________________________________________________________________________________
  addCloseButtons() {
    const items = this.signalsList.getElementsByTagName('LI');
    for (let i = 0; i < items.length; i++) {
      const span = document.createElement('SPAN');
      const txt = document.createTextNode('\u00D7');
      span.appendChild(txt);
      items[i].appendChild(span);
    }
  }

  //________________________________________________________________________________
  addCloseEventListeners() {
    const closeButtons = this.signalsList.getElementsByClassName('close');
    for (let i = 0; i < closeButtons.length; i++) {
      closeButtons[i].onclick = function () {
        const div = this.parentElement;
        div.style.display = 'none';
      };
    }
  }
}

export{Controller};
