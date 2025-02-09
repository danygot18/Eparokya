// const User = require('../models/user')
// const jwt = require("jsonwebtoken")

// exports.isAuthenticatedUser = (req, res, next) => {
//     const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 

//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); 
//         req.user = decoded; 
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid or expired token' });
//     }
// };


//sa forms gumagana:
// exports.isAuthenticatedUser = async (req, res, next) => {
//     let token = ''
//     if (req.cookies) {
//         token = req.cookies.token
//     }
//     if (req.headers.authorization) {
//         token = req.headers.authorization.split(' ')[1];
//     }
//     console.log('Extracted token:', token);

//     // const jwtString = token.split(' ')[1]
//     //  console.log("token", jwtString)

//     if (!token) {
//         return res.status(401).json({ message: 'Login first to access this resource' })
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
//         req.user = await User.findById(decoded.id); // Find user by ID from token
//         next();
//     } catch (error) {
//         console.error('JWT verification error:', error);
//         return res.status(401).json({ message: 'Invalid or expired token' });
//     }

//     // const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     // req.user = await User.findById(decoded.id);
//     // next()

// };

// exports.authorizeRoles = (...roles) => {
//     return (req, res, next) => {
//         console.log(roles, req.user, req.body);
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({ message: `Role (${req.user.role}) is not allowed to acccess this resource` })

//         }
//         next()
//     }
// }


//gumagana sa dashboard
// exports.isAuthenticatedUser = async (req, res, next) => {

//     let token = ''

//     if (req.cookies) {
//         token = req.cookies.token
//     }

//     if (req.headers.authorization) {
//         token = req.headers.authorization.split('')[1];
//     }
//     console.log(token)

//     // const jwtString = token.split(' ')[1]
//     //  console.log("token", jwtString)

//     if (!token) {
//         return res.status(401).json({ message: 'Login first to access this resource' })
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     req.user = await User.findById(decoded.id);

//     next()

// };


//try

// exports.isAuthenticatedUser = async (req, res, next) => {
//     try {
//         let token = '';

//         // Extract token from cookies
//         if (req.cookies && req.cookies.token) {
//             token = req.cookies.token;
//         }

//         // Extract token from Authorization header
//         if (req.headers.authorization) {
//             const authHeader = req.headers.authorization;
//             if (authHeader.startsWith("Bearer ")) {
//                 token = authHeader.split(' ')[1]; 
//             }
//         }

//         console.log('Extracted Token:', token); 

//         if (!token) {
//             return res.status(401).json({ message: 'Login first to access this resource' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // This will throw an error if the token is malformed
//         req.user = await User.findById(decoded.id); // Get user from DB

//         console.log('Authenticated User:', req.user); // Log the authenticated user

//         next(); // Proceed to next middleware
//     } catch (error) {
//         console.error("JWT Verification Error:", error); // Log any errors
//         res.status(401).json({ message: 'Token is invalid or expired' });
//     }
// };

//for guestSidebar tetsing

// exports.isAuthenticatedUser = async (req, res, next) => {
//     try {
//         let token = '';

//         if (req.cookies && req.cookies.token) {
//             token = req.cookies.token;
//         }

//         if (req.headers.authorization) {
//             const authHeader = req.headers.authorization;
//             if (authHeader.startsWith("Bearer ")) {
//                 token = authHeader.split(' ')[1];
//             }
//         }

//         console.log('Extracted Token:', token);

//         if (!token) {
//             return res.status(401).json({ message: 'Login first to access this resource' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET); 
//         req.user = await User.findById(decoded.id); 

//         console.log('Authenticated User:', req.user); 

//         next(); // Proceed to next middleware
//     } catch (error) {
//         console.error("JWT Verification Error:", error);
//         res.status(401).json({ message: 'Token is invalid or expired' });
//     }
// };



// exports.authorizeAdmin = () => {
//     return (req, res, next) => {
//         console.log(req.user, req.body);
//         if (!req.user.isAdmin) {
//             return res.status(403).json({ message: `Access denied. Admin privileges required.` });
//         }
//         next();
//     };
// };


//web and mobile merge backend
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        console.log(req.cookie.token)
        console.log(req.headers.authorization)
        console.log(req.cookie)
        let token = "";

        // Extract token from cookies (Web)
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // Extract token from Authorization header (Mobile)
        if (req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        console.log("Extracted Token:", token);

        // If no token is found
        if (!token) {
            return res.status(401).json({ message: "Login first to access this resource" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        // Fetch user from DB (Ensures token is still valid & user exists)
        req.user = await User.findById(decoded.id);
        console.log("Authenticated User:", req.user);

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next(); // Proceed to next middleware
    } catch (error) {
        console.error("JWT Verification Error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Unauthorized: Token expired" });
        }
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

// Role-based authorization
// exports.isAuthorized = (...roles) => {

//     return (req, res, next) => {
//         if (!req.user.isAdmin) {
//             return res.status(403).json({ message: `You are not allowed to acccess or do something on this resource` })
//         }
//         next()
//     }
// }
exports.isAuthorized = (...roles) => {
    
    try {
        
        return (req, res, next) => {
            console.log(req.user);
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }
    
            if (!roles.includes("admin") || !req.user.isAdmin) {
                return res.status(403).json({ message: "You are not allowed to access this resource" });
            }
    
            next();
        };
    } catch (error) {     
        console.error("Authorization Error:", error);
        return res.status(403).json({ message: "Unauthorized: Invalid role" });
    }
};

exports.isAuthenticatedMobile = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
      req.user = decoded; 
      console.log("User set in req.user:", req.user); 
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Unauthorized: Token expired" });
      }
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };
