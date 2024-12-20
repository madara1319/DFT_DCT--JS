import { Transformation } from './Transformation.js'

class DFT extends Transformation {
  constructor(probes) {
    //access properties on an object literal or class's [[Protype]]
    super(probes)
  }
  transform() {
    const N = this.probes.length
    const X = []
    for (let k = 0; k < N; k++) {
      let sum = { real: 0, imag: 0 }
      for (let n = 0; n < N; n++) {
        const angle = (-2 * Math.PI * k * n) / N
        sum.real += this.probes[n] * Math.cos(angle)
        sum.imag += this.probes[n] * Math.sin(angle)
        sum.real = parseFloat(sum.real.toFixed(4))
        sum.imag = parseFloat(sum.imag.toFixed(4))
      }
      X.push(sum)
    }
    this.clearSpectrum(X)
    return X
  }

  //_______________________________________________________________
  clearSpectrum(X) {
    const maxAmp = Math.max(
      ...X.map((r) => Math.sqrt(r.real ** 2 + r.imag ** 2)),
    )
    const tol = maxAmp / 10000
    X.forEach((r, i) => {
      const amp = Math.sqrt(r.real ** 2 + r.imag ** 2)
      if (amp < tol) {
        X[i] = { real: 0, imag: 0 }
      }
    })
  }
  //_______________________________________________________________
  getAmplitude(dftResults) {
    return dftResults.map((r) =>
      parseFloat(
        (
          (Math.sqrt(r.real ** 2 + r.imag ** 2) * 2) /
          this.probes.length
        ).toFixed(4),
      ),
    )
  }
  //_______________________________________________________________
  getPhase(dftResults) {
    const amplitudes = this.getAmplitude(dftResults)
    const maxAmp = Math.max(...amplitudes)
    const threshold = maxAmp / 10000;
    return dftResults.map((r, index) => {
      if (amplitudes[index] > threshold) {
        return parseFloat(
          (Math.atan2(r.imag, r.real) * (180 / Math.PI)).toFixed(4),
        )
      } else {
        return 0
      }
    })
  }
}

export { DFT }
