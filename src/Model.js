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

    this.data = {
      samples: [],
      dftResults: [],
      dctResults: [],
      modifiedDftResults: [],
      reverseDFTResults: [],
      modifiedDctResults: [],
      reverseDCTResults: [],
      sampleRate: 100,
      transformationType: 'DFT',
    }
  }

  logStorageInfo() {
    const storageInfo = this.getLocalStorageInfo()
    console.log(`Zajęte miejsce: ${storageInfo.usage} KB`)
    console.log(`Limit: ${storageInfo.limit} KB`)
    console.log(`Procent wykorzystania: ${storageInfo.percentUsed}%`)
    console.log(`Dostępne miejsce: ${storageInfo.available} KB`)
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

  clearModDFT(modifiedDftResults) {
    if (this.modifiedDftResults) {
      localStorage.removeItem('modifiedDftResults')
      this.modifiedDftResults = []
    }
    console.log('cleared DFT' + this.modifiedDftResults)
  }
  clearModDCT(modifiedDctResults) {
    if (this.modifiedDctResults) {
      localStorage.removeItem('modifiedDctResults')
      this.modifiedDctResults = []
    }
    console.log('cleared DCT' + this.modifiedDctResults)
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

  //testing

  getLocalStorageUsage() {
    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length
      }
    }
    return total
  }

  getLocalStorageLimit() {
    let test = '0'
    let i = 0
    try {
      for (i = 250; i <= 10000; i += 250) {
        test = new Array(i * 1024 + 1).join('a')
        localStorage.setItem('test', test)
      }
    } catch (e) {
      localStorage.removeItem('test')
      return i - 250
    }
  }

  getLocalStorageInfo() {
    const usage = this.getLocalStorageUsage()
    const limit = this.getLocalStorageLimit()
    const usageInKB = Math.round(usage / 1024)
    const limitInKB = Math.round(limit)
    const percentUsed = Math.round((usage / (limit * 1024)) * 100)

    return {
      usage: usageInKB,
      limit: limitInKB,
      percentUsed: percentUsed,
      available: limitInKB - usageInKB,
    }
  }

  checkStorageBeforeSave(dataToSave) {
    const dataSize = JSON.stringify(dataToSave).length
    const storageInfo = this.getLocalStorageInfo()

    if (dataSize > storageInfo.available * 1024) {
      throw new Error(
        `Niewystarczająca ilość miejsca w localStorage. Potrzebne: ${Math.round(dataSize / 1024)} KB, Dostępne: ${storageInfo.available} KB`,
      )
    }
  }

  saveToLocalStorage() {
    try {
      this.checkStorageBeforeSave(this.data)
      Object.entries(this.data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })
    } catch (error) {
      console.error('Błąd podczas zapisywania do localStorage:', error.message)
      // Tu możesz dodać kod do obsługi sytuacji, gdy brakuje miejsca
    }
  }

  loadFromLocalStorage() {
    Object.keys(this.data).forEach((key) => {
      const storedValue = localStorage.getItem(key)
      if (storedValue !== null) {
        this.data[key] = JSON.parse(storedValue)
      }
    })
  }

  saveToLocalStorage() {
    Object.entries(this.data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value))
    })
  }
}

export { Model }
