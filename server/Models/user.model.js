import mongoose from 'mongoose'
const { Schema } = mongoose;

const UserSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String
    }
}, { timestamps: true })

const User = mongoose.model("User ", UserSchema);

export default User;