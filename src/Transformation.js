class Transformation{
  constructor(probes){
    this.probes=probes;
  }

  normalizeProbes(){
    const max=Math.max(...this.probes);
    return this.probes.map(probe=>probe/max);
  }
  fillWithZeros(correctLength){
    if(this.probes.length>=correctLength){
      return this.probes;
    }
    const filledProbes=[...this.probes];
    while(filledProbes.length < correctLength){
      filledProbes.push(0);
    }
    return filledProbes;
  }

  tranform(){
    throw new Error('Method "transform" must be be implemented')
  }
}
export {Transformation}
