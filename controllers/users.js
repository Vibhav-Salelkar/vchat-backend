import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signin = async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne( {email} );

        if(!existingUser) return res.status(404).json({message: "User doesn't exist"});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"});

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: "30d"});

        res.status(200).json({result: existingUser, token});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong'});
    }
}

export const signup = async (req, res) => {
    const { name, email, password, confirmPassword, avatar} = req.body;

    try {
        if(!name || !email || !password) {
            res.status(400).json({message: "Please provide required data"})
        }

        const existingUser = await User.findOne({ email });

        if(existingUser) return res.status(400).json({message: "User already exist"});

        if(password !== confirmPassword) return res.status(400).json({message: "Passwords don't match"});

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create( {
            name,
            email,
            password: hashedPassword,
            avatar
        });

        const token = jwt.sign({ email: result.email, id: result._id}, process.env.JWT_SECRET, {expiresIn: "30d"});

        res.status(200).json({result, token});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong'});
    }

}

export const allUsers = async(req, res) => {
    const searchQuery = req.query.search ? {
        $or: [
            {
                name: {
                    $regex: req.query.search, $options: "i"
                }
            },
            {
                email: {
                    $regex: req.query.search, $options: "i"
                }
            },
        ]
    }: {};
    const user = await User.find(searchQuery).find({_id:{$ne:req.userId}});
    res.status(200).json({user})
    console.log(searchQuery);
}
