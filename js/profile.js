/* ================================================
   WISATA JOMOKERTO - Profile Page JS
   Terhubung dengan database (localStorage / MySQL)
   ================================================ */

'use strict';

const ProfilePage = {
  user: null,
  profileData: null,

  // ---- INIT ----
  init() {
    this.user = JSON.parse(localStorage.getItem('wj-user') || 'null');

    if (!this.user) {
      document.getElementById('authWall').style.display = 'flex';
      document.getElementById('profileMain').style.display = 'none';
      return;
    }

    document.getElementById('authWall').style.display = 'none';
    document.getElementById('profileMain').style.display = 'block';

    this.profileData = this.loadProfile();
    this.renderCover();
    this.renderInfoTab();
    this.renderSecurityTab();
    this.renderPreferencesTab();
    this.renderNotificationsTab();
    this.bindTabs();
    this.syncStats();
    this.updateLastSync();
  },

  // ---- LOAD / SAVE PROFILE FROM DB ----
  loadProfile() {
    // Simulasi koneksi ke tabel `users` MySQL via localStorage
    const key = `wj-profile-${this.user.id}`;
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    return saved || {
      id: this.user.id,
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone || '',
      birthdate: '',
      gender: '',
      city: '',
      address: '',
      bio: '',
      avatar: '',
      // Dokumen perjalanan
      nik: '',
      passport: '',
      passportExp: '',
      nationality: 'Indonesia',
      // Preferensi
      favoriteCategories: [],
      tujuan: [],
      budget: '',
      // Notifikasi
      notifBooking: true,
      notifPromo: true,
      notifNewsletter: false,
      notifApp: true,
      // Keamanan
      twoFA: false,
      loginHistory: [
        { device: 'Chrome / Windows 10', time: new Date().toISOString(), current: true },
        { device: 'Mobile / Android', time: new Date(Date.now() - 86400000).toISOString(), current: false }
      ]
    };
  },

  saveProfile() {
    const key = `wj-profile-${this.user.id}`;
    localStorage.setItem(key, JSON.stringify(this.profileData));

    // Sync ke tabel users (localStorage simulasi)
    const users = JSON.parse(localStorage.getItem('wj-users') || '[]');
    const idx = users.findIndex(u => u.id === this.user.id);
    if (idx !== -1) {
      users[idx].name = this.profileData.name;
      users[idx].email = this.profileData.email;
      users[idx].phone = this.profileData.phone;
      localStorage.setItem('wj-users', JSON.stringify(users));
      // Update current user
      const cu = JSON.parse(localStorage.getItem('wj-user') || 'null');
      if (cu && cu.id === this.user.id) {
        cu.name = this.profileData.name;
        cu.email = this.profileData.email;
        localStorage.setItem('wj-user', JSON.stringify(cu));
      }
    }

    this.updateLastSync();
  },

  updateLastSync() {
    const el = document.getElementById('lastSync');
    if (el) {
      const now = new Date();
      el.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
  },

  // ---- RENDER COVER ----
  renderCover() {
    const p = this.profileData;
    const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    // Avatar
    const avatarEl = document.getElementById('profileAvatarBig');
    if (p.avatar) {
      avatarEl.innerHTML = `<img src="${p.avatar}" alt="Avatar">`;
    } else {
      avatarEl.textContent = initials;
    }

    document.getElementById('profileHeroName').textContent = p.name;
    document.getElementById('profileHeroEmail').innerHTML = `📧 ${p.email}`;

    const roleEl = document.getElementById('profileHeroBadge');
    if (this.user.role === 'admin') {
      roleEl.textContent = '⭐ Administrator';
      roleEl.style.background = 'rgba(255, 215, 0, 0.2)';
    } else {
      roleEl.textContent = '👤 Member';
    }

    const since = new Date(this.user.createdAt);
    document.getElementById('profileHeroSince').textContent =
      `📅 Bergabung ${since.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
  },

  // ---- SYNC STATS ----
  syncStats() {
    const bookings = this.getBookings();
    const wishlist = JSON.parse(localStorage.getItem('wj-wishlist') || '[]');
    const reviews = JSON.parse(localStorage.getItem(`wj-reviews-${this.user.id}`) || '[]');

    document.getElementById('statBooking').textContent = bookings.length;
    document.getElementById('statWishlist').textContent = wishlist.length;
    document.getElementById('statReview').textContent = reviews.length;
  },

  getBookings() {
    const all = JSON.parse(localStorage.getItem('wj-bookings') || '[]');
    return all.filter(b => b.userId === this.user.id);
  },

  // ---- RENDER INFO TAB ----
  renderInfoTab() {
    const p = this.profileData;
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || 'Belum diisi';
    };

    set('viewName', p.name);
    set('viewEmail', p.email);
    set('viewPhone', p.phone);
    set('viewBirthdate', p.birthdate ? new Date(p.birthdate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
    set('viewGender', p.gender);
    set('viewCity', p.city);
    set('viewAddress', p.address);

    const bioEl = document.getElementById('viewBio');
    if (bioEl) {
      bioEl.textContent = p.bio || 'Belum ada bio';
      bioEl.style.fontStyle = p.bio ? 'normal' : 'italic';
      bioEl.style.color = p.bio ? 'var(--text-primary)' : 'var(--text-muted)';
    }

    // Docs
    set('viewNik', p.nik);
    set('viewPassport', p.passport);
    set('viewPassportExp', p.passportExp ? new Date(p.passportExp).toLocaleDateString('id-ID') : '');
    set('viewNationality', p.nationality);
  },

  // ---- TOGGLE EDIT ----
  toggleEdit() {
    const viewMode = document.getElementById('viewMode');
    const editMode = document.getElementById('editMode');
    const btn = document.getElementById('editToggleBtn');

    if (editMode.style.display === 'none') {
      // Show edit
      const p = this.profileData;
      document.getElementById('editName').value = p.name || '';
      document.getElementById('editEmail').value = p.email || '';
      document.getElementById('editPhone').value = p.phone || '';
      document.getElementById('editBirthdate').value = p.birthdate || '';
      document.getElementById('editGender').value = p.gender || '';
      document.getElementById('editCity').value = p.city || '';
      document.getElementById('editAddress').value = p.address || '';
      document.getElementById('editBio').value = p.bio || '';

      viewMode.style.display = 'none';
      editMode.style.display = 'block';
      btn.textContent = '✕ Batal';

      // Bind form submit
      document.getElementById('editProfileForm').onsubmit = (e) => {
        e.preventDefault();
        this.saveEditForm();
      };
    } else {
      viewMode.style.display = 'block';
      editMode.style.display = 'none';
      btn.textContent = '✏️ Edit Profil';
    }
  },

  saveEditForm() {
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();

    if (!name || !email) {
      Toast.show('Nama dan email wajib diisi!', 'error');
      return;
    }

    this.profileData.name = name;
    this.profileData.email = email;
    this.profileData.phone = document.getElementById('editPhone').value.trim();
    this.profileData.birthdate = document.getElementById('editBirthdate').value;
    this.profileData.gender = document.getElementById('editGender').value;
    this.profileData.city = document.getElementById('editCity').value.trim();
    this.profileData.address = document.getElementById('editAddress').value.trim();
    this.profileData.bio = document.getElementById('editBio').value.trim();

    this.saveProfile();
    this.renderInfoTab();
    this.renderCover();
    this.toggleEdit();
    Toast.show('✅ Profil berhasil disimpan ke database!', 'success');
  },

  // ---- DOCS ----
  editDocs() {
    const form = document.getElementById('docsEditForm');
    if (form.style.display === 'none') {
      document.getElementById('editNik').value = this.profileData.nik || '';
      document.getElementById('editPassport').value = this.profileData.passport || '';
      document.getElementById('editPassportExp').value = this.profileData.passportExp || '';
      document.getElementById('editNationality').value = this.profileData.nationality || 'Indonesia';
      form.style.display = 'block';
    } else {
      form.style.display = 'none';
    }
  },

  saveDocs() {
    this.profileData.nik = document.getElementById('editNik').value.trim();
    this.profileData.passport = document.getElementById('editPassport').value.trim();
    this.profileData.passportExp = document.getElementById('editPassportExp').value;
    this.profileData.nationality = document.getElementById('editNationality').value.trim();

    this.saveProfile();
    this.renderInfoTab();
    this.editDocs();
    Toast.show('✅ Dokumen perjalanan tersimpan!', 'success');
  },

  // ---- AVATAR ----
  changeAvatar(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      Toast.show('Ukuran foto maks 2MB!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.profileData.avatar = e.target.result;
      this.saveProfile();
      this.renderCover();
      Toast.show('📷 Foto profil berhasil diperbarui!', 'success');
    };
    reader.readAsDataURL(file);
  },

  // ---- SECURITY TAB ----
  renderSecurityTab() {
    // Login history
    const container = document.getElementById('loginHistory');
    if (!container) return;
    const history = this.profileData.loginHistory || [];
    container.innerHTML = history.map(h => `
      <div class="login-item">
        <div class="login-item-icon">${h.current ? '💻' : '📱'}</div>
        <div class="login-item-info">
          <div class="login-item-device">${h.device}</div>
          <div class="login-item-time">${new Date(h.time).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <span class="login-item-badge ${h.current ? 'current' : 'old'}">${h.current ? '✅ Sesi ini' : 'Tidak aktif'}</span>
      </div>
    `).join('');

    // 2FA toggle
    const toggle = document.getElementById('toggle2FA');
    if (toggle) toggle.checked = this.profileData.twoFA || false;
  },

  togglePassForm() {
    const form = document.getElementById('passForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  },

  changePassword() {
    const oldPass = document.getElementById('oldPass').value;
    const newPass = document.getElementById('newPass').value;
    const confPass = document.getElementById('confPass').value;

    if (!oldPass || !newPass || !confPass) {
      Toast.show('Semua field password wajib diisi!', 'error');
      return;
    }

    // Verifikasi password lama
    const users = JSON.parse(localStorage.getItem('wj-users') || '[]');
    const u = users.find(u => u.id === this.user.id);
    if (!u || u.password !== oldPass) {
      Toast.show('Password lama tidak sesuai!', 'error');
      return;
    }

    if (newPass !== confPass) {
      Toast.show('Konfirmasi password tidak cocok!', 'error');
      return;
    }
    if (newPass.length < 6) {
      Toast.show('Password baru minimal 6 karakter!', 'error');
      return;
    }

    // Update password di "database"
    const idx = users.findIndex(u => u.id === this.user.id);
    if (idx !== -1) {
      users[idx].password = newPass;
      localStorage.setItem('wj-users', JSON.stringify(users));
    }

    document.getElementById('oldPass').value = '';
    document.getElementById('newPass').value = '';
    document.getElementById('confPass').value = '';

    this.togglePassForm();
    Toast.show('🔒 Password berhasil diperbarui!', 'success');
  },

  toggle2FA(checkbox) {
    this.profileData.twoFA = checkbox.checked;
    this.saveProfile();
    Toast.show(checkbox.checked ? '🔐 Verifikasi 2 langkah diaktifkan!' : '🔓 Verifikasi 2 langkah dinonaktifkan', 'info');
  },

  deleteAccount() {
    const confirm1 = confirm('⚠️ Yakin ingin menghapus akun Anda?\nSemua data akan terhapus PERMANEN!');
    if (!confirm1) return;
    const confirm2 = confirm('❌ Ini adalah tindakan TIDAK DAPAT DIBATALKAN!\nKetuk OK untuk melanjutkan hapus akun.');
    if (!confirm2) return;

    // Hapus dari users DB
    const users = JSON.parse(localStorage.getItem('wj-users') || '[]');
    const filtered = users.filter(u => u.id !== this.user.id);
    localStorage.setItem('wj-users', JSON.stringify(filtered));

    // Hapus data profil
    localStorage.removeItem(`wj-profile-${this.user.id}`);
    localStorage.removeItem('wj-user');
    localStorage.removeItem('wj-wishlist');

    Toast.show('Akun berhasil dihapus. Sampai jumpa!', 'info');
    setTimeout(() => window.location.href = 'index.html', 1500);
  },

  // ---- PREFERENCES TAB ----
  renderPreferencesTab() {
    const p = this.profileData;

    // Checkboxes kategori
    document.querySelectorAll('#prefCategories input[type="checkbox"]').forEach(cb => {
      cb.checked = (p.favoriteCategories || []).includes(cb.value);
    });

    // Budget
    document.querySelectorAll('input[name="budget"]').forEach(r => {
      r.checked = r.value === p.budget;
    });

    // Dark mode toggle
    const dmToggle = document.getElementById('darkModeToggle');
    if (dmToggle) dmToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
  },

  toggleTheme(checkbox) {
    const theme = checkbox.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wj-theme', theme);
    document.querySelectorAll('.btn-theme').forEach(b => {
      b.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    });
    Toast.show(theme === 'dark' ? '🌙 Dark mode aktif!' : '☀️ Light mode aktif!', 'info');
  },

  savePreferences() {
    const cats = [];
    document.querySelectorAll('#prefCategories input:checked').forEach(cb => cats.push(cb.value));
    this.profileData.favoriteCategories = cats;

    const budget = document.querySelector('input[name="budget"]:checked');
    this.profileData.budget = budget ? budget.value : '';

    this.saveProfile();
    Toast.show('⚙️ Preferensi berhasil disimpan!', 'success');
  },

  // ---- NOTIFICATIONS TAB ----
  renderNotificationsTab() {
    const p = this.profileData;
    const items = [
      { key: 'notifBooking', icon: '🎫', label: 'Update Booking', desc: 'Konfirmasi, pengingat, dan status perubahan booking' },
      { key: 'notifPromo', icon: '🔥', label: 'Promo & Penawaran', desc: 'Diskon eksklusif dan penawaran terbatas waktu' },
      { key: 'notifNewsletter', icon: '📧', label: 'Newsletter', desc: 'Tips wisata, destinasi baru, dan artikel menarik' },
      { key: 'notifApp', icon: '📱', label: 'Notifikasi Aplikasi', desc: 'Push notification dari aplikasi mobile' },
    ];

    const container = document.getElementById('notifList');
    if (!container) return;

    container.innerHTML = items.map(item => `
      <div class="notif-item">
        <div class="notif-item-left">
          <div class="notif-item-icon">${item.icon}</div>
          <div>
            <div class="notif-item-label">${item.label}</div>
            <div class="notif-item-desc">${item.desc}</div>
          </div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" data-key="${item.key}" ${p[item.key] ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
    `).join('');
  },

  saveNotifications() {
    document.querySelectorAll('#notifList input[type="checkbox"]').forEach(cb => {
      this.profileData[cb.dataset.key] = cb.checked;
    });
    this.saveProfile();
    Toast.show('🔔 Pengaturan notifikasi disimpan!', 'success');
  },

  // ---- WISHLIST ----
  goWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wj-wishlist') || '[]');
    if (!wishlist.length) {
      Toast.show('Wishlist Anda masih kosong. Tambahkan destinasi favorit!', 'info');
      return;
    }
    window.location.href = 'index.html#destinasiSection';
  },

  // ---- TABS ----
  bindTabs() {
    document.querySelectorAll('.psidebar-link[data-tab]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;

        document.querySelectorAll('.psidebar-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        document.querySelectorAll('.profile-tab').forEach(t => t.style.display = 'none');
        const tabEl = document.getElementById(`tab-${tab}`);
        if (tabEl) tabEl.style.display = 'block';
      });
    });
  },

  // ---- LOGOUT ----
  logout() {
    localStorage.removeItem('wj-user');
    Toast.show('👋 Berhasil logout!', 'info');
    setTimeout(() => window.location.href = 'index.html', 800);
  }
};

// Override Toast if not loaded yet
if (typeof Toast === 'undefined') {
  window.Toast = {
    container: null,
    init() {
      this.container = document.getElementById('toastWrap');
    },
    show(msg, type = 'success') {
      if (!this.container) this.container = document.getElementById('toastWrap');
      if (!this.container) return;
      const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
      const el = document.createElement('div');
      el.className = `toast ${type}`;
      el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
      this.container.appendChild(el);
      setTimeout(() => { el.style.animation = 'slideIn 0.3s reverse'; setTimeout(() => el.remove(), 300); }, 3500);
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // Init theme first
  const theme = localStorage.getItem('wj-theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.btn-theme').forEach(b => b.innerHTML = theme === 'dark' ? '☀️' : '🌙');
  document.querySelectorAll('.btn-theme').forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('wj-theme', next);
      document.querySelectorAll('.btn-theme').forEach(b => b.innerHTML = next === 'dark' ? '☀️' : '🌙');
    });
  });

  // Navbar scroll
  window.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  hamburger?.addEventListener('click', () => {
    document.querySelector('.mobile-nav')?.classList.toggle('open');
  });

  // Init profile page
  setTimeout(() => ProfilePage.init(), 100);
});
