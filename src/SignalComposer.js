//
//
//class SignalComposer {
//  constructor() {
//    this.signalsList = document.querySelector('.signalListElement');
//    this.removeInitialElement();
//    this.addCloseButtons();
//    this.addCloseEventListeners();
//
//    this.list = document.querySelector('.composerList');
//
//    document.querySelector('.composerAddButton').addEventListener('click', () => {
//      this.showFloatingDiv();
//    });
//
//    document.querySelector('.generateCombinedSignalButton').addEventListener('click', () => {
//      this.generateCombinedSignal();
//    });
//  }
//
//  removeInitialElement() {
//    const initialElements = document.querySelectorAll('.signalListElement');
//    initialElements.forEach((element) => {
//      element.remove();
//    });
//  }
//
//  generateCombinedSignal() {
//    const signals = Array.from(this.list.querySelectorAll('.signalListElement')).map((li) => {
//      const [selectedOption, amplitude, frequency] = li.dataset;
//      return {
//        selectedOption,
//        amplitude: parseFloat(amplitude),
//        frequency: parseFloat(frequency),
//      };
//    });
//
//    const view = new View();
//    const combinedSignal = signals.reduce((acc, signal) => {
//      const { labels, data } = view.calculateInput(
//        signal.selectedOption,
//        [signal.amplitude],
//        [signal.frequency]
//      );
//      acc.labels = labels;
//      acc.data = acc.data.map((val, index) => val + data[index]);
//      return acc;
//    }, { labels: [], data: Array(100).fill(0) });
//
//    ChartDrawer.drawChart(combinedSignal.labels, combinedSignal.data, 'line');
//  }
//
//  addCloseButtons() {
//    const items = this.signalsList.getElementsByTagName('LI');
//    for (let i = 0; i < items.length; i++) {
//      const span = document.createElement('SPAN');
//      const txt = document.createTextNode('\u00D7');
//      span.appendChild(txt);
//      items[i].appendChild(span);
//    }
//  }
//
//  addCloseEventListeners() {
//    const closeButtons = this.signalsList.getElementsByClassName('close');
//    for (let i = 0; i < closeButtons.length; i++) {
//      closeButtons[i].onclick = function () {
//        const div = this.parentElement;
//        div.style.display = 'none';
//      };
//    }
//  }
//
//  showFloatingDiv() {
//    let floatingDiv = document.querySelector('.showDiv');
//    if (!floatingDiv) {
//      floatingDiv = document.createElement('div');
//      floatingDiv.className = 'showDiv';
//      floatingDiv.innerHTML = `<div class="composerFloatingDiv">
//        <div class="composerInputInsideDiv">
//          <select class="composerSelect">
//            <option value="Sine function">Sine function</option>
//            <option value="Square function">Square function</option>
//            <option value="Triangle function">Triangle function</option>
//          </select>
//          <input type="text" id="amplitudeComposerInput" class="amplitudeComposerInput" placeholder="Enter amplitude...">
//          <input type="text" id="frequencyComposerInput" class="frequencyComposerInput" placeholder="Enter frequency...">
//        </div>
//        <span class="composerAddToList">Enter</span>
//        <button class="closeFloatingDiv">\u00D7</button>
//      </div>`;
//      document.body.appendChild(floatingDiv);
//      floatingDiv.style.display = 'block';
//      floatingDiv.style.top = '50%';
//      floatingDiv.style.left = '50%';
//
//      let offsetX, offsetY;
//      floatingDiv.addEventListener('mousedown', (event) => {
//        offsetX = event.clientX - floatingDiv.getBoundingClientRect().left;
//        offsetY = event.clientY - floatingDiv.getBoundingClientRect().top;
//        document.addEventListener('mousemove', mouseMoveHandler);
//        document.addEventListener('mouseup', mouseUpHandler);
//      });
//      const mouseMoveHandler = (event) => {
//        floatingDiv.style.left = `${event.clientX - offsetX}px`;
//        floatingDiv.style.top = `${event.clientY - offsetY}px`;
//      };
//      const mouseUpHandler = () => {
//        document.removeEventListener('mousemove', mouseMoveHandler);
//        document.removeEventListener('mouseup', mouseUpHandler);
//      };
//      const frequencyInput=floatingDiv.querySelector('.frequencyComposerInput');
//      const amplitudeInput = floatingDiv.querySelector('.amplitudeComposerInput');
//      frequencyInput.addEventListener('keydown', (event) => {
//        if (event.key === 'Enter') {
//          this.addElementToList();
//          floatingDiv.remove();
//        }
//      });
//
//      amplitudeInput.addEventListener('keydown', (event) => {
//        if (event.key === 'Enter') {
//          this.addElementToList();
//          floatingDiv.remove();
//        }
//      });
//      const closeFloatingDiv = floatingDiv.querySelector('.closeFloatingDiv');
//      closeFloatingDiv.addEventListener('click', () => {
//        floatingDiv.remove();
//      });
//
//      const addButton = floatingDiv.querySelector('.composerAddToList');
//      addButton.addEventListener('click', () => {
//        this.addElementToList();
//        floatingDiv.remove();
//      });
//    } else {
//      floatingDiv.style.display = floatingDiv.style.display === 'none' ? 'block' : 'none';
//    }
//  }
//
//  addElementToList() {
//    const selectedOption = document.querySelector('.composerSelect').value;
//    const amplitude = document.querySelector('.amplitudeComposerInput').value;
//    const frequency = document.querySelector('.frequencyComposerInput').value;
//
//    if (amplitude.trim() !== '' && frequency.trim() !== '') {
//      const li = document.createElement('li');
//      li.className = 'signalListElement';
//      li.dataset.selectedOption = selectedOption;
//      li.dataset.amplitude = amplitude;
//      li.dataset.frequency = frequency;
//      li.textContent = `${selectedOption} - Amplitude: ${amplitude}, Frequency: ${frequency}`;
//      const span = document.createElement('SPAN');
//      const txt = document.createTextNode('\u00D7');
//      span.className = 'close';
//      span.appendChild(txt);
//      li.appendChild(span);
//      this.list.appendChild(li);
//
//      span.onclick = function () {
//        const div = this.parentElement;
//        div.remove();
//      };
//    }
//    console.log(this.list);
//  }
//}
//
//export { SignalComposer };
//


