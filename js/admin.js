/* ================================================
   WISATA JOMOKERTO - Admin Panel JavaScript
   ================================================ */

'use strict';

// =========== ADMIN AUTH CHECK ===========
const AdminAuth = {
  init() {
    const user = JSON.parse(localStorage.getItem('wj-user') || 'null');
    if (!user || user.role !== 'admin') {
      document.getElementById('authRequired').style.display = 'flex';
      document.getElementById('adminPanel').style.display = 'none';
      return false;
    }
    document.getElementById('authRequired').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    document.getElementById('adminName').textContent = user.name;
    document.getElementById('adminEmail').textContent = user.email;
    document.getElementById('adminInitials').textContent = user.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
    return true;
  },
  
  logout() {
    localStorage.removeItem('wj-user');
    window.location.href = '../index.html';
  },
  
  loginAsAdmin() {
    const users = JSON.parse(localStorage.getItem('wj-users') || '[]');
    const admin = users.find(u => u.role === 'admin');
    if (admin) {
      localStorage.setItem('wj-user', JSON.stringify(admin));
      location.reload();
    } else {
      AdminToast.show('Admin tidak ditemukan. Buka website utama dulu!', 'error');
    }
  }
};

// =========== THEME ===========
const AdminTheme = {
  init() {
    const saved = localStorage.getItem('wj-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateIcon(saved);
    
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('wj-theme', next);
      this.updateIcon(next);
    });
  },
  
  updateIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
};

// =========== SIDEBAR ===========
const Sidebar = {
  collapsed: false,
  
  init() {
    document.getElementById('sidebarToggle')?.addEventListener('click', () => this.toggle());
    document.getElementById('sidebarToggleMobile')?.addEventListener('click', () => this.open());
    
    // Active link
    const path = window.location.pathname;
    document.querySelectorAll('.sidebar-link').forEach(link => {
      if (link.getAttribute('href') && path.includes(link.getAttribute('href').replace('.html',''))) {
        link.classList.add('active');
      }
    });
  },
  
  toggle() {
    const sidebar = document.getElementById('sidebar');
    this.collapsed = !this.collapsed;
    sidebar.classList.toggle('collapsed', this.collapsed);
  },
  
  open() {
    document.getElementById('sidebar').classList.add('open');
  }
};

