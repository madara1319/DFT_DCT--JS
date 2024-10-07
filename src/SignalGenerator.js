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
    const period = Math.floor(sampleRate / frequency)
    const halfPeriod = Math.floor(period / 2)
    const timeIncrement = 1 / sampleRate
    for (let i = 0; i < length; i++) {
      const time = parseFloat((i * timeIncrement).toFixed(10))
      const phase = i % period
      wave.set(time, phase < halfPeriod ? amplitude : -amplitude)
    }
    return wave
  }
  static generateTriangleWave(frequency, amplitude = 1, sampleRate, length) {
    const wave = new Map()
    const period = Math.floor(sampleRate / frequency)
    const halfPeriod = Math.floor(period / 2)
    const timeIncrement = 1 / sampleRate
    for (let i = 0; i < length; i++) {
      const time = parseFloat((i * timeIncrement).toFixed(10))
      const t = (i % period) / period
      let value

      if (t < 0.25) {
        value = 4 * t * amplitude
      } else if (t < 0.75) {
        value = (-4 * t + 2) * amplitude
      } else {
        value = (4 * t - 4) * amplitude
      }
      wave.set(time, value)
    }
    return wave
  }
}
export { SignalGenerator }
