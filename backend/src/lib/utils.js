import jwt from 'jsonwebtoken'

export const generateToken = (userId,res) => {
    try {
        const token = jwt.sign({userId},process.env.JWT_SECRET,{
            expiresIn: "7d"
        })

        res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        //The other options are to enhance safety
        httpOnly:true,
        sameSite:"none",
        secure:process.env.NODE_ENV !== "development"
        })
    } catch (error) {
        console.log('Error in generateToken middleware')
        throw new Error("Token generation failed");
    }
}