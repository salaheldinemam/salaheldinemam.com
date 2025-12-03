/* ===== scripts.js (extracted + cleaned) ===== */

(function () {
    // Elements
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('[data-section]');

    /* ===== THEME HANDLING ===== */
    function applyTheme(theme) {
        if (theme === 'dark') document.documentElement.classList.add('dark'), document.body.classList.add('dark');
        else document.documentElement.classList.remove('dark'), document.body.classList.remove('dark');
        try { localStorage.setItem('site-theme', theme); } catch (e) { /* ignore */ }
        if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'dark');
        if (themeIcon) {
            themeIcon.innerHTML = theme === 'dark'
                ? '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />'
                : '<path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke-linecap="round" stroke-linejoin="round" />';
        }
    }

    (function initTheme() {
        let saved = null;
        try { saved = localStorage.getItem('site-theme'); } catch (e) { saved = null; }
        if (saved) applyTheme(saved);
        else {
            const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefers ? 'dark' : 'light');
        }
    })();

    if (themeToggle) themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        applyTheme(isDark ? 'light' : 'dark');
    });

    /* ===== MOBILE MENU ===== */
    if (menuToggle && mobileDrawer) {
        menuToggle.addEventListener('click', () => {
            const open = mobileDrawer.style.display === 'flex';
            mobileDrawer.style.display = open ? 'none' : 'flex';
            menuToggle.setAttribute('aria-expanded', !open);
            mobileDrawer.setAttribute('aria-hidden', open);
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mobileDrawer.contains(e.target)) {
                mobileDrawer.style.display = 'none';
                menuToggle.setAttribute('aria-expanded', false);
                mobileDrawer.setAttribute('aria-hidden', true);
            }
        });
    }

    /* ===== SECTION NAV & SHOW/HIDE (single page) ===== */
    function showSection(id) {
        sections.forEach(s => {
            if (s.id === id) { s.hidden = false; s.classList.add('visible'); s.scrollIntoView({ behavior: 'smooth' }); }
            else s.hidden = true;
        });
        navLinks.forEach(a => a.classList.toggle('active', a.dataset.target === id));
    }

    // initial show home
    showSection('home');

    // nav click handlers
    document.querySelectorAll('[data-target]').forEach(el => {
        el.addEventListener('click', (ev) => {
            ev.preventDefault();
            const id = el.getAttribute('data-target');
            showSection(id);
            if (mobileDrawer) { mobileDrawer.style.display = 'none'; menuToggle.setAttribute('aria-expanded', false); }
        });
    });

    // deep links
    if (location.hash) {
        const h = location.hash.replace('#', '');
        if (['home', 'resume', 'projects', 'contact'].includes(h)) showSection(h);
    }

    /* ===== ACCORDION ===== */
    document.querySelectorAll('[data-acc]').forEach(head => {
        head.addEventListener('click', () => {
            const body = head.nextElementSibling;
            const open = body.classList.contains('open');
            // close all
            document.querySelectorAll('.acc-body').forEach(b => {
                b.style.maxHeight = null;
                b.classList.remove('open');
            });
            if (!open) {
                body.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });

    // Expand summary by default
    document.addEventListener('DOMContentLoaded', () => {
        const firstBody = document.querySelector('.accordion-summary .acc-body');
        if (firstBody) { firstBody.classList.add('open'); firstBody.style.maxHeight = firstBody.scrollHeight + 'px'; }
    });

    /* ===== REVEAL ON SCROLL (slide-up) ===== */
    const revealed = document.querySelectorAll('.reveal');
    try {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealed.forEach(r => io.observe(r));
    } catch (e) {
        // fallback: show all
        revealed.forEach(r => r.classList.add('visible'));
    }

    /* ===== CONTACT FORM (demo) ===== */
    function handleContact(e) {
        e.preventDefault();
        const form = e.target;
        const name = form.name?.value || form.querySelector('#name')?.value || 'there';
        const email = form.email?.value || form.querySelector('#email')?.value || '';
        const msg = form.message?.value || form.querySelector('#msg')?.value || '';
        const mailto = `mailto:goldencap2009@gmail.com?subject=${encodeURIComponent('Website message from ' + name)}&body=${encodeURIComponent(msg + '\n\nFrom: ' + name + ' (' + email + ')')}`;
        window.location.href = mailto;
    }
    window.handleContact = handleContact;

    /* ===== EXPORT CV TO PDF ===== */
    const exportBtn = document.getElementById('exportPdf');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            const cvSection = document.querySelector('#resume .cv-wrap');
            if (!cvSection) { alert("CV content not found."); return; }

            // Expand all
            const bodies = document.querySelectorAll('#resume .acc-body');
            bodies.forEach(body => {
                body.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
            });

            // Clone
            const clone = cvSection.cloneNode(true);
            clone.style.padding = "20px";
            clone.style.background = "#ffffff";
            clone.style.color = "#000000";
            clone.style.maxWidth = "800px";
            clone.style.fontSize = "14px";

            clone.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal'));

            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'fixed';
            tempContainer.style.top = '-9999px';
            tempContainer.appendChild(clone);
            document.body.appendChild(tempContainer);

            const opt = {
                margin: 10,
                filename: 'Salah-Eldin-Emam-CV.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            try {
                await html2pdf().set(opt).from(clone).save();
            } catch (err) {
                console.error('PDF export failed', err);
                alert('Export failed. Check console for details.');
            } finally {
                document.body.removeChild(tempContainer);
            }
        });
    }

})();
