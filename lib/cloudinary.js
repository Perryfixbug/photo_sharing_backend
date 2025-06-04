const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

//Cấu hình Cloudinary
cloudinary.config({
    cloud_name: "djzmxvnvw",
    api_key: "694317145653989",
    api_secret: "h9CPDzVwnxvjPY2T36zV-9_RI-Q"
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
          folder: 'photo_sharing',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'jfif'],
          transformation: [{ width: 800, height: 800, crop: 'limit' }],
        };
    },
})

const remove = async (url)=>{
    try {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];            // abc123.jpg
        const folder = parts[parts.length - 2];              // uploads
        const publicId = `${folder}/${filename.split('.')[0]}`; // uploads/abc123
        
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Cant remove image from cloudinary");
      }
}

const upload = multer({storage: storage})
module.exports = {
    upload, 
    remove
}