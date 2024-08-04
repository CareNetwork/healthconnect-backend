import { UserModel } from "../models/user.model.js";
import bcrypt from 'bcrypt';




export const Usersignup = async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;

        // Validate input
        if (!firstname || !lastname || !username || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate email format (basic check)
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(email)) {
        //     return res.status(400).json({ message: "Invalid email format" });
        // }

        // Check if a user already exists with the provided email or username
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or username" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error in user signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
