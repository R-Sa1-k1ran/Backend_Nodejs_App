const firmController = require('../controllers/firmController.js');

const verifyToken = require('../middlewares/verifyToken.js')
const express = require('express');
const router = express.Router();

router.post('/add-firm', verifyToken.verifyToken, firmController.addFirm )

router.get('/uploads/:imageName',(req,res)=>{
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, "..", 'uploads', imageName))
})

router.delete('/:firmId',firmController.deleteFirmById)

module.exports = router