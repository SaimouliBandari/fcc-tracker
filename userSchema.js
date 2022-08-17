const mongoose = require('mongoose');

const excercise = {
    description : {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: String}
}

const UserSchema = mongoose.Schema({
    username : {type: String, required: true},
    excercise : [excercise]
})

module.exports={
    UserSchema : UserSchema,
    excercise : excercise
}