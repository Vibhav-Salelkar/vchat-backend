import mongoose from "mongoose";

const userSchema = mongoose.Schema( {
    userName: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timeStamps: true
});

const User = mongoose.model('User', userSchema);

export default User;