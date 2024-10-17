class Model {
  constructor() {
    this.samples = JSON.parse(localStorage.getItem('samples')) || []
    this.affectedByDCTSamples = JSON.parse(localStorage.getItem('affectedByDCTSamples')) || []
    this.dftResults = JSON.parse(localStorage.getItem('dftResults')) || []
    this.dctResults = JSON.parse(localStorage.getItem('dctResults')) || []
    this.transformationType = 'DFT'
    this.savedSignalsKey = 'savedSignals'
    this.savedSamplesKey = 'savedSamples'
    this.modifiedDftResults =
      JSON.parse(localStorage.getItem('modifiedDftResults')) || []
    this.reverseDFTResults =
      JSON.parse(localStorage.getItem('reverseDFTResults')) || []
    this.sampleRate = JSON.parse(localStorage.getItem('sampleRate')) || 100
    this.modifiedDctResults =
      JSON.parse(localStorage.getItem('modifiedDctResults')) || []
    this.reverseDCTResults =
      JSON.parse(localStorage.getItem('reverseDCTResults')) || []

  }


  setCurrentTransformation(type) {
    this.transformationType = type
  }

  getCurrentTransformation() {
    return this.transformationType
  }

  setSampleRate(sampleRate) {
    this.sampleRate = sampleRate
    localStorage.setItem('sampleRate', JSON.stringify(sampleRate))
  }

  saveSamples(samples) {
    this.samples = samples
    localStorage.setItem('samples', JSON.stringify(samples))
  }

  saveDCTSamples(affectedByDCTSamples) {
    this.affectedByDCTSamples = affectedByDCTSamples
    localStorage.setItem('affectedByDCTSamples', JSON.stringify(affectedByDCTSamples))
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
  saveModifiedDCT(modifiedDctResults) {
    this.modifiedDctResults = modifiedDctResults
    localStorage.setItem(
      'modifiedDctResults',
      JSON.stringify(modifiedDctResults),
    )
  }

  saveReverseDCT(reverseDCTResults) {
    this.reverseDCTResults = reverseDCTResults
    localStorage.setItem('reverseDCTResults', JSON.stringify(reverseDCTResults))
  }

  getSamples() {
    return this.samples
  }

  getDCTSamples() {
    return this.affectedByDCTSamples;
  }

  clearModDFT() {
    if (this.modifiedDftResults) {
      localStorage.removeItem('modifiedDftResults')
      this.modifiedDftResults = []
    }
    console.log('cleared DFT' + this.modifiedDftResults)
  }
  clearModDCT() {
    if (this.modifiedDctResults) {
      localStorage.removeItem('modifiedDctResults')
      this.modifiedDctResults = []
    }
    console.log('cleared DCT' + this.modifiedDctResults)
  }

  clearModDCTSamples() {
    if (this.affectedByDCTSamples) {
      localStorage.removeItem('affectedByDCTSamples')
      this.affectedByDCTSamples = []
    }
    console.log('cleared DCT Samples')
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

  getDCTSamplesCount() {
    return this.affectedByDCTSamples.length
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

  getModifiedDCT() {
    return this.modifiedDctResults
  }

  getReverseDCT() {
    return this.reverseDCTResults
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
