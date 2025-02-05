const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { 
    registerUser, 
    LoginUser, 
    Logout, 
    ForgotPassword, 
    ResetPassword, 
    Profile, 
    updatePassword, 
    UpdateProfile,
    AllUsers, 
    getUserDetails, 
    deleteUser, 
    updateUser, 
    getRegisteredUsersCount,
     
} = require('../controllers/userController');
const { isAuthenticatedUser, isAuthorized } = require('../middleware/auth');

router.post('/register', upload.single("avatar"), registerUser);
router.post('/login', LoginUser);
router.get('/profile', isAuthenticatedUser, Profile);
router.get('/logout', Logout);

router.get("/stats/registeredUsersCount", getRegisteredUsersCount);

router.post('/password/forgot', ForgotPassword);
router.put('/password/reset/:token', ResetPassword);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.put('/profile/update', upload.single("avatar"), isAuthenticatedUser, UpdateProfile)

router.get('/admin/users', isAuthenticatedUser, isAuthorized("admin"), AllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser, isAuthorized("admin"), getUserDetails).delete(isAuthenticatedUser,isAuthorized("admin"), deleteUser).put(isAuthenticatedUser,isAuthorized("admin"), updateUser)

// router.put('/profile/update', UpdateProfile);



module.exports = router;