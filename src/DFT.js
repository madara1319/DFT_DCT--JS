import {Transformation} from './Transformation.js'
class DFT extends Transformation{
  constructor(probes){
    //access properties on an object literal or class's [[Protype]]
    super(probes);
  }

  transform(){
    const N=this.probes.length;
    const X=[];

    for (let k=0; k<N; k++){
      let sum={real:0, imag:0};
      for (let n=0; n<N; n++){
        const angle=-2 * Math.PI * k * n/N;
        sum.real+=this.probes[n] * Math.cos(angle);
        sum.imag+=this.probes[n]*Math.sin(angle);
      }
      X.push(sum);
    }
    return X;
  }
}

export {DFT}
