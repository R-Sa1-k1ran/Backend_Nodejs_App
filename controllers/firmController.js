const Firm = require("../models/Firm")
const Vendor = require('../models/Vendor')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g. 123456789.jpg
  }
});
const upload = multer({ storage: storage });


const addFirm = async (req,res)=>{
  try{
  const{firmName,area,category,region,offer} =req.body;
  const image = req.file? req.file.filename:undefined
  
    const vendor = await Vendor.findById(req.vendorId)
    if(!vendor){
      console.log("error there")
      res.status(401).json({error:"vendor not found"})
    }

  const firm = new Firm({
    firmName,
    area,
    category,
    region,
    offer,
    image,
    vendor:vendor._id
  })
  const savedFirm = await firm.save();

  vendor.firm.push(savedFirm)
  await vendor.save()

  return res.status(200).json({message:"Firm added successfully"})
    
  } catch (error) {
    console.error(error);
    res.status(404).json({error:"Internal server error"})
  }
}


const deleteFirmById = async(req,res)=>{
  try {
    const deleteFirm = req.params.deleteFirm;
    const deletedFirm = await Firm.findByIdAndDelete(deleteFirm);
    if(!deletedFirm){
      return res.status(404).json({error:"firm not found"})
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({error:"Internal server errror"})
  }
}


module.exports = {addFirm:[upload.single('image'),addFirm], deleteFirmById}