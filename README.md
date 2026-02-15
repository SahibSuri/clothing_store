# 🛍️ Brand Station — MERN Stack Fashion Store

A full-stack luxury fashion e-commerce website built with **Node.js + Express + MongoDB + EJS**.  
Features a beautiful user-facing storefront and a complete admin panel for product management.

---

## 🗂️ Project Structure

```
brandstation/
├── server.js               ← Express app entry point
├── package.json
├── .env                    ← Environment variables (never commit!)
│
├── config/
│   ├── multer.js           ← Image upload configuration
│   └── seed.js             ← One-time DB seed script
│
├── models/
│   ├── Product.js          ← Mongoose product schema
│   └── Admin.js            ← Mongoose admin schema + bcrypt
│
├── routes/
│   ├── user.js             ← All public-facing routes
│   └── admin.js            ← All admin routes (protected)
│
├── middleware/
│   └── auth.js             ← Session-based admin guard
│
├── views/
│   ├── partials/           ← Shared: navbar, footer, flash
│   ├── user/               ← Home, collections, product, about, contact, 404
│   └── admin/              ← Login, dashboard, products list, form, settings
│       └── partials/       ← Admin sidebar, admin header
│
└── public/
    ├── css/
    │   ├── style.css       ← User-facing styles (pastel yellow × black)
    │   └── admin.css       ← Admin panel styles
    ├── js/
    │   ├── main.js         ← User JS (navbar, WhatsApp, scroll reveal)
    │   └── admin.js        ← Admin JS (toggle, sidebar)
    └── uploads/            ← Uploaded product images
```

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** v18+ → https://nodejs.org
- **MongoDB** v6+ (local) OR a free **MongoDB Atlas** account → https://mongodb.com/atlas
- **npm** (comes with Node.js)

---

### 2. Install Dependencies

```bash
cd brandstation
npm install
```

---

### 3. Configure Environment

Open `.env` and update:

```env
PORT=3000
MONGO_URI=
SESSION_SECRET=change_this_to_a_random_string_please
ADMIN_EMAIL=
ADMIN_PASSWORD=
WHATSAPP_NUMBER=
```

---

### 4. Seed the Database

Run once to create your admin account + 3 sample products:

```bash
node config/seed.js
```

You should see:
```
✅  Admin created: admin@brandstation.com
✅  Sample products created
🎉  Seed complete! Start server: npm run dev
```

---

### 5. Start the Server

**Development** (auto-restarts on changes):
```bash
npm run dev
```

**Production:**
```bash
npm start
```

---

### 6. Open in Browser

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | 🌐 User-facing storefront |
| `http://localhost:3000/admin` | 🔑 Admin panel |

**Default admin credentials:**
- Email: `admin@brandstation.com`
- Password: `Admin@123`

> ⚠️ Change these immediately in `.env` and re-run `node config/seed.js`

---

## 🌐 User-Facing Routes

| Route | Page |
|-------|------|
| `GET /` | Home — hero, featured collections, testimonials |
| `GET /collections` | All products with category filter + sort |
| `GET /collections/:id` | Single product detail with color/size picker |
| `GET /shop` | Same as /collections (alias) |
| `GET /about` | About Us + brand values |
| `GET /contact` | Contact page with WhatsApp form |

---

## 🔑 Admin Routes

| Route | Description |
|-------|-------------|
| `GET  /admin/login` | Login page |
| `POST /admin/login` | Authenticate |
| `GET  /admin/logout` | Destroy session |
| `GET  /admin/dashboard` | Stats + recent products |
| `GET  /admin/products` | List all products (search + filter) |
| `GET  /admin/products/new` | Add product form |
| `POST /admin/products` | Create product |
| `GET  /admin/products/:id/edit` | Edit product form |
| `PUT  /admin/products/:id` | Update product |
| `DELETE /admin/products/:id` | Delete product |
| `POST /admin/products/:id/toggle` | Toggle active status (AJAX) |
| `GET  /admin/settings` | Settings page |
| `POST /admin/settings` | Update password + WhatsApp number |

---

## 🛍️ Features

