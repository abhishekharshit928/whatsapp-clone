import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "whatsapp-clone",
    resource_type: "auto",
    allowed_formats: [
      "jpg", "jpeg", "png", "webp",
      "mp4", "mov", "avi", "mkv", "webm",
    ],
  },
});

const upload = multer({ storage });

export default upload;