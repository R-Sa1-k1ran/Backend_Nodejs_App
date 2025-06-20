const express=require('express');
const dotEnv=require('dotenv');
const mongoose=require('mongoose');
const vendorRoutes = require("./routes/vendorRoutes.js")
const firmRoutes = require('./routes/firmRoutes.js')
const productRoutes = require('./routes/productRoutes.js')
const app=express()
dotEnv.config();
const path = require('path')


app.use(express.json());
app.use(express.urlencoded({extended:true}))


mongoose.connect(process.env.mongodb_url)
.then(()=>console.log("database is connected successfully"))
.catch(()=>console.log("error occured on database connection"))

app.get('/home',(req,res)=>{
  res.send(`<h1>hello tomato </h1>`)
})

app.use('/vendor',vendorRoutes)
app.use('/firm',firmRoutes)
app.use('/product',productRoutes)
app.use('/uploads',express.static('uploads'));

app.listen(process.env.PORT,()=>{
  console.log(`seerver started and running successfully`)
})