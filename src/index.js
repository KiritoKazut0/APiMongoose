import app from "./app";
import './database'
const Port = 4000;

app.listen(Port, ()=>{
    console.log ("On Port : "+ Port);
});