import { SignalGenerator } from './SignalGenerator.js';
import { ChartDrawer } from './ChartDrawer.js';

class SignalComposer {
  constructor() {
    this.signalsList = document.querySelector('.signalListElement');
    this.removeInitialElement();
    this.addCloseButtons();
    this.addCloseEventListeners();

    this.list = document.querySelector('.composerList');

    document.querySelector('.composerAddButton').addEventListener('click', () => {
      this.showFloatingDiv();
    });

    document.querySelector('.generateCombinedSignalButton').addEventListener('click', () => {
      this.generateCombinedSignal();
    });
  }

  removeInitialElement() {
    const initialElements = document.querySelectorAll('.signalListElement');
    initialElements.forEach((element) => {
      element.remove();
    });
  }

  generateCombinedSignal() {
    const signals = Array.from(this.list.querySelectorAll('.signalListElement')).map((li) => {
      return {
        selectedOption: li.dataset.selectedOption,
        amplitude: parseFloat(li.dataset.amplitude),
        frequency: parseFloat(li.dataset.frequency),
      };
    });

    const sampleRate = 100; // 100 samples per second
    const duration = 1; // 1 second
    const length = sampleRate * duration;

    let combinedWave = new Map();
    signals.forEach((signal) => {
      let wave;
      switch (signal.selectedOption) {
        case 'Sine function':
          wave = SignalGenerator.generateSineWave(signal.frequency, signal.amplitude, sampleRate, length);
          break;
        case 'Square function':
          wave = SignalGenerator.generateSquareWave(signal.frequency, signal.amplitude, sampleRate, length);
          break;
        case 'Triangle function':
          wave = SignalGenerator.generateTriangleWave(signal.frequency, signal.amplitude, sampleRate, length);
          break;
        default:
          return;
      }
      wave.forEach((value, key) => {
        if (!combinedWave.has(key)) {
          combinedWave.set(key, 0);
        }
        combinedWave.set(key, combinedWave.get(key) + value);
      });
    });

    const labels = Array.from(combinedWave.keys());
    const data = Array.from(combinedWave.values());

    ChartDrawer.drawChart(labels, data, 'line');
  }

