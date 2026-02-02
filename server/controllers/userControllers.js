import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

//singup a new user
export const signup = async (req, res) => {
  const { fullname, email, password, bio } = req.body;

  try {
    if (!fullname || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      message: "Account created successfully",
      userData: newUser,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller to login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userdata =await User.findOne({ email });
    if (!userdata) {
      return res.json({ success: false, message: "User not found" });
    }


    const isPasswardCorrect = await bcrypt.compare(password, userdata.password);

    if (!isPasswardCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userdata._id);

    res.json({
      success: true,
      message: "Login successfully",
      userdata,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

//controller to update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullname } = req.body;
    const userId = req.user._id;
    let updateUser;

    if (!profilePic) {
      updateUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullname },
        { new: true },
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "quickchat",
      });

      updateUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullname },
        { new: true },
      );
    }

    res.json({ success: true, user: updateUser });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
