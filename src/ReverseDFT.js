import { ReverseTransformation } from './ReverseTransformation.js'
class ReverseDFT extends ReverseTransformation {
  constructor(signal) {
    super(signal)
  }
  reverseTransform() {
    const N = this.signal.length
    const x = []
    for (let n = 0; n < N; n++) {
      let sum = { real: 0, imag: 0 }
      for (let k = 0; k < N; k++) {
        const angle = (2 * Math.PI * k * n) / N
        sum.real +=
          this.signal[k].real * Math.cos(angle) -
          this.signal[k].imag * Math.sin(angle)
        sum.imag +=
          this.signal[k].real * Math.sin(angle) +
          this.signal[k].imag * Math.cos(angle)
      }
      x.push(sum.real / N)
    }
    return x
  }
}
export { ReverseDFT }
