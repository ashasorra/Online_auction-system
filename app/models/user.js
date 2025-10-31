const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Schema } = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4
    },

    lastName: {
        type: String,
        required: true,
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: function () {
                return 'invalid Email'
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 80
    },
    mobile: {
        type: String,
        minlength: 10,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ],
    role: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    }


})
// Fix the pre-validate hook
userSchema.pre('validate', async function(next) {
    if (this.isNew) {
        try {
            const count = await this.constructor.countDocuments();
            this.role = count === 0 ? 'admin' : 'user';
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

// Fix the pre-save hook
userSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const salt = await bcryptjs.genSalt(10);
            this.password = await bcryptjs.hash(this.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

// Improve findByEmailAndPassword
userSchema.statics.findByEmailAndPassword = async function(email, password) {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw { error: 'invalid email and password' };
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            throw { error: 'invalid email and password' };
        }
        return user;
    } catch (err) {
        throw err;
    }
};

// Improve generateToken
userSchema.methods.generateToken = async function() {
    const tokenData = {
        userId: this._id,
        firstName: this.firstName,
        email: this.email,
        role: this.role
    };
    const token = jwt.sign(tokenData, 'onlinebidding19');
    this.tokens.push({ token });
    
    try {
        await this.save();
        return token;
    } catch (err) {
        throw err;
    }
};

// Improve findByToken
userSchema.statics.findByToken = async function(token) {
    try {
        const tokenData = jwt.verify(token, 'onlinebidding19');
        const user = await this.findOne({ 
            _id: tokenData.userId,
            'tokens.token': token 
        });
        
        if (!user) {
            throw { notice: 'redirect to login page' };
        }
        return user;
    } catch (err) {
        throw err;
    }
};



// Fix exports
module.exports = mongoose.model('User', userSchema);


