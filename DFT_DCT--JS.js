//random N element array
//random values of probes
export const N = 32;
export let probes = [];
for (let i = 0; i < N; i++) {
    probes.push(Math.random());
}
export let n = [];
for (let i = -10; i < -10 + N; i++) {
    n.push(i);
}
//console.table(probes);

//random normalized frequencies values
export let normalizedFrequencies=[];

export function roundNumberTwoDigits(x)
{
  return Math.round(x*1e2)/1e2;
}

for(let i=-3; i<=3; i+=0.01)  
{
  normalizedFrequencies.push(roundNumberTwoDigits(i));

}
//for (element of normalizedFrequencies)
//{ 
//  console.log(element);
//  console.log(typeof(element));
//}
//calculate DFT slowly

export function simpleDFT(normalizedFrequencies)
{

  let X=[];
  for (let k=0; k<normalizedFrequencies.length; k++)
  {
    let sum={real:0, imag:0};
    for (let m=0; m<N; m++)
    {
      let angle=-2*Math.PI*normalizedFrequencies[k]*n[m];
      sum.real+=probes[m]*Math.cos(angle);
      sum.imag+=probes[m]*Math.sin(angle);
    }
    X.push(sum);
  }
  return X;
}
//export default N;
//console.log(simpleDFT(normalizedFrequencies));
//console.log("testchuj");
//window.alert("chuj");
//console.log("innytest");

console.log(n);

export function simpleDCT(probes)
{
  const N=probes.length;
  const X=[];
  for (let k=0; k<N; k++)
  {
    let sum=0;
    for(let n=0; n<N; n++)
    {
      const angle=(Math.PI * k * (2 * n + 1))/(2*N);
      sum+=probes[n] * Math.cos(angle);
    }
    X.push(sum);
  }
  return X;
}



