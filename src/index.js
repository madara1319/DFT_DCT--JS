import {test} from '../test.js';
import { Controller } from './pattern.js'; 
import { View } from './pattern.js'; 
import { Model } from './pattern.js'; 
import * as dftFile from '../DFT_DCT--JS.js';
//console.log(dftFile);
console.log("test");
console.log(dftFile.n);




function main(){
  const model = new Model();
  const controller = new Controller(model);
  const view = new View(controller);
}

main();
//try catch do ogarniecia
//try {
//chuj();
//} catch(e) {
//    alert("cos poszlo nie tak");
//    console.log(e);
//  }


document.addEventListener('DOMContentLoaded', function() {
    // Tworzenie wykresu za pomocą zaimportowanego modułu Chart.js
  const sineLabels=[];
  const sineData=[];
  for (let i=0; i<=2*Math.PI; i+=0.1)
  {
    sineLabels.push(i);
    sineData.push(Math.sin(i));
  }
  const sine=document.getElementById('mySine').getContext('2d');
  const mySine=new Chart(sine,{
   type: 'line',
      data: {
        labels: sineLabels,
        datasets: [{
          label: 'Sine Function',
          data: sineData,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'X'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Y'
            }
          }
        }
      }
  })

const sampleCtx=document.getElementById('sampleChart').getContext('2d');
  const sampleChart=new Chart(sampleCtx,{
    type: 'bar',
    data:{
      labels:dftFile.n,
      datasets:[{
        label:'Probes',
        data:dftFile.probes,
        backgroundColor:'rgba(255,99,132,0.2)',
        borderColor:'rgba(255,99,132,1)',
        borderWidth:1
      }]
    },
    options:{
      scales:{
        y:{
          beginAtZero:true
        }
      }
    }
  })
const transformData=dftFile.simpleDFT(dftFile.normalizedFrequencies);
  const transformCtx=document.getElementById('transformChart').getContext('2d');
  const transformChart=new Chart(transformCtx,{
    type:'line',
    data:{
      labels:dftFile.normalizedFrequencies,
      datasets:[{
        label:'Transformed Data',
        data:transformData.map(x=>Math.sqrt(x.real * x.real + x.imag * x.imag)),
        fill:false,
        borderColor:'rgb(75,192,192)',
        tension:0.1
      }]
    },
    options:{
      scales:{
        x:{
          title:{
            display:true,
            text:'Frequency'
          }
        },
        y:{
          title:{
            display:true,
            text:'Magnitude'
          }
        }
      }
    }
  })

});



const transformData=dftFile.simpleDCT(dftFile.normalizedFrequencies);
  const transformCtx=document.getElementById('dctTransformChart').getContext('2d');
  const transformChart=new Chart(transformCtx,{
    type:'line',
    data:{
      labels:dftFile.n,
      datasets:[{
        label:'Transformed Data',
        data:transformData,
        fill:false,
        borderColor:'rgb(75,192,192)',
        tension:0.1
      }]
    },
    options:{
      scales:{
        x:{
          title:{
            display:true,
            text:'Frequency'
          }
        },
        y:{
          title:{
            display:true,
            text:'Magnitude'
          }
        }
      }
    }
  });

console.log(dftFile.cosineProbes);

console.log("Just a check");
