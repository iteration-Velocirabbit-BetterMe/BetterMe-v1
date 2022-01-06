const express = require("express");
const router = express.Router();
const db = require("../db-models/db-models.js");
const appControllers = require("../controller/controller.js");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

router.get('/logout', (req, res) => {
  res.clearCookie('user');
  return res.status(200).json({deleted: true});
})

router.post("/signup", appControllers.signup, (req, res) => {
  if (res.locals.validationErrors) {
    console.log(res.locals.validationErrors);
    return res.json(res.locals.validationErrors);
  }

  if (res.locals.message) {
    console.log("this is the message: ", res.locals.message);
    return res.status(200).json({ message: res.locals.message });
  }

  if (res.locals.error) {
    console.log("this is error:", res.locals.error);
    return res.status(400).send(res.locals.error);
  }
});

router.post("/login", appControllers.login, appControllers.checkPassword, (req, res) => {
  if (res.locals.clearance) {
    
    console.log(res.locals.message);
    res.status(200).json({ message: res.locals.message });
  }
  else {
    console.log(res.locals.error);
    res.status(400).json({ error: res.locals.error });
  }
});

router.put("/:id/updateProfile", async (req, res) => {
  const { id } = req.params;
  const bcryptPassword = await bcrypt.hash(req.body.password, SALT_WORK_FACTOR)
  const { fullName, username, email } = req.body;

  const q =
    "UPDATE users SET username =($1), password=($2), email=($3), fullName=($4) WHERE user_id=($5)";
  await db.query(
    q,
    [username, bcryptPassword, email, fullName, id],
    (err, result) => {
      if (err) {
        return res.status(400).send("Error updating userAccountDetails");
      }
      if (result) {
        db.query("SELECT * from users where user_id=($1)",[id],(err,result) =>{
          if(err) return res.status(400).send("Error in selecting updated user details");
              res.cookie("user", JSON.stringify(result.rows[0]), {
                maxAge: 900000,
                httpOnly: false,
              });
            return res.status(200).send("User Details updated successfully");
        })
      }
    }
  );
});

module.exports = router;
