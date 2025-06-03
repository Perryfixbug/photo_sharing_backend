const expres = require('express');
const Comment = require('../db/commentModel');
const Photo = require('../db/photoModel');
const router = expres.Router();

router.post("/", async (req, res) => {
    const { user_id, photo_id, comment } = req.body;
    try {
        const date_time = new Date();
        const newComment = new Comment({ user_id, comment });
        
        const photo  = await Photo.findById(photo_id);
        if (!photo) {
            return res.status(404).json({ message: "Photo not found!" });
        }
        photo.comments.push(newComment);
        await photo.save();
        await newComment.save();

        const populatedComment = await Comment.findById(newComment._id).populate("user_id");

        res.status(201).json(populatedComment);
    } catch (e) {
        res.status(400).json({ message: "Error adding comment", error: e.message });
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { photo_id } = req.body;
    try {
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found!" });
        }
        const photo = await Photo.findById(photo_id);
        if (!photo) {
            return res.status(404).json({ message: "Photo not found!" });
        }
        photo.comments = photo.comments.filter(comment => comment._id !== id);
        await photo.save();

        res.status(200).json({ message: "Comment deleted successfully!" });
    } catch (e) {
        res.status(400).json({ message: "Error deleting comment", error: e.message });
    }
})

module.exports = router;