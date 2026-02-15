const express      = require('express');
const mongoose     = require('mongoose');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const flash        = require('connect-flash');
const methodOverride = require('method-override');
const path         = require('path');
require('dotenv').config();

// ── Validate required env vars ───────────────────────────────
const MONGO_URI      = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback_secret_change_me';

if (!MONGO_URI) {
    console.error('❌  FATAL: MONGO_URI is not set in environment variables.');
    console.error('    → On Render: go to Environment tab and add MONGO_URI');
    console.error('    → Locally: check your .env file');
    process.exit(1);   // crash early with a clear message
}

const app = express();

// ── View Engine ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Core Middleware ──────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// ── Sessions (uses same Mongoose connection) ─────────────────
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        touchAfter: 24 * 3600   // only update session once per day unless data changes
    }),
    cookie: {
        maxAge:   1000 * 60 * 60 * 24,   // 24 hours
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production'
    }
}));

app.use(flash());

// ── Global Template Locals ───────────────────────────────────
app.use((req, res, next) => {
    res.locals.success  = req.flash('success');
    res.locals.error    = req.flash('error');
    res.locals.admin    = req.session.admin || null;
    res.locals.whatsapp = process.env.WHATSAPP_NUMBER || '';
    next();
});

// ── Routes ───────────────────────────────────────────────────
app.use('/',      require('./routes/user'));
app.use('/admin', require('./routes/admin'));

// ── 404 ──────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).render('user/404', { title: 'Page Not Found' });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).send('<h1>Something went wrong</h1><p>' + err.message + '</p>');
});

// ── Connect to MongoDB THEN start server ─────────────────────
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅  MongoDB connected');
        app.listen(PORT, () => {
            console.log(`🚀  Brand Station running on port ${PORT}`);
            console.log(`🔑  Admin: http://localhost:${PORT}/admin`);
        });
    })
    .catch(err => {
        console.error('❌  MongoDB connection failed:', err.message);
        process.exit(1);
    });
