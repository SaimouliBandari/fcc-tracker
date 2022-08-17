const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const dbConnection = require('./dbConnection');
const mongoose  = require('mongoose');
const userSchema = require('./userSchema');

// basic app setup.....
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//connecting database using mongoose.......
dbConnection.connection;

// Creating a  modal from schema...
const Tracker = mongoose.model('Tracker',userSchema.UserSchema);

// request processing ......
app.post('/api/users', (request, response) =>{
  const {username} = request.body;
  
  const user = new Tracker({
    username: username
  });

  Tracker.find({username : username}, (err, doc) => {

    if(doc.length != 0 && username === doc[0].username){
      response.json({username: doc[0].username, id: doc[0].id});
    }else{
      user.save((err,doc) => {
        if(err) response.status(400).json({err});
        else response.json({username: username, _id: doc.id}); // 3rd testcase..
      })
    }

    //console.log(err + " -> " + doc.length);
    
  });
  
})

var excercise = {
  description : String ,
  duration:  Number,
  date: String
}


app.post('/api/users/:_id/exercises', (request, response) => {
       const id = request.params['_id'];
       excercise.description = request.body['description'];
       excercise.duration = request.body['duration'];
       console.log()
       if(request.body.date === ""){
        request.body.date = new Date();
        console.log(request.body.date);
       }else{
        request.body.date = new Date(request.body.date);
        console.log(request.body.date);
       }
      //  console.log(excercise );
      //  console.log(id);
      const date = (request.body['date']).toString().split(" ");
      excercise.date = (date[0] + " " + date[1] + " " +  date[2] + " " + date[3]);
      
      console.log(excercise.date);

       Tracker.findById(id, (err, document) => {
            if(err) console.log("error occured whiling finding");
            
            if(!err && document != null){
              // console.log(typeof doc.excercise);
              // console.log( doc.excercise.length);
              userSchema.excercise = excercise;
              Tracker.updateOne({_id: id}, {$push : {excercise : excercise}}, (err, doc) => {
                  if(err){
                    console.log("error while updating");
                    return;
                  }else{
                      response.json({
                                    username: document.username,  
                                    description: excercise.description,
                                    duration: excercise.duration,
                                    date: excercise.date, 
                                    _id : document._id
                                    }); // 8th testcase.....
                  }   
              });
            }
      });

})
// 6th testcase
app.get('/api/users',(req, res) =>{

  Tracker.find({},{"username" : 1, "_id" : 1, "__v" : 1}, (err, doc) =>{
      res.json(doc);
  })

});

//9th testcase......
app.get('/api/users/:_id/logs',(req, res) => {
    const id = req.params['_id'];

    Tracker.findById({_id: id}, (err, doc) =>{
        res.json({
          username : doc.username,
          count : doc.excercise.length,
          _id: doc.id,
          log : doc.excercise
        })
    })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
