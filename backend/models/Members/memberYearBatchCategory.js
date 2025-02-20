const mongoose = require('mongoose');

const memberYearBatchCategorySchema = new mongoose.Schema({
    yearRange: {
        startYear: {
            type: Number,
            required: [true, 'Start year is required'],
            min: [1900, 'Start year must be greater than 1900']
        },
        endYear: {
            type: Number,
            required: [true, 'End year is required'],
            min: [1900, 'End year must be greater than 1900'],
            validate: {
                validator: function (value) {
                    const startYear = this.yearRange?.startYear || 0;
                    return value > startYear;
                },
                message: 'End year must be greater than start year'
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

memberYearBatchCategorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('memberYearBatchCategory', memberYearBatchCategorySchema);
