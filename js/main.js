/* ================================================
   WISATA JOMOKERTO - Main JavaScript
   ================================================ */

'use strict';

// =========== LOADING SCREEN ===========
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 2000);
});

document.body.style.overflow = 'hidden';

// =========== THEME MANAGER ===========
const ThemeManager = {
  key: 'wj-theme',
  
  init() {
    const saved = localStorage.getItem(this.key) || 'light';
    this.set(saved, false);
    document.querySelectorAll('.btn-theme').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },
  
  set(theme, animate = true) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);
    document.querySelectorAll('.btn-theme').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.title = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    });
    if (animate) {
      document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
    }
  },
  
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    this.set(current === 'dark' ? 'light' : 'dark');
    Toast.show(current === 'dark' ? '☀️ Light Mode aktif' : '🌙 Dark Mode aktif', 'info');
  }
};

// =========== AUTH MANAGER ===========
const Auth = {
  users: JSON.parse(localStorage.getItem('wj-users') || '[]'),
  currentUser: JSON.parse(localStorage.getItem('wj-user') || 'null'),
  
  init() {
    // Seed admin default
    if (!this.users.find(u => u.email === 'admin@wisatajomokerto.com')) {
      this.users.push({
        id: 1,
        name: 'Admin Jomokerto',
        email: 'admin@wisatajomokerto.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      this.save();
    }
    this.updateUI();
  },
  
  register(data) {
    if (this.users.find(u => u.email === data.email)) {
      return { success: false, msg: 'Email sudah terdaftar!' };
    }
    if (data.password !== data.confirmPassword) {
      return { success: false, msg: 'Password tidak cocok!' };
    }
    if (data.password.length < 6) {
      return { success: false, msg: 'Password minimal 6 karakter!' };
    }
    const user = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    this.users.push(user);
    this.save();
    this.login({ email: data.email, password: data.password });
    return { success: true };
  },
  
  login(data) {
    const user = this.users.find(u => u.email === data.email && u.password === data.password);
    if (!user) return { success: false, msg: 'Email atau password salah!' };
    this.currentUser = user;
    localStorage.setItem('wj-user', JSON.stringify(user));
    this.updateUI();
    return { success: true, user };
  },
  
  logout() {
    this.currentUser = null;
    localStorage.removeItem('wj-user');
    this.updateUI();
    Toast.show('👋 Berhasil logout!', 'info');
    setTimeout(() => location.reload(), 800);
  },
  
  save() {
    localStorage.setItem('wj-users', JSON.stringify(this.users));
  },
  
  updateUI() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;
    
    if (this.currentUser) {
      const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
      const roleLabel = this.currentUser.role === 'admin' ? '⭐ Admin' : '👤 User';
      
      navRight.innerHTML = `
        <button class="btn-theme" id="themeBtn" title="Toggle theme">🌙</button>
        <div class="user-menu">
          <button class="user-avatar-btn">
            <div class="user-avatar">${initials}</div>
            <span class="user-name-nav">${this.currentUser.name.split(' ')[0]}</span>
            <span style="font-size:10px; color:var(--text-muted)">▾</span>
          </button>
          <div class="user-dropdown">
            <div style="padding: 12px; border-bottom: 1px solid var(--border); margin-bottom: 8px;">
              <div style="font-size:14px; font-weight:700; color:var(--text-primary)">${this.currentUser.name}</div>
              <div style="font-size:12px; color:var(--text-muted)">${this.currentUser.email}</div>
              <div style="font-size:11px; margin-top:4px; color:var(--primary); font-weight:600">${roleLabel}</div>
            </div>
            ${this.currentUser.role === 'admin' ? '<a href="admin/index.html" class="dropdown-item"><span class="icon">⚙️</span> Panel Admin</a>' : ''}
            <a href="profile.html" class="dropdown-item"><span class="icon">👤</span> Profil Saya</a>
            <a href="bookings.html" class="dropdown-item"><span class="icon">🎫</span> Booking Saya</a>
            <a href="wishlist.html" class="dropdown-item"><span class="icon">❤️</span> Wishlist</a>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" onclick="Auth.logout()" style="width:100%; text-align:left; background:none; border:none; cursor:pointer; color:#ff4757">
              <span class="icon">🚪</span> Logout
            </button>
          </div>
        </div>
      `;
      // Re-init theme button
      document.querySelectorAll('.btn-theme').forEach(btn => {
        btn.addEventListener('click', () => ThemeManager.toggle());
      });
    } else {
      navRight.innerHTML = `
        <button class="btn-theme" id="themeBtn" title="Toggle theme">🌙</button>
        <button class="btn-login" onclick="Modal.open('login')">Masuk</button>
        <button class="btn-register" onclick="Modal.open('register')">Daftar</button>
      `;
      document.querySelectorAll('.btn-theme').forEach(btn => {
        btn.addEventListener('click', () => ThemeManager.toggle());
      });
    }
    
    // Re-apply theme icon
    const savedTheme = localStorage.getItem('wj-theme') || 'light';
    document.querySelectorAll('.btn-theme').forEach(btn => {
      btn.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    });
  }
};

// =========== MODAL MANAGER ===========
const Modal = {
  overlay: null,
  
  init() {
    this.overlay = document.getElementById('authModal');
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
    }
    
    // Keyboard close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
    
    this.bindForms();
  },
  
  open(type) {
    if (!this.overlay) return;
    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.render(type);
  },
  
  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
  },
  
  render(type) {
    const content = document.getElementById('modalContent');
    if (!content) return;
    
    if (type === 'login') {
      content.innerHTML = `
        <button class="modal-close" onclick="Modal.close()">×</button>
        <div class="modal-logo">
          <div style="font-size:40px; margin-bottom:8px">✈️</div>
        </div>
        <div class="modal-title">Selamat Datang!</div>
        <div class="modal-sub">Masuk ke akun Wisata Jomokerto Anda</div>
        
        <form id="loginForm">
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="form-input-icon">
              <span class="icon">📧</span>
              <input type="email" class="form-input" id="loginEmail" placeholder="nama@email.com" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="form-input-icon">
              <span class="icon">🔒</span>
              <input type="password" class="form-input" id="loginPass" placeholder="••••••••" required>
              <span class="toggle-pass" onclick="togglePass('loginPass', this)">👁️</span>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <label class="form-check">
              <input type="checkbox"> Ingat saya
            </label>
            <a href="#" style="font-size:13px; color:var(--primary); font-weight:600">Lupa password?</a>
          </div>
          <button type="submit" class="btn-form">🚀 Masuk Sekarang</button>
        </form>
        
        <div class="form-divider">atau masuk dengan</div>
        <div style="display:flex; gap:10px; margin-bottom:16px;">
          <button onclick="Toast.show('Google login coming soon!', 'info')" style="flex:1; padding:10px; border-radius:var(--radius); border:1.5px solid var(--border); background:var(--bg); color:var(--text-primary); font-size:14px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-family:var(--font);">
            <img src="https://www.google.com/favicon.ico" width="16" alt="G"> Google
          </button>
          <button onclick="Toast.show('Facebook login coming soon!', 'info')" style="flex:1; padding:10px; border-radius:var(--radius); border:1.5px solid var(--border); background:var(--bg); color:var(--text-primary); font-size:14px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-family:var(--font);">
            📘 Facebook
          </button>
        </div>
        
        <div class="modal-switch">
          Belum punya akun? <a onclick="Modal.render('register')">Daftar gratis →</a>
        </div>
        
        <div style="margin-top:16px; padding:12px; background:var(--primary-light); border-radius:var(--radius); font-size:12px; color:var(--text-secondary);">
          <strong>Demo Admin:</strong> admin@wisatajomokerto.com / admin123
        </div>
      `;
      
      document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPass').value;
        const result = Auth.login({ email, password });
        if (result.success) {
          Modal.close();
          Toast.show(`🎉 Selamat datang, ${result.user.name.split(' ')[0]}!`, 'success');
        } else {
          Toast.show(result.msg, 'error');
        }
      });
    } else {
      content.innerHTML = `
        <button class="modal-close" onclick="Modal.close()">×</button>
        <div class="modal-title">Buat Akun Baru</div>
        <div class="modal-sub">Bergabunglah dengan Wisata Jomokerto</div>
        
        <form id="registerForm">
          <div class="form-group">
            <label class="form-label">Nama Lengkap</label>
            <div class="form-input-icon">
              <span class="icon">👤</span>
              <input type="text" class="form-input" id="regName" placeholder="Nama Lengkap" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="form-input-icon">
              <span class="icon">📧</span>
              <input type="email" class="form-input" id="regEmail" placeholder="nama@email.com" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="form-input-icon">
              <span class="icon">🔒</span>
              <input type="password" class="form-input" id="regPass" placeholder="Min. 6 karakter" required>
              <span class="toggle-pass" onclick="togglePass('regPass', this)">👁️</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Konfirmasi Password</label>
            <div class="form-input-icon">
              <span class="icon">🔒</span>
              <input type="password" class="form-input" id="regPassConf" placeholder="Ulangi password" required>
            </div>
          </div>
          <label class="form-check" style="margin-bottom:16px;">
            <input type="checkbox" required>
            Saya setuju dengan <a href="#">Syarat & Ketentuan</a>
          </label>
          <button type="submit" class="btn-form">✨ Daftar Sekarang</button>
        </form>
        
        <div class="modal-switch">
          Sudah punya akun? <a onclick="Modal.render('login')">Masuk →</a>
        </div>
      `;
      
      document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const result = Auth.register({
          name: document.getElementById('regName').value,
          email: document.getElementById('regEmail').value,
          password: document.getElementById('regPass').value,
          confirmPassword: document.getElementById('regPassConf').value
        });
        if (result.success) {
          Modal.close();
          Toast.show('🎉 Akun berhasil dibuat! Selamat datang!', 'success');
        } else {
          Toast.show(result.msg, 'error');
        }
      });
    }
  },
  
  bindForms() {}
};

