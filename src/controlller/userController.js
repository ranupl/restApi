const httpError = require("http-errors");
const { UserDB } = require("../model/userModel");
const xml2js = require("xml2js");

async function createUser(req, res, next) {
  try {
    let userData;
    if (req.is("application/xml")) {
      const parser = new xml2js.Parser({ explicitArray: false });
      userData = await new Promise((resolve, reject) => {
        parser.parseString(req.body, (err, result) => {
          if (err) {
            reject(httpError.BadRequest("Invalid XML format"));
          } else {
            resolve(result.root);
          }
        });
      });
    } else if (req.is("application/json")) {
      userData = req.body;
    } else {
      return next(httpError.UnsupportedMediaType("Unsupported media type"));
    }

    const { firstname, lastname, email, username, password } = userData;
    const user = await UserDB.findOne({ email });

    if (user) {
      return next(httpError.BadRequest("User already exits.."));
    }

    const newUser = new UserDB({
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username,
      password: password,
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: req.body,
    });
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

async function getAllUser(req, res, next) {
  const user = await UserDB.find();
  try {
    if (user.length > 0) {
      return res.status(200).json({
        success: true,
        message: "All users",
        data: user,
      });
    }
    return next(httpError.NotFound("No users"));
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

async function getById(req, res, next) {
  const { id } = req.params;
  const user = await UserDB.findOne({ id });
  try {
    if (!user) {
      return next(http.NotFound("User not found"));
    }
    return res.status(200).json({
      success: true,
      message: "User by Id",
      data: user,
    });
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

async function updateUser(req, res, next) {
  const { id } = req.params;

  try {
    let user = await UserDB.findOne({ id });
    if (!user) {
      return next(httpError.NotFound("No user found"));
    }
    let updateData;
    if (req.is("application/xml")) {
      const parser = new xml2js.Parser({ explicitArray: false });
      parser.parseString(req.body, (err, result) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "Error parsing XML",
          });
        }
        updateData = result.root;
      });
    } else if (req.is("application/json")) {
      updateData = req.body;
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported Media Type",
      });
    }

    user = await UserDB.findOneAndUpdate({ id }, updateData, { new: true });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: req.body,
    });
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

async function deleteUser(req, res, next) {
  const { id } = req.params;
  const user = await UserDB.findOne({ id });

  try {
    if (!user) {
      return next(httpError.NotFound("User not found"));
    }
    return res.status(200).json({
      success: true,
      message: "user deleted",
      data: req.user,
    });
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

async function filterResult(req, res, next) {
  console.log(req.query);
  try {
    const { firstname, lastname, email, username } = req.query;
    const filter = {};

    if (firstname) {
      filter.firstname = firstname;
    }
    if (lastname) {
      filter.lastname = lastname;
    }
    if (email) {
      filter.email = email;
    }
    if (username) {
      filter.username = username;
    }

    const user = await UserDB.findOne(filter);

    if (!user) {
      return next(httpError.NotFound("User not found"));
    }
    return res.status(200).json({
      success: true,
      message: "user found",
      data: user,
    });
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

module.exports = {
  createUser,
  getAllUser,
  getById,
  updateUser,
  deleteUser,
  filterResult,
};
