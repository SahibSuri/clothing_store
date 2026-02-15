const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: String, required: true },
    images:      [{ type: String }],
    colors:      [{ name: String, hex: String }],
    sizes:       [{ type: String }],
    category: {
        type: String,
        enum: ['Sportswear', 'Essentials', 'Streetwear'],
        required: true
    },
    brand:      { type: String, default: '' },
    active:     { type: Boolean, default: true },
    featured:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
