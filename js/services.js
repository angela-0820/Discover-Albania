(function () {
    // vit dinamik ne footer
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // storage key
    const KEY = 'da_services';
    function get() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
    function set(v) { localStorage.setItem(KEY, JSON.stringify(v)); }

    // seed demo nese bosh
    if (!get().length) {
        set([
            { name: 'Guided Hiking Tour – Valbona', desc: 'A full-day guided hike in Valbona National Park.', price: 80 },
            { name: 'Ferry Trip – Lake Komani', desc: 'Scenic boat ride through the fjords of Albania.', price: 25 },
            { name: 'Beach Day – Ksamil', desc: 'Relax on white sand with optional island hop.', price: 55 }
        ]);
    }

    // dom refs
    const tbody = document.querySelector('#servicesTable tbody');
    const form = document.getElementById('serviceForm');
    const modalEl = document.getElementById('serviceModal');
    const modal = new bootstrap.Modal(modalEl);
    const idxEl = document.getElementById('editingIndex');
    const title = document.getElementById('serviceModalTitle');

    // sanitizim (shmang injektimin e html)
    function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

    // render tabele
    function render() {
        const rows = get();
        tbody.innerHTML = '';

        rows.forEach((s, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td class="fw-semibold">${esc(s.name)}</td>
            <td class="text-muted">${esc(s.desc)}</td>
            <td>${Number(s.price).toFixed(0)}</td>
            <td class="text-nowrap">
              <button class="btn btn-sm btn-outline-light me-1" data-edit="${i}" type="button" aria-label="Edit service"><i class="bi bi-pencil" aria-hidden="true"></i></button>
              <button class="btn btn-sm btn-outline-danger" data-del="${i}" type="button" aria-label="Delete service"><i class="bi bi-trash" aria-hidden="true"></i></button>
            </td>`;
            tbody.appendChild(tr);
        });

        // ngjit eventet pas renderit
        tbody.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => {
            const i = Number(btn.getAttribute('data-edit'));
            const s = get()[i];
            title.textContent = 'Edit Service';
            idxEl.value = String(i);
            form.svcName.value = s.name;
            form.svcDesc.value = s.desc;
            form.svcPrice.value = s.price;
            form.classList.remove('was-validated');
            modal.show();
        }));

        tbody.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => {
            const i = Number(btn.getAttribute('data-del'));
            const rows2 = get();
            if (!confirm('Delete this service?')) return;
            rows2.splice(i, 1);
            set(rows2);
            render();
        }));
    }

    // modal lifecycle
    modalEl.addEventListener('show.bs.modal', () => {
        if (idxEl.value === '-1') {
            title.textContent = 'Add Service';
            form.reset();
        }
    });
    modalEl.addEventListener('hidden.bs.modal', () => {
        idxEl.value = '-1';
        form.reset();
        form.classList.remove('was-validated');
    });

    // submit (add/edit)
    form.addEventListener('submit', e => {
        e.preventDefault();
        form.classList.add('was-validated');
        if (!form.checkValidity()) return;

        const row = {
            name: form.svcName.value.trim(),
            desc: form.svcDesc.value.trim(),
            price: Number(form.svcPrice.value || 0)
        };

        const rows = get();
        const i = Number(idxEl.value);
        if (i >= 0) rows[i] = row; else rows.push(row);
        set(rows);
        render();
        modal.hide();
    });

    // fillimi
    render();
})();
