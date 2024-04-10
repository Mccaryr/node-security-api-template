const mongoose = require('mongoose');

const dogSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"],
        unique:false
    },
    breed: {
        type: String 
    },
    owner: {
        type: String
    },
    isMicrochipped: {
        type: Boolean
    },
    image: {
        type: String 
    }
})

module.exports = mongoose.model('Dog', dogSchema)