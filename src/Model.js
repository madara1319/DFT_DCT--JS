class Model{
  constructor(){
    this.samples=JSON.parse(localStorage.getItem('samples')) || [];
    this.dftResults=JSON.parse(localStorage.getItem('dftResults')) || [];
    this.dctResults=JSON.parse(localStorage.getItem('dctResults')) || [];
//    this.samplesKey='samples';
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

  getDFTResults() {
    return this.dftResults;
  }

  getDCTResults() {
    return this.dctResults;
  }
}

export { Model };
