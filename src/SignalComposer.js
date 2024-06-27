//
//class SignalComposer {
//  constructor() {
//    this.signalsList = document.querySelector('.signalListElement')
//    this.removeInitialElement()
//    this.addCloseButtons()
//    this.addCloseEventListeners()
//
//    this.list = document.querySelector('.composerList')
//
//    document
//      .querySelector('.composerAddButton')
//      .addEventListener('click', () => {
//        //this.newElement();
//        this.showFloatingDiv()
//      })
//
//    document
//      .querySelector('.generateCombinedSignalButton')
//      .addEventListener('click', () => {
//        this.generateCombinedSignal()
//      })
//  }
//
//  removeInitialElement() {
//    const initialElements = document.querySelectorAll('.signalListElement')
//    initialElements.forEach((element) => {
//      element.remove()
//    })
//  }
//
//  generateCombinedSignal() {
//    const amplitudeInputs = Array.from(
//      this.list.querySelectorAll('.signalListElement'),
//    ).map((li) => parseFloat(li.textContent.match(/Amplitude: (\d+\.?\d*)/)[1]))
//    const frequencyInputs = Array.from(
//      this.list.querySelectorAll('.signalListElement'),
//    ).map((li) => parseFloat(li.textContent.match(/Frequency: (\d+\.?\d*)/)[1]))
//    const view = new View()
//    const { labels, data } = view.calculateInput(
//      'Sine function',
//      amplitudeInput,
//      frequencyInput,
//    )
//    ChartDrawer.drawChart(labels, data, 'line')
//  }
//
//  addCloseButtons() {
//    const items = this.signalsList.getElementsByTagName('LI')
//    for (let i = 0; i < items.length; i++) {
//      const span = document.createElement('SPAN')
//      const txt = document.createTextNode('\u00D7')
//      span.appendChild(txt)
//      items[i].appendChild(span)
//    }
//  }
//
//  addCloseEventListeners() {
//    const closeButtons = this.signalsList.getElementsByClassName('close')
//    for (let i = 0; i < closeButtons.length; i++) {
//      closeButtons[i].onclick = function () {
//        const div = this.parentElement
//        div.style.display = 'none'
//      }
//    }
//  }
//
//  showFloatingDiv() {
//    let floatingDiv = document.querySelector('.showDiv')
//    if (!floatingDiv) {
//      floatingDiv = document.createElement('div')
//      floatingDiv.className = 'showDiv'
//      floatingDiv.innerHTML = `<div class="composerFloatingDiv">
//      <div class="composerInputInsideDiv">
//      <select class="composerSelect">
//      <option class="sine">Sine function</option>
//      <option class="quad">Quadratic function</option>
//      <option class="triangle">Triangle function</option>
//      </select>
//
//      <input type="text" id=amplitudeComposerInput" class="amplitudeComposerInput" placeholder="Enter amplitude...">
//      <input type="text" id="frequencyComposerInput" class="frequencyComposerInput" placeholder="Enter frequency...">
//      </div>
//      <span class="composerAddToList">Enter </span>
//      <button class="closeFloatingDiv">\u00D7</button>
//      </div>
//      `
//      document.body.appendChild(floatingDiv)
//      floatingDiv.style.display = 'block'
//      floatingDiv.style.top = '50%'
//      floatingDiv.style.left = '50%'
//
//      let offsetX, offsetY
//      floatingDiv.addEventListener('mousedown', (event) => {
//        offsetX = event.clientX - floatingDiv.getBoundingClientRect().left
//        offsetY = event.clientY - floatingDiv.getBoundingClientRect().top
//        document.addEventListener('mousemove', mouseMoveHandler)
//        document.addEventListener('mouseup', mouseUpHandler)
//      })
//      function mouseMoveHandler(event) {
//        floatingDiv.style.left = `${event.clientX - offsetX}px`
//        floatingDiv.style.top = `${event.clientY - offsetY}px`
//      }
//      function mouseUpHandler(event) {
//        document.removeEventListener('mousemove', mouseMoveHandler)
//        document.removeEventListener('mouseup', mouseUpHandler)
//      }
//      const input = floatingDiv.querySelector('.amplitudeComposerInput')
//      input.addEventListener('keydown', (event) => {
//        if (event.key === 'Enter') {
//          this.addElementToList(input.value)
//          input.value = ''
//        }
//      })
//
//      const closeFloatingDiv = floatingDiv.querySelector('.closeFloatingDiv')
//      closeFloatingDiv.addEventListener('click', () => {
//        floatingDiv.remove()
//      })
//      const addButton = floatingDiv.querySelector('.composerAddToList')
//      addButton.addEventListener('click', () => {
//        const amplitudeInput = floatingDiv.querySelector(
//          '.amplitudeComposerInput',
//        ).value
//        const frequencyInput = floatingDiv.querySelector(
//          '.frequencyComposerInput',
//        ).value
//        this.addElementToList(amplitudeComposerInput, frequencyArray)
//        this.addElementToList(input.value)
//
//        floatingDiv.remove()
//        //input.value=''
//      })
//    } else {
//      floatingDiv.style.display =
//        floatingDiv.style.display === 'none' ? 'block' : 'none'
//    }
//  }
//  //this.list zaimplementowac jako liste z 2 elementami badz mape
//  //tak zeby bylo amplitude i czestotliwosc i zebrac z 2 inputow
//  //napisac combinedSignal metode do wyliczania lacznego sygnalu
//  //przemyslec klasy
//  addElementToList(element) {
//    if (element.trim() !== '') {
//      const li = document.createElement('li')
//      li.className = 'signalListElement'
//      li.textContent = element
//      const span = document.createElement('SPAN')
//      //unicode X sign
//      const txt = document.createTextNode('\u00D7')
//      span.className = 'close'
//      span.appendChild(txt)
//      li.appendChild(span)
//      this.list.appendChild(li)
//      span.onclick = function () {
//        const div = this.parentElement
//        //div.style.display='none';
//        div.remove()
//      }
//    }
//  }
//}
//
//export {SignalComposer};

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
      const [selectedOption, amplitude, frequency] = li.dataset;
      return {
        selectedOption,
        amplitude: parseFloat(amplitude),
        frequency: parseFloat(frequency),
      };
    });

    const view = new View();
    const combinedSignal = signals.reduce((acc, signal) => {
      const { labels, data } = view.calculateInput(
        signal.selectedOption,
        [signal.amplitude],
        [signal.frequency]
      );
      acc.labels = labels;
      acc.data = acc.data.map((val, index) => val + data[index]);
      return acc;
    }, { labels: [], data: Array(100).fill(0) });

    ChartDrawer.drawChart(combinedSignal.labels, combinedSignal.data, 'line');
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

