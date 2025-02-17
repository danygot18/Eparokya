const express = require('express');
const router = express.Router();
const { upload } = require('../../config/cloudinary');
const membersController = require('../../controllers/Members/MembersController');

router.get('/getAllMembers', membersController.getMembers);
router.get('/count-by-batch', membersController.getMembersCountByBatch);

router.get('/getMemberById/:memberId', membersController.getMemberById);
router.post('/createMember', upload.single('image'), membersController.createMemberHistory);
router.put('/editMember/:memberId', upload.single('image'), membersController.updateMemberHistory);
router.delete('/deleteMember/:memberId', membersController.deleteMemberHistory);


module.exports = router;
