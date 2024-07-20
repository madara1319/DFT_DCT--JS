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
    return X;
  }
}
