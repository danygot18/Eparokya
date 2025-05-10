// const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto')

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Please enter your name'],
//         maxLength: [30, 'Your name cannot exceed 30 characters']
//     },
//     email: {
//         type: String,
//         required: [true, 'Please enter your email'],
//         unique: true,
//         validate: [validator.isEmail, 'Please enter valid email address']
//     },
//     password: {
//         type: String,
//         required: [true, 'Please enter your password'],
//         minlength: [6, 'Your password must be longer than 6 characters'],
//         select: false
//     },
//     avatar: {
//         public_id: {
//             type: String,
//             required: true
//         },
//         url: {
//             type: String,
//             required: true 
//         }
//     },
//     isAdmin: {
//         type: Boolean,
//         default: false,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     resetPasswordToken: String,
//     resetPasswordExpire: Date
// })
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next()
//     }
//     this.password = await bcrypt.hash(this.password, 10)
// });

// userSchema.methods.getJwtToken = function () {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_TIME
//     });
// }

// userSchema.methods.comparePassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password)
// }

// userSchema.methods.getResetPasswordToken = function () {
//     // Generate token
//     const resetToken = crypto.randomBytes(20).toString('hex');

//     // Hash and set to resetPasswordToken
//     this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

//     // Set token expire time
//     this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

//     return resetToken

// }

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your first name'],
        maxLength: [30, 'Name should not be longer than 30 characters'],
        minLength: [1, 'Name must have more than 1 characters']
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    ministryRoles: [
        {
            ministry: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ministryCategory',
                required: true
            },
            startYear: {
                type: Number,
                required: true,
            },
            endYear: {
                type: Number,
                required: false,
            },
            role: {
                type: String,
                enum: ['Coordinator', 'Assistant Coordinator', 'Office Worker', 'Member', 'Others'],
                required: false
            },
            customRole: {
                type: String,
                required: function () {
                    return this.role === 'Others';
                }
            }
        }
    ],
   
    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [8, 'Your password must be longer than 6 characters'],
        select: false
    },
    birthDate: {
        type: Date,
        required: true, 
    },
    preference: {
        type: String,
        enum: ['He', 'She', 'They/Them']

    },
    phone: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    civilStatus: {
        type: String,
        enum: [
            'Single', 
            'Married', 
            'Divorced', 
            'Widowed', 
            'Separated', 
            'In Civil Partnership', 
            'Former Civil Partner', 
            ],
    required: true

    },
    address: {
        BldgNameTower: { type: String, required: false },
        LotBlockPhaseHouseNo: { type: String, required: false },
        SubdivisionVillageZone: { type: String, required: false },
        Street: {
            type: String,
            required: [
              function () {
                return this.isNew; 
              },
              'Street is required',
            ],
          },
          
        District: { type: String, required: true },
        barangay: {
            type: String,
            enum: [
                'Bagumbayan', 'Bambang', 'Calzada', 'Cembo', 'Central Bicutan',
                'Central Signal Village', 'Comembo', 'East Rembo', 'Fort Bonifacio', 'Hagonoy',
                'Ibayo-Tipas', 'Katuparan', 'Ligid-Tipas', 'Lower Bicutan', 'Maharlika Village',
                'Napindan', 'New Lower Bicutan', 'North Daang Hari', 'North Signal Village', 'Palingon',
                'Pembo', 'Pinagsama', 'Pitogo', 'Post Proper Northside', 'Post Proper Southside',
                'Rizal', 'San Miguel', 'Santa Ana', 'South Cembo', 'South Daang Hari', 'South Signal Village',
                'Tanyag', 'Tuktukan', 'Upper Bicutan', 'Ususan', 'Wawa', 'West Rembo', 'Western Bicutan',
                'Others'
            ],
            required: [ function () {
                return this.isNew; 
              },
              'Barangay is required',
            ],
        },
        customBarangay: {
            type: String,
            required: function () {
                return this.isNew && this.address.barangay === 'Others';
            }
        },
        city: { type: String, enum: ['Taguig City', 'Others'], required: true },
        customCity: {
            type: String,
            required: function () {
                return this.isNew && this.address.city === 'Others';
            }
        },
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isPriest: { 
        type: Boolean, 
        default: false 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], async function (next) {

    const data = this.getUpdate();

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    next()

});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

userSchema.methods.comparePassword = async function (inputtedPassword) {
    return await bcrypt.compare(inputtedPassword, this.password);
}

userSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken;
}

module.exports = mongoose.model('User', userSchema)