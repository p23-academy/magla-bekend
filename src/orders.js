const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  time: Date,
  items: Array,
  total: Number,
  status: String,
  buyerName: String,
  buyerAddress: String,
  buyerPhone: String,
});

const Order = mongoose.model('order', orderSchema)

module.exports = function (app) {

  app.get("/api/v1/orders", async (req, res) => {
    const orders = await Order.find({})
    return res.status(200).json(orders)
  })

  app.get("/api/v1/orders/:id", async (req, res) => {
    try {
      const orderId = req.params.id
      const order = await Order.findById(orderId)
      return res.status(200).json(order)
    } catch (error) {
      console.log(error)
      return res.status(404).json({error})
    }
  })

  app.post("/api/v1/orders", async (req, res) => {
    try {
      const items = req.body.items || []
      const total = items.reduce((total, item) => (total + item.price), 0)
      const orderBody = {
        time: new Date(),
        items: items,
        total: total,
        status: "new",
        buyerName: req.body.buyerName,
        buyerAddress: req.body.buyerAddress,
        buyerPhone: req.body.buyerPhone,
      }
      const newOrder = await Order.create(orderBody)
      return res.status(200).json(newOrder)
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  })

  app.post("/api/v1/orders/:id", async (req, res) => {
    try {
      const orderId = req.params.id
      await Order.updateOne({_id: orderId}, {
        status: req.body.status,
      })
      const order = await Order.findById(orderId)
      return res.status(200).json(order)
    } catch (error) {
      console.log(error)
      return res.status(400).json({error})
    }
  })
}