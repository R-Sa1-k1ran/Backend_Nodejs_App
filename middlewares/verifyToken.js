// only the actual vendor has to control the firm, so creating a middleware that only allow respedted vendor. this can be acheived by using the vendor token.

const Vendor = require('../models/Vendor.js');
const jwt = require('jsonwebtoken');

const verifyToken = async (req,res,next)=>{
  const token = req.headers.token;
  if(!token){
    return res.status(401).json({error:"token is required"})
  }
  try {
    const decoded = jwt.verify(token,process.env.jwt_secret)
    const vendor = await Vendor.findById(decoded.vendorId)
    if(!vendor){
      return res.status(401).json({error:"vendor not found"})
    }
    
    req.vendorId = vendor._id;
    next();

  } catch (error) {
    console.error(error);
    return res.status(402).json({error:"Invalid token"})
  }
}

module.exports = {verifyToken}