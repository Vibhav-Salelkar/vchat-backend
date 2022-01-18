import express from "express";
import { addInGroup, createChats, createGroup, editGroup, getChats } from "../controllers/chats.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/', auth, createChats);
router.get('/', auth, getChats);
router.post('/group', auth, createGroup);
router.put('/editgroup', auth, editGroup);
router.put('/addingroup',auth,addInGroup);
// router.put('removegroup',auth,removeFromGroup);

export default router;