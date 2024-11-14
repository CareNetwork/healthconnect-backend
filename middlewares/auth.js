import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/admin.model.js';
import { UserModel } from '../models/user.model.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';



dotenv.config();



const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("Error: Google client ID or secret is missing in environment variables.");
  process.exit(1);
}

// Initialize Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:6010/auth/google/callback',
    passReqToCallback: true
  },

  // Google Mail Login
async (accessToken, refreshToken, profile, done) => {
  try {
      let user = await UserModel.findOne({ googleId: profile.id });

      if (!user) {
          // Create a new user if one doesn't already exist
          user = new UserModel({
              googleId: profile.id,
              firstname: profile.name.givenName,
              lastname: profile.name.familyName,
              email: profile.emails[0].value,
              username: profile.displayName,
          });
          await user.save();
      }

      // Serialize user into session
      passport.serializeUser((user, done) => {
          done(null, user);
      });

      // Deserialize user from session
      passport.deserializeUser((user, done) => {
          done(null, user);
      });

      return done(null, user);
  } catch (error) {
      return done(error, false);
  }
}
));




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