// =========== HERO SLIDER ===========
const HeroSlider = {
  slides: [],
  dots: [],
  current: 0,
  timer: null,
  
  init() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.dots = document.querySelectorAll('.hero-dot');
    if (!this.slides.length) return;
    
    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => this.goto(i));
    });
    
    this.start();
    
    // Pause on hover
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', () => this.stop());
      heroEl.addEventListener('mouseleave', () => this.start());
    }
  },
  
  goto(index) {
    this.slides[this.current].classList.remove('active');
    if (this.dots[this.current]) this.dots[this.current].classList.remove('active');
    this.current = index;
    this.slides[this.current].classList.add('active');
    if (this.dots[this.current]) this.dots[this.current].classList.add('active');
  },
  
  next() {
    this.goto((this.current + 1) % this.slides.length);
  },
  
  start() {
    this.stop();
    this.timer = setInterval(() => this.next(), 5000);
  },
  
  stop() {
    clearInterval(this.timer);
  },

  // ✅ Update slide images dari data admin (wj-sliders di localStorage)
  syncFromAdmin() {
    const saved = localStorage.getItem('wj-sliders');
    if (!saved) return;
    try {
      const sliders = JSON.parse(saved).filter(s => s.status === 'aktif').sort((a,b) => a.urutan - b.urutan);
      if (!sliders.length) return;
      const container = document.querySelector('.hero-slider');
      if (!container) return;
      container.innerHTML = sliders.map((s, i) => `
        <div class="hero-slide ${i===0?'active':''}">
          <img src="${s.gambar}" alt="${s.judul}" loading="${i===0?'eager':'lazy'}">
          <div class="hero-overlay"></div>
        </div>`).join('');
      // Update dots
      const dotsEl = document.querySelector('.hero-controls');
      if (dotsEl) {
        dotsEl.querySelectorAll('.hero-dot').forEach(d => d.remove());
        sliders.forEach((_,i) => {
          const dot = document.createElement('button');
          dot.className = 'hero-dot' + (i===0?' active':'');
          dotsEl.appendChild(dot);
        });
      }
      // Update hero title/subtitle dari slide pertama
      const heroTitle = document.querySelector('.hero-title');
      const heroSub   = document.querySelector('.hero-subtitle');
      const heroBtn   = document.querySelector('.btn-hero-primary');
      if (heroTitle && sliders[0].judul) heroTitle.innerHTML = sliders[0].judul.replace(/\n/g, '<br>');
      if (heroSub   && sliders[0].subjudul) heroSub.textContent = sliders[0].subjudul;
      if (heroBtn   && sliders[0].btn_text) { heroBtn.textContent = sliders[0].btn_text; heroBtn.href = sliders[0].btn_link || '#destinasiSection'; }
      // Re-init
      this.slides = container.querySelectorAll('.hero-slide');
      this.dots   = document.querySelectorAll('.hero-dot');
      this.current = 0;
    } catch(e) { console.warn('Slider sync error:', e); }
  }
};

