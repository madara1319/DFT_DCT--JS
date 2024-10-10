import { ReverseTransformation } from './ReverseTransformation.js'
class ReverseDCT extends ReverseTransformation {
  constructor(signal) {
    super(signal)
  }

  reverseTransform() {
    const N = this.signal.length
    const x = []
    const factor = Math.PI / N

    for (let n = 0; n < N; n++) {
      let sum = this.signal[0] / 2 
      for (let k = 1; k < N; k++) {
        const angle = factor * k * (2 * n + 1) / 2
        sum += this.signal[k] * Math.cos(angle)
      }
      x.push(sum)
    }
    
    return x
  }
}

export { ReverseDCT }
