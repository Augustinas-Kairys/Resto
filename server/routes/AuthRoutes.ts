import { Router } from 'express';
import upload from '../config/multer';

import {
    registerUser, loginUser, getUserInfo, updateUserProfilePicture, deleteProfilePicture,adminCreateUser 
} from '../controllers/authController'; 


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/create-user', adminCreateUser);
router.get('/user-info', getUserInfo);
router.post('/upload-profile-picture/:userId', upload.single('file'), updateUserProfilePicture);
router.delete('/delete-profile-picture/:userId', deleteProfilePicture); 

export default router;