  addCloseButtons() {
    const items = this.signalsList.getElementsByTagName('LI');
    for (let i = 0; i < items.length; i++) {
      const span = document.createElement('SPAN');
      const txt = document.createTextNode('\u00D7');
      span.appendChild(txt);
      items[i].appendChild(span);
    }
  }

  addCloseEventListeners() {
    const closeButtons = this.signalsList.getElementsByClassName('close');
    for (let i = 0; i < closeButtons.length; i++) {
      closeButtons[i].onclick = function () {
        const div = this.parentElement;
        div.style.display = 'none';
      };
    }
  }

  showFloatingDiv() {
    let floatingDiv = document.querySelector('.showDiv');
    if (!floatingDiv) {
      floatingDiv = document.createElement('div');
      floatingDiv.className = 'showDiv';
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
      </div>`;
      document.body.appendChild(floatingDiv);
      floatingDiv.style.display = 'block';
      floatingDiv.style.top = '50%';
      floatingDiv.style.left = '50%';

      let offsetX, offsetY;
      floatingDiv.addEventListener('mousedown', (event) => {
        offsetX = event.clientX - floatingDiv.getBoundingClientRect().left;
        offsetY = event.clientY - floatingDiv.getBoundingClientRect().top;
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      });
      const mouseMoveHandler = (event) => {
        floatingDiv.style.left = `${event.clientX - offsetX}px`;
        floatingDiv.style.top = `${event.clientY - offsetY}px`;
      };
      const mouseUpHandler = () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
      const frequencyInput=floatingDiv.querySelector('.frequencyComposerInput');
      const amplitudeInput = floatingDiv.querySelector('.amplitudeComposerInput');
      frequencyInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.addElementToList();
          floatingDiv.remove();
        }
      });

      amplitudeInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.addElementToList();
          floatingDiv.remove();
        }
      });
      const closeFloatingDiv = floatingDiv.querySelector('.closeFloatingDiv');
      closeFloatingDiv.addEventListener('click', () => {
        floatingDiv.remove();
      });

      const addButton = floatingDiv.querySelector('.composerAddToList');
      addButton.addEventListener('click', () => {
        this.addElementToList();
        floatingDiv.remove();
      });
    } else {
      floatingDiv.style.display = floatingDiv.style.display === 'none' ? 'block' : 'none';
    }
  }

  addElementToList() {
    const selectedOption = document.querySelector('.composerSelect').value;
    const amplitude = document.querySelector('.amplitudeComposerInput').value;
    const frequency = document.querySelector('.frequencyComposerInput').value;

    if (amplitude.trim() !== '' && frequency.trim() !== '') {
      const li = document.createElement('li');
      li.className = 'signalListElement';
      li.dataset.selectedOption = selectedOption;
      li.dataset.amplitude = amplitude;
      li.dataset.frequency = frequency;
      li.textContent = `${selectedOption} - Amplitude: ${amplitude}, Frequency: ${frequency}`;
      const span = document.createElement('SPAN');
      const txt = document.createTextNode('\u00D7');
      span.className = 'close';
      span.appendChild(txt);
      li.appendChild(span);
      this.list.appendChild(li);

      span.onclick = function () {
        const div = this.parentElement;
        div.remove();
      };
    }
    console.log(this.list);
  }
}

export { SignalComposer };
