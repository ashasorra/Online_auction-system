const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  basePrice: {
    type: Number,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Sold'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;