import express from "express";
import { createChats } from "../controllers/chats.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/', auth, createChats);
// router.get('/', auth, getChats);
// router.post('/group', auth, createGroup);
// router.put('editgroup', auth, editGroup);
// router.put('removegroup',auth,removeFromGroup);
// router.put('addgroup',auth,addInGroup);

export default router;