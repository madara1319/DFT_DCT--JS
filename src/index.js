//main js file
import { Model } from './Model.js'
import { Controller } from './Controller.js'
import { View } from './View.js'

document.addEventListener('DOMContentLoaded', () => {
  const model = new Model()
  const view = new View()
  const controller = new Controller(view, model)

})
