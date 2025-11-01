const express = require('express')
const router = express.Router()

const Product = require('../models/product')
const { Category } = require('../models/category')
const { authenticateUser } = require('../middlewares/authenticate')
const { upload } = require('../middlewares/fileUpload')

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001'

// GET list (public or auth as per app)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category').populate('seller', 'firstName email')
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET my products
router.get('/myproduct', authenticateUser, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).populate('category')
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your products' })
  }
})

// CREATE product (multipart/form-data) - attach category and seller
router.post('/', authenticateUser, upload.array('image', 3), async (req, res) => {
  try {
    const { name, description, basePrice, category } = req.body

    if (!name || !basePrice || !category) {
      return res.status(400).json({ error: 'name, basePrice and category are required' })
    }

    // validate category exists
    const cat = await Category.findOne({ _id: category })
    if (!cat) {
      return res.status(400).json({ error: 'Invalid category' })
    }

    // prepare images
    const imageUrls = []
    if (req.files && req.files.length) {
      req.files.forEach(file => {
        // If using local upload
        const url = `${SERVER_URL}/public/uploads/${file.filename}`
        imageUrls.push(url)
      })
    }

    const product = new Product({
      name,
      description,
      basePrice,
      category,
      seller: req.user._id,
      imageUrl: imageUrls
    })

    const saved = await product.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error('Error creating product:', err)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// GET product detail
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category').populate('seller', 'firstName email')
    if (!product) return res.status(404).json({ error: 'Not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// DELETE product
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id })
    if (!product) return res.status(404).json({ error: 'Not found or not authorized' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

module.exports = router
