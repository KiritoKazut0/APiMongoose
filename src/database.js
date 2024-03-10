import mongoose from "mongoose";

mongoose.connect("mongodb://Localhost/multiPrueba")
.then(db => console.log ('Db is connected'))
.catch(error => console.log(error))