function toggleMenu() {
    const m = document.getElementById('mMenu');
    if (!m) return;
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
}


let i18nCache = null;


function detectLang() {
    const urlLang = new URLSearchParams(location.search).get('lang');
    if (urlLang) return urlLang;
    const saved = localStorage.getItem('lang');
    if (saved) return saved;
    const nav = (navigator.language || 'en').toLowerCase();
    return nav.startsWith('fr') ? 'fr' : 'en';
}


async function applyTranslations(lang) {
    try {
        if (!i18nCache) {
            const res = await fetch('./translations.json', { cache: 'no-store' });
            i18nCache = await res.json();
        }
        const dict = i18nCache[lang] || i18nCache['en'];


        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = deepGet(dict, key);
            if (typeof val === 'string') el.textContent = val;
        });


        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const pairs = el.getAttribute('data-i18n-attr').split(',').map(s => s.trim());
            pairs.forEach(pair => {
                const [attr, key] = pair.split(':');
                const val = deepGet(dict, key);
                if (attr && typeof val === 'string') el.setAttribute(attr, val);
            });
        });


        document.documentElement.setAttribute('lang', lang);
        document.body.setAttribute('data-lang', lang);


        const yearEl = document.getElementById('yr');
        if (yearEl) yearEl.textContent = new Date().getFullYear();


        const sel = document.getElementById('langSelect');
        if (sel && sel.value !== lang) sel.value = lang;
    } catch (err) {
        console.error('i18n load error', err);
    }
}


function deepGet(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] != null) ? o[k] : undefined, obj);
}