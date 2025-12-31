import {Router} from 'express';
import { signIn, signOut, signUp } from '../controllers/auth.controller.js';

const authRouter = Router();
// authRouter.post('/sign-up',(req,res)=>res.send({body:{title: 'Sign-up'}})); for single 
// authRouter.post('/sign-in',(req,res)=>res.send({body:{title: 'Sign-in'}})); difficult for all 
// authRouter.post('/sign-out',(req,res)=>res.send({body:{title: 'Sign-out'}})); complex
// thats why

// path: /api/v1/auth/sign-up(POST) 
authRouter.get('/sign-up',(req,res)=>{
  res.send(`
    <html>
      <body>
        <h2>Sign Up</h2>
        <form method="POST" action="/api/v1/auth/sign-up">
          <input type="text" name="name" placeholder="Name" required><br><br>
          <input type="email" name="email" placeholder="Email" required><br><br>
          <input type="password" name="password" placeholder="Password" minlength="6" required><br><br>
          <button type="submit">Sign Up</button>
        </form>
      </body>
    </html>
  `);
});
authRouter.get('/sign-in',(req,res)=>{
  res.send(`
    <html>
      <body>
        <h2>Sign In</h2>
        <form method="POST" action="/api/v1/auth/sign-in">
          <input type="email" name="email" placeholder="Email" required><br><br>
          <input type="password" name="password" placeholder="Password" required><br><br>
          <button type="submit">Sign In</button>
        </form>
      </body>
    </html>
  `);
});
authRouter.post('/sign-up',signUp);  
authRouter.post('/sign-in',signIn);  
authRouter.post('/sign-out',signOut); 

export default authRouter;