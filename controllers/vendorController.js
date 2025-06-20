const Vendor = require("../models/Vendor.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const vendorRegister = async(req,res)=>{
  const{username,email,password} = req.body;
  if(!username || !email || !password){
    return res.status(400).json({message:"All fields (username,email,password) are required"})
  }
  try{
    const vendorExists= await Vendor.findOne({email});
    if(vendorExists){
      return res.status(400).json("email already exits")
    }
  let salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password,salt);

  const newVendor = new Vendor({
    username,
    email,
    password:hashedPassword,
  })
  await newVendor.save();
  console.log(`vendor registered successfully`)
  return res.status(201).json({message:"vendor register successfully."});
  
}catch(error){
  console.error("Error during vendor registration:", error)
  res.status(500).json({error:"An unexpected error occurred during registration. Please try again later."});
}}


//  LOGIN FUNCTION
const vendorLogin = async(req,res)=>{
  const {email,password}= req.body;
  if(!email || !password){
    return res.status(400).json({message:"email and password are required."})
  }
  try{
     const vendor = await Vendor.findOne({email})
     if(vendor){
     const match = await bcrypt.compare(password,vendor.password)
     if(match){

      // token generation
      const token = jwt.sign({vendorId:vendor._id},process.env.jwt_secret,{expiresIn:'1hr'});
      return res.status(200).json({message:"login successfull",token: token})
     }
     else{
      return res.status(401).json({message:"Password is incorrect"})
     }
     }else{
      return res.status(401).json({message:"please register before login"})
     }

  }catch(error){
    console.error("error occured while login");
    res.status(500).json({message:"error occured while login"})
  }
}

const getAllVendors = async(req,res)=>{
  try {
    const vendors = await Vendor.find().populate('firm')
    res.json({vendors})
  } catch (error) {
    console.log(error);
    res.status(400).json({error:"internal server error"})
  }
}


const getVendorById = async (req,res)=>{
  const vendorId = req.params.id;
  try {
    const vendor = await Vendor.findById(vendorId).populate('firm')
    if(!vendor){
      return res.status(400).json({error:"vendor not found"})
    }
    res.status(200).json({vendor})
  } catch (error) {
    console.log(error);
    res.status(400).json({error:"Internal server error"})
  }
}

module.exports = {vendorRegister,vendorLogin, getAllVendors, getVendorById}