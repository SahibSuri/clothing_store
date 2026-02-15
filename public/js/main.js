// ── NAVBAR HAMBURGER ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('nav-open');
    });
    // close on link click
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('nav-open');
        });
    });
}

// ── NAVBAR SCROLL SHADOW ─────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 40 ? '0 4px 20px rgba(0,0,0,.4)' : 'none';
    });
}

// ── FLASH AUTO-DISMISS ────────────────────────────────────────
document.querySelectorAll('.flash').forEach(el => {
    setTimeout(() => el.style.display = 'none', 4000);
});

// ── COLLECTIONS PAGE: SIZE + BUY NOW ─────────────────────────
const WA_NUMBER = window.WA || '';

document.querySelectorAll('.inline-options').forEach(opts => {
    const card         = opts.closest('.product-card');
    const productName  = opts.dataset.product;
    const productPrice = opts.dataset.price;

    // Size selection
    opts.querySelectorAll('.sz-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            opts.querySelectorAll('.sz-btn').forEach(b => b.classList.remove('sz-active'));
            btn.classList.add('sz-active');
        });
    });

    // Auto-select first size
    const firstSize = opts.querySelector('.sz-btn');
    if (firstSize) firstSize.classList.add('sz-active');

    // Buy Now
    const buyBtn = opts.querySelector('.btn-buy-now');
    if (buyBtn) {
        buyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const activeSize = opts.querySelector('.sz-btn.sz-active');
            if (!activeSize) { alert('Please select a size first'); return; }

            const wa  = WA_NUMBER || document.body.dataset.wa || '';
            const msg = encodeURIComponent(
                `Hi! I'd like to order:\n\n📦 *Product:* ${productName}\n📏 *Size:* ${activeSize.dataset.size}\n💰 *Price:* ${productPrice}\n\nPlease confirm availability. Thank you!`
            );
            window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
        });
    }
});

// ── SCROLL REVEAL ─────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity    = '1';
            e.target.style.transform  = 'translateY(0)';
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.collection-card, .product-card, .value-card, .testimonial-card, .stat-card').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
});
