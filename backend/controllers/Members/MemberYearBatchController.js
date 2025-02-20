const MemberYearBatchCategory = require('../../models/Members/memberYearBatchCategory')

// exports.createCategory = async (req, res) => {
//     try {
//         const { name, startYear, endYear } = req.body;

//         if (!name || !startYear || !endYear) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         const newCategory = new MemberYearBatchCategory({
//             name,
//             yearRange: { startYear, endYear }
//         });

//         const savedCategory = await newCategory.save();
//         res.status(201).json({ message: 'Category created successfully.', data: savedCategory });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error.', error: error.message });
//     }
// };


exports.createCategory = async (req, res) => {
    try {
        const {  yearRange } = req.body;
        const { startYear, endYear } = yearRange || {};

        if ( !startYear || !endYear) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newCategory = new MemberYearBatchCategory({
            
            yearRange: { startYear, endYear }
        });

        const savedCategory = await newCategory.save();
        res.status(201).json({ message: 'Category created successfully.', data: savedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


exports.getAllCategories = async (req, res) => {
    try {
        const categories = await MemberYearBatchCategory.find();
        console.log(categories);  
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


exports.getCategoryById = async (req, res) => {
    try {
        const category = await MemberYearBatchCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.status(200).json({ data: category });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, yearRange } = req.body;

        const category = await MemberYearBatchCategory.findById(req.params.memberYearId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        const updatedData = {
            name: name || category.name, 
            yearRange: {
                startYear: yearRange?.startYear ?? category.yearRange.startYear,
                endYear: yearRange?.endYear ?? category.yearRange.endYear
            }
        };
        const updatedCategory = await MemberYearBatchCategory.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Category updated successfully.', data: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error.message);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};



exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await MemberYearBatchCategory.findByIdAndDelete(req.params.memberYearId);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.status(200).json({ message: 'Category deleted successfully.', data: deletedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
