import jwt from 'jsonwebtoken';
import { AdminModel } from "../models/admin.model.js";

// Refresh Token Endpoint
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        // Verify the refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY);
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        // Check if the user exists
        const admin = await AdminModel.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ error: 'Admin not found' });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '72h' } // Short-lived access token (e.g., 1h)
        );

        // Optionally, generate a new refresh token (you can choose to rotate it)
        const newRefreshToken = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '7d' } // Long-lived refresh token (e.g., 7 days)
        );

        // Send the new tokens to the client
        res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error('Refresh token error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};