### User Side
- ✅ Beautiful pastel yellow × black luxury design
- ✅ Animated hero section
- ✅ Product grid with category filtering and sorting
- ✅ Single product page with image gallery
- ✅ Color swatch selector
- ✅ Size selector
- ✅ "Buy Now via WhatsApp" — pre-fills message with product + color + size
- ✅ Floating WhatsApp button on all pages
- ✅ Brand marquee ticker
- ✅ Testimonials section
- ✅ About Us page
- ✅ Contact page with WhatsApp form
- ✅ Scroll reveal animations
- ✅ Fully mobile responsive

### Admin Side
- ✅ Secure login (bcrypt + sessions)
- ✅ Dashboard with stats (total, active, featured)
- ✅ Category breakdown bar chart
- ✅ Product list with search + filter
- ✅ Add/Edit/Delete products
- ✅ Drag & drop image upload (multer)
- ✅ Multiple images per product
- ✅ Preset + custom color builder
- ✅ Size checkbox selector
- ✅ Active/Featured toggles
- ✅ One-click active toggle in product table (AJAX)
- ✅ Change password
- ✅ Update WhatsApp number
- ✅ Flash messages
- ✅ Mobile responsive sidebar

---

## 🗃️ MongoDB Schemas

### Product
```js
{
  name:        String (required)
  description: String (required)
  price:       String (required)          // e.g. "$89.00"
  images:      [String]                   // paths like /uploads/img123.jpg
  colors:      [{ name: String, hex: String }]
  sizes:       [String]                   // ["S","M","L","XL"]
  category:    "Sportswear" | "Essentials" | "Streetwear"
  brand:       String
  active:      Boolean (default: true)
  featured:    Boolean (default: false)
  timestamps:  createdAt, updatedAt
}
```

### Admin
```js
{
  email:     String (unique, required)
  password:  String (bcrypt hashed)
  whatsapp:  String
  timestamps: createdAt, updatedAt
}
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `ejs` | Template engine |
| `bcryptjs` | Password hashing |
| `express-session` | Session management |
| `connect-mongo` | Store sessions in MongoDB |
| `connect-flash` | Flash messages |
| `multer` | File/image upload |
| `method-override` | PUT/DELETE from HTML forms |
| `dotenv` | Environment variables |
| `nodemon` | Dev auto-restart |

---

## 🚢 Deployment

### Option A: Railway (Recommended, Free tier available)
1. Push code to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard
4. Done! Railway auto-detects Node.js

### Option B: Render
1. Push to GitHub
2. Go to https://render.com → New Web Service
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add env vars in dashboard

### Option C: VPS (DigitalOcean / AWS)
```bash
# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name brandstation
pm2 startup
pm2 save
```

### MongoDB Atlas (Production Database)
1. Create free account at https://mongodb.com/atlas
2. Create M0 free cluster
3. Add your IP to Network Access
4. Get connection string
5. Replace MONGO_URI in .env

---

## 🔒 Security Checklist

- [ ] Change default admin email and password in `.env`
- [ ] Use a strong, random `SESSION_SECRET`
- [ ] Never commit `.env` to Git (it's in `.gitignore`)
- [ ] Enable HTTPS in production (use Nginx or platform SSL)
- [ ] Restrict MongoDB Atlas to specific IPs in production

---

## 🎨 Customization

### Change Brand Colors
Edit `public/css/style.css` CSS variables (line 1–10):
```css
:root {
    --y3: #f5b53e;   /* Primary yellow (buttons, accents) */
    --blk: #0A0A0A;  /* Background black */
}
```

### Change WhatsApp Number
Option 1 — Admin Panel: Go to `/admin/settings` and update.  
Option 2 — `.env` file: Update `WHATSAPP_NUMBER=919XXXXXXXXXX`

### Add a New Category
1. Add to `Product.js` model enum: `enum: ['Sportswear', 'Essentials', 'Streetwear', 'YourCategory']`
2. Add to the `<select>` in `views/admin/product-form.ejs`
3. Add filter pill in `views/user/collections.ejs`

---

## 🤝 WhatsApp Order Flow

```
Customer visits website
       ↓
Browses /collections
       ↓
Clicks product → /collections/:id
       ↓
Selects Color + Size
       ↓
Clicks "Buy Now via WhatsApp"
       ↓
WhatsApp opens with pre-filled message:
"Hi! I want to order:
📦 Product: Nike Air Max
🎨 Color: Black
📏 Size: M
💰 Price: $89.00
Please confirm availability."
       ↓
You reply and complete the sale! 💰
```

---

---

*Built with using Node.js + Express + MongoDB + EJS*
