
//For Production
const sendToken = (user, statusCode, res) => {
    
    // Create Jwt token
    const token = user.getJwtToken();
    // user.token = token;
    // const userObj = {
    //     user,
    //     token: token
    // }
    // console.log(userObj)
    // Options for cookie
    // const options = {
    //     expires: new Date(
    //         Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    //     ),
    //     httpOnly: false,
        
    // }
    console.log(user)
    const options = {
        expires: false,
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user
        })

}

module.exports = sendToken;
// New


//For Deployment
// const sendToken = (user, statusCode, res) => {
//     const token = user.getJwtToken();

//     const options = {
//         httpOnly: true,  // Secure against XSS
//         secure: process.env.NODE_ENV === "production", // Use HTTPS only in production
//         sameSite: "None", // Required for cross-origin cookies
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 5 minutes
//     };

//     res
//         .status(statusCode)
//         .cookie("token", token, options) // Attach JWT token to HTTP-only cookie
//         .json({
//             success: true,
//             token,
//             user
//         });
// };

module.exports = sendToken;