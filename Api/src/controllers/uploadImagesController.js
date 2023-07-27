const multer = require('multer');
const uuid = require('uuid');
const sharp = require('sharp');
const fs = require('fs');

const storageProduct = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/imagesProducts');
    },
    filename: function (req, file, cb) {
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFilename = uuid.v4();
      cb(null, `${uniqueFilename}.${fileExtension}`);
    }
  });
    
const uploadImageProduct = multer({ storage: storageProduct })


const storageClient = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/imagesClients');
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = uuid.v4();
    cb(null, `${uniqueFilename}.${fileExtension}`);
  }
});
  
const uploadImageClient = multer({ storage: storageClient })


const storageSales = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/imagesSales');
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = uuid.v4();
    cb(null, `${uniqueFilename}.${fileExtension}`);
  }
});
  
const uploadImageSales = multer({ storage: storageSales })


const storageChofer = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/imagesChofer');
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = uuid.v4();
    cb(null, `${uniqueFilename}.${fileExtension}`);
  }
});
  
const uploadImageChofer = multer({ storage: storageChofer })



function imageToHexMatrix(imagePath) {
  return new Promise((resolve, reject) => {
    sharp(imagePath)
      .greyscale() 
      .resize(200, 100) 
      .raw() 
      .toBuffer((err, buffer, { width, height }) => {
        if (err) {
          reject(err);
        } else {
          // Convertir cada valor de píxel a hexadecimal y concatenar en una cadena
          let hexMatrix = '';
          for (let i = 0; i < buffer.length; i++) {
            const hexValue = buffer[i].toString(16).padStart(2, '0');
            hexMatrix += hexValue;
          }
          resolve({ width, height, hexMatrix });
        }
      });
  });
}


module.exports = {
  uploadImageProduct,
  uploadImageClient,
  uploadImageSales,
  uploadImageChofer,
  imageToHexMatrix
} 