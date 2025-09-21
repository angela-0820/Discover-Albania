(function () {
    'use strict';

    // Konstante per keys ne storage
    const KEYS = { res: 'da_reservations', auth: 'da_auth' };

    // Footer: Viti aktual
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // ---- HELPERA STORAGE (me try/catch per robustesi) ----
    function getRes() {
        try {
            return JSON.parse(localStorage.getItem(KEYS.res)) || [];
        } catch {
            return [];
        }
    }

    function setRes(arr) {
        localStorage.setItem(KEYS.res, JSON.stringify(arr));
    }

    function getAuth() {
        try {
            return JSON.parse(sessionStorage.getItem(KEYS.auth));
        } catch {
            return null;
        }
    }

    function setAuth(user) {
        sessionStorage.setItem(KEYS.auth, JSON.stringify({ u: user, ts: Date.now() }));
    }

    function clearAuth() {
        sessionStorage.removeItem(KEYS.auth);
    }

    // Formatimi i dates 
    function fmt(d) {
        const t = new Date(d);
        return isNaN(t) ? '' : t.toLocaleDateString(
            undefined,
            { year: 'numeric', month: 'short', day: '2-digit' }
        );
    }

    // Demo data nese nuk ka te dhena te ruajtura
    if (!getRes().length) {
        setRes([
            { name: 'Elira', email: 'elira@mail.com', destination: 'Valbona', date: '2025-07-10', message: 'Early start' },
            { name: 'Thomas', email: 'thomas@de.example', destination: 'Ksamil', date: '2025-07-15', message: '' },
            { name: 'Ana', email: 'ana@es.example', destination: 'Lake Komani', date: '2025-07-20', message: 'Window seat' }
        ]);
    }

  
    const loginBox = document.getElementById('loginBox');
    const panel = document.getElementById('adminPanel');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const ddLogout = document.getElementById('dropdownLogoutBtn');

    const tbody = document.getElementById('reservationTable');
    const empty = document.getElementById('emptyState');
    const q = document.getElementById('searchInput');
    const dest = document.getElementById('destinationFilter');
    const sortSel = document.getElementById('sortSelect');
    const refresh = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');

    // Shfaq ose fsheh login/panel
    function show(isIn) {
        if (isIn) {
            loginBox.classList.add('hidden');
            panel.classList.remove('hidden');
        } else {
            loginBox.classList.remove('hidden');
            panel.classList.add('hidden');
        }
    }

    // escape per html (per sigurine e te dhenave)
    function esc(s) {
        return String(s ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // Kerkimi, filtrimi dhe renditja e te dhenave per tabelen
    function filtered() {
        let rows = [...getRes()];

        const qq = (q && q.value ? q.value : '').toLowerCase();
        const d = (dest && dest.value ? dest.value : '');
        const sortVal = (sortSel && sortSel.value) ? sortSel.value : 'date:desc';
        const [key, dir] = sortVal.split(':');

        if (qq) {
            rows = rows.filter(r =>
                (r.name || '').toLowerCase().includes(qq) ||
                (r.email || '').toLowerCase().includes(qq) ||
                (r.destination || '').toLowerCase().includes(qq) ||
                (r.message || '').toLowerCase().includes(qq)
            );
        }

        if (d) {
            rows = rows.filter(r => r.destination === d);
        }

        rows.sort((a, b) => {
            let A = a[key] || '';
            let B = b[key] || '';

            if (key === 'date') {
                A = new Date(A).getTime() || 0;
                B = new Date(B).getTime() || 0;
            } else {
                A = String(A).toLowerCase();
                B = String(B).toLowerCase();
            }

            if (A < B) return (dir === 'asc') ? -1 : 1;
            if (A > B) return (dir === 'asc') ? 1 : -1;
            return 0;
        });

        return rows;
    }

    // Renditja e tabeles
    function render() {
        const rows = filtered();

        tbody.innerHTML = '';
        empty.style.display = rows.length ? 'none' : '';

        rows.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${esc(r.name)}</td>
        <td><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td>
        <td><span class="badge badge-destination">${esc(r.destination)}</span></td>
        <td>${fmt(r.date)}</td>
        <td class="text-nowrap">
          <button class="btn btn-sm btn-outline-light me-1" data-view type="button" aria-label="View reservation">View</button>
          <button class="btn btn-sm btn-outline-danger" data-del  type="button" aria-label="Delete reservation">Delete</button>
        </td>
      `;

            // Veprimi "View" – shfaq detajet ne alert te thjeshte
            tr.querySelector('[data-view]').addEventListener('click', () => {
                alert(
                    `Name: ${r.name}\nEmail: ${r.email}\nDestination: ${r.destination}\nDate: ${fmt(r.date)}\nNotes: ${r.message || '—'}`
                );
            });

            // Veprimi "Delete" – konfirmo dhe fshi nga storage pastaj rifresko
            tr.querySelector('[data-del]').addEventListener('click', () => {
                if (!confirm('Delete this reservation?')) return;

                const all = getRes();
                // Identifikim me kombinim fushash (per prodhim sugjerohet id unike)
                const idx = all.findIndex(x =>
                    x.name === r.name &&
                    x.email === r.email &&
                    x.destination === r.destination &&
                    x.date === r.date
                );
                if (idx > -1) {
                    all.splice(idx, 1);
                    setRes(all);
                    render();
                }
            });

            tbody.appendChild(tr);
        });
    }

    // ---- NGJARJE UI ----
    // DOM eshte gati; ne mbajme edhe kete degjues per sigurine e renditjes se ngarkimit
    document.addEventListener('DOMContentLoaded', () => {
        const isAuth = !!getAuth();
        show(isAuth);
        if (isAuth) render();
    });

    // Login demo
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('adminUser').value.trim();
            const p = document.getElementById('adminPass').value.trim();
            if (u === 'admin' && p === '1234') {
                setAuth(u);
                show(true);
                render();
            } else {
                alert('Invalid credentials.');
            }
        });
    }

    // Logout (nga paneli dhe nga dropdown)
    [logoutBtn, ddLogout].forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            clearAuth();
            show(false);
        });
    });

    // Filtrat dhe sorter-i
    if (q) q.addEventListener('input', render);
    [dest, sortSel].forEach(el => {
        if (!el) return;
        el.addEventListener('input', render);
        el.addEventListener('change', render);
    });

    // Refresh manual
    if (refresh) refresh.addEventListener('click', render);

    // Eksport CSV
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const rows = filtered();
            if (!rows.length) return alert('No data to export.');

            const headers = ['Name', 'Email', 'Destination', 'Date', 'Notes'];
            const csv = [headers.join(',')].concat(
                rows.map(r => [r.name, r.email, r.destination, r.date, r.message || '']
                    // Escape i thonjzave sipas rregullit CSV
                    .map(x => `"${String(x ?? '').replaceAll('"', '""')}"`)
                    .join(','))
            ).join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            // Disa shfletues (p.sh. Firefox) preferojne qe linku te jete ne DOM
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reservations.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });
    }
})();
