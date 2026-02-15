const express  = require('express');
const router   = express.Router();
const Product  = require('../models/Product');
const Admin    = require('../models/Admin');

// ── HOME ──────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    const featured = await Product.find({ active: true, featured: true }).limit(6);
    const all      = await Product.find({ active: true }).limit(3);
    res.render('user/home', { title: 'Brand Station – Premium Fashion', featured, all });
});

// ── COLLECTIONS ───────────────────────────────────────────────
router.get('/collections', async (req, res) => {
    const { category, sort } = req.query;
    let query = { active: true };
    if (category) query.category = category;

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc')  sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };

    const products   = await Product.find(query).sort(sortOption);
    const categories = ['Sportswear', 'Essentials', 'Streetwear'];
    res.render('user/collections', { title: 'Collections – Brand Station', products, categories, category, sort });
});

// ── SINGLE COLLECTION / PRODUCT ───────────────────────────────
router.get('/collections/:id', async (req, res) => {
    const product  = await Product.findById(req.params.id);
    if (!product) return res.redirect('/collections');
    const related  = await Product.find({ category: product.category, _id: { $ne: product._id }, active: true }).limit(3);
    res.render('user/product', { title: product.name + ' – Brand Station', product, related });
});

// ── SHOP (alias for collections) ─────────────────────────────
router.get('/shop', async (req, res) => {
    const products   = await Product.find({ active: true }).sort({ createdAt: -1 });
    const categories = ['Sportswear', 'Essentials', 'Streetwear'];
    res.render('user/collections', { title: 'Shop – Brand Station', products, categories, category: null, sort: null });
});

// ── ABOUT ─────────────────────────────────────────────────────
router.get('/about', (req, res) => {
    res.render('user/about', { title: 'About Us – Brand Station' });
});

// ── CONTACT ───────────────────────────────────────────────────
router.get('/contact', async (req, res) => {
    const adminDoc = await Admin.findOne();
    const whatsapp = adminDoc?.whatsapp || process.env.WHATSAPP_NUMBER;
    res.render('user/contact', { title: 'Contact Us – Brand Station', whatsapp });
});

module.exports = router;
