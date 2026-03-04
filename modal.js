

document.addEventListener('DOMContentLoaded', () => {

    function openModal(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    // [data-close] buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.dataset.close));
    });

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape')
            document.querySelectorAll('.modal-overlay.open')
                    .forEach(m => closeModal(m.id));
    });

    //  Quote modal triggers 
    ['btn-get-quote', 'btn-request-quote'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => openModal('quote-modal'));
    });

    // Quote form submit
    document.getElementById('quote-form')?.addEventListener('submit', e => {
        e.preventDefault();
        closeModal('quote-modal');
        showToast('Request Received!', "We'll call you back shortly.");
        e.target.reset();
    });

    //  Catalogue modal trigger 
    document.getElementById('btn-catalogue')?.addEventListener('click', () => {
        const existing  = document.getElementById('catalogue-email')?.value.trim();
        const mInput    = document.getElementById('modal-catalogue-email');
        if (mInput && existing?.includes('@')) mInput.value = existing;
        openModal('catalogue-modal');
    });

    // Catalogue form submit
    document.getElementById('catalogue-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('modal-catalogue-email')?.value.trim();
        if (!email?.includes('@')) {
            showToast('Invalid Email', 'Please enter a valid email address.', 'error');
            return;
        }
        closeModal('catalogue-modal');
        showToast('Catalogue Requested!', `Brochure will be emailed to ${email}.`);
        e.target.reset();
        const faqIn = document.getElementById('catalogue-email');
        if (faqIn) faqIn.value = '';
    });

});