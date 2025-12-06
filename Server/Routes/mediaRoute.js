import express from 'express';
import upload from '../Utils/multer.js'
import { uploadMedia } from '../Utils/cloudinary.js';

const router = express.Router();

router.post('/upload-video', upload.single('file'), async (req, res) => {
    try {
        const result = await uploadMedia(req.file.path);
        return res.status(200).json({
            success: true,
            message: "Media uploaded successfully",
            data:result
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error from uploadMedia endpoint mediaRoute"
        })
    }
})

export default router;