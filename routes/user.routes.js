import {Router} from 'express';
import authorize from '../middleswares/auth.middleware.js';
import { getUser, getUsers } from '../controllers/user.controller.js';

const userRouter=Router();
userRouter.get('/', authorize, getUsers);
userRouter.get('/:id', authorize, getUser);
userRouter.post('/',(req,res)=>res.send({title: 'Create new users'}));
userRouter.put('/:id',(req,res)=>res.send({title: 'Update users'}));
userRouter.delete('/:id',(req,res)=>res.send({title: 'Delete a users'}));
export default userRouter;