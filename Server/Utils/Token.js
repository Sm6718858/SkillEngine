import jwt from 'jsonwebtoken';

export const generateToken = (res, user) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,       
  sameSite: "none",   
  maxAge: 3600000,
});


  return res.status(200).json({
    success: true,
    message: 'Login successful'
  });
};
