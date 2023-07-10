const cloudinary = require("cloudinary").v2;

// aqui se realiza la conexion debes poner tus datos si tienes ya una cuenta
cloudinary.config({
  cloud_name: "armex",
  api_key: "137832638542119",
  api_secret: "Y86AXb2mF2XeMSEyM6PEeRKEV5g",
});

// con esta funcion subimos archivos a cloudinary
async function uploadImageProducts(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "Products",
      // Agrega otras propiedades de la foto aquí
    });
    return result
  } catch (error) {    
    console.error(error.message);
  
  }
}

async function uploadImageChofers(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "Chofers",
      // Agrega otras propiedades de la foto aquí
    });
    return result
  } catch (error) {    
    console.error(error.message);
  
  }
}

async function uploadImageClientTax(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "Client Taxes",
      // Agrega otras propiedades de la foto aquí
    });
    return result
  } catch (error) {    
    console.error(error.message);
  
  }
}

async function uploadImagePayments(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "Payments",
      // Agrega otras propiedades de la foto aquí
    });
    return result
  } catch (error) {    
    console.error(error.message);
  
  }
}

// para borrar imagenes requerimos el publicID en el modelo user se encuentra como imagePublicId este
//es el que debemos usar para borrarla una vez borrada usamos uploadImage para cargar la nueva
async function deleteImage(publicId) {
  await cloudinary.uploader.destroy(publicId);
}

//con esta funcion se obtienen todas las imagenes que estan en cloudinary
async function searchAllImages() {
  const searchResult = await cloudinary.search
    .expression("resource_type:image") // si quisieramos podriamos buscarlo por folder con folder:nombre de la carpeta
    .sort_by("public_id", "desc")
    .execute();
  return searchResult;
}

async function searchFilterImages(folderName) {
  const searchFilterResult = await cloudinary.search
    .expression(`folder: ${folderName}`) // si quisieramos podriamos buscarlo por folder con folder:nombre de la carpeta
    .sort_by("public_id", "desc")
    .execute();
  return searchFilterResult;
}


module.exports = {
  cloudinary,
  uploadImageProducts,
  deleteImage,
  searchAllImages,
  searchFilterImages,
  uploadImageChofers,
  uploadImageClientTax,
  uploadImagePayments
};
