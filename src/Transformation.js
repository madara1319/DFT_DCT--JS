class Transformation{
  constructor(probes){
    this.probes=probes;
  }

  normalizeProbes(){
    const max=Math.max(...this.probes);
    return this.probes.map(probe=>probe/max);
  }

  tranform(){
    throw new Error('Method "transform" must be be implemented')
  }
}
export {Transformation}
