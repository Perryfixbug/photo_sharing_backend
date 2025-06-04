const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const {upload, remove} = require("../lib/cloudinary"); 

router.get("/", async (request, response) => {
    try{
        const photos = await Photo.aggregate([
        {
            $addFields: {
            commentCount: { $size: { $ifNull: ["$comments", []] } }
            }
        },
        {
            $sort: {
            commentCount: -1,    // nhiều comment trước
            date_time: -1        // nếu bằng nhau, bài mới hơn trước
            }
        }
        ]);
        const populatedPhotos = await Photo.populate(photos, [
            { path: 'user_id', select: '_id first_name last_name' },
            { path: 'comments.user_id', select: '_id first_name last_name' }
        ]);
        response.status(200).json(populatedPhotos);
    }catch(e){
        response.status(400).json({message: "Something went wrong!"});
    }
})

router.get("/:id", async (request, response) => {
    try{
        const {id} = request.params;
        const photo = await Photo.find({user_id: id}).populate({
            path: "comments.user_id",
            select: "_id first_name last_name"
        }).sort({date_time: -1});
        response.status(200).json(photo);
    }catch(e){
        response.status(400).json({message: "Photo not found!"})
    }
});

//upload vào cloudinary
router.post("/", upload.single("image"), async (request, response) => {
    try{
        const {user_id} = request.body;

        if(!request.file) {
            return response.status(400).json({ message: "Image file is required!" });
        }
        const url = request.file.path;
        const newPhoto = new Photo({
            user_id,
            url: url,
            date_time: new Date()
        });
        await newPhoto.save();

        response.status(201).json(newPhoto);
    }catch(e){
        response.status(400).json({message: "Something went wrong!"});
    }
});

router.delete("/:id", async (request, response)=>{
    try{
        const photo_id = request.params.id;
        const photo = await Photo.findById(photo_id);
        
        if (!photo) {
            return response.status(404).json({ message: "Photo not found" });
        }

        await remove(photo.id);

        await photo.deleteOne();

        res.json({ message: "Photo deleted successfully" });
        
    }catch(e){
        response.status(400).json({message: "Something went wrong!"});
    }
})

module.exports = router;
