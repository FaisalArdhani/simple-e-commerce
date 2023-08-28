import express from 'express';
import { register, login, authenticate, logout, setupSessionMiddleware, toggleUserRole, deleteUser } from '../controllers/UserController.js';

const userRouter = express.Router();

// Setup session middleware
setupSessionMiddleware(userRouter);

userRouter.post('/register', register); // --> Register new user
userRouter.post('/login', login); // --> Login user
userRouter.post('/logout', logout); // --> Logout user
userRouter.patch('/toggle-role/:userId', authenticate, toggleUserRole);// --> Toggle user role (admin/user)
userRouter.delete('/:userId', deleteUser)
userRouter.get('/profile', authenticate, (req, res) => {
    res.json({ user: req.user });
});

export default userRouter;