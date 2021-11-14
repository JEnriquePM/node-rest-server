const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const { response } = require("express");
const { uploadFile: uploadFileHelper } = require('../helpers');

const {User, Product} = require('../models')

const uploadFile = async (req, res = response) => {
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    // const validExtensions = ['txt', 'md'];
    try {
      const name = await uploadFileHelper(req.files, validExtensions, 'imgs');
      res.json({ name });
    } catch(err) {
      res.status(400).json({err});
    }
}

const updateUserImage = async (req, res = response) => {
  const {id, colection} = req.params;

  let model;

  switch (colection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `User with id ${id} do not exists`
        });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Product with id ${id} do not exists`
        });
      }
      break;

    default:
      return res.status(500).json({msg: 'Not validated'});
  }

  // Delete previous img
  if (model.img) {
    // Delete server img
    const pathImg = path.join(__dirname, '../uploads', colection, model.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  const name = await uploadFileHelper(req.files, validExtensions, colection);
  model.img = name;

  await model.save();

  res.json({ model });
}

const getImage = async (req, res = response) => {
  const {id, colection} = req.params;

  let model;

  switch (colection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `User with id ${id} do not exists`
        });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Product with id ${id} do not exists`
        });
      }
      break;

    default:
      return res.status(500).json({msg: 'Not validated'});
  }

  // Delete previous img
  if (model.img) {
    // Delete server img
    const pathImg = path.join(__dirname, '../uploads', colection, model.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  const pathPlaceholder = path.join(__dirname, '../assets', 'no-image.jpg');
  res.sendFile(pathPlaceholder);
}

const updateImageCloudinary = async (req, res = response) => {
  const {id, colection} = req.params;

  let model;

  switch (colection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `User with id ${id} do not exists`
        });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Product with id ${id} do not exists`
        });
      }
      break;

    default:
      return res.status(500).json({msg: 'Not validated'});
  }

  // Delete previous img
  if (model.img) {
    // Delete server img
    const nameArray = model.img.split('/');
    const name = nameArray[nameArray.length -1];
    const [public_id] = name.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;
  try {
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    model.img = secure_url;

    await model.save();

    res.json({ model });
  } catch (error) {
    console.log('cagaste cloudinary');
    console.log(error);
  }
}

module.exports = {
    uploadFile,
    updateUserImage,
    getImage,
    updateImageCloudinary
}