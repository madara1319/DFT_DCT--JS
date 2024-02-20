//need to use webpack to bundle the modules together
//random N element array
//random values of probes
export const N = 32;
let probes = [];
for (let i = 0; i < N; i++) {
    probes.push(Math.random());
}
let n = [];
for (let i = -10; i < -10 + N; i++) {
    n.push(i);
}
//console.table(probes);

//random normalized frequencies values
let normalizedFrequencies=[];

function roundNumberTwoDigits(x)
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
//export default N;
//console.log(X);
console.log("testchuj");
window.alert("chuj");
console.log("innytest");
//--------------------------------------------
//const ctx=document.getElementById('myChart');
//new Chart(ctx,{
//  type:'bar',
//  data:{
//    labels:['red','blue','green','purple','orange'],
//    datasets:[{
//      label:'# of votes',
//      data:[12,19,3,5,2,3],
//      borderWidth:1
//    }]
//  },
//  options:{
//    scales:{
//      y:{
//        beginAtZero:true
//      }
//    }
//  }
//});





