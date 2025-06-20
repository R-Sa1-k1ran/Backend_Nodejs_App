
const Product = require('../models/Product.js')
const Firm = require('../models/Firm.js')
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

const addProduct = async (req,res)=>{
  try {
    const{productName,price,category,bestseller,description} = req.body;
    const image = req.file ? req.file.filename:undefined

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if(!firm){
      return res.status(401).json({error:"firm not found"})
    }

    const productExists = await Product.findOne({productName});
    if(productExists){
      res.status(400).json({error: "product already exist"})
    }
    const product = new Product({
      productName,
      price,
      category,
      bestseller,
      description,
      image,
      firm: firm._id
    })

    const savedProduct = await product.save()
    firm.product.push(savedProduct);

    await firm.save();
    console.log("new product added successfully")
    res.status(200).json(savedProduct)
    

  } catch (error) {
    console.error(error);
    res.status(401).json({error:"Internal server error"})

  }
}

const getProductById = async(req,res)=>{
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if(!firm){
      return res.status(404).json({error:"no firm found"})
    }
    
    const restaurentName = firm.firmName;
    const products = await Product.find({firm:firmId})

    res.status(200).json({restaurentName,products});

  } catch (error) {
    console.error(error);
    res.status(404).json({error:"Internal server error"})
  }
}


const deleteProductById = async(req,res)=>{
  try {
    const deleteId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(deleteId)
    if(!deletedProduct){
      return res.status(400).json({error:"product not found"})
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({error:"Internal server error"})
  }
}

module.exports = {addProduct:[upload.single('image'),addProduct], getProductById, deleteProductById}

