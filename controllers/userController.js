const User = require("../models/userModel");
const bcrypt = require("bcrypt");





const loadregister = function (req, res) {
  if (req.session.user) {
    res.redirect("/userhome");
  } else if (req.session.admin) {
    res.redirect("/adminhome");
  } else {
    res.render("register");
  }
};








const loginload = function (req, res) {
  if (req.session.user) {
    res.redirect("/userhome");
  } else if (req.session.admin) {
    res.redirect("/adminhome");
  } else {
    res.render("login");
  }
};








const loguser = async (req, res) => {
  
  try {
    const logemail = req.body.email;
    const loggeduser = await User.findOne({
      email: logemail
      
    });
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      loggeduser.password
    );

    if (isPasswordMatch) {
      if (loggeduser.isAdmin === true) {
        req.session.admin = loggeduser._id;

        res.redirect("/adminhome");
      } else {
        req.session.user = loggeduser._id;

        res.redirect("/userhome");
      }
    } else {
      res.render("login", { errmessage: "Login Failed!!" });
    }
  } catch (err) {
    console.log(err.message);
  }
};






const insertUser = async (req, res) => {
  try {
    const email = req.body.email;
    const emailExist = await User.findOne({ email: email })
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    console.log(hashedPassword)

  if (!emailExist) {
      const userIn = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mob,
        password: hashedPassword,
        is  : false,
      };

      const result = await User.create(userIn);

      if (result) {
        res.render("login", { successMessage: " Registered Succesfully !!" });
      }
    } else {
      res.render("register", { message: " Email already exists !!" });

    }
  } catch (error) {

    res.render("register", { message: " Registration Failed !!" });

  }
};






const loaduserHome = async function (req, res) {
  try {
    if (req.session.user) {
      const userdata = await User.findOne({ _id: req.session.user });
      res.render("userhome", { name: userdata.name, user: userdata });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err.message);
  }
};






const logoutuser = (req, res) => {
  if (req.session.user || req.session.admin) {
    req.session.destroy((err) => {
      if (err) {
        console.log("error in logging out");
      } else {
        res.redirect("/");
      }
    });
  }
  else {
    res.redirect("/")
  }
};






const viewprofile = async function (req, res) {
  try {
    if (req.session.user) {
      const userdata = await User.findOne({ _id: req.session.user });
      res.render("userprofile", { name: userdata.name, user: userdata });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err.message);
  }
};








const editprofileload = async function (req, res) {
  try {
    if (req.session.user) {

      const userdata = await User.findOne({ _id: req.session.user });
      res.render("userprofileedit", { name: userdata.name, user: userdata });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err.message);
  }
};







const editprofile = async (req, res) => {
  try {
    const uname = req.body.name
    const uemail = req.body.email
    const umobile = req.body.mob
    const currpass = req.body.pass1
    const newpass = req.body.pass2
    if (req.session.user) {

      const udata = await User.findById({ _id: req.session.user })

      if (currpass === udata.password) {
        const data = { name: uname, email: uemail, mobile: umobile, password: newpass }

        const result = async (req, res) => {

          try {
            return await User.findByIdAndUpdate({ _id: req.session.user }, { $set: data })
          } catch (error) {
            console.log(error.message)
          }
        }
        const resdata = result(req, res)
        if (resdata) {
          res.redirect("/userhome/viewprofile")
        }
        else {
          res.redirect("/userhome/editprofile")
        }
      }
      else {
        res.redirect("/userhome/editprofile")
      }
    }
    else {
      res.redirect("/");

    }

  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  loadregister,
  insertUser,
  loginload,
  loguser,
  loaduserHome,
  logoutuser,
  viewprofile,
  editprofileload,
  editprofile
};
