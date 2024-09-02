import {Transformation} from './Transformation.js'
class DCT extends Transformation{
  constructor(probes){
    super(probes);
  }

  transform(){
    const N=this.probes.length;
    const X=[];

    for(let k=0; k<N; k++){
      let sum=0;
      for (let n=0; n<N; n++){
        const angle=(Math.PI * k * (2*n + 1))/(2*N);
        sum+=this.probes[n]*Math.cos(angle);
      }
      X.push(sum);
    }
    this.clearSpectrum(X);
    return X;
  }

  clearSpectrum(X){
    const maxAmp=Math.max(...X.map(r=>Math.abs(r.real)))
    const tol=maxAmp/10000
    X.forEach((r,i)=>{
      const amp=Math.abs(r.real)
      if(amp<tol){
        X[i]={real:0,imag:0}
      }
      
    });

  }


getAmplitude(dctResults) {

  return dctResults
}
}
export {DCT}
