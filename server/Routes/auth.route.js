import express from 'express';
const router = express.Router();

import { signIn, signUp, logout } from '../Controller/auth.controller.js';

router.post('/signin', signIn);
router.post('/signup', signUp, ()=>{res.send({message: "Hello")});
router.post('/logout', logout);

export default router;
