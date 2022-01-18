import express from "express";
import {signin, signup, allUsers} from "../controllers/users.js" 

import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/', auth, allUsers);

export default router;