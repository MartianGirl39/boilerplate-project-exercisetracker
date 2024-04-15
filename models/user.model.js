const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { kStringMaxLength } = require('buffer');

SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        match: [/^[A-Za-z0-9\s_]*$/, 'username can only consist of letters, numbers and underscore'],
        required: [true, 'username is required']
    },
    name: {
        type: String,
        trim: true,
        match: [/^[a-zA-Z\s]*$/, 'name may only consist of letters and spaces'],
        required: [true, 'name is required']
    },
    age: {
        type: Number,
        min: [12, 'must be 12 or older to create account'],
        max: [120, 'I seriously doubt you are over 120, please enter your age'],
        required: [true, 'age is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    count: {
        type: Number
    },
    log: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise"
    }],
    /*_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => {new mongoose.Types.ObjectId},
        unique: true,
    }*/
});

/*userSchema.pre('save', (next) => {
    let user = this;
    console.log(`this is user: ${user.password}`);
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if(err) {
            console.error(err);
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) {
                console.error(err)
                return next(err)
            }
            user.password = hash;
            next();
        })
    })
})*/

userSchema.pre('updateOne', (next) => {
    if(this.getUpdate()['log']){
        this.count += 1;
        next();
    }
})

userSchema.methods.comparePassword = (canditate, cb) => {
    bcrypt.compare(canditate, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

module.exports = mongoose.model('User', userSchema);