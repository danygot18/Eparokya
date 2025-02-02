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
    ministryCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ministryCategory',  
        required: false,  
    },
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
    // image: {
    //     type: String,
    //     default: ''
    // },
    age: {
        type: Number,
        min: [1, 'Age must be between 1 and 1000'],
        max: [1000, 'Age must be between 1 and 1000']
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
    barangay: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
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