//import { Controller } from './pattern.js';
//import { View } from './pattern.js';
//import { Model } from './pattern.js';
//import * as dftFile from '../DFT_DCT--JS.js';


  import { Controller } from './Controller.js';
import { View } from './View.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('jestm przed');
  const view = new View();
  const controller = new Controller(view);
  console.log("jestm po funkcjach");
});
