import { Transformation } from './Transformation.js'

import fft from 'fft-js'
import fftInPlace from 'fft-js'

class DFT extends Transformation {
  constructor(probes) {
    //access properties on an object literal or class's [[Protype]]
    super(probes)
    //    console.log(probes)
    //const simpleInput = [[1, 0], [0, 0], [0, 0], [0, 0]];
    //const fftResult = fft(simpleInput);
    //console.log('Test FFT Result:', fftResult);
  }
  //first attemp at implementing algorithm
  //    transform() {
  //      const N = this.probes.length
  //      const X = []
  //      for (let k = 0; k < N; k++) {
  //        let sum = { real: 0, imag: 0 }
  //        for (let n = 0; n < N; n++) {
  //          const angle = (-2 * Math.PI * k * n) / N
  //          sum.real += this.probes[n] * Math.cos(angle)
  //          sum.imag += this.probes[n] * Math.sin(angle)
  //          sum.real = parseFloat(sum.real.toFixed(4))
  //          sum.imag = parseFloat(sum.imag.toFixed(4))
  //        }
  //        X.push(sum)
  //      }
  //      this.clearSpectrum(X)
  //      return X
  //    }
  //

  bruteForceDFTtransform() {
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
  //attemp at using npm package for DFT
  transform() {
    const newLength = 2 ** Math.ceil(Math.log2(this.probes.length))
    this.probes = this.fillWithZeros(newLength) // Ensure length is a power of 2
    const N = this.probes.length

    if ((N & (N - 1)) !== 0) {
      console.error(`Liczba próbek musi być potęgą 2 dla FFT: ${N}`)
      return []
    }

    //const input = this.probes.map((p) => [parseFloat(p), 0])
    const input = [];
    for (let i = 0; i < this.probes.length; i++) {
      input.push([parseFloat(this.probes[i]), 0]);
      let test=[parseFloat(this.probes[i]), 0];
      let fftTest=fft(test);
      console.log(` input to ${[parseFloat(this.probes[i]), 0]} a jego fft to ${fftTest}`)
    }

    //const input = this.probes.flatMap((p) => [parseFloat(p) || 0, 0])
    //const input=this.probes
   // console.log(fft([1,0],[15,0],[3.23,0],[7.89,0]))
    const testInput = this.probes
  //  for (let step = 0; step <= 10; step++) {
    //  console.log(
    //    `input ${step} to ${input[step]} jego typ ${typeof input[step]}`,
    //  )

     // console.log(`input ${step} to ${input[step]} jego typ ${typeof(input[step])} a mapowany to ${testInput[step]} jego typ to ${typeof(testInput[step])}`)
  //  }
    //console.log('Input to FFT:' +  input)

    const DFTSpectrum = this.bruteForceDFTtransform()
  //  console.log(DFTSpectrum)
  try {
      //const fftResult = fft(input);
      
      // Konwertuj wynik FFT na format {real, imag}
      const X = [];
      for (let i = 0; i < input.length; i++) {
        let fftResult=fft(input[i])
        console.log(fftResult)
   //     const real = fftResult[i][0] 
   //     const imag = fftResult[i][1]
   //     X.push({
   //       real: parseFloat(real.toFixed(4)),
   //       imag: parseFloat(imag.toFixed(4))
  //      });
      }

      console.log('Parsed FFT Result:', X);
    
      this.clearSpectrum(X);
      return X;
    } catch (error) {
      console.error('Błąd podczas wykonywania FFT:', error);
      console.log('FFT Result:', fftResult);
      return [];
    }
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
  getAmplitude(dftResults) {
    return dftResults.map((r) =>
      parseFloat(Math.sqrt(r.real ** 2 + r.imag ** 2).toFixed(4)),
    )
  }
  getPhase(dftResults) {
    return dftResults.map(
      (r) => parseFloat(Math.atan2(r.imag, r.real)) * (180 / Math.PI),
    )
  }
}

export { DFT }
