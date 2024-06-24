
class SignalGenerator {
  static generateSineWave(frequency, amplitude = 1, sampleRate, length) {
    const wave = new Map()
    const angularFrequency = 2 * Math.PI * frequency
    const timeIncrement = 1 / sampleRate
    for (let i = 0; i < length; i++) {
      const time = i * timeIncrement

      wave.set(time, amplitude * Math.sin(angularFrequency * time))
    }
    return wave
  }
  static generateSquareWave(frequency, amplitude = 1, sampleRate, length) {
    const wave = new Map()
    const period = Number((sampleRate / frequency).toFixed(6))
    const halfPeriod = period / 2
    const timeIncrement = 1 / sampleRate
    for (let i = 0; i < length; i++) {
      const time = Number((i * timeIncrement).toFixed(3))
      const phase = Number((i % period).toFixed(3))
      wave.set(time, phase < halfPeriod ? amplitude : -amplitude)
      console.log(wave)
    }
    return wave
  }
  static generateTriangleWave(frequency, amplitude = 1, sampleRate, length) {
    const wave = new Map()
    const period = Math.floor(sampleRate / frequency)
    const halfPeriod = Math.floor(period / 2)
    const timeIncrement = 1 / sampleRate
    for (let i = 0; i < length; i++) {
      const phase = i % period
      const time = i * timeIncrement
      wave.set(
        time,
        (2 / halfPeriod) *
          (Math.abs(phase - halfPeriod) - halfPeriod) *
          amplitude,
      )
    }
    return wave
  }
}
export {SignalGenerator};
