const mongoose = require('mongoose');
const path = require('path');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  category: String,
});

const Item = mongoose.model('item', itemSchema)

module.exports = function (app) {
  const upload = require('./upload');

  app.get("/api/v1/items", async (req, res) => {
    const items = await Item.find({})
    return res.status(200).json(items)
  })

  app.get("/api/v1/items/:id", async (req, res) => {
    try {
      const itemId = req.params.id
      const item = await Item.findById(itemId)
      return res.status(200).json(item)
    } catch (error) {
      console.log(error)
      return res.status(404).json({error})
    }
  })

  app.post("/api/v1/items/:id", async (req, res) => {
    try {
      const itemId = req.params.id
      await Item.updateOne({_id: itemId}, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
      })
      const item = await Item.findById(itemId)
      return res.status(200).json(item)
    } catch (error) {
      console.log(error)
      return res.status(404).json({error})
    }
  })

  app.delete("/api/v1/items", async (req, res) => {
    try {
      const id = req.body.id
      await Item.deleteOne({_id: id})
      return res.status(200).json({})
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  })

  app.post("/api/v1/items", async (req, res) => {
    try {
      const itemBody = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
      }
      const newItem = await Item.create(itemBody)
      return res.status(200).json(newItem)
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  })

  app.post('/api/v1/upload', upload.single('file'), (req, res) => {
    try {
      const file = req.file
      const fileName = file.filename
      const fileUrl = "http://localhost:3000/api/v1/uploads/" + fileName
      return res.status(200).json({fileUrl});
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  });

  app.get('/api/v1/uploads/:fileName', async (req, res) => {
    try {
      const fileName = req.params.fileName;
      const fileUrl = path.join(__dirname, "..", "uploads", fileName);
      return res.status(200).sendFile(fileUrl);
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  })
}