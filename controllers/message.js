import Message from "../models/message.js";
import User from "../models/user.js";
import Chat from "../models/chat.js";

export const sendMessage = async (req, res) => {
    const {content, chatId} = req.body;

    if(!content || !chatId) {
        return res.status(400).json({message: 'data required'})
    }

    let messageSent = {
        sender: req.userId,
        message: content,
        chat: chatId
    }

    try {
        let newMessage = await Message.create(messageSent);

        newMessage = await newMessage.populate("sender", "name avatar")
        newMessage = await newMessage.populate("chat")
        newMessage = await User.populate(newMessage, {
            path: 'chat.users',
            select: "name avatar email"
        })

        await Chat.findByIdAndUpdate(chatId, {
            recentChat: newMessage
        })

        res.status(200).json(newMessage);

    } catch (error) {
        return res.status(400).json({message: 'Could not send message'})
    }
}

export const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId}).populate("sender", "name avatar email").populate("chat");

        res.status(200).json(messages);
        
    } catch (error) {
        return res.status(400).json({message: 'Could not fetch messages'})
    }
}