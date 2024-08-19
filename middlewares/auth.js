import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/admin.model.js';


// authentication middleware

// export const iSauthenticated = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ error: 'Authentication required' });
//     }

//     const secretKey = process.env.JWT_PRIVATE_KEY;
//     if (!secretKey) {
//       throw new Error('JWT secret key is not defined');
//     }

//     const decoded = jwt.verify(token, secretKey);

//     if (!decoded.id || decoded.role !== 'Admin') {
//       return res.status(401).json({ error: 'Not authorized as admin' });
//     }

//     const Admin = await AdminModel.findById(decoded.id);
//     if (!decoded.id || decoded.role !== 'Admin') {
//       return res.status(401).json({ error: 'Not authorized as admin' });
//     }

//     req.Admin = Admin;
//     req.token = token;
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error.message);
//     res.status(401).json({ error: 'Authentication required' });
//   }
// };


export const iSauthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const secretKey = process.env.JWT_PRIVATE_KEY;
    if (!secretKey) {
      throw new Error('JWT secret key is not defined');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Token expired', refreshRequired: true });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!decoded.id || decoded.role !== 'Admin') {
      return res.status(401).json({ error: 'Not authorized as admin' });
    }

    const admin = await AdminModel.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    req.admin = admin;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Authentication required' });
  }
};








// authorization middleware
export const authorized = (allowedRoles) => {
    return (req, res, next) => {
      const AdminRole = req.user?.role;
 
      console.log('Admin Role:', AdminRole);
      console.log('Allowed Roles:', allowedRoles);
 
      if (!AdminRole) {
        console.log('Access denied. No role provided.');
        return res.status(403).json({ error: 'Access denied. No role provided.' });
      }
 
      if (allowedRoles.includes(AdminRole)) {
        next();
      } else {
        console.log('Access denied. User does not have required permissions.');
        res.status(403).json({
          error: 'Access denied. You do not have the required permissions.',
        });
      }
    };
  };