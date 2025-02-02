const MemberHistory = require('../../models/Members/members');
const { cloudinary } = require('../../config/cloudinary');
const MinistryCategory = require('../../models/ministryCategory');
const MemberYearBatchCategory = require('../../models/Members/memberYearBatchCategory');
// const upload = require('../config/cloudinary');
// const cloudinary = require('cloudinary').v2;  

exports.createMemberHistory = async (req, res) => {
    try {
        const { firstName, middleName, lastName, age, birthday, address, position, memberYearBatch, ministryCategory } = req.body;
        if (!firstName || !lastName || !age || !birthday || !position || !memberYearBatch || !ministryCategory) {
            return res.status(400).json({ error: 'All required fields must be provided.' });
        }

        let image = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'MemberHistory_Images',
            });
            image = result.secure_url;
        }

        const newMember = new MemberHistory({
            firstName,
            middleName,
            lastName,
            age,
            birthday,
            address: JSON.parse(address), 
            position,
            memberYearBatch,
            ministryCategory,
            image,
        });

        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        console.error('Error creating member history:', error);
        res.status(500).json({ error: 'Server error.', details: error.message });
    }
};


exports.getMembers = async (req, res) => {
    try {
        const members = await MemberHistory.find()
            .populate('memberYearBatch', 'name yearRange') 
            .populate('ministryCategory', 'name'); 

        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching member histories.', details: error.message });
    }
};
exports.updateMemberHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = { ...req.body };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'MemberHistory_Images',
            });
            updatedData.image = result.secure_url;
        }

        const updatedMember = await MemberHistory.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedMember) {
            return res.status(404).json({ error: 'Member not found.' });
        }

        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(500).json({ error: 'Error updating member history.', details: error.message });
    }
};

exports.deleteMemberHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMember = await MemberHistory.findByIdAndDelete(id);

        if (!deletedMember) {
            return res.status(404).json({ error: 'Member not found.' });
        }

        res.status(200).json({ message: 'Member deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting member history.', details: error.message });
    }
};

exports.getMemberById = async (req, res) => {
    try {
        const member = await MemberHistory.findById(req.params.id)
            .populate('memberYearBatch', 'name yearRange')
            .populate('ministryCategory', 'name'); 

        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching member details', details: error.message });
    }
};


exports.getMembersCountByBatch = async (req, res) => {
    try {
        const membersCountByBatch = await MemberYearBatchCategory.aggregate([
            {
                $lookup: {
                    from: "members", 
                    localField: "_id", 
                    foreignField: "memberYearBatch", 
                    as: "members", 
                },
            },
            {
                $project: {
                    batchName: "$name", 
                    count: { $size: "$members" }, 
                },
            },
        ]);

        res.status(200).json(membersCountByBatch);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching members count by batch.",
            error: error.message,
        });
    }
};


