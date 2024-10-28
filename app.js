const express = require('express');
const app = express();

app.get('*',(req,res)=>{
    res.send("Hello u are here at swipe2clean mern project!!")
})
app.listen(8000,()=>{
    console.log("listening at 8000 port!!")
})