import { ReverseTransformation } from './ReverseTransformation.js'
class ReverseDCT extends ReverseTransformation {
  constructor(signal) {
    super(signal)
  }

  reverseTransform() {
    const N = this.signal.length
    const x = []
    for (let n = 0; n < N; n++) {
      let sum = this.signal[0] / Math.sqrt(N)
      for (let k = 1; k < N; k++) {
        const angle = (Math.PI * k * (2 * n + 1)) / (2 * N)
        sum += this.signal[k] * Math.cos(angle) * Math.sqrt(2 / N)
      }
      x.push(sum)
    }
    return x
  }
}

export { ReverseDCT }
