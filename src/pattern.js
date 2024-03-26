
class Model{
  constructor(){
    this.heading = "Hello";
  }

}

export { Model };

class View{

  //encapsulate DOM selectors
  constructor(controller){
    this.controller = controller;
    this.heading = document.getElementById("heading");
    this.heading.innerText = controller.modelHeading;
    this.heading.addEventListener("click",controller);
  }

}
export { View };

class Controller{
  /*controller provides strategy, view is concerned only
  with visual aspects of application, and delegates to the controller
    any decisions about interface behavior*/

  constructor(model){
    this.model = model;
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
