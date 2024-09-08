import { Router } from 'express';
import upload from '../config/multer';

import {
    registerUser, loginUser, getUserInfo, updateUserProfilePicture, deleteProfilePicture,adminCreateUser,completeRegistration, isAdmin, getAllUsers,updateUser,getUserById,forgotPassword,resetPassword
} from '../controllers/authController'; 


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/create-user', isAdmin, adminCreateUser);
router.get('/users', isAdmin, getAllUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId', isAdmin, updateUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/user-info', getUserInfo);
router.post('/upload-profile-picture/:userId', upload.single('file'), updateUserProfilePicture);
router.delete('/delete-profile-picture/:userId', deleteProfilePicture); 
router.post('/registernew', completeRegistration);

export default router;
