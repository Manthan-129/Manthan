const express= require('express');
const {addProduct, listProduct, removeProduct, singleProductInfo} = require('../controllers/productController');
const {upload}= require('../middleware/multer.js');
const productRouter= express.Router();

productRouter.post('/add', upload.fields([{name: 'image1', maxCount: 1}, {name: 'image2', maxCount: 1},{name: 'image3', maxCount: 1},{name: 'image4', maxCount: 1}]), addProduct);
productRouter.get('/list', listProduct);
productRouter.delete('/remove', removeProduct);
productRouter.get('/single', singleProductInfo);

module.exports= productRouter;