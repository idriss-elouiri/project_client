import { errorHandler } from "../../utils/error.js";
import User from "../auth/auth.model.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  try {
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters")
        );
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
      const { username } = req.body;
      if (username.length < 7 || username.length > 20) {
        return next(
          errorHandler(400, "Username must be between 7 and 20 characters")
        );
      }
      if (username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"));
      }
      if (username !== username.toLowerCase()) {
        return next(errorHandler(400, "Username must be lowercase"));
      }
      if (!username.match(/^[a-zA-Z0-9]+$/)) {
        return next(
          errorHandler(400, "Username can only contain letters and numbers")
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body }, // This will only update fields present in req.body
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({ user: rest });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "User has been signed out" });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map(({ _doc }) => {
      const { password, ...rest } = _doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last month
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json({ user: rest });
  } catch (error) {
    next(error);
  }
};