// Run once: node config/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin    = require('../models/Admin');
const Product  = require('../models/Product');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Create admin
    await Admin.deleteMany({});
    await Admin.create({
        email:    process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        whatsapp: process.env.WHATSAPP_NUMBER
    });
    console.log('✅  Admin created:', process.env.ADMIN_EMAIL);

    // Create sample products
    await Product.deleteMany({});
    await Product.insertMany([
        {
            name: 'Premium Sportswear Collection',
            description: 'Discover our exclusive Nike and Adidas collections featuring sustainable materials and cutting-edge designs for the modern athlete.',
            price: '$89.00',
            images: ['/uploads/default-sport.jpg'],
            colors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#ffffff' }, { name: 'Navy', hex: '#001f3f' }],
            sizes: ['S', 'M', 'L', 'XL'],
            category: 'Sportswear',
            brand: 'Nike',
            active: true, featured: true
        },
        {
            name: 'Contemporary Essentials',
            description: "Elevate your wardrobe with Zara's latest minimalist designs, crafted with eco-conscious materials for the conscious consumer.",
            price: '$69.00',
            images: ['/uploads/default-essential.jpg'],
            colors: [{ name: 'Beige', hex: '#f5f5dc' }, { name: 'Olive', hex: '#556b2f' }],
            sizes: ['S', 'M', 'L', 'XL'],
            category: 'Essentials',
            brand: 'Zara',
            active: true, featured: true
        },
        {
            name: 'Luxury Streetwear',
            description: 'Limited edition pieces blending street culture with high-fashion sophistication and sustainable practices.',
            price: '$99.00',
            images: ['/uploads/default-street.jpg'],
            colors: [{ name: 'Black', hex: '#000000' }, { name: 'Gray', hex: '#808080' }, { name: 'Burgundy', hex: '#800020' }],
            sizes: ['M', 'L', 'XL'],
            category: 'Streetwear',
            brand: 'Adidas',
            active: true, featured: false
        }
    ]);
    console.log('✅  Sample products created');

    mongoose.disconnect();
    console.log('\n🎉  Seed complete! Start server: npm run dev');
}

seed().catch(console.error);
