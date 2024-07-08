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
    const existingUser = await User.findOne({email: req.body.email})
    if (existingUser) {
      return res.status(400).json({error: 'Korisnik već postoji'})
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      role: "user",
    })
    await newUser.save();
    return res.status(200).json({})
  })

  app.post("/api/v1/login", async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if (!user) {
      return res.status(400).json({error: 'Korisnik ne postoji'})
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password)
    if (!passwordMatch) {
      return res.status(400).json({error: 'Nevalja ti šifra hababu'})
    }
    const token = jwt.sign({email: user.email}, "p23-akademija")
    return res.status(200).json({token})
  })
}