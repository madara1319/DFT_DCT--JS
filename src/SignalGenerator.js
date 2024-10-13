//class used to generate base Functions
class SignalGenerator {
  static generateSineWave(frequency, amplitude = 1, sampleRate, length) {
    const wave = new Map()
    const angularFrequency = 2 * Math.PI * frequency
    const timeIncrement = 1 / sampleRate
    for (let i = 0; i < length; i++) {
      const time = parseFloat((i * timeIncrement).toFixed(10))
      wave.set(time, amplitude * Math.sin(angularFrequency * time))
    }
    return wave
  }
//
//  static generateSineWave(frequency, amplitude = 1, sampleRate, length) {
//    const angularFrequency = 2 * Math.PI * frequency
//    return (t) => amplitude * Math.sin(angularFrequency * t)
//  }
  static generateSquareWave(frequency, amplitude = 1, sampleRate, length) {
    const wave = new Map()
    //const period = Math.floor(sampleRate / frequency)
    
    //testing
    const period=1/frequency
    //const halfPeriod = Math.floor(period / 2)
    //const timeIncrement = 1 / sampleRate
    for (let i = 0; i < length; i++) {
      //const time = parseFloat((i * timeIncrement).toFixed(10))
      const time = i/sampleRate
      const normalizedTime = (time % period)/period
      //const phase = i % period
      wave.set(time, normalizedTime < 0.5 ? amplitude : -amplitude)
    }
    return wave
  }
  static generateTriangleWave(frequency, amplitude = 1, sampleRate, length) {
    const wave = new Map()
    //const period = Math.floor(sampleRate / frequency)

    //testing
    const period = 1/frequency;
    //const halfPeriod = Math.floor(period / 2)
    //const timeIncrement = 1 / sampleRate
        for (let i = 0; i < length; i++) {
      const time = i / sampleRate
      const normalizedTime = (time % period) / period
      let value
      if (normalizedTime < 0.25) {
        value = (4 * normalizedTime) * amplitude
      } else if (normalizedTime < 0.75) {
        value = (2 - 4 * normalizedTime) * amplitude
      } else {
        value = (4 * normalizedTime - 4) * amplitude
      }
      wave.set(time, value)}
    return wave
  }
}
export { SignalGenerator }