// =========== DESTINATION MANAGER ===========
const Destinations = {
  data: [],
  filtered: [],
  wishlist: JSON.parse(localStorage.getItem('wj-wishlist') || '[]'),
  currentType: 'semua',
  currentCategory: 'semua',
  
  // Data destinasi (simulasi database)
  init() {
    this.data = [
      {
        id: 1, nama: 'Bromo Tengger Semeru', slug: 'bromo',
        lokasi: 'Probolinggo, Jawa Timur', negara: 'Indonesia',
        tipe: 'dalam_negeri', kategori: 'gunung',
        deskripsi: 'Keajaiban alam Jawa Timur dengan sunrise memukau di atas lautan pasir',
        gambar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        harga: 250000, rating: 4.9, ulasan: 1240, featured: true
      },
      {
        id: 2, nama: 'Raja Ampat', slug: 'raja-ampat',
        lokasi: 'Sorong, Papua Barat', negara: 'Indonesia',
        tipe: 'dalam_negeri', kategori: 'pantai',
        deskripsi: 'Surga tersembunyi dengan keindahan bawah laut nomor satu di dunia',
        gambar: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600',
        harga: 1500000, rating: 4.8, ulasan: 890, featured: true
      },
      {
        id: 3, nama: 'Borobudur', slug: 'borobudur',
        lokasi: 'Magelang, Jawa Tengah', negara: 'Indonesia',
        tipe: 'dalam_negeri', kategori: 'budaya',
        deskripsi: 'Candi Buddha terbesar di dunia, warisan UNESCO yang menakjubkan',
        gambar: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600',
        harga: 50000, rating: 4.7, ulasan: 2100, featured: true
      },
      {
        id: 4, nama: 'Gili Trawangan', slug: 'gili-trawangan',
        lokasi: 'Lombok, NTB', negara: 'Indonesia',
        tipe: 'dalam_negeri', kategori: 'pantai',
        deskripsi: 'Pulau surga di Lombok dengan pantai putih dan air biru jernih',
        gambar: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
        harga: 350000, rating: 4.6, ulasan: 756, featured: true
      },
      {
        id: 5, nama: 'Danau Toba', slug: 'danau-toba',
        lokasi: 'Sumatera Utara', negara: 'Indonesia',
        tipe: 'dalam_negeri', kategori: 'alam',
        deskripsi: 'Danau vulkanik terbesar di dunia dengan budaya Batak yang kaya',
        gambar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        harga: 200000, rating: 4.5, ulasan: 630, featured: false
      },
      {
        id: 6, nama: 'Komodo Island', slug: 'komodo',
        lokasi: 'Labuan Bajo, NTT', negara: 'Indonesia',
        tipe: 'dalam_negeri', kategori: 'alam',
        deskripsi: 'Habitat kadal terbesar di dunia dengan Pink Beach yang memukau',
        gambar: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600',
        harga: 500000, rating: 4.7, ulasan: 920, featured: true
      },
      {
        id: 7, nama: 'Ubud Bali', slug: 'ubud',
        lokasi: 'Gianyar, Bali', negara: 'Indonesia',
        tipe: 'dalam_negeri', kategori: 'budaya',
        deskripsi: 'Jantung seni dan budaya Bali di tengah persawahan hijau',
        gambar: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600',
        harga: 150000, rating: 4.8, ulasan: 1890, featured: true
      },
      {
        id: 8, nama: 'Santorini', slug: 'santorini',
        lokasi: 'Cyclades, Yunani', negara: 'Yunani',
        tipe: 'luar_negeri', kategori: 'pantai',
        deskripsi: 'Pulau romantis Yunani dengan bangunan putih dan sunset terbaik dunia',
        gambar: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600',
        harga: 15000000, rating: 4.9, ulasan: 3200, featured: true
      },
      {
        id: 9, nama: 'Machu Picchu', slug: 'machu-picchu',
        lokasi: 'Cusco, Peru', negara: 'Peru',
        tipe: 'luar_negeri', kategori: 'budaya',
        deskripsi: 'Kota kuno Inca di puncak Andes Peru, keajaiban dunia yang memukau',
        gambar: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600',
        harga: 18000000, rating: 4.9, ulasan: 2800, featured: true
      },
      {
        id: 10, nama: 'Maldives', slug: 'maldives',
        lokasi: 'Male, Maladewa', negara: 'Maladewa',
        tipe: 'luar_negeri', kategori: 'pantai',
        deskripsi: 'Surga tropis dengan villa apung mewah di Samudra Hindia',
        gambar: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600',
        harga: 25000000, rating: 5.0, ulasan: 4100, featured: true
      },
      {
        id: 11, nama: 'Tokyo', slug: 'tokyo',
        lokasi: 'Tokyo, Jepang', negara: 'Jepang',
        tipe: 'luar_negeri', kategori: 'kota',
        deskripsi: 'Kota metropolitan Jepang yang memadukan tradisi dan modernitas',
        gambar: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
        harga: 20000000, rating: 4.8, ulasan: 5600, featured: true
      },
      {
        id: 12, nama: 'Dubai', slug: 'dubai',
        lokasi: 'Dubai, UAE', negara: 'Uni Emirat Arab',
        tipe: 'luar_negeri', kategori: 'kota',
        deskripsi: 'Kota futuristik di gurun dengan kemewahan yang tak tertandingi',
        gambar: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
        harga: 19000000, rating: 4.7, ulasan: 4300, featured: true
      }
    ];
    
    // ✅ Sync dari Admin Panel — wj-destinations diisi WJData.syncAll()
    const adminSync = localStorage.getItem('wj-destinations');
    if (adminSync) {
      try {
        const synced = JSON.parse(adminSync);
        if (synced && synced.length > 0) {
          // Merge: base data sudah termasuk dalam sync, jangan duplikat
          const baseIds = new Set(this.data.map(d => d.id));
          const adminExtra = synced.filter(d => !baseIds.has(d.id));
          // Apply edits dari admin ke base data
          const edited = JSON.parse(localStorage.getItem('wj-dest-edited') || '{}');
          this.data = this.data.map(d => edited[d.id] ? {...d, ...edited[d.id]} : d);
          // Filter deleted
          const deleted = JSON.parse(localStorage.getItem('wj-dest-deleted') || '[]');
          this.data = this.data.filter(d => !deleted.includes(d.id));
          // Tambah custom
          this.data = [...this.data, ...adminExtra];
        }
      } catch(e) { console.warn('Admin sync error:', e); }
    }
    
    this.filtered = [...this.data];
    this.render();
    this.bindTabs();
    this.bindSearch();
  },
  
  filter(type = 'semua', category = 'semua', query = '') {
    this.currentType = type;
    this.currentCategory = category;
    
    this.filtered = this.data.filter(d => {
      const matchType = type === 'semua' || d.tipe === type;
      const matchCat = category === 'semua' || d.kategori === category;
      const matchQuery = !query || 
        d.nama.toLowerCase().includes(query.toLowerCase()) ||
        d.lokasi.toLowerCase().includes(query.toLowerCase()) ||
        d.negara.toLowerCase().includes(query.toLowerCase());
      return matchType && matchCat && matchQuery;
    });
    
    this.render();
  },
  
  render() {
    const grid = document.getElementById('destGrid');
    if (!grid) return;
    
    if (!this.filtered.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted)">
          <div style="font-size:60px; margin-bottom:16px">🔍</div>
          <div style="font-size:18px; font-weight:600; margin-bottom:8px">Destinasi tidak ditemukan</div>
          <div>Coba kata kunci lain atau ubah filter</div>
        </div>
      `;
      return;
    }
    
    grid.innerHTML = this.filtered.map(d => this.cardHTML(d)).join('');
    
    // Animate cards
    grid.querySelectorAll('.dest-card').forEach((card, i) => {
      card.style.animationDelay = `${i * 0.05}s`;
      card.classList.add('reveal');
      setTimeout(() => card.classList.add('visible'), 50 + i * 50);
    });
    
    // Bind events
    grid.querySelectorAll('.dest-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        this.toggleWishlist(id, btn);
      });
    });
    
    grid.querySelectorAll('.dest-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        this.openDetail(id);
      });
    });
  },
  
  cardHTML(d) {
    const isWishlisted = this.wishlist.includes(d.id);
    const stars = '★'.repeat(Math.round(d.rating)) + '☆'.repeat(5 - Math.round(d.rating));
    const harga = d.harga >= 1000000
      ? `Rp ${(d.harga/1000000).toFixed(1)}Jt`
      : `Rp ${d.harga.toLocaleString('id-ID')}`;
    const badgeClass = d.tipe === 'luar_negeri' ? 'luar' : '';
    const badgeText = d.tipe === 'luar_negeri' ? '🌍 Luar Negeri' : '🇮🇩 Dalam Negeri';
    
    return `
      <div class="dest-card" data-id="${d.id}" style="cursor:pointer">
        <div class="dest-card-img">
          <img src="${d.gambar}" alt="${d.nama}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'">
          <span class="dest-badge ${badgeClass}">${badgeText}</span>
          <button class="dest-wishlist ${isWishlisted ? 'active' : ''}" data-id="${d.id}" title="Simpan ke wishlist">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="dest-card-body">
          <div class="dest-category">✨ ${d.kategori.charAt(0).toUpperCase() + d.kategori.slice(1)}</div>
          <div class="dest-name">${d.nama}</div>
          <div class="dest-location">
            <span class="icon">📍</span>
            ${d.lokasi}
          </div>
          <div class="dest-rating">
            <span class="stars">${stars}</span>
            <span class="num">${d.rating}</span>
            <span>(${d.ulasan.toLocaleString('id-ID')} ulasan)</span>
          </div>
          <div class="dest-footer">
            <div class="dest-price">
              <div class="label">Mulai dari</div>
              <div class="amount">${harga}</div>
              <div class="per">/orang</div>
            </div>
            <button class="btn-detail" onclick="event.stopPropagation(); Destinations.openDetail(${d.id})">
              Detail →
            </button>
          </div>
        </div>
      </div>
    `;
  },
  
  toggleWishlist(id, btn) {
    if (!Auth.currentUser) {
      Modal.open('login');
      Toast.show('💡 Login dulu untuk menyimpan wishlist', 'info');
      return;
    }
    
    const idx = this.wishlist.indexOf(id);
    if (idx === -1) {
      this.wishlist.push(id);
      btn.classList.add('active');
      btn.innerHTML = '❤️';
      Toast.show('❤️ Ditambahkan ke wishlist!', 'success');
    } else {
      this.wishlist.splice(idx, 1);
      btn.classList.remove('active');
      btn.innerHTML = '🤍';
      Toast.show('🤍 Dihapus dari wishlist', 'info');
    }
    localStorage.setItem('wj-wishlist', JSON.stringify(this.wishlist));
  },
  
  openDetail(id) {
    const dest = this.data.find(d => d.id === id);
    if (!dest) return;
    
    const overlay = document.getElementById('destModal');
    if (!overlay) return;
    
    const stars = '★'.repeat(Math.round(dest.rating)) + '☆'.repeat(5 - Math.round(dest.rating));
    const harga = dest.harga >= 1000000
      ? `Rp ${(dest.harga/1000000).toFixed(1)} Juta`
      : `Rp ${dest.harga.toLocaleString('id-ID')}`;
    
    document.getElementById('destModalContent').innerHTML = `
      <button class="modal-close" onclick="document.getElementById('destModal').classList.remove('open'); document.body.style.overflow=''">×</button>
      
      <div style="position:relative; height:260px; margin:-40px -40px 28px; border-radius:var(--radius-xl) var(--radius-xl) 0 0; overflow:hidden;">
        <img src="${dest.gambar}" style="width:100%;height:100%;object-fit:cover" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div>
        <div style="position:absolute;bottom:16px;left:24px;color:white">
          <div style="font-size:11px;font-weight:700;letter-spacing:1px;opacity:0.8;text-transform:uppercase">${dest.tipe === 'luar_negeri' ? '🌍 Luar Negeri' : '🇮🇩 Dalam Negeri'}</div>
          <div style="font-family:var(--font-display);font-size:26px;font-weight:700;line-height:1.2">${dest.nama}</div>
        </div>
      </div>
      
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:4px;color:var(--text-secondary);font-size:14px">
          <span>📍</span>${dest.lokasi}
        </div>
        <div style="display:flex;align-items:center;gap:4px;font-size:14px">
          <span style="color:#f59e0b">${stars}</span>
          <span style="font-weight:700;color:var(--text-primary)">${dest.rating}</span>
          <span style="color:var(--text-muted)">(${dest.ulasan.toLocaleString('id-ID')} ulasan)</span>
        </div>
      </div>
      
      <p style="font-size:15px;color:var(--text-secondary);line-height:1.7;margin-bottom:24px">${dest.deskripsi}</p>
      
      <div style="background:var(--primary-light);border-radius:var(--radius);padding:16px;margin-bottom:24px">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">Harga mulai dari</div>
        <div style="font-size:28px;font-weight:800;color:var(--primary)">${harga}</div>
        <div style="font-size:12px;color:var(--text-muted)">/orang</div>
      </div>
      
      <div style="display:flex;gap:12px">
        <button onclick="Destinations.booking(${dest.id})" style="flex:1;padding:14px;border-radius:var(--radius);background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;font-size:15px;font-weight:700;border:none;cursor:pointer;font-family:var(--font)">
          🎫 Pesan Sekarang
        </button>
        <button onclick="Destinations.toggleWishlist(${dest.id}, this)" style="padding:14px 18px;border-radius:var(--radius);border:1.5px solid var(--border);background:var(--bg);cursor:pointer;font-size:20px;font-family:var(--font)">
          ${this.wishlist.includes(dest.id) ? '❤️' : '🤍'}
        </button>
      </div>
    `;
    
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    };
  },
  
  booking(id) {
    if (!Auth.currentUser) {
      Modal.open('login');
      Toast.show('💡 Login dulu untuk memesan!', 'info');
      return;
    }

    const dest = this.data.find(d => d.id === id);
    if (!dest) return;

    // Tutup modal destinasi
    document.getElementById('destModal').classList.remove('open');
    document.body.style.overflow = '';

    // Buka modal booking form
    this.openBookingForm(dest);
  },

  openBookingForm(dest) {
    // Buat modal booking inline
    let overlay = document.getElementById('bookingFormModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bookingFormModal';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const harga = dest.harga >= 1000000
      ? `Rp ${(dest.harga / 1000000).toFixed(1)}Jt`
      : `Rp ${dest.harga.toLocaleString('id-ID')}`;

    const today = new Date().toISOString().split('T')[0];

    overlay.innerHTML = `
      <div class="modal" style="max-width:520px">
        <div style="position:relative;height:180px;overflow:hidden;border-radius:var(--radius-xl) var(--radius-xl) 0 0;">
          <img src="${dest.gambar}" style="width:100%;height:100%;object-fit:cover">
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent)"></div>
          <button onclick="document.getElementById('bookingFormModal').classList.remove('open');document.body.style.overflow=''"
            style="position:absolute;top:12px;right:12px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.9);border:none;cursor:pointer;font-size:16px;font-weight:700">×</button>
          <div style="position:absolute;bottom:14px;left:20px;color:white">
            <div style="font-size:11px;opacity:0.8;margin-bottom:2px;font-weight:600;text-transform:uppercase">🎫 Form Booking</div>
            <div style="font-size:20px;font-weight:800;font-family:var(--font-display)">${dest.nama}</div>
            <div style="font-size:12px;opacity:0.8">📍 ${dest.lokasi}</div>
          </div>
        </div>

        <div style="padding:24px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">

            <div style="grid-column:span 2">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">Jenis Booking</div>
              <div style="display:flex;gap:8px">
                <label style="flex:1;display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;border:1.5px solid var(--border);cursor:pointer;font-size:13px;font-weight:600;background:var(--bg);transition:var(--transition)" id="bfTypeD">
                  <input type="radio" name="bf_tipe" value="destinasi" checked style="accent-color:var(--primary)" onchange="BF.updatePrice()"> 🗺️ Destinasi
                </label>
                <label style="flex:1;display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;border:1.5px solid var(--border);cursor:pointer;font-size:13px;font-weight:600;background:var(--bg);transition:var(--transition)">
                  <input type="radio" name="bf_tipe" value="paket" style="accent-color:var(--primary)" onchange="BF.updatePrice()"> 🎁 Paket
                </label>
              </div>
            </div>

            <div>
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">📅 Tanggal Berangkat *</div>
              <input type="date" id="bf_date" min="${today}" value="${today}"
                style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);font-size:13px;font-family:var(--font);color:var(--text-primary)"
                onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'" onchange="BF.updatePrice()">
            </div>

            <div>
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">👥 Jumlah Orang *</div>
              <input type="number" id="bf_pax" value="1" min="1" max="20"
                style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);font-size:13px;font-family:var(--font);color:var(--text-primary)"
                onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'" oninput="BF.updatePrice()">
            </div>

            <div>
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">👤 Nama Kontak *</div>
              <input type="text" id="bf_name" value="${Auth.currentUser.name}" placeholder="Nama pemesan"
                style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);font-size:13px;font-family:var(--font);color:var(--text-primary)"
                onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">
            </div>

            <div>
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">📱 WhatsApp *</div>
              <input type="tel" id="bf_phone" placeholder="08xxxxxxxxxx"
                style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);font-size:13px;font-family:var(--font);color:var(--text-primary)"
                onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">
            </div>

            <div style="grid-column:span 2">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">💳 Metode Pembayaran</div>
              <select id="bf_payment"
                style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);font-size:13px;font-family:var(--font);color:var(--text-primary)">
                <option value="transfer_bank">🏦 Transfer Bank (BCA/BRI/Mandiri)</option>
                <option value="gopay">💚 GoPay</option>
                <option value="ovo">💜 OVO</option>
                <option value="qris">📱 QRIS</option>
                <option value="cod">💵 Bayar di Tempat (COD)</option>
              </select>
            </div>

            <div style="grid-column:span 2">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">📝 Catatan</div>
              <textarea id="bf_notes" placeholder="Permintaan khusus, alergi, dll..." rows="2"
                style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);font-size:13px;font-family:var(--font);color:var(--text-primary);resize:vertical"
                onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'"></textarea>
            </div>
          </div>

          <!-- Harga Preview -->
          <div id="bf_priceBox" style="background:var(--primary-light);border-radius:10px;padding:14px 16px;margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:12px;color:var(--text-muted)">Harga per orang</span>
              <span style="font-size:13px;font-weight:600;color:var(--text-secondary)">${harga}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:12px;color:var(--text-muted)">Jumlah peserta</span>
              <span style="font-size:13px;font-weight:600;color:var(--text-secondary)" id="bf_paxLabel">× 1</span>
            </div>
            <div style="height:1px;background:var(--border);margin:8px 0"></div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-weight:700;color:var(--text-primary)">Total Pembayaran</span>
              <span style="font-size:22px;font-weight:800;color:var(--primary)" id="bf_total">${harga}</span>
            </div>
          </div>

          <button onclick="BF.submit(${dest.id})"
            style="width:100%;padding:14px;border-radius:var(--radius);background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;font-size:15px;font-weight:700;border:none;cursor:pointer;font-family:var(--font);box-shadow:0 4px 14px rgba(13,91,221,0.35)">
            🎫 Konfirmasi Booking Sekarang
          </button>

          <div style="text-align:center;margin-top:10px;font-size:12px;color:var(--text-muted)">
            🔒 Data Anda aman · Bisa dibatalkan kapan saja
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Simpan data destinasi ke object global sementara
    window._bfDest = dest;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  },
  
  bindTabs() {
    document.querySelectorAll('.dest-tab[data-type]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.dest-tab[data-type]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.filter(tab.dataset.type, this.currentCategory);
      });
    });
    
    document.querySelectorAll('.dest-tab[data-cat]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.dest-tab[data-cat]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.filter(this.currentType, tab.dataset.cat);
      });
    });
  },
  
  bindSearch() {
    const input = document.getElementById('searchDest');
    if (input) {
      let timeout;
      input.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.filter(this.currentType, this.currentCategory, input.value);
        }, 300);
      });
    }
  }
};

