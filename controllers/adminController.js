const User = require("../models/userModel");









const loadadminHome = async function (req, res) {
  try {
    if (req.session.admin) {
      const admindata = await User.findOne({ _id: req.session.admin });
      const userData = await User.find({ isAdmin: false });
      res.render("adminhome", { name: admindata.name, user: userData });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err.message);
  }
};




const loadDashboard = async (req, res) => {
  try {
    let search = req.query.search ? req.query.search : "" 
    const userData = await User.find({
      $and: [
        { name: { $regex: new RegExp(search, "i") } },
        { isAdmin: false },
      ],
    });
    res.render('admindashboard', { user: userData, search: search })  
  } catch (error) {
    console.log(error.message)

  }
}




const edituserload = async (req, res) => {
  if (req.session.admin) {
    const uid = req.query.userid;
    const getuserdetails = await User.findById({ _id: uid });
    res.render("adminuseredit", { edituser: getuserdetails });
  } else {
    res.redirect("/");
  }
};






const edituser = async (req, res) => {
  try {
    if (req.session.admin) {
      const id = req.body.id;
      const name = req.body.name;
      const email = req.body.email;
      const mobile = req.body.mob;

      const updateduser = await User.findByIdAndUpdate(
        { _id: id },
        { $set: { name: name, email: email, mobile: mobile } }
      );

      res.redirect("/adminhome");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err.message);
  }
};






const deleteuser = async (req, res) => {
  try {
    if (req.session.admin) {
      const id = req.query.userid;
      const deleteuser = await User.deleteOne({ _id: id });
      res.redirect("/adminhome/dashboard");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err.message);
  }
};




const searchuser = async (req, res) => {
  try {
    if (req.session.admin) {
      const searchdata = req.body.search;
      const [searcheduser, admindata] = await Promise.all([
        (async (req, res) => {
          try {
            return await User.find({
              $and: [
                { name: { $regex: new RegExp(searchdata, "i") } },
                { isAdmin: false },
              ],
            });
          } catch (error) {
            console.log(error.message);
          }
        })(req, res),
        (async (req, res) => {
          try {
            return await User.findById({ _id: req.session.admin });
          } catch (error) {
            console.log(error.message);
          }
        })(req, res),
      ]);
      res.render("adminhome", { name: admindata.name, user: searcheduser });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};






const createuserload = async (req, res) => {
  try {
    if (req.session.admin) {
      const admindata = await User.findById({ _id: req.session.admin });
      res.render("adminusercreate", { name: admindata.name });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};







const createuser = async (req, res) => {
  try {
    if (req.session.admin) {
      const email = req.body.email;
      const emailExist = await User.findOne({ email: email })
      if (!emailExist) {
        const newUserName = req.body.name;
        const newUserEmail = req.body.email;
        const newUserMobile = req.body.mobile;
        const newUserPassword = req.body.password;
        const newUser = await User.create({
          name: newUserName,
          email: newUserEmail,
          mobile: newUserMobile,
          password: newUserPassword,
          isAdmin: false,
        });
        res.redirect("/adminhome/dashboard");
      } else {
        res.render("adminusercreate", { message: " Email already exists !!" });

      }

    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }


};
module.exports = {
  loadadminHome,
  edituserload,
  edituser,
  deleteuser,
  searchuser,
  createuserload,
  createuser,
  loadDashboard
};
