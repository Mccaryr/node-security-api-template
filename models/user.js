const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    user_email: {
        type:String, 
        required: [true, "Please enter a email"], 
        unique: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type:String, 
        required: [true, "Please enter a password"], 
        minlength:[6, "Minimum password length is 6 characters"]}
})

//Fires a func after saved to db
// userSchema.post('save', function (doc, next) {
//     next();
// })

//Fires a func before saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

userSchema.statics.login = async function(user_email, password) {
    const user = await this.findOne({ user_email })

    if(user) {
        const auth = await bcrypt.compare(password, user.password)

        if(auth) {
            return user
        } 
        
        throw Error("Incorrect password")
    } 
    throw Error("Incorrect Email")
}

module.exports = mongoose.model('User', userSchema)