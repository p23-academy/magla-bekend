const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model('user', userSchema)

module.exports = function (app) {
  app.post("/api/v1/register", async (req, res) => {
    try {
      const existingUser = await User.findOne({email: req.body.email})
      if (existingUser) {
        return res.status(400).json({error: 'Korisnik već postoji'})
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const email = req.body.email
      const newUser = new User({
        email: email,
        password: hashedPassword,
        role: "user",
      })
      await newUser.save();
      const token = jwt.sign({email: email, role: "user"}, "p23-akademija")
      return res.status(200).json({token})
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  })

  app.post("/api/v1/login", async (req, res) => {
    try {
      const user = await User.findOne({email: req.body.email})
      if (!user) {
        return res.status(400).json({error: 'Korisnik ne postoji'})
      }
      const passwordMatch = await bcrypt.compare(req.body.password, user.password)
      if (!passwordMatch) {
        return res.status(400).json({error: 'Nevalja ti šifra hababu'})
      }
      const token = jwt.sign({email: user.email, role: user.role}, "p23-akademija")
      return res.status(200).json({token})
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  })

  app.post("/api/v1/verify", async (req, res) => {
    try {
      const token = req.body.token
      jwt.verify(token, "p23-akademija")
      return res.status(200).json({token})
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  })
}