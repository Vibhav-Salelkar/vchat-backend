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

export const getChats = async (req, res) => {
    try {
        let chats = await Chat.find({
            users: {$elemMatch: {$eq: req.userId}}
        }).populate("users", "-password").populate("groupAdmin", "-password").populate("recentChat").sort({updatedAt: -1});

        chats = await User.populate(chats, {
            path: 'recentChat.sender',
            select: "name, avatar, email"
        });
        
        res.status(200).json({chats});
    } catch (error) {
        res.status(400).json({message:'chats does not exist'});
    }
}

export const createGroup = async(req, res) => {
    let {name, users} =req.body;

    if(!name || !users) {
        return res.status(400).json({meesage: "Please provide required data"});
    }
    users = JSON.parse(users);

    if(users.length <2){
        res.status(400).json({message:'Requires more than 2 users'});
    }

    let currentUser = await User.findOne({_id: req.userId});
    users.push(currentUser);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroup: true,
            groupAdmin: currentUser,
            users:users
        })

        let foundGroupChat = await Chat.findOne({_id: groupChat._id}).populate("users","-password").populate("groupAdmin", "-password"); 

        res.status(200).json({foundGroupChat});
    } catch (error) {
        res.status(400).json({message:'error occured'});
    }
}

export const editGroup = async (req, res) => {
    const {name, groupId} = req.body;

    if(!name) {
        res.status(400).json({message: 'Please provide required data'})
    }

    try {
        let existingGroup = await Chat.findByIdAndUpdate(
            groupId,
            {
                chatName: name
            },
            {
                new:true
            }
        ).populate("users", "-password").populate("groupAdmin", "-password");
        
        if(!existingGroup){
            res.status(400).json({message: 'failed to update group'})
        }else {
            res.status(400).json({existingGroup})
        }
    } catch (error) {
        res.status(400).json({message: 'failed to update group'})
    }
}

export const addInGroup = async(req,res) => {
    const {userId, groupId} = req.body;
    try {
        const addUser = await Chat.findByIdAndUpdate(
            groupId,
            {
                $push: {
                    users: userId
                },
            },
            {
                new:true
            }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if(!addUser){
            res.status(400).json({message: 'failed to add user in group'})
        }else {
            res.status(200).json({addUser})
        }
    } catch (error) {
        res.status(400).json({message: 'Error, failed to add user in group'})
    }
}