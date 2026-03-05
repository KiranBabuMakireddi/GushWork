document.addEventListener('DOMContentLoaded', () => {

    // Dummy csv file donload from tech secp button
    document.getElementById('download-specs')?.addEventListener('click', () => {
        const rows = document.querySelectorAll('.specs-table tbody tr');
        if (!rows.length) return;
        const lines = ['"Parameter","Specification"'];
        rows.forEach(r => {
            const c = r.querySelectorAll('td');
            if (c.length >= 2)
                lines.push(`"${c[0].innerText.trim().replace(/"/g,'""')}","${c[1].innerText.trim().replace(/"/g,'""')}"`);
        });
        const a = Object.assign(document.createElement('a'), {
            href:     URL.createObjectURL(new Blob([lines.join('\n')], { type:'text/csv' })),
            download: 'Mangalam_HDPE_Datasheet.csv'
        });
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast('Download Started', 'Datasheet is downloading as CSV.');
    });

    // hamberger menu for mobile screen
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks     = document.querySelector('nav .nav-links');

    mobileToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        mobileToggle.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
    });

    // produc tload logic form json file
    const mainImage = document.getElementById('main-product-image');

    async function initProducts() {
        try {
            const res  = await fetch('/json/products.json');
            if (!res.ok) throw new Error(res.status);
            const data = await res.json();
            if (!Array.isArray(data) || !data.length) return;
            loadProduct(data[0]);
            document.querySelectorAll('[data-product]').forEach(link => {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    const p = data.find(p => p.id === link.dataset.product);
                    if (p) loadProduct(p);
                });
            });
        } catch (err) { console.warn('products.json:', err); }
    }

    function loadProduct(p) {
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('current-breadcrumb', p.name);
        set('product-title',      p.title);
        set('product-price',      p.priceRange);
        set('product-shipping',   `Shipping: ${p.shipping}`);
        set('product-returns',    `Returns: ${p.returns}`);
        set('product-certs-text', `Certifications: ${p.certifications.join(', ')}`);

        const feats = document.getElementById('product-features');
        if (feats) feats.innerHTML = p.features
            .map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('');

        const badges = document.getElementById('product-badges');
        if (badges) badges.innerHTML = p.certifications
            .map(c => `<span class="badge"><i class="fas fa-check-circle"></i> ${c}</span>`).join('');

        if (mainImage) {
            const src = p.image || mainImage.src;
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = src;
                mainImage.style.opacity = '1';
                document.querySelectorAll('.thumb img').forEach(img => img.src = src);
            }, 150);
        }
    }

    // Carousel thumbanail display
    document.querySelectorAll('.thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.querySelector('.thumb.active')?.classList.remove('active');
            thumb.classList.add('active');
            if (!mainImage) return;
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = thumb.querySelector('img').src;
                mainImage.style.opacity = '1';
            }, 150);
        });
    });

    const getThumbs = () => [...document.querySelectorAll('.thumb')];
    document.querySelector('.gallery-nav.prev')?.addEventListener('click', () => {
        const t = getThumbs(), i = t.findIndex(x => x.classList.contains('active'));
        t[(i - 1 + t.length) % t.length].click();
    });
    document.querySelector('.gallery-nav.next')?.addEventListener('click', () => {
        const t = getThumbs(), i = t.findIndex(x => x.classList.contains('active'));
        t[(i + 1) % t.length].click();
    });

    // Zoom lofic to zoom carousel image
    const zoomContainer = document.getElementById('zoom-container');
    const zoomLens      = document.getElementById('zoom-lens');
    const zoomResult    = document.getElementById('zoom-result');

    if (zoomContainer && zoomLens && zoomResult && mainImage) {
        const showZoom = () => {
            if (window.innerWidth < 992) return;
            zoomLens.style.display   = 'block';
            zoomResult.style.display = 'block';
        };
        const hideZoom = () => {
            zoomLens.style.display   = 'none';
            zoomResult.style.display = 'none';
        };
        const moveLens = e => {
            const rect = mainImage.getBoundingClientRect();
            const rawX = e.touches ? e.touches[0].clientX : e.clientX;
            const rawY = e.touches ? e.touches[0].clientY : e.clientY;
            const hw = zoomLens.offsetWidth  / 2;
            const hh = zoomLens.offsetHeight / 2;
            const imgW = mainImage.offsetWidth;
            const imgH = mainImage.offsetHeight;
            let x = Math.min(Math.max(rawX - rect.left, hw), imgW - hw);
            let y = Math.min(Math.max(rawY - rect.top,  hh), imgH - hh);
            zoomLens.style.left = (x - hw) + 'px';
            zoomLens.style.top  = (y - hh) + 'px';
            const sx = zoomResult.offsetWidth  / zoomLens.offsetWidth;
            const sy = zoomResult.offsetHeight / zoomLens.offsetHeight;
            zoomResult.style.backgroundImage    = `url('${mainImage.src}')`;
            zoomResult.style.backgroundSize     = `${imgW * sx}px ${imgH * sy}px`;
            zoomResult.style.backgroundPosition = `-${(x - hw) * sx}px -${(y - hh) * sy}px`;
        };
        zoomContainer.addEventListener('mouseenter', showZoom);
        zoomContainer.addEventListener('mouseleave', hideZoom);
        zoomContainer.addEventListener('mousemove',  moveLens);
        zoomContainer.addEventListener('touchstart', showZoom, { passive: true });
        zoomContainer.addEventListener('touchend',   hideZoom);
        zoomContainer.addEventListener('touchmove',  e => { e.preventDefault(); moveLens(e); }, { passive: false });
        window.addEventListener('resize', () => { if (window.innerWidth < 992) hideZoom(); });
    }

    // Applcaition dipaly from json file logic
    async function initApplications() {
        try {
            const res = await fetch('/json/applications.json');
            if (!res.ok) throw new Error(res.status);
            renderApplications(await res.json());
        } catch (err) { console.warn('applications.json:', err); }
    }

    function renderApplications(items) {
        const track = document.getElementById('apps-track');
        if (!track) return;
        track.innerHTML = [...items, ...items].map(item => `
            <div class="app-card">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="app-card-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>`).join('');
        const CARD_W = 260 + 20;
        const MIN    = -(items.length * CARD_W);
        let offset   = 0;
        document.getElementById('apps-prev')?.addEventListener('click', () => {
            offset = Math.min(offset + CARD_W, 0);
            track.style.transform = `translateX(${offset}px)`;
        });
        document.getElementById('apps-next')?.addEventListener('click', () => {
            offset = Math.max(offset - CARD_W, MIN);
            track.style.transform = `translateX(${offset}px)`;
        });
    }

    // Process rendering logic from json
    let processData = [], activeStep = 0;

    async function initProcess() {
        try {
            const res = await fetch('/json/process.json');
            if (!res.ok) throw new Error(res.status);
            processData = await res.json();
            renderProcessTabs();
            renderProcessBody(0);
        } catch (err) { console.warn('process.json:', err); }
    }

    function renderProcessTabs() {
        const wrap = document.getElementById('process-tabs');
        if (!wrap) return;
        wrap.innerHTML = processData.map((s, i) => `
            ${i > 0 ? '<div class="process-tab-connector"></div>' : ''}
            <button class="process-tab ${i === 0 ? 'active' : ''}" data-step="${i}">${s.label}</button>
        `).join('');
        wrap.querySelectorAll('.process-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                activeStep = +btn.dataset.step;
                wrap.querySelectorAll('.process-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProcessBody(activeStep);
            });
        });
    }

    function renderProcessBody(i) {
        const step = processData[i]; if (!step) return;
        const left = document.getElementById('process-body-left');
        if (left) left.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.description}</p>
            ${step.bullets.map(b => `<div class="process-bullet">${b}</div>`).join('')}`;
        const img = document.getElementById('process-img');
        if (img) { img.src = step.image || '/images/product_pipe.png'; img.alt = step.title; }
    }

    const shiftStep = d => {
        const len = processData.length || 1;
        activeStep = (activeStep + d + len) % len;
        document.querySelectorAll('.process-tab')
                .forEach((b, i) => b.classList.toggle('active', i === activeStep));
        renderProcessBody(activeStep);
    };
    document.getElementById('process-prev')?.addEventListener('click', () => shiftStep(-1));
    document.getElementById('process-next')?.addEventListener('click', () => shiftStep(1));

    // Testimonial render logic fro json file
    async function initTestimonials() {
        try {
            const res = await fetch('/json/testimonials.json');
            if (!res.ok) throw new Error(res.status);
            renderTestimonials(await res.json());
        } catch (err) { console.warn('testimonials.json:', err); }
    }

    function renderTestimonials(items) {
        const track = document.getElementById('testimonials-track');
        if (!track) return;
        track.innerHTML = [...items, ...items].map(t => `
            <div class="testimonial-card">
                <div class="testimonial-quote">"</div>
                <h3>${t.heading}</h3>
                <p>${t.body}</p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar">${t.name.charAt(0)}</div>
                    <div class="testimonial-author-info">
                        <strong>${t.name}</strong>
                        <span>${t.role}</span>
                    </div>
                </div>
            </div>`).join('');
    }

    // Faq section accordian logic from json file
    async function initFaq() {
        try {
            const res = await fetch('/json/faq.json');
            if (!res.ok) throw new Error(res.status);
            renderFaq(await res.json());
        } catch (err) { console.warn('faq.json:', err); }
    }

    function renderFaq(faqs) {
        const list = document.getElementById('faq-list');
        if (!list) return;
        list.innerHTML = faqs.map((f, i) => `
            <div class="faq-item ">
                <button class="faq-question">
                    ${f.question}
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="faq-answer">${f.answer}</div>
            </div>`).join('');
        list.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item    = btn.closest('.faq-item');
                const wasOpen = item.classList.contains('open');
                list.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
                if (!wasOpen) item.classList.add('open');
            });
        });
    }

    
    document.getElementById('contact-form')?.addEventListener('submit', e => {
        e.preventDefault();
        showToast('Message Sent!', 'Thank you! We will get back to you shortly.');
        e.target.reset();
    });

    // Load data fro the json file to show the section data on page load
    initProducts();
    initApplications();
    initProcess();
    initTestimonials();
    initFaq();

});