import { AdminModel } from "../models/admin.model.js";
import bcrypt from 'bcrypt';
import { adminloginValidator, adminsignupValidator } from "../validation/admin.validation.js";
import jwt from "jsonwebtoken";



// Admin signup
export const signup = async (req, res, next) => {
    try {
        // Validate request body
        const { error, value } = adminsignupValidator.validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Destructure values from validated request body
        const { name, username, email, password } = value;

        // Check if user already exists
        const findIfAdminExist = await AdminModel.findOne({ email });

        if (findIfAdminExist) {
            return res.status(400).send('Admin already signed up');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the Admin
        const addAdmin = await AdminModel.create({ name, username, email, password: hashedPassword });

        // Optionally set session or token here
        req.session.user = { id: addAdmin._id };

        // Send success response
        return res.status(201).json({ message: 'Admin signed up successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
};

// Admin login
export const token = async (req, res, next) => {
    try {
        const { value, error } = adminloginValidator.validate(req.body);

        if (error) {
            return res.status(422).json(error);
        }

        const Admin = await AdminModel.findOne({
            $or: [
                { username: value.username },
                { email: value.email },
            ]
        });

        if (!Admin) {
            return res.status(401).json({ error: 'Admin not found' });
        }

        // Check if the user is an admin
        if (Admin.role !== 'Admin') {
            return res.status(401).json({ error: 'Not authorized as admin' });
        }

        const correctPassword = await bcrypt.compare(value.password, Admin.password);

        if (!correctPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: Admin._id, role: Admin.role },
            process.env.JWT_PRIVATE_KEY, 
            { expiresIn: "1h" }
        );


        const refreshToken = jwt.sign(
            { id: Admin._id, role: Admin.role },
            process.env.JWT_PRIVATE_KEY, 
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: 'You are successfully logged in',
            accessToken: token, refreshToken,
            Admin: {
                name: Admin.name,
                username: Admin.username,
                email: Admin.email,
                role: Admin.role
            }
        });

    } catch (error) {
        next(error);
    }
}




    // logout controller
export const logout = async (req, res, next) => {
    try {
      await req.session.destroy()
      // if (error) {
      //     return res.status(500).json("Failed to logout");
      // }
  
      // Clear the session cookie
      res.status(200).json("You successfully Logged out");
  
    } catch (error) {
      next(error);
    }
  };