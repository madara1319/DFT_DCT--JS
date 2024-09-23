import { Transformation } from './Transformation.js';

import fft from 'fft-js';


class DFT extends Transformation {
  constructor(probes) {
    //access properties on an object literal or class's [[Protype]]
    super(probes)
  }
//first attemp at implementing algorithm  
//  transform() {
//    const N = this.probes.length
//    const X = []
//    for (let k = 0; k < N; k++) {
//      let sum = { real: 0, imag: 0 }
//      for (let n = 0; n < N; n++) {
//        const angle = (-2 * Math.PI * k * n) / N
//        sum.real += this.probes[n] * Math.cos(angle)
//        sum.imag += this.probes[n] * Math.sin(angle)
//        sum.real = parseFloat(sum.real.toFixed(4))
//        sum.imag = parseFloat(sum.imag.toFixed(4))
//      }
//      X.push(sum)
//    }
//    this.clearSpectrum(X)
//    return X
//  }
//_______________________________________________________________
//attemp at using npm package for DFT
  transform() {
    const N = this.probes.length;
    
    if ((N & (N - 1)) !== 0) {
      console.error("Liczba próbek musi być potęgą 2 dla FFT");
      return [];
    }
    
    const input = this.probes.map(p => [p, 0]);
    
    try {
      const fftResult = fft(input);
      
      const X = fftResult.map(complex => {
        if (!Array.isArray(complex) || complex.length < 2) {
          throw new Error("Nieprawidłowy format wyniku FFT");
        }
        return {
          real: parseFloat(complex[0].toFixed(4)),
          imag: parseFloat(complex[1].toFixed(4)),
        };
      });
      
      this.clearSpectrum(X);
      return X;
    } catch (error) {
      console.error("Błąd podczas wykonywania FFT:", error);
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
