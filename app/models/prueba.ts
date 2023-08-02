const { Schema, model } = require('mongoose')

const pruebaSchema = new Schema({
   token:{
    type: String,
    required: true 
   }
})

module.exports = model('prueba', pruebaSchema)