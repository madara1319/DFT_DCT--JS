class Model{
  constructor(){
    this.samples=JSON.parse(localStorage.getItem('samples')) || [];
    this.dftResults=JSON.parse(localStorage.getItem('dftResults')) || [];
    this.dctResults=JSON.parse(localStorage.getItem('dctResults')) || [];
    this.savedSignalsKey='savedSignals';
    this.savedSamplesKey='savedSamples';
//    this.dftKey='dft';
//    this.dctKey='dct';
//    this.loadSamples();
  }
  saveSamples(samples) {
    this.samples = samples;
    localStorage.setItem('samples', JSON.stringify(samples));
  }

  saveDFT(dftResults) {
    this.dftResults = dftResults;
    localStorage.setItem('dftResults', JSON.stringify(dftResults));
  }

  saveDCT(dctResults) {
    this.dctResults = dctResults;
    localStorage.setItem('dctResults', JSON.stringify(dctResults));
  }


  getSamples() {
    return this.samples;
  }

  getSamplesCount() {
    return this.samples.length;
  }
//
//  getDFT(){
//    return this.dft
//  }
//  

  getDFTResults() {
    return this.dftResults;
  }

  getDCTResults() {
    return this.dctResults;
  }
  saveSignalsToLocalStorage(signals){
    localStorage.setItem(this.savedSignalsKey, JSON.stringify(signals));
  }
  loadSignalsFromLocalStorage(){
    const signals=localStorage.getItem(this.savedSignalsKey);
    return signals ? JSON.parse(signals) : [];
  }


  saveSamplesToLocalStorage(samples) {
    localStorage.setItem(this.savedSamplesKey, JSON.stringify(samples));
  }

  loadSamplesFromLocalStorage() {
    const samples = localStorage.getItem(this.savedSamplesKey);
    return samples ? JSON.parse(samples) : [];
  }

}

export { Model };
