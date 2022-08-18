const userSchema = require('./userSchema');
const mongoose = require('mongoose');
const assert = require('assert/strict');
//let errorArray = new Array();
module.exports.excerciseValidation = function excerciseValidation(document){
    const Tracker = mongoose.model('Tracker',userSchema.UserSchema);
    const check = new Tracker({
        username : document.username,
        excercise : [
            {
                description : document.description ,
                duration:  document.duration,
                date: document.date
            }
        ]
    });

    let error = check.validateSync();
    assert.equal(error.errors['description'].message, 'Path `description` is required.');
    assert.equal(error.errors['duration', 'Path `duration` is required']);
}

module.exports.checkDate = function checkDate(testdate){
    var date_regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/ ;
    return date_regex.test(testdate);
}

