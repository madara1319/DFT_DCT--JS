import { Transformation } from './Transformation.js'

class DCT extends Transformation {
  constructor(probes) {
    super(probes)
  }

  transform() {
    const N = this.probes.length
    const X = new Array(N)

    for (let k = 0; k < N; k++) {
      let sum = 0
      for (let n = 0; n < N; n++) {
        const angle = (Math.PI * k * (2 * n + 1)) / (2 * N)
        sum += this.probes[n] * Math.cos(angle)
      }

      if (k === 0) {
        X[k] = sum * Math.sqrt(1 / N)
      } else {
        X[k] = sum * Math.sqrt(2 / N)
      }
    }

    this.clearSpectrum(X)
    return X
  }

  clearSpectrum(X) {
    const maxAmp = Math.max(...X.map((x) => Math.abs(x)))
    const tol = maxAmp / 10000

    for (let i = 0; i < X.length; i++) {
      if (Math.abs(X[i]) < tol) {
        X[i] = 0
      }
    }
  }

  getAmplitude(dctResults) {
    return dctResults.map((x) => Math.abs(x))
  }
}

export { DCT }
