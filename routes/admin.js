const express    = require('express');
const router     = express.Router();
const Admin      = require('../models/Admin');
const Product    = require('../models/Product');
const { isAdmin } = require('../middleware/auth');
const upload     = require('../config/multer');
const bcrypt     = require('bcryptjs');

// ── LOGIN PAGE ────────────────────────────────────────────────
router.get('/login', (req, res) => {
    if (req.session.admin) return res.redirect('/admin/dashboard');
    res.render('admin/login', { title: 'Admin Login' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/admin/login');
    }
    req.session.admin = { id: admin._id, email: admin.email };
    req.flash('success', 'Welcome back! 👋');
    res.redirect('/admin/dashboard');
});

// ── LOGOUT ────────────────────────────────────────────────────
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// ── DASHBOARD ─────────────────────────────────────────────────
router.get('/dashboard', isAdmin, async (req, res) => {
    const total    = await Product.countDocuments();
    const active   = await Product.countDocuments({ active: true });
    const featured = await Product.countDocuments({ featured: true });
    const recent   = await Product.find().sort({ createdAt: -1 }).limit(5);
    const byCategory = await Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.render('admin/dashboard', { title: 'Dashboard', total, active, featured, recent, byCategory });
});

// ── PRODUCTS LIST ─────────────────────────────────────────────
router.get('/products', isAdmin, async (req, res) => {
    const { q, category } = req.query;
    let query = {};
    if (q)        query.name = { $regex: q, $options: 'i' };
    if (category) query.category = category;
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.render('admin/products', { title: 'Products', products, q: q || '', category: category || '' });
});

// ── ADD PRODUCT ───────────────────────────────────────────────
router.get('/products/new', isAdmin, (req, res) => {
    res.render('admin/product-form', { title: 'Add Product', product: null });
});

router.post('/products', isAdmin, upload.array('images', 6), async (req, res) => {
    try {
        const { name, description, price, category, brand, active, featured, sizes } = req.body;

        // Parse colors from JSON sent by frontend
        let colors = [];
        if (req.body.colors) {
            try { colors = JSON.parse(req.body.colors); } catch(e) {}
        }

        // Collect uploaded image paths
        const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];

        // Normalize sizes to array
        const sizesArr = Array.isArray(sizes) ? sizes : (sizes ? [sizes] : []);

        await Product.create({
            name, description, price, category,
            brand:    brand || '',
            images,
            colors,
            sizes:    sizesArr,
            active:   active === 'on' || active === 'true',
            featured: featured === 'on' || featured === 'true'
        });

        req.flash('success', 'Product added successfully! 🎉');
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to add product: ' + err.message);
        res.redirect('/admin/products/new');
    }
});

// ── EDIT PRODUCT ──────────────────────────────────────────────
router.get('/products/:id/edit', isAdmin, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect('/admin/products');
    res.render('admin/product-form', { title: 'Edit Product', product });
});

router.put('/products/:id', isAdmin, upload.array('images', 6), async (req, res) => {
    try {
        const { name, description, price, category, brand, active, featured, sizes, existingImages } = req.body;

        let colors = [];
        if (req.body.colors) {
            try { colors = JSON.parse(req.body.colors); } catch(e) {}
        }

        // Merge existing + new images
        const kept    = Array.isArray(existingImages) ? existingImages : (existingImages ? [existingImages] : []);
        const newImgs = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
        const images  = [...kept, ...newImgs];

        const sizesArr = Array.isArray(sizes) ? sizes : (sizes ? [sizes] : []);

        await Product.findByIdAndUpdate(req.params.id, {
            name, description, price, category,
            brand: brand || '',
            images,
            colors,
            sizes:    sizesArr,
            active:   active === 'on' || active === 'true',
            featured: featured === 'on' || featured === 'true'
        });

        req.flash('success', 'Product updated successfully!');
        res.redirect('/admin/products');
    } catch (err) {
        req.flash('error', 'Update failed: ' + err.message);
        res.redirect('/admin/products/' + req.params.id + '/edit');
    }
});

// ── DELETE PRODUCT ────────────────────────────────────────────
router.delete('/products/:id', isAdmin, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted.');
    res.redirect('/admin/products');
});

// ── TOGGLE ACTIVE ─────────────────────────────────────────────
router.post('/products/:id/toggle', isAdmin, async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.active = !product.active;
    await product.save();
    res.json({ active: product.active });
});

// ── SETTINGS ──────────────────────────────────────────────────
router.get('/settings', isAdmin, async (req, res) => {
    const adminDoc = await Admin.findById(req.session.admin.id);
    res.render('admin/settings', { title: 'Settings', adminDoc });
});

router.post('/settings', isAdmin, async (req, res) => {
    const { whatsapp, currentPassword, newPassword, confirmPassword } = req.body;
    const adminDoc = await Admin.findById(req.session.admin.id);

    // Update whatsapp
    if (whatsapp) adminDoc.whatsapp = whatsapp;

    // Update password
    if (currentPassword && newPassword) {
        const valid = await adminDoc.comparePassword(currentPassword);
        if (!valid) { req.flash('error', 'Current password is wrong'); return res.redirect('/admin/settings'); }
        if (newPassword !== confirmPassword) { req.flash('error', 'Passwords do not match'); return res.redirect('/admin/settings'); }
        adminDoc.password = newPassword;
    }

    await adminDoc.save();
    req.flash('success', 'Settings saved!');
    res.redirect('/admin/settings');
});

// ── Redirect /admin → /admin/dashboard ───────────────────────
router.get('/', (req, res) => res.redirect('/admin/dashboard'));

module.exports = router;
