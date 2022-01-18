import Chat from "../models/chat.js"
import User from "../models/user.js";

export const createChats = async (req, res) => {
    const {userId} = req.body;

    if(!userId) {
        return res.status(400).json({message: 'user id missing'})
    }

    let chatExist = await Chat.find({
        isGroup: false,
        $and: [
            {users: {$elemMatch:{$eq:req.userId}}},
            {users: {$elemMatch:{$eq:userId}}}
        ]
    }).populate("users","-password").populate("recentChat")

    chatExist = await User.populate(chatExist, {
        path: 'recentChat.sender',
        select: "name, avatar, email"
    });

    if(chatExist.length > 0) {
        let result = chatExist[0];
        res.status(200).json({result});
    }else {
        var createChat = {
            chatName: "sender",
            isGroup: false,
            users: [req.userId, userId]
        }
    }

    try {
        const createdChat = await Chat.create(createChat);
        const foundChat = await Chat.findOne({_id: createdChat._id}).populate("users","-password");

        res.status(200).send(foundChat);
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}