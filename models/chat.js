import mongoose from "mongoose";

const chatSchema = mongoose.Schema( {
    chatName: {
        type: String,
        trim: true
    },
    recentChat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isGroup: {
        type: Boolean,
        default: false
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timeStamps: true
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;