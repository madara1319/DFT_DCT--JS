import {ReverseTransformation} from './ReverseTransformation.js'

class ReverseDFT extends ReverseTransformation{
 constructor(signal){
   super(signal)
 } 
 reverseTransform(){
   console.log("reverse dft")
 } 
}