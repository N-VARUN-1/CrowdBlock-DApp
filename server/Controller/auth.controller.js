import User from "../Models/user.model.js";
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcrypt'
import 'dotenv'


/////////// User - SIGN UP ///////////
export const signUp = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all the fields!' })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' })
    }

    const userIdGenerator = async () => {
        let userId;
        let isUnique = false;
        while (!isUnique) {
            userId = 'CB_' + Math.random().toString(36).substr(2, 6).toUpperCase();

            const userExists = await User.findOne({ userId });
            if (!userExists) {
                isUnique = true;
            }
        }
        return userId;
    }

    const userId = await userIdGenerator();

    const newUser = new User({
        userId,
        email,
        password
    })

    try {
        await newUser.save();
        console.log('SignUp successfull')
        res.status(200).json({ message: 'Sign Up successfull !' })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
}


/////////// User - SIGN IN ///////////
export const signIn = async (req, res) => {
    const { userId, email, password } = req.body;

    if (!userId || !email || !password) {
        return res.status(400).json({ message: 'Please fill all the fields!' })
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: validUser._id, pass: validUser.password }, process.env.JWT_SECRET_KEY);

        const { password: pass, ...rest } = validUser._doc;
        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json({ ...rest, _id: validUser._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


/////////// User Logout ///////////
export const logout = async (req, res) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json({ message: 'User has been signed out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error during sign out', error: error.message });
    }
};