// =========== TOAST ===========
const AdminToast = {
  container: null,
  
  init() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.id = 'toastContainer';
      document.body.appendChild(this.container);
    }
  },
  
  show(msg, type = 'success', duration = 3500) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type]}</span> <span>${msg}</span>`;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s reverse ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// =========== MODAL ===========
const AdminModal = {
  open(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  },
  close(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
  },
  init() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) { m.classList.remove('open'); document.body.style.overflow = ''; }
      });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
          m.classList.remove('open');
        });
        document.body.style.overflow = '';
      }
    });
  }
};

// =========== DESTINATIONS ADMIN ===========
const AdminDestinations = {
  data: [],
  page: 1,
  perPage: 10,
  searchQuery: '',
  filterType: 'all',
  filterStatus: 'all',
  editId: null,
  
  init() {
    this.load();
    this.render();
    this.bindEvents();
  },
  
  load() {
    // Base destinations (same as main)
    const base = [
      { id: 1, nama: 'Bromo Tengger Semeru', lokasi: 'Probolinggo, Jawa Timur', negara: 'Indonesia', tipe: 'dalam_negeri', kategori: 'gunung', gambar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200', harga: 250000, rating: 4.9, ulasan: 1240, status: 'aktif', is_featured: true },
      { id: 2, nama: 'Raja Ampat', lokasi: 'Sorong, Papua Barat', negara: 'Indonesia', tipe: 'dalam_negeri', kategori: 'pantai', gambar: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=200', harga: 1500000, rating: 4.8, ulasan: 890, status: 'aktif', is_featured: true },
      { id: 3, nama: 'Borobudur', lokasi: 'Magelang, Jawa Tengah', negara: 'Indonesia', tipe: 'dalam_negeri', kategori: 'budaya', gambar: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=200', harga: 50000, rating: 4.7, ulasan: 2100, status: 'aktif', is_featured: true },
      { id: 4, nama: 'Gili Trawangan', lokasi: 'Lombok, NTB', negara: 'Indonesia', tipe: 'dalam_negeri', kategori: 'pantai', gambar: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200', harga: 350000, rating: 4.6, ulasan: 756, status: 'aktif', is_featured: true },
      { id: 5, nama: 'Danau Toba', lokasi: 'Sumatera Utara', negara: 'Indonesia', tipe: 'dalam_negeri', kategori: 'alam', gambar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', harga: 200000, rating: 4.5, ulasan: 630, status: 'aktif', is_featured: false },
      { id: 6, nama: 'Santorini', lokasi: 'Yunani', negara: 'Yunani', tipe: 'luar_negeri', kategori: 'pantai', gambar: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=200', harga: 15000000, rating: 4.9, ulasan: 3200, status: 'aktif', is_featured: true },
      { id: 7, nama: 'Tokyo', lokasi: 'Jepang', negara: 'Jepang', tipe: 'luar_negeri', kategori: 'kota', gambar: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200', harga: 20000000, rating: 4.8, ulasan: 5600, status: 'aktif', is_featured: true },
    ];
    
    const custom = JSON.parse(localStorage.getItem('wj-destinations') || '[]');
    this.data = [...base, ...custom];
    
    // Update stats
    this.updateStats();
  },
  
  updateStats() {
    const total = this.data.length;
    const dn = this.data.filter(d => d.tipe === 'dalam_negeri').length;
    const ln = this.data.filter(d => d.tipe === 'luar_negeri').length;
    const featured = this.data.filter(d => d.is_featured).length;
    
    const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
    set('totalDest', total);
    set('totalDN', dn);
    set('totalLN', ln);
    set('totalFeatured', featured);
  },
  
  filtered() {
    return this.data.filter(d => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || d.nama.toLowerCase().includes(q) || d.lokasi.toLowerCase().includes(q);
      const matchType = this.filterType === 'all' || d.tipe === this.filterType;
      const matchStatus = this.filterStatus === 'all' || d.status === this.filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  },
  
  render() {
    const tbody = document.getElementById('destTableBody');
    if (!tbody) return;
    
    const list = this.filtered();
    const start = (this.page - 1) * this.perPage;
    const paged = list.slice(start, start + this.perPage);
    
    // Count label
    const label = document.getElementById('destCount');
    if (label) label.textContent = `${list.length} destinasi`;
    
    if (!paged.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px">
        <div style="font-size:40px;margin-bottom:8px">🔍</div>
        <div style="color:var(--text-muted)">Tidak ada data ditemukan</div>
      </td></tr>`;
      return;
    }
    
    tbody.innerHTML = paged.map(d => {
      const harga = d.harga >= 1000000 ? `Rp ${(d.harga/1000000).toFixed(1)}Jt` : `Rp ${d.harga.toLocaleString('id-ID')}`;
      return `
        <tr>
          <td>
            <div class="td-name">
              <img src="${d.gambar}" class="td-img" onerror="this.style.display='none'">
              <div>
                <div style="font-weight:600;color:var(--text-primary)">${d.nama}</div>
                <div style="font-size:11px;color:var(--text-muted)">📍 ${d.lokasi}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="tipe-badge ${d.tipe === 'dalam_negeri' ? 'dn' : 'ln'}">
              ${d.tipe === 'dalam_negeri' ? '🇮🇩 DN' : '🌍 LN'}
            </span>
          </td>
          <td style="text-transform:capitalize">${d.kategori}</td>
          <td style="font-weight:700;color:var(--primary)">${harga}</td>
          <td>
            <div style="display:flex;align-items:center;gap:4px;color:#f59e0b">
              ★ <span style="font-weight:700;color:var(--text-primary)">${d.rating}</span>
              <span style="color:var(--text-muted);font-size:11px">(${d.ulasan})</span>
            </div>
          </td>
          <td>${d.is_featured ? '<span style="background:#fef3c7;color:#d97706;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700">⭐ Ya</span>' : '-'}</td>
          <td><span class="badge-status ${d.status}">${d.status}</span></td>
          <td>
            <div style="display:flex;gap:4px">
              <button class="btn btn-sm btn-secondary" onclick="AdminDestinations.edit(${d.id})" title="Edit">✏️</button>
              <button class="btn btn-sm btn-warning" onclick="AdminDestinations.toggleStatus(${d.id})" title="Toggle Status">🔄</button>
              <button class="btn btn-sm btn-danger" onclick="AdminDestinations.delete(${d.id})" title="Hapus">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
    
    this.renderPagination(list.length);
  },
  
  renderPagination(total) {
    const pages = Math.ceil(total / this.perPage);
    const container = document.getElementById('destPagination');
    if (!container) return;
    
    let html = '';
    html += `<button class="page-btn" onclick="AdminDestinations.goPage(${this.page-1})" ${this.page===1?'disabled':''}>◀</button>`;
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - this.page) <= 1) {
        html += `<button class="page-btn ${i===this.page?'active':''}" onclick="AdminDestinations.goPage(${i})">${i}</button>`;
      } else if (Math.abs(i - this.page) === 2) {
        html += `<span style="color:var(--text-muted);padding:0 4px">...</span>`;
      }
    }
    html += `<button class="page-btn" onclick="AdminDestinations.goPage(${this.page+1})" ${this.page===pages?'disabled':''}>▶</button>`;
    container.innerHTML = html;
  },
  
  goPage(p) {
    const pages = Math.ceil(this.filtered().length / this.perPage);
    if (p < 1 || p > pages) return;
    this.page = p;
    this.render();
  },
  
  add() {
    this.editId = null;
    document.getElementById('destModalTitle').textContent = '➕ Tambah Destinasi Baru';
    document.getElementById('destForm').reset();
    document.getElementById('previewImg').src = '';
    document.getElementById('previewImg').style.display = 'none';
    AdminModal.open('destFormModal');
  },
  
  edit(id) {
    const dest = this.data.find(d => d.id === id);
    if (!dest) return;
    this.editId = id;
    
    document.getElementById('destModalTitle').textContent = '✏️ Edit Destinasi';
    
    const set = (name, val) => {
      const el = document.querySelector(`[name="${name}"]`);
      if (el) el.value = val ?? '';
    };
    
    set('nama', dest.nama);
    set('lokasi', dest.lokasi);
    set('kota', dest.kota || '');
    set('provinsi', dest.provinsi || '');
    set('negara', dest.negara);
    set('tipe', dest.tipe);
    set('kategori', dest.kategori);
    set('harga', dest.harga);
    set('gambar', dest.gambar);
    set('deskripsi', dest.deskripsi || '');
    set('rating', dest.rating);
    set('jam_buka', dest.jam_buka || '');
    set('status', dest.status);
    
    const featured = document.querySelector('[name="is_featured"]');
    if (featured) featured.checked = dest.is_featured;
    
    // Preview
    if (dest.gambar) {
      const preview = document.getElementById('previewImg');
      preview.src = dest.gambar;
      preview.style.display = 'block';
    }
    
    AdminModal.open('destFormModal');
  },
  
  save() {
    const form = document.getElementById('destForm');
    const getData = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';
    
    const nama = getData('nama');
    const lokasi = getData('lokasi');
    const tipe = getData('tipe');
    const harga = parseFloat(getData('harga'));
    
    if (!nama || !lokasi || !tipe || isNaN(harga)) {
      AdminToast.show('❌ Lengkapi semua field yang wajib diisi!', 'error');
      return;
    }
    
    const destData = {
      id: this.editId || Date.now(),
      nama,
      lokasi: getData('lokasi'),
      kota: getData('kota'),
      provinsi: getData('provinsi'),
      negara: getData('negara') || 'Indonesia',
      tipe: getData('tipe'),
      kategori: getData('kategori'),
      harga,
      gambar: getData('gambar') || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
      deskripsi: getData('deskripsi'),
      rating: parseFloat(getData('rating')) || 4.5,
      ulasan: 0,
      jam_buka: getData('jam_buka'),
      status: getData('status') || 'aktif',
      is_featured: form.querySelector('[name="is_featured"]')?.checked || false,
      slug: nama.toLowerCase().replace(/\s+/g, '-')
    };
    
    if (this.editId) {
      const idx = this.data.findIndex(d => d.id === this.editId);
      if (idx !== -1) {
        this.data[idx] = { ...this.data[idx], ...destData };
        AdminToast.show('✅ Destinasi berhasil diperbarui!', 'success');
      }
    } else {
      this.data.push(destData);
      AdminToast.show('✅ Destinasi baru berhasil ditambahkan!', 'success');
    }
    
    // Save custom destinations (exclude base)
    const baseIds = [1,2,3,4,5,6,7];
    const custom = this.data.filter(d => !baseIds.includes(d.id));
    localStorage.setItem('wj-destinations', JSON.stringify(custom));
    
    AdminModal.close('destFormModal');
    this.render();
    this.updateStats();
  },
  
  delete(id) {
    const dest = this.data.find(d => d.id === id);
    if (!dest) return;
    
    if (!confirm(`🗑️ Yakin hapus destinasi "${dest.nama}"?`)) return;
    
    this.data = this.data.filter(d => d.id !== id);
    
    const baseIds = [1,2,3,4,5,6,7];
    const custom = this.data.filter(d => !baseIds.includes(d.id));
    localStorage.setItem('wj-destinations', JSON.stringify(custom));
    
    this.render();
    this.updateStats();
    AdminToast.show('🗑️ Destinasi berhasil dihapus!', 'info');
  },
  
  toggleStatus(id) {
    const dest = this.data.find(d => d.id === id);
    if (!dest) return;
    dest.status = dest.status === 'aktif' ? 'nonaktif' : 'aktif';
    
    const baseIds = [1,2,3,4,5,6,7];
    const custom = this.data.filter(d => !baseIds.includes(d.id));
    localStorage.setItem('wj-destinations', JSON.stringify(custom));
    
    this.render();
    AdminToast.show(`Status diubah ke ${dest.status}!`, 'info');
  },
  
  bindEvents() {
    // Search
    document.getElementById('searchDestInput')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.page = 1;
      this.render();
    });
    
    // Filters
    document.getElementById('filterType')?.addEventListener('change', (e) => {
      this.filterType = e.target.value;
      this.page = 1;
      this.render();
    });
    
    document.getElementById('filterStatus')?.addEventListener('change', (e) => {
      this.filterStatus = e.target.value;
      this.page = 1;
      this.render();
    });
    
    // Image preview
    document.querySelector('[name="gambar"]')?.addEventListener('input', (e) => {
      const preview = document.getElementById('previewImg');
      if (e.target.value) {
        preview.src = e.target.value;
        preview.style.display = 'block';
        preview.onerror = () => { preview.style.display = 'none'; };
      } else {
        preview.style.display = 'none';
      }
    });
  }
};

// =========== USERS ADMIN ===========
const AdminUsers = {
  init() {
    const users = JSON.parse(localStorage.getItem('wj-users') || '[]');
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    if (!users.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">
        <div style="font-size:40px;margin-bottom:8px">👤</div>
        Belum ada user terdaftar
      </td></tr>`;
      return;
    }
    
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>
          <div class="td-name">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:13px;flex-shrink:0">
              ${u.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style="font-weight:600;color:var(--text-primary)">${u.name}</div>
              <div style="font-size:11px;color:var(--text-muted)">${u.email}</div>
            </div>
          </div>
        </td>
        <td><span class="badge-status ${u.role === 'admin' ? 'confirmed' : 'aktif'}">${u.role === 'admin' ? '⭐ Admin' : '👤 User'}</span></td>
        <td>${new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
        <td>-</td>
        <td><span class="badge-status aktif">Aktif</span></td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-secondary">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="AdminUsers.delete('${u.email}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalAdmins').textContent = users.filter(u=>u.role==='admin').length;
  },
  
  delete(email) {
    if (!confirm('Hapus user ini?')) return;
    const users = JSON.parse(localStorage.getItem('wj-users') || '[]');
    const filtered = users.filter(u => u.email !== email);
    localStorage.setItem('wj-users', JSON.stringify(filtered));
    this.init();
    AdminToast.show('User berhasil dihapus!', 'info');
  }
};

// =========== CHART (Simple) ===========
const AdminChart = {
  init() {
    const container = document.getElementById('visitChart');
    if (!container) return;
    
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
    const data = [120, 145, 200, 180, 220, 310, 290, 350, 410, 380, 450, 520];
    const max = Math.max(...data);
    
    container.innerHTML = months.map((m, i) => `
      <div class="chart-bar-wrap">
        <div class="chart-val">${data[i] >= 1000 ? (data[i]/1000).toFixed(1)+'K' : data[i]}</div>
        <div class="chart-bar" style="height:${(data[i]/max)*180}px" title="${m}: ${data[i]} pengunjung"></div>
        <div class="chart-label">${m}</div>
      </div>
    `).join('');
  }
};

// =========== BOOKINGS ===========
const AdminBookings = {
  data: [
    { id: 'BK001', user: 'Budi Santoso', dest: 'Bromo Tengger Semeru', tgl: '2024-12-15', pax: 2, total: 500000, status: 'confirmed' },
    { id: 'BK002', user: 'Siti Rahayu', dest: 'Raja Ampat', tgl: '2024-12-20', pax: 3, total: 4500000, status: 'pending' },
    { id: 'BK003', user: 'Andi Nugroho', dest: 'Maldives', tgl: '2025-01-10', pax: 2, total: 45000000, status: 'confirmed' },
    { id: 'BK004', user: 'Dewi Larasati', dest: 'Tokyo', tgl: '2025-01-15', pax: 4, total: 74000000, status: 'pending' },
  ],
  
  init() {
    const tbody = document.getElementById('bookingTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = this.data.map(b => `
      <tr>
        <td style="font-weight:700;color:var(--primary)">${b.id}</td>
        <td>${b.user}</td>
        <td>${b.dest}</td>
        <td>${new Date(b.tgl).toLocaleDateString('id-ID')}</td>
        <td>${b.pax} orang</td>
        <td style="font-weight:700;color:var(--text-primary)">Rp ${b.total.toLocaleString('id-ID')}</td>
        <td><span class="badge-status ${b.status}">${b.status}</span></td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-success" onclick="AdminBookings.updateStatus('${b.id}','confirmed')">✅</button>
            <button class="btn btn-sm btn-danger" onclick="AdminBookings.updateStatus('${b.id}','cancelled')">❌</button>
          </div>
        </td>
      </tr>
    `).join('');
    
    document.getElementById('totalBookings').textContent = this.data.length;
    document.getElementById('pendingBookings').textContent = this.data.filter(b=>b.status==='pending').length;
    
    const revenue = this.data.filter(b=>b.status==='confirmed').reduce((s,b)=>s+b.total,0);
    const el = document.getElementById('totalRevenue');
    if (el) el.textContent = `Rp ${(revenue/1000000).toFixed(0)}Jt`;
  },
  
  updateStatus(id, status) {
    const b = this.data.find(b => b.id === id);
    if (b) { b.status = status; this.init(); AdminToast.show(`Booking ${id} diperbarui ke ${status}!`, 'success'); }
  }
};

// =========== INIT — hanya untuk admin/index.html (dashboard lama) ===========
// Halaman admin baru (bookings, transport, dll) pakai adminPageInit() dari admin-shared.js
document.addEventListener('DOMContentLoaded', () => {
  // Hanya jalankan init lama kalau halaman adalah admin/index.html TANPA admin-shared.js
  // admin-shared.js punya adminPageInit() yang dipakai halaman-halaman baru
  if (typeof adminPageInit === 'function') {
    // Halaman baru sudah punya adminPageInit dari admin-shared.js — jangan double-init
    AdminToast.init();
    AdminModal.init();
    return;
  }
  // Halaman lama (index.html dashboard original)
  AdminTheme.init();
  AdminToast.init();
  Sidebar.init();
  AdminModal.init();
  if (!AdminAuth.init()) return;
  AdminDestinations.init();
  AdminUsers.init();
  AdminBookings.init();
  AdminChart.init();
  console.log('%c⚙️ Wisata Jomokerto - Admin Panel', 'color:#0d5bdd;font-size:16px;font-weight:800');
});
