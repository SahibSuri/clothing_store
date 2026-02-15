// ── SIDEBAR TOGGLE (mobile) ──────────────────────────────────
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar       = document.getElementById('adminSidebar');
if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-open');
    });
}

// ── FLASH AUTO-DISMISS ────────────────────────────────────────
document.querySelectorAll('.flash').forEach(el => {
    setTimeout(() => { el.style.transition='opacity .5s'; el.style.opacity='0'; setTimeout(()=>el.remove(),500); }, 4000);
});

// ── PRODUCT ACTIVE TOGGLE (products table) ───────────────────
document.querySelectorAll('.toggle-cb').forEach(cb => {
    cb.addEventListener('change', async function () {
        const id = this.dataset.id;
        try {
            const res  = await fetch(`/admin/products/${id}/toggle`, { method: 'POST' });
            const data = await res.json();
            // Update the row status badge if present
            const row    = this.closest('tr');
            const badge  = row?.querySelector('.status-dot');
            if (badge) {
                badge.textContent = data.active ? 'Active' : 'Off';
                badge.className   = 'status-dot ' + (data.active ? 'status-active' : 'status-off');
            }
        } catch (err) {
            console.error('Toggle failed', err);
            // Revert checkbox
            this.checked = !this.checked;
        }
    });
});
