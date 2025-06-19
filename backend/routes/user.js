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
    getUsersByMinistryCategory,
    getUsersGroupedByMinistryCategory,
    getUserMinistries,
    getUserFormCounts,
    getMemberStatuses,
    updateMemberDirectoryUser,
    getMemberDirectoryUser,
    sendOtp,
    verifyOtp
    
} = require('../controllers/userController');
const { isAuthenticatedUser, isAuthorized } = require('../middleware/auth');

router.post('/register',
     upload.single("avatar"),
      registerUser);
router.post('/login', LoginUser);
router.get('/profile', isAuthenticatedUser, Profile);
router.get('/logout', Logout);

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);

router.get("/stats/registeredUsersCount", getRegisteredUsersCount);

router.post('/password/forgot', ForgotPassword);
router.put('/password/reset/:token', ResetPassword);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.put('/profile/update', upload.single("avatar"), isAuthenticatedUser, UpdateProfile)
router.put('/updateMemberDirectoryUser/:userId', updateMemberDirectoryUser);

router.get('/admin/users', isAuthenticatedUser, isAuthorized("admin"), AllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser, isAuthorized("admin"), getUserDetails).delete(isAuthenticatedUser,isAuthorized("admin"), deleteUser).put(isAuthenticatedUser,isAuthorized("admin"), updateUser)

router.get("/userMinistries", isAuthenticatedUser, getUserMinistries);
router.get('/:ministryCategoryId/getUsers', getUsersByMinistryCategory);
router.get('/getMemberDirectoryUser/:userId', getMemberDirectoryUser);
router.get('/admin/getUsersGroupedByMinistryCategory', isAuthenticatedUser, isAuthorized("admin"), getUsersGroupedByMinistryCategory)

router.get('/getMemberStatuses', getMemberStatuses);

router.get("/formCounts/user", isAuthenticatedUser, getUserFormCounts);
// router.put('/profile/update', UpdateProfile);

module.exports = router;