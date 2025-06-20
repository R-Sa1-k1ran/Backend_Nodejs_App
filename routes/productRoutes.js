const express = require('express');
const router = express.Router()
const productController = require('../controllers/productController')

router.post('/add-product/:firmId',productController.addProduct)

router.get('/:firmId/products',productController.getProductById)

router.get('/uploads/:imageName',(req,res)=>{
  const imageName = req.params.imageName;
  res.sendFile(path.join('_dirname','..','uploads',imageName))
})

router.delete('/:productId',productController.deleteProductById)

module.exports = router