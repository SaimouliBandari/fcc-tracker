const mongoose = require('mongoose');

const excercise = {
    
    description : {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: String, required: true}
}

const UserSchema = mongoose.Schema({
    username : {type: String, required: true},
    excercise : [{
        _id : false,
        description : {type: String, required: true},
        duration: {type: Number, required: true},
        date: {type: String, required: true}
    }]
})

module.exports={
    UserSchema : UserSchema,
    excercise : excercise
}