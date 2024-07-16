const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
});

const Category = mongoose.model('category', categorySchema)

module.exports = function (app) {
  app.get("/api/v1/categories", async (req, res) => {
    const categories = await Category.find({})
    return res.status(200).json(categories)
  })

  app.get("/api/v1/categories/:id", async (req, res) => {
    try {
      const categoryId = req.params.id
      const category = await Category.findById(categoryId)
      return res.status(200).json(category)
    } catch (error) {
      console.log(error)
      return res.status(404).json({error})
    }
  })

  app.post("/api/v1/categories/:id", async (req, res) => {
    try {
      const categoryId = req.params.id
      await Category.updateOne({_id: categoryId}, {
        name: req.body.name,
      })
      const category = await Category.findById(categoryId)
      return res.status(200).json(category)
    } catch (error) {
      console.log(error)
      return res.status(404).json({error})
    }
  })

  app.delete("/api/v1/categories", async (req, res) => {
    try {
      const id = req.body.id
      await Category.deleteOne({_id: id})
      return res.status(200).json({})
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  })

  app.post("/api/v1/categories", async (req, res) => {
    try {
      const categoryBody = {
        name: req.body.name,
      }
      const newCategory = await Category.create(categoryBody)
      return res.status(200).json(newCategory)
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  })
}