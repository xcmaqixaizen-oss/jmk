/* ================================================
   WISATA JOMOKERTO - Admin Shared JS
   Data bersama untuk semua halaman admin
   Semua perubahan otomatis sync ke index.html
   ================================================ */

'use strict';

// =========== BASE DATA (default, bisa dioverride admin) ===========
const WJ_BASE = {

  destinations: [
    { id:1, nama:'Bromo Tengger Semeru', lokasi:'Probolinggo, Jawa Timur', negara:'Indonesia', tipe:'dalam_negeri', kategori:'gunung', gambar:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', harga:250000, rating:4.9, ulasan:1240, jam_buka:'24 Jam', deskripsi:'Keajaiban alam Jawa Timur dengan sunrise memukau di atas lautan pasir', status:'aktif', is_featured:true },
    { id:2, nama:'Raja Ampat', lokasi:'Sorong, Papua Barat', negara:'Indonesia', tipe:'dalam_negeri', kategori:'pantai', gambar:'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600', harga:1500000, rating:4.8, ulasan:890, jam_buka:'08:00-17:00', deskripsi:'Surga tersembunyi dengan keindahan bawah laut nomor satu di dunia', status:'aktif', is_featured:true },
    { id:3, nama:'Borobudur', lokasi:'Magelang, Jawa Tengah', negara:'Indonesia', tipe:'dalam_negeri', kategori:'budaya', gambar:'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600', harga:50000, rating:4.7, ulasan:2100, jam_buka:'06:00-17:00', deskripsi:'Candi Buddha terbesar di dunia, warisan UNESCO yang menakjubkan', status:'aktif', is_featured:true },
    { id:4, nama:'Gili Trawangan', lokasi:'Lombok, NTB', negara:'Indonesia', tipe:'dalam_negeri', kategori:'pantai', gambar:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', harga:350000, rating:4.6, ulasan:756, jam_buka:'24 Jam', deskripsi:'Pulau surga di Lombok dengan pantai putih dan air biru jernih', status:'aktif', is_featured:true },
    { id:5, nama:'Danau Toba', lokasi:'Sumatera Utara', negara:'Indonesia', tipe:'dalam_negeri', kategori:'alam', gambar:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', harga:200000, rating:4.5, ulasan:630, jam_buka:'06:00-18:00', deskripsi:'Danau vulkanik terbesar di dunia dengan budaya Batak yang kaya', status:'aktif', is_featured:false },
    { id:6, nama:'Komodo Island', lokasi:'Labuan Bajo, NTT', negara:'Indonesia', tipe:'dalam_negeri', kategori:'alam', gambar:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600', harga:500000, rating:4.7, ulasan:890, jam_buka:'07:00-17:00', deskripsi:'Rumah komodo raksasa dan pantai pink yang eksotis', status:'aktif', is_featured:false },
    { id:7, nama:'Ubud Bali', lokasi:'Gianyar, Bali', negara:'Indonesia', tipe:'dalam_negeri', kategori:'budaya', gambar:'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', harga:150000, rating:4.8, ulasan:3400, jam_buka:'06:00-22:00', deskripsi:'Pusat seni dan budaya Bali yang kaya tradisi', status:'aktif', is_featured:true },
    { id:8, nama:'Santorini', lokasi:'Yunani', negara:'Yunani', tipe:'luar_negeri', kategori:'pantai', gambar:'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600', harga:15000000, rating:4.9, ulasan:3200, jam_buka:'24 Jam', deskripsi:'Pulau ikonik dengan bangunan putih biru dan pemandangan Mediterania', status:'aktif', is_featured:true },
    { id:9, nama:'Machu Picchu', lokasi:'Cusco, Peru', negara:'Peru', tipe:'luar_negeri', kategori:'budaya', gambar:'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600', harga:18000000, rating:4.9, ulasan:4500, jam_buka:'06:00-17:00', deskripsi:'Kota kuno Inca tersembunyi di pegunungan Andes', status:'aktif', is_featured:true },
    { id:10, nama:'Maldives', lokasi:'Male, Maladewa', negara:'Maladewa', tipe:'luar_negeri', kategori:'pantai', gambar:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600', harga:25000000, rating:4.9, ulasan:2800, jam_buka:'24 Jam', deskripsi:'Surga tropis dengan villa apung dan laguna kristal', status:'aktif', is_featured:true },
    { id:11, nama:'Tokyo', lokasi:'Jepang', negara:'Jepang', tipe:'luar_negeri', kategori:'kota', gambar:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', harga:20000000, rating:4.8, ulasan:5600, jam_buka:'24 Jam', deskripsi:'Metropolitan futuristik yang memadukan tradisi dan teknologi', status:'aktif', is_featured:true },
    { id:12, nama:'Dubai', lokasi:'Uni Emirat Arab', negara:'UAE', tipe:'luar_negeri', kategori:'kota', gambar:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', harga:19000000, rating:4.7, ulasan:4100, jam_buka:'24 Jam', deskripsi:'Kota mewah modern di gurun dengan gedung tertinggi dunia', status:'aktif', is_featured:false },
  ],

  transport: [
    { id:1, tipe:'pesawat', nama:'Jakarta - Bali', asal:'Jakarta (CGK)', tujuan:'Bali (DPS)', operator:'Garuda Indonesia', harga:650000, durasi:'1j 45m', kelas:'ekonomi', jam_berangkat:'06:00', jam_tiba:'07:45', status:'aktif' },
    { id:2, tipe:'pesawat', nama:'Jakarta - Surabaya', asal:'Jakarta (CGK)', tujuan:'Surabaya (SUB)', operator:'Lion Air', harga:350000, durasi:'1j 20m', kelas:'ekonomi', jam_berangkat:'08:00', jam_tiba:'09:20', status:'aktif' },
    { id:3, tipe:'pesawat', nama:'Surabaya - Lombok', asal:'Surabaya (SUB)', tujuan:'Lombok (LOP)', operator:'Wings Air', harga:420000, durasi:'1j 05m', kelas:'ekonomi', jam_berangkat:'10:00', jam_tiba:'11:05', status:'aktif' },
    { id:4, tipe:'bus', nama:'Malang - Banyuwangi', asal:'Malang', tujuan:'Banyuwangi', operator:'Rosalia Indah', harga:85000, durasi:'4j 30m', kelas:'eksekutif', jam_berangkat:'07:00', jam_tiba:'11:30', status:'aktif' },
    { id:5, tipe:'bus', nama:'Surabaya - Yogyakarta', asal:'Surabaya', tujuan:'Yogyakarta', operator:'PO Haryanto', harga:110000, durasi:'5j 00m', kelas:'bisnis', jam_berangkat:'20:00', jam_tiba:'01:00', status:'aktif' },
    { id:6, tipe:'kapal', nama:'Banyuwangi - Gilimanuk', asal:'Banyuwangi', tujuan:'Gilimanuk, Bali', operator:'ASDP Ferry', harga:15000, durasi:'45m', kelas:'ekonomi', jam_berangkat:'05:00', jam_tiba:'05:45', status:'aktif' },
    { id:7, tipe:'kapal', nama:'Padangbai - Lembar', asal:'Padangbai, Bali', tujuan:'Lembar, Lombok', operator:'Wahyu Sejati', harga:45000, durasi:'4j 00m', kelas:'ekonomi', jam_berangkat:'08:00', jam_tiba:'12:00', status:'aktif' },
    { id:8, tipe:'kereta', nama:'Surabaya - Yogyakarta', asal:'Surabaya (SB)', tujuan:'Yogyakarta (YK)', operator:'KAI - Sancaka', harga:195000, durasi:'4j 15m', kelas:'eksekutif', jam_berangkat:'07:00', jam_tiba:'11:15', status:'aktif' },
    { id:9, tipe:'kereta', nama:'Jakarta - Surabaya', asal:'Jakarta (GMR)', tujuan:'Surabaya (SB)', operator:'KAI - Bima', harga:450000, durasi:'10j 30m', kelas:'eksekutif', jam_berangkat:'17:00', jam_tiba:'03:30', status:'aktif' },
  ],

  packages: [
    { id:1, nama:'Paket Bromo 3D2N', destId:1, namaDestinasi:'Bromo Tengger Semeru', gambar:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', durasi:3, harga:1850000, minPeserta:2, maxPeserta:15, include:'Transport PP, Hotel 2 malam, Guide, Sarapan, Tiket masuk', exclude:'Makan siang & malam, Pengeluaran pribadi', deskripsi:'Paket lengkap menikmati keindahan Bromo termasuk sunrise', status:'aktif', is_featured:true },
    { id:2, nama:'Paket Raja Ampat 5D4N', destId:2, namaDestinasi:'Raja Ampat', gambar:'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600', durasi:5, harga:8500000, minPeserta:2, maxPeserta:10, include:'Penerbangan PP, Hotel 4 malam, Speedboat, Snorkeling, Guide', exclude:'Makan pribadi, Oleh-oleh', deskripsi:'Jelajahi surga bawah laut Raja Ampat', status:'aktif', is_featured:true },
    { id:3, nama:'Paket Bali Honeymoon 4D3N', destId:7, namaDestinasi:'Ubud Bali', gambar:'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', durasi:4, harga:5500000, minPeserta:2, maxPeserta:2, include:'Hotel honeymoon, Spa, Dinner romantis, Flower bath, Transport', exclude:'Penerbangan, Makan siang', deskripsi:'Rayakan momen spesial di Bali yang romantis', status:'aktif', is_featured:true },
    { id:4, nama:'Paket Tokyo 7D6N', destId:11, namaDestinasi:'Tokyo', gambar:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', durasi:7, harga:22000000, minPeserta:1, maxPeserta:20, include:'Penerbangan PP, Hotel bintang 4, JR Pass 7 hari, City tour', exclude:'Makan, Pengeluaran pribadi', deskripsi:'Jelajahi Tokyo dan sekitarnya dengan JR Pass', status:'aktif', is_featured:false },
    { id:5, nama:'Paket Santorini 5D4N', destId:8, namaDestinasi:'Santorini', gambar:'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600', durasi:5, harga:28000000, minPeserta:2, maxPeserta:12, include:'Penerbangan PP, Hotel cliffside, Sunset cruise, Wine tour', exclude:'Makan, Oleh-oleh', deskripsi:'Liburan mewah di pulau paling cantik di Eropa', status:'aktif', is_featured:false },
  ],

  sliders: [
    { id:1, judul:'Jelajahi Keajaiban Nusantara', subjudul:'Temukan destinasi wisata terbaik Indonesia bersama Wisata Jomokerto', gambar:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600', btn_text:'Jelajahi Sekarang', btn_link:'#destinasiSection', urutan:1, status:'aktif' },
    { id:2, judul:'Petualangan Tak Terlupakan', subjudul:'Dari Sabang sampai Merauke, kami siap temani perjalananmu', gambar:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600', btn_text:'Lihat Destinasi', btn_link:'#destinasiSection', urutan:2, status:'aktif' },
    { id:3, judul:'Dunia di Ujung Jarimu', subjudul:'Paket wisata mancanegara dengan harga terjangkau dan layanan premium', gambar:'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1600', btn_text:'Paket Luar Negeri', btn_link:'#paketSection', urutan:3, status:'aktif' },
  ],

  gallery: [
    { id:1, destId:1, namaDestinasi:'Bromo', gambar:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', judul:'Sunrise Bromo', status:'aktif' },
    { id:2, destId:2, namaDestinasi:'Raja Ampat', gambar:'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600', judul:'Bawah Laut Raja Ampat', status:'aktif' },
    { id:3, destId:7, namaDestinasi:'Ubud Bali', gambar:'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', judul:'Pura di Bali', status:'aktif' },
    { id:4, destId:4, namaDestinasi:'Gili Trawangan', gambar:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', judul:'Pantai Gili', status:'aktif' },
    { id:5, destId:6, namaDestinasi:'Komodo', gambar:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600', judul:'Komodo Island', status:'aktif' },
    { id:6, destId:11, namaDestinasi:'Tokyo', gambar:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', judul:'Tokyo Skyline', status:'aktif' },
  ],

  settings: {
    siteName: 'Wisata Jomokerto',
    siteTagline: 'Jelajahi Dunia Bersamamu',
    siteEmail: 'info@wisatajomokerto.com',
    sitePhone: '+62 321 123456',
    siteAddress: 'Jl. Majapahit No.1, Mojokerto, Jawa Timur',
    siteLogo: '✈️',
    primaryColor: '#0d5bdd',
    secondaryColor: '#ff6b35',
    currency: 'IDR',
    bookingFee: 0,
    maxPeserta: 20,
    maintenanceMode: false,
    allowRegister: true,
    requireApproval: false,
    whatsapp: '6282112345678',
    instagram: '@wisatajomokerto',
    facebook: 'wisatajomokerto',
  }
};

// =========== DATA MANAGER — baca/tulis ke localStorage ===========
const WJData = {

  // --- DESTINATIONS ---
  getDestinations() {
    const custom = JSON.parse(localStorage.getItem('wj-dest-custom') || '[]');
    const deleted = JSON.parse(localStorage.getItem('wj-dest-deleted') || '[]');
    const edited  = JSON.parse(localStorage.getItem('wj-dest-edited') || '{}');

    return WJ_BASE.destinations
      .filter(d => !deleted.includes(d.id))
      .map(d => edited[d.id] ? {...d, ...edited[d.id]} : d)
      .concat(custom);
  },
  saveCustomDest(arr) { localStorage.setItem('wj-dest-custom', JSON.stringify(arr)); this.syncAll(); },
  saveEditedDest(id, data) {
    const edited = JSON.parse(localStorage.getItem('wj-dest-edited') || '{}');
    edited[id] = data;
    localStorage.setItem('wj-dest-edited', JSON.stringify(edited));
    this.syncAll();
  },
  deleteDest(id) {
    // If custom, remove from custom
    const custom = JSON.parse(localStorage.getItem('wj-dest-custom') || '[]');
    const newCustom = custom.filter(d => d.id !== id);
    localStorage.setItem('wj-dest-custom', JSON.stringify(newCustom));
    // If base, mark as deleted
    if (WJ_BASE.destinations.find(d => d.id === id)) {
      const deleted = JSON.parse(localStorage.getItem('wj-dest-deleted') || '[]');
      if (!deleted.includes(id)) deleted.push(id);
      localStorage.setItem('wj-dest-deleted', JSON.stringify(deleted));
    }
    this.syncAll();
  },

  // --- TRANSPORT ---
  getTransport() {
    const custom = JSON.parse(localStorage.getItem('wj-transport-custom') || '[]');
    const deleted = JSON.parse(localStorage.getItem('wj-transport-deleted') || '[]');
    const edited  = JSON.parse(localStorage.getItem('wj-transport-edited') || '{}');
    return WJ_BASE.transport
      .filter(t => !deleted.includes(t.id))
      .map(t => edited[t.id] ? {...t, ...edited[t.id]} : t)
      .concat(custom);
  },
  saveTransportCustom(arr) { localStorage.setItem('wj-transport-custom', JSON.stringify(arr)); this.syncAll(); },
  saveTransportEdit(id, data) {
    const edited = JSON.parse(localStorage.getItem('wj-transport-edited') || '{}');
    edited[id] = data;
    localStorage.setItem('wj-transport-edited', JSON.stringify(edited));
    this.syncAll();
  },
  deleteTransport(id) {
    const custom = JSON.parse(localStorage.getItem('wj-transport-custom') || '[]');
    localStorage.setItem('wj-transport-custom', JSON.stringify(custom.filter(t => t.id !== id)));
    if (WJ_BASE.transport.find(t => t.id === id)) {
      const del = JSON.parse(localStorage.getItem('wj-transport-deleted') || '[]');
      if (!del.includes(id)) del.push(id);
      localStorage.setItem('wj-transport-deleted', JSON.stringify(del));
    }
    this.syncAll();
  },

  // --- PACKAGES ---
  getPackages() {
    const custom = JSON.parse(localStorage.getItem('wj-pkg-custom') || '[]');
    const deleted = JSON.parse(localStorage.getItem('wj-pkg-deleted') || '[]');
    const edited  = JSON.parse(localStorage.getItem('wj-pkg-edited') || '{}');
    return WJ_BASE.packages
      .filter(p => !deleted.includes(p.id))
      .map(p => edited[p.id] ? {...p, ...edited[p.id]} : p)
      .concat(custom);
  },
  savePkgCustom(arr) { localStorage.setItem('wj-pkg-custom', JSON.stringify(arr)); this.syncAll(); },
  savePkgEdit(id, data) {
    const edited = JSON.parse(localStorage.getItem('wj-pkg-edited') || '{}');
    edited[id] = data;
    localStorage.setItem('wj-pkg-edited', JSON.stringify(edited));
    this.syncAll();
  },
  deletePkg(id) {
    const custom = JSON.parse(localStorage.getItem('wj-pkg-custom') || '[]');
    localStorage.setItem('wj-pkg-custom', JSON.stringify(custom.filter(p => p.id !== id)));
    if (WJ_BASE.packages.find(p => p.id === id)) {
      const del = JSON.parse(localStorage.getItem('wj-pkg-deleted') || '[]');
      if (!del.includes(id)) del.push(id);
      localStorage.setItem('wj-pkg-deleted', JSON.stringify(del));
    }
    this.syncAll();
  },

  // --- SLIDERS ---
  getSliders() {
    const saved = localStorage.getItem('wj-sliders');
    return saved ? JSON.parse(saved) : [...WJ_BASE.sliders];
  },
  saveSliders(arr) { localStorage.setItem('wj-sliders', JSON.stringify(arr)); this.syncAll(); },

  // --- GALLERY ---
  getGallery() {
    const saved = localStorage.getItem('wj-gallery');
    return saved ? JSON.parse(saved) : [...WJ_BASE.gallery];
  },
  saveGallery(arr) { localStorage.setItem('wj-gallery', JSON.stringify(arr)); this.syncAll(); },

  // --- BOOKINGS ---
  getBookings() { return JSON.parse(localStorage.getItem('wj-bookings') || '[]'); },
  updateBooking(id, data) {
    const all = this.getBookings();
    const idx = all.findIndex(b => b.id === id);
    if (idx !== -1) { all[idx] = {...all[idx], ...data}; localStorage.setItem('wj-bookings', JSON.stringify(all)); }
  },

  // --- USERS ---
  getUsers() { return JSON.parse(localStorage.getItem('wj-users') || '[]'); },
  saveUsers(arr) { localStorage.setItem('wj-users', JSON.stringify(arr)); },

  // --- SETTINGS ---
  getSettings() {
    const saved = localStorage.getItem('wj-settings');
    return saved ? {...WJ_BASE.settings, ...JSON.parse(saved)} : {...WJ_BASE.settings};
  },
  saveSettings(data) { localStorage.setItem('wj-settings', JSON.stringify(data)); this.syncAll(); },

  // --- SYNC ALL → ke index.html melalui key 'wj-sync' ---
  syncAll() {
    // Tulis semua data ke localStorage dengan key yang dibaca main.js
    localStorage.setItem('wj-destinations', JSON.stringify(this.getDestinations()));
    localStorage.setItem('wj-transport',    JSON.stringify(this.getTransport()));
    localStorage.setItem('wj-packages',     JSON.stringify(this.getPackages()));
    localStorage.setItem('wj-gallery',      JSON.stringify(this.getGallery()));
    localStorage.setItem('wj-sync-ts', Date.now()); // timestamp sync
  },
  // Alias untuk kompatibilitas
  _sync() { this.syncAll(); }
};

// Jalankan sync awal
WJData.syncAll();

// =========== SHARED SIDEBAR HTML ===========
function buildSidebar(activePage) {
  const links = [
    { href:'index.html',        icon:'📊', label:'Dashboard',     section:'Menu Utama' },
    { href:'destinations.html', icon:'🗺️', label:'Destinasi',     section:'' },
    { href:'transport.html',    icon:'✈️', label:'Transportasi',  section:'' },
    { href:'packages.html',     icon:'🎁', label:'Paket Wisata',  section:'' },
    { href:'slider.html',       icon:'🖼️', label:'Slider/Banner', section:'' },
    { href:'bookings.html',     icon:'🎫', label:'Booking',       section:'Manajemen', badge: true },
    { href:'users.html',        icon:'👥', label:'Users',         section:'' },
    { href:'reviews.html',      icon:'⭐', label:'Ulasan',        section:'' },
    { href:'gallery.html',      icon:'📸', label:'Galeri',        section:'' },
    { href:'reports.html',      icon:'📈', label:'Laporan',       section:'Sistem' },
    { href:'settings.html',     icon:'⚙️', label:'Pengaturan',    section:'' },
  ];

  const pendingBookings = WJData.getBookings().filter(b => b.status === 'pending').length;
  const settings = WJData.getSettings();

  let nav = '';
  links.forEach(l => {
    if (l.section) nav += `<div class="nav-section-label">${l.section}</div>`;
    const isActive = window.location.pathname.endsWith(l.href) || window.location.href.includes(l.href) ? 'active' : '';
    const badge = (l.badge && pendingBookings > 0) ? `<span class="badge">${pendingBookings}</span>` : '';
    nav += `<a href="${l.href}" class="sidebar-link ${isActive}"><span class="icon">${l.icon}</span> ${l.label} ${badge}</a>`;
  });

  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">${settings.siteLogo}</div>
      <div class="sidebar-brand">${settings.siteName}<span>Admin Panel v2.0</span></div>
    </div>
    <nav class="sidebar-nav">${nav}</nav>
    <div class="sidebar-footer">
      <a href="../index.html" class="sidebar-link" target="_blank"><span class="icon">🌐</span> Lihat Website</a>
      <button onclick="AdminAuth.logout()" class="sidebar-link" style="width:100%;text-align:left;background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;font-family:inherit">
        <span class="icon">🚪</span> Logout
      </button>
    </div>
  </aside>`;
}

// =========== SHARED TOPBAR ===========
function buildTopbar(breadcrumb, page) {
  const user = JSON.parse(localStorage.getItem('wj-user') || '{}');
  const initials = (user.name||'AD').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  const pending = WJData.getBookings().filter(b=>b.status==='pending').length;
  return `
  <header class="topbar">
    <button class="topbar-toggle" id="sidebarToggle">☰</button>
    <div class="topbar-breadcrumb">Dashboard / <span class="current">${breadcrumb}</span></div>
    <div class="topbar-search">
      <span class="search-icon">🔍</span>
      <input type="text" placeholder="Cari data...">
    </div>
    <div class="topbar-right">
      <button class="topbar-btn" id="themeToggle" title="Toggle tema">🌙</button>
      <button class="topbar-btn" title="Notifikasi" onclick="window.location.href='bookings.html'">
        🔔 ${pending > 0 ? `<span class="notif-badge">${pending}</span>` : ''}
      </button>
      <div class="admin-profile">
        <div class="admin-avatar" id="adminInitials">${initials}</div>
        <div>
          <div class="admin-name" id="adminName">${user.name||'Admin'}</div>
          <div class="admin-role">Administrator</div>
        </div>
      </div>
    </div>
  </header>`;
}

// =========== SHARED AUTH WALL ===========
const AUTH_WALL = `
<div id="authRequired" style="display:none;position:fixed;inset:0;background:var(--bg);z-index:9999;align-items:center;justify-content:center;flex-direction:column;font-family:var(--font)">
  <div style="text-align:center;max-width:420px;padding:48px;background:var(--bg-card);border-radius:20px;border:1px solid var(--border);box-shadow:0 8px 40px rgba(0,0,0,0.12)">
    <div style="font-size:72px;margin-bottom:16px">🔐</div>
    <h2 style="font-size:24px;font-weight:800;color:var(--text-primary);margin-bottom:8px">Akses Terbatas</h2>
    <p style="color:var(--text-secondary);margin-bottom:24px;font-size:15px">Halaman ini hanya untuk Admin.</p>
    <button onclick="AdminAuth.loginAsAdmin()" style="width:100%;padding:14px 28px;background:linear-gradient(135deg,#0d5bdd,#0847b0);color:white;border-radius:10px;border:none;font-size:15px;font-weight:700;cursor:pointer;font-family:var(--font);margin-bottom:10px">
      🔑 Login sebagai Admin Demo
    </button>
    <a href="../index.html" style="display:block;padding:12px 20px;border:1.5px solid var(--border);border-radius:10px;font-size:14px;font-weight:600;color:var(--text-secondary);text-align:center">← Kembali ke Website</a>
    <div style="margin-top:16px;padding:12px;background:var(--primary-light);border-radius:8px;font-size:12px;color:var(--primary);text-align:left">
      📧 admin@wisatajomokerto.com<br>🔒 admin123
    </div>
  </div>
</div>`;

// =========== INIT SHARED (dipanggil tiap halaman) ===========
function adminPageInit(pageSetup) {
  // Inject auth wall
  document.body.insertAdjacentHTML('afterbegin', AUTH_WALL);

  // Check auth
  const user = JSON.parse(localStorage.getItem('wj-user') || 'null');
  if (!user || user.role !== 'admin') {
    const _aw = document.getElementById('authRequired');
    const _ap = document.getElementById('adminPanel');
    if (_aw) _aw.style.display = 'flex';
    if (_ap) _ap.style.display = 'none';
    return;
  }
  const _aw = document.getElementById('authRequired');
  const _ap = document.getElementById('adminPanel');
  if (_aw) _aw.style.display = 'none';
  if (_ap) _ap.style.display = 'flex';

  // Inject sidebar & topbar
  const panel = document.getElementById('adminPanel');
  if (panel) panel.insertAdjacentHTML('afterbegin', buildSidebar(pageSetup.page));

  const main = document.getElementById('mainContent');
  if (main) main.insertAdjacentHTML('afterbegin', buildTopbar(pageSetup.breadcrumb, pageSetup.page));

  // Sidebar toggle
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('collapsed');
  });

  // Theme (dari admin.js)
  if (typeof AdminTheme !== 'undefined') AdminTheme.init();

  // Toast (dari admin.js)
  if (typeof AdminToast !== 'undefined') AdminToast.init();
  if (typeof AdminModal !== 'undefined') AdminModal.init();

  // Run page init — support dua format
  const fn = pageSetup.init || pageSetup.onReady;
  if (fn) fn();
}

// =========== FORMAT HELPERS ===========
const fmt = {
  currency(n) {
    if (n >= 1000000) return `Rp ${(n/1000000).toFixed(1)}Jt`;
    if (n >= 1000) return `Rp ${(n/1000).toFixed(0)}K`;
    return `Rp ${Number(n).toLocaleString('id-ID')}`;
  },
  date(str) {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
  },
  datetime(str) {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  },
  statusBadge(status) {
    const map = {
      aktif:     `<span class="badge-status aktif">✅ Aktif</span>`,
      nonaktif:  `<span class="badge-status nonaktif">⏸ Nonaktif</span>`,
      pending:   `<span class="badge-status" style="background:#fef3c7;color:#d97706">⏳ Pending</span>`,
      confirmed: `<span class="badge-status" style="background:#dbeafe;color:#1d4ed8">✅ Confirmed</span>`,
      completed: `<span class="badge-status" style="background:#dcfce7;color:#15803d">🏁 Selesai</span>`,
      cancelled: `<span class="badge-status" style="background:#fee2e2;color:#dc2626">❌ Batal</span>`,
    };
    return map[status] || `<span class="badge-status">${status}</span>`;
  },
  tipeBadge(tipe) {
    return tipe === 'dalam_negeri'
      ? `<span class="tipe-badge dn">🇮🇩 DN</span>`
      : `<span class="tipe-badge ln">🌍 LN</span>`;
  }
};

// =========== GENERATE ID ===========
function genId(prefix='C') {
  return prefix + Date.now() + Math.floor(Math.random()*1000);
}
