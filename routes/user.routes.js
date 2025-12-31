import {Router} from 'express';
const userRouter=Router();
userRouter.get('/',(req,res)=>res.send({title: 'GET all users'}));
userRouter.get('/:id',(req,res)=>res.send({title: 'GET all details'}));
userRouter.post('/',(req,res)=>res.send({title: 'Create new users'}));
userRouter.put('/:id',(req,res)=>res.send({title: 'Update users'}));
userRouter.delete('/:id',(req,res)=>res.send({title: 'Delete a users'}));
export default userRouter;