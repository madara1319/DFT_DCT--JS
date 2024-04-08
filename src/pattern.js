import * as dftFile from '../DFT_DCT--JS.js';
//abstract transformation Class
class Transformation{
  constructor(){
    if(new.target === Transformation){
      throw new TypeError('Cannot create instance of abstract class');
    }
  }

  calculate(data){
    throw new Error('Calculate method must be implemented');
  }
}

class DFT extends Transformation{
  calculate(data){

    //DFT
  }
}

class DCT extends Transformation{
  calculate(data){
    
    //DCT
  }
}

class DCT2D extends Transformation{
  calculate(data){
    //DCT
  }
}

class DFT2D extends Transformation{
  calculate(data){
    //DCT
  }
}
class Model{
  //generateSignal
  /*sine,square,triangle etc*/
  
  //loadSignal
  /*from external sources*/

  //saveSignal

  //filterSignal

  //addNoise

  //analyzeSignal

  //interPolateSignal

  //exportTransform

  //calculateMetrics

  //visualizeSpectrum

  //CalculateDFT

  //CalculateDCT

  //CalculateDFT2D

  //CalculateDCT2D

  //CalculateIDFT

  //CalculateIDCT

  //CalculateIDFT2D

  //CalculateIDCT2D

  //moveInTimeDomain

  //spinProbes

  //scaleSignalV

  constructor(){
    //transformation object
    this.transformer = null;
    this.heading = "Hello";
  }

  setTransformation(transformationType){
    if(transformationType === 'DFT'){
      this.transformer = new DFT();
    }
    else if(transformationType === 'DCT'){
      this.transformer = new DCT();
    }
  }

  processSignal(signalData){
    if(!this.transformer){
      throw new Error('No defined transformation');
    }
    return this.transformer.calculate(signalData);
  }

}

export { Model };

class View{

  //DFTView

  //DCTView

  //DFT2DView

  //DCT2DView

  //encapsulate DOM selectors
  constructor(controller){
    //this.controller = null;
    this.controller = controller;
    this.heading = document.getElementById("heading");
    this.heading.innerText = controller.modelHeading;
    this.heading.addEventListener("click",controller);
    //-----------------------------------------------
    this.button = document.getElementById('processButton');
    this.button.innerText="TRANsFORM";
    this.button.addEventListener('click',this.handleButtonClick.bind(this));

  }

  handleButtonClick(event){
    event.preventDefault();

    const signalData = this.getSignalData();

    this.controller.InitiateSingalProcessing(signalData);
  }

  getSignalData(){
    //get signal from UI
  }

  setController(controller){
    this.controller = controller;
  }

  displaySingalProcessingOptions(){
    //show transform type UI 
  }

  displaySingalResults(result){
    //show results
  }

}
export { View };

class Controller{
  /*controller provides strategy, view is concerned only
  with visual aspects of application, and delegates to the controller
    any decisions about interface behavior*/

  //InitiateSingalProcessing 
  /*launch processing after click*/

  //HandleSingalModification

  //UpdateSignal

  //UpdateView

  //ExportData

  //ImportData




  constructor(model,view){
    this.model = model;
    this.view = view;
  }

  initateSignalProcessing(transformationType, signalData){
    this.model.setTransformation(transformationType);
    const result = this.model.processSignal(signalData);
    this.view.displaySingalResults(result);
  }

  //EVENTLISTENER INTERFACE
  handleEvent(e){
    e.stopPropagation();
    switch(e.type){
      case "click":
        this.clickHandler(e.target);
        break;
      default:
        console.log(e.target);
    }
  }

  get modelHeading(){
    return this.model.heading;
  }

  //CHANGE THE MODEL
  clickHandler(target){
    this.model.heading = "World";
    target.innerText = this.modelHeading;
  }

}

export { Controller };
