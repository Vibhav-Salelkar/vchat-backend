import express from "express";
import { sendMessage, allMessages } from "../controllers/message.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/',auth,sendMessage);
router.get('/:chatId',auth,allMessages);

export default router;