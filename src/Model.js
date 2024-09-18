class Model {
  constructor() {
    this.samples = JSON.parse(localStorage.getItem('samples')) || []
    this.dftResults = JSON.parse(localStorage.getItem('dftResults')) || []
    this.dctResults = JSON.parse(localStorage.getItem('dctResults')) || []
    this.savedSignalsKey = 'savedSignals'
    this.savedSamplesKey = 'savedSamples'
    this.modifiedDftResults =
      JSON.parse(localStorage.getItem('modifiedDftResults')) || []
    this.reverseDFTResults =
      JSON.parse(localStorage.getItem('reverseDFTResults')) || []
    this.sampleRate = JSON.parse(localStorage.getItem('sampleRate')) || 100
  }

  setSampleRate(sampleRate) {
    this.sampleRate = sampleRate
    localStorage.setItem('sampleRate', JSON.stringify(sampleRate))
  }

  saveSamples(samples) {
    this.samples = samples
    localStorage.setItem('samples', JSON.stringify(samples))
  }

  saveDFT(dftResults) {
    this.dftResults = dftResults
    localStorage.setItem('dftResults', JSON.stringify(dftResults))
  }

  saveDCT(dctResults) {
    this.dctResults = dctResults
    localStorage.setItem('dctResults', JSON.stringify(dctResults))
  }

  saveModifiedDFT(modifiedDftResults) {
    this.modifiedDftResults = modifiedDftResults
    localStorage.setItem(
      'modifiedDftResults',
      JSON.stringify(modifiedDftResults),
    )
  }

  saveReverseDFT(reverseDFTResults) {
    this.reverseDFTResults = reverseDFTResults
    localStorage.setItem('reverseDFTResults', JSON.stringify(reverseDFTResults))
  }
  getSamples() {
    return this.samples
  }

  clearModDFT(modifiedDftResults) {
    if (this.modifiedDftResults) {
      localStorage.removeItem('modifiedDftResults')
      this.modifiedDftResults = []
    }
    console.log('cleared DFT' + this.modifiedDftResults)
  }

  clearLocalStorage() {
    localStorage.clear()
  }

  getSampleRate() {
    return this.sampleRate
  }

  getSamplesCount() {
    return this.samples.length
  }

  getDFTResults() {
    return this.dftResults
  }

  getDCTResults() {
    return this.dctResults
  }

  getModifiedDFT() {
    return this.modifiedDftResults
  }

  getReverseDFT() {
    return this.reverseDFTResults
  }

  saveSignalsToLocalStorage(signals) {
    localStorage.setItem(this.savedSignalsKey, JSON.stringify(signals))
  }
  loadSignalsFromLocalStorage() {
    const signals = localStorage.getItem(this.savedSignalsKey)
    return signals ? JSON.parse(signals) : []
  }
  saveSamplesToLocalStorage(samples) {
    localStorage.setItem(this.savedSamplesKey, JSON.stringify(samples))
  }

  loadSamplesFromLocalStorage() {
    const samples = localStorage.getItem(this.savedSamplesKey)
    return samples ? JSON.parse(samples) : []
  }
}

export { Model }
