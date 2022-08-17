const mongoose = require('mongoose');
require('dotenv').config();
const connection =  mongoose.connect(process.env.MONGO_URL, (err) =>{
    if(err) console.log("error occured while connecting to the database...");
    else console.log("successfully connceted to the database....");
});

module.exports = {
    connection : connection
}
