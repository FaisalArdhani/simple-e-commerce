import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import User from '../models/UserModel.js'

dotenv.config()

const sessionMiddleware = expressSession({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'strict',
    },
});


// Register dengan methode post
export const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, role } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ msg: 'Password do not macth' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user', // --> jika seseorang register tanpa menggunakan role maka akan menjadi user
        })

        const token = generateToken(newUser); // --> untuk menggenerete token | membuat token
        res.status(201).json({ msg: 'Register successfully', token })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Failed to register' })
    }
}

// Login dengan methode post
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: { username }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Invalid password' });
        }

        const token = generateToken(user)
        res.cookie('token', token, { httpOnly: true, secure: true }); // secure: true untuk HTTPS

        res.status(201).json({ msg: 'Login successfully', token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// mengganti role dengan methode patch
export const toggleUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }

        user.role = user.role === 'user' ? 'admin' : 'user';
        await user.save();
        res.status(200).json({ msg: 'successfully change role' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// menghapus user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Fungsi untuk menghasilkan token JWT
const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
    };
    return jwt.sign(payload, 'secretKey', { expiresIn: '7h' });
};

// untuk authentication dengan methode Get
export const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token from cookie:", token);

    if (!token) {
        return res.status(401).json({ msg: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        res.status(403).json({ msg: 'Invalid token' });
    }
};

// untuk keluar dari akun menggunakan methode post
export const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

export const setupSessionMiddleware = (app) => {
    app.use(cookieParser());
    app.use(sessionMiddleware);
    console.log("Session middleware setup successful");
};