// =========== TRANSPORT ===========
const Transport = {
  active: 'pesawat',
  
  init() {
    document.querySelectorAll('.transport-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.transport-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.active = card.dataset.type;
        
        // Update search tabs
        const tab = document.querySelector(`.search-tab[data-transport="${this.active}"]`);
        if (tab) tab.click();
        
        Toast.show(`✅ Mode transportasi: ${card.querySelector('.transport-name').textContent}`, 'success');
        
        // Scroll to search
        document.querySelector('.hero')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    });
  }
};

// =========== SEARCH ===========
const Search = {
  init() {
    document.querySelectorAll('.search-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
    
    document.querySelector('.btn-search')?.addEventListener('click', () => {
      const dest = document.getElementById('searchDest')?.value;
      const date = document.getElementById('searchDate')?.value;
      
      if (!dest) {
        Toast.show('⚠️ Masukkan destinasi tujuan!', 'warning');
        document.getElementById('searchDest')?.focus();
        return;
      }
      
      Toast.show(`🔍 Mencari destinasi: ${dest}...`, 'info');
      
      // Filter destinations
      Destinations.filter('semua', 'semua', dest);
      document.getElementById('destinasiSection')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
};

// =========== TOAST NOTIFICATIONS ===========
const Toast = {
  container: null,
  
  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },
  
  show(msg, type = 'success', duration = 3500) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${msg}</span>`;
    this.container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s reverse ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// =========== NAVBAR ===========
const Navbar = {
  init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Scroll effect
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
    
    // Hamburger
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        if (mobileNav.classList.contains('open')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
      });
    }
    
    // Active link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      if (link.href === window.location.href) link.classList.add('active');
    });
  }
};

// =========== SCROLL REVEAL ===========
const ScrollReveal = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
};

// =========== COUNTER ANIMATION ===========
const Counter = {
  init() {
    const counters = document.querySelectorAll('.count-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    counters.forEach(c => observer.observe(c));
  },
  
  animate(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const update = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current).toLocaleString('id-ID');
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('id-ID');
      }
    };
    requestAnimationFrame(update);
  }
};

// =========== BACK TO TOP ===========
const BackToTop = {
  btn: null,
  
  init() {
    this.btn = document.querySelector('.back-to-top');
    if (!this.btn) return;
    
    window.addEventListener('scroll', () => {
      this.btn.classList.toggle('visible', window.scrollY > 400);
    });
    
    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// =========== NEWSLETTER ===========
const Newsletter = {
  init() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      if (!email) return;
      Toast.show(`📧 Terima kasih! ${email} berhasil berlangganan newsletter!`, 'success');
      form.reset();
    });
  }
};

// =========== UTILS ===========
function togglePass(inputId, icon) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    icon.textContent = '🙈';
  } else {
    input.type = 'password';
    icon.textContent = '👁️';
  }
}

function formatCurrency(num) {
  if (num >= 1000000) return `Rp ${(num/1000000).toFixed(1)}Jt`;
  if (num >= 1000) return `Rp ${(num/1000).toFixed(0)}K`;
  return `Rp ${num}`;
}

// =========== TESTIMONIAL SLIDER ===========
const TestimonialSlider = {
  init() {
    const cards = document.querySelectorAll('.testimonial-card');
    if (!cards.length) return;
    
    cards.forEach((card, i) => {
      card.style.animationDelay = `${i * 0.15}s`;
    });
  }
};

// =========== BOOKING FORM HANDLER ===========
// BF = Booking Form, menangani submit booking dari halaman utama
// Data disimpan ke localStorage key 'wj-bookings' (sama dengan bookings.js)
const BF = {

  // Generate kode booking unik
  generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'WJ';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  },

  // Update tampilan harga secara real-time
  updatePrice() {
    const dest = window._bfDest;
    if (!dest) return;
    const paxEl = document.getElementById('bf_pax');
    const pax = parseInt(paxEl?.value || 1);
    const total = dest.harga * pax;
    const label = document.getElementById('bf_paxLabel');
    const totalEl = document.getElementById('bf_total');
    if (label) label.textContent = `× ${pax}`;
    if (totalEl) {
      totalEl.textContent = total >= 1000000
        ? `Rp ${(total / 1000000).toFixed(1)}Jt`
        : `Rp ${total.toLocaleString('id-ID')}`;
    }
  },

  // Submit booking — simpan ke localStorage tabel 'wj-bookings'
  submit(destId) {
    const dest = window._bfDest;
    if (!dest) return;

    const user = Auth.currentUser;
    if (!user) {
      Toast.show('Login dulu untuk booking!', 'error');
      return;
    }

    // Ambil nilai form
    const tanggal   = document.getElementById('bf_date')?.value;
    const pax       = parseInt(document.getElementById('bf_pax')?.value || 1);
    const nama      = document.getElementById('bf_name')?.value?.trim();
    const phone     = document.getElementById('bf_phone')?.value?.trim();
    const payment   = document.getElementById('bf_payment')?.value || 'transfer_bank';
    const notes     = document.getElementById('bf_notes')?.value?.trim() || '';
    const tipe      = document.querySelector('input[name="bf_tipe"]:checked')?.value || 'destinasi';

    // Validasi
    if (!tanggal) { Toast.show('⚠️ Pilih tanggal berangkat!', 'warning'); return; }
    if (!nama)    { Toast.show('⚠️ Nama kontak wajib diisi!', 'warning'); return; }
    if (!phone)   { Toast.show('⚠️ Nomor WhatsApp wajib diisi!', 'warning'); return; }
    if (pax < 1)  { Toast.show('⚠️ Jumlah peserta minimal 1!', 'warning'); return; }

    const total = dest.harga * pax;

    // Buat objek booking — format SAMA dengan bookings.js
    const booking = {
      id          : this.generateCode(),
      userId      : user.id,          // ← KEY INI harus sama persis dengan filter di bookings.js
      destId      : dest.id,
      tipe        : tipe,
      namaDestinasi: dest.nama,
      lokasi      : dest.lokasi,
      gambar      : dest.gambar,
      tanggal     : tanggal,
      pax         : pax,
      harga       : dest.harga,
      total       : total,
      status      : 'pending',
      payment     : payment,
      contactName : nama,
      contactPhone: phone,
      notes       : notes,
      createdAt   : new Date().toISOString(),
      reviewed    : false
    };

    // ✅ Simpan ke localStorage — key 'wj-bookings' (dibaca juga oleh bookings.js & admin)
    const existing = JSON.parse(localStorage.getItem('wj-bookings') || '[]');
    existing.unshift(booking); // taruh paling depan (terbaru)
    localStorage.setItem('wj-bookings', JSON.stringify(existing));

    // Tutup modal booking form
    const overlay = document.getElementById('bookingFormModal');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Notifikasi sukses
    Toast.show(`🎉 Booking ke ${dest.nama} berhasil! Kode: ${booking.id}`, 'success');

    // Tawaran ke halaman booking
    setTimeout(() => {
      const go = confirm(
        `✅ Booking berhasil!\n\nKode: ${booking.id}\nDestinasi: ${dest.nama}\nTotal: Rp ${total.toLocaleString('id-ID')}\nStatus: Menunggu Konfirmasi\n\nBuka halaman "Booking Saya" sekarang?`
      );
      if (go) window.location.href = 'bookings.html';
    }, 400);
  }
};

// =========== SYNC MANAGER — baca data admin → tampilkan di index.html ===========
const SyncManager = {

  init() {
    this.applySettings();
    this.syncPackages();
    this.syncGallery();
    this.syncTransportSection();
    this.syncCounters();
  },

  // Baca wj-settings → update nama website, kontak, WA button, dll
  applySettings() {
    try {
      const s = JSON.parse(localStorage.getItem('wj-settings') || '{}');

      // Nama website di navbar, footer, title
      if (s.siteName) {
        document.querySelectorAll('.brand-name, .site-name').forEach(el => el.textContent = s.siteName);
        document.title = s.siteName + ' - ' + (s.siteTagline || 'Wisata Terbaik');
      }

      // WhatsApp floating button
      if (s.whatsapp) {
        const waBtn = document.querySelector('.wa-float, .btn-whatsapp, [href*="wa.me"]');
        if (waBtn) waBtn.href = `https://wa.me/${s.whatsapp}?text=Halo%20${encodeURIComponent(s.siteName||'Wisata Jomokerto')}!`;
      }

      // Email & phone di footer
      document.querySelectorAll('.footer-email').forEach(el => el.textContent = s.siteEmail || el.textContent);
      document.querySelectorAll('.footer-phone').forEach(el => el.textContent = s.sitePhone || el.textContent);
      document.querySelectorAll('.footer-address').forEach(el => el.textContent = s.siteAddress || el.textContent);

    } catch(e) { console.warn('Settings sync error:', e); }
  },

  // Sync paket wisata dari admin → tampilkan di section #paketSection
  syncPackages() {
    const pkgSection = document.getElementById('paketSection');
    if (!pkgSection) return;
    try {
      const pkgs = JSON.parse(localStorage.getItem('wj-packages') || '[]')
        .filter(p => p.status === 'aktif' || !p.status);
      if (!pkgs.length) return;

      const grid = pkgSection.querySelector('.paket-grid, .packages-grid, [data-packages]');
      const target = grid || pkgSection;
      const container = target.tagName === 'SECTION' ? target : target;

      // Find or create paket-grid
      let paketGrid = pkgSection.querySelector('.paket-grid');
      if (!paketGrid) {
        paketGrid = document.createElement('div');
        paketGrid.className = 'paket-grid';
        paketGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;padding:0 0 16px';
        const existCards = pkgSection.querySelector('.section-body, .paket-content');
        (existCards || pkgSection).appendChild(paketGrid);
      }

      paketGrid.innerHTML = pkgs.slice(0,6).map(p => {
        const harga = p.harga >= 1000000 ? `Rp ${(p.harga/1000000).toFixed(1)}Jt` : `Rp ${Number(p.harga).toLocaleString('id-ID')}`;
        return `
        <div class="paket-card" style="background:var(--bg-card);border:1px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);transition:all 0.3s;cursor:pointer" onclick="Destinations.booking && Destinations.data ? BF.openBookingFormFromPkg(${JSON.stringify(p)}) : null" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 28px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'">
          <div style="position:relative;height:180px;overflow:hidden">
            <img src="${p.gambar || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'}" alt="${p.nama}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform=''" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'">
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.5),transparent)"></div>
            ${p.is_featured ? '<div style="position:absolute;top:12px;right:12px;background:#f59e0b;color:white;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:700">⭐ Featured</div>' : ''}
            <div style="position:absolute;bottom:12px;left:14px;color:white">
              <div style="font-size:11px;opacity:0.8">${p.namaDestinasi || ''}</div>
              <div style="font-size:16px;font-weight:800">${p.durasi} Hari</div>
            </div>
          </div>
          <div style="padding:16px 20px">
            <div style="font-weight:800;font-size:16px;color:var(--text-primary);margin-bottom:6px">${p.nama}</div>
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:10px;line-height:1.5">${(p.deskripsi||'').substring(0,80)}${p.deskripsi?.length>80?'...':''}</div>
            ${p.include ? `<div style="font-size:11px;color:#15803d;background:#dcfce7;padding:6px 10px;border-radius:6px;margin-bottom:10px">✅ ${p.include.substring(0,60)}${p.include.length>60?'...':''}</div>` : ''}
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-size:11px;color:var(--text-muted)">Mulai dari</div>
                <div style="font-size:20px;font-weight:800;color:var(--primary)">${harga}</div>
                <div style="font-size:11px;color:var(--text-muted)">/orang · min. ${p.minPeserta||2} pax</div>
              </div>
              <button onclick="event.stopPropagation()" style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)">
                Pesan
              </button>
            </div>
          </div>
        </div>`;
      }).join('');
    } catch(e) { console.warn('Package sync error:', e); }
  },

  // Sync galeri dari admin
  syncGallery() {
    const galeriSection = document.getElementById('galeriSection');
    if (!galeriSection) return;
    try {
      const gallery = JSON.parse(localStorage.getItem('wj-gallery') || '[]')
        .filter(g => g.status === 'aktif' || !g.status);
      if (!gallery.length) return;

      let grid = galeriSection.querySelector('.galeri-grid, .gallery-grid');
      if (!grid) {
        grid = document.createElement('div');
        grid.className = 'galeri-grid';
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px';
        galeriSection.appendChild(grid);
      }

      grid.innerHTML = gallery.slice(0,12).map(g => `
        <div style="border-radius:12px;overflow:hidden;aspect-ratio:4/3;position:relative;cursor:pointer" onclick="this.querySelector('img').style.transform='scale(1)'">
          <img src="${g.gambar}" alt="${g.judul||''}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.3s" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'" onerror="this.closest('div').style.display='none'">
          <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:12px;color:white;font-size:12px;font-weight:600">${g.judul||g.namaDestinasi||''}</div>
        </div>`).join('');
    } catch(e) { console.warn('Gallery sync error:', e); }
  },

  // Sync data transport ke section transportasi
  syncTransportSection() {
    try {
      const saved = localStorage.getItem('wj-transport');
      if (!saved) return;
      // Data transport sudah ada di Transport object, ini hanya untuk update counters
    } catch(e) {}
  },

  // Sync counters (angka statistik di hero/about section)
  syncCounters() {
    try {
      const dests = JSON.parse(localStorage.getItem('wj-destinations') || '[]');
      const bookings = JSON.parse(localStorage.getItem('wj-bookings') || '[]');
      const users = JSON.parse(localStorage.getItem('wj-users') || '[]');

      // Update counter elements jika ada
      const destCounter = document.querySelector('[data-counter="destinations"]');
      const bkCounter   = document.querySelector('[data-counter="bookings"]');
      const userCounter = document.querySelector('[data-counter="users"]');
      if (destCounter && dests.length) destCounter.textContent = dests.length + '+';
      if (bkCounter   && bookings.length) bkCounter.textContent = bookings.length + '+';
      if (userCounter && users.length) userCounter.textContent = users.length + '+';
    } catch(e) {}
  }
};

// =========== INIT ALL ===========
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  ThemeManager.init();
  Auth.init();
  Modal.init();
  Navbar.init();
  HeroSlider.init();
  // Sync slider dari admin jika ada
  HeroSlider.syncFromAdmin();
  Transport.init();
  Search.init();
  Destinations.init();
  BackToTop.init();
  ScrollReveal.init();
  Counter.init();
  Newsletter.init();
  TestimonialSlider.init();
  // ✅ Sync semua data admin ke index.html
  SyncManager.init();
  
  console.log('%c🌴 Wisata Jomokerto', 'color:#0d5bdd; font-size:20px; font-weight:800');
  console.log('%cWebsite wisata terlengkap se-Jomokerto!', 'color:#4a5568; font-size:14px');
});
