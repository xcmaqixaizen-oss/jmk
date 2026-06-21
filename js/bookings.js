/* ================================================
   WISATA JOMOKERTO - Bookings Page JS
   Terhubung dengan database (localStorage / MySQL)
   Tabel: booking, destinasi, users
   ================================================ */

'use strict';

const BookingPage = {
  user: null,
  allBookings: [],
  filtered: [],
  currentStatus: 'all',
  searchQuery: '',
  sortBy: 'newest',
  page: 1,
  perPage: 5,
  currentReviewBookingId: null,
  selectedRating: 0,

  // Destinations reference (simulasi JOIN dengan tabel destinasi)
  destinations: [
    { id: 1, nama: 'Bromo Tengger Semeru', lokasi: 'Probolinggo, Jawa Timur', gambar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', harga: 250000, tipe: 'dalam_negeri', kategori: 'gunung' },
    { id: 2, nama: 'Raja Ampat', lokasi: 'Sorong, Papua Barat', gambar: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=400', harga: 1500000, tipe: 'dalam_negeri', kategori: 'pantai' },
    { id: 3, nama: 'Borobudur', lokasi: 'Magelang, Jawa Tengah', gambar: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400', harga: 50000, tipe: 'dalam_negeri', kategori: 'budaya' },
    { id: 4, nama: 'Gili Trawangan', lokasi: 'Lombok, NTB', gambar: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', harga: 350000, tipe: 'dalam_negeri', kategori: 'pantai' },
    { id: 5, nama: 'Danau Toba', lokasi: 'Sumatera Utara', gambar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', harga: 200000, tipe: 'dalam_negeri', kategori: 'alam' },
    { id: 6, nama: 'Komodo Island', lokasi: 'Labuan Bajo, NTT', gambar: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400', harga: 500000, tipe: 'dalam_negeri', kategori: 'alam' },
    { id: 7, nama: 'Ubud Bali', lokasi: 'Gianyar, Bali', gambar: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400', harga: 150000, tipe: 'dalam_negeri', kategori: 'budaya' },
    { id: 8, nama: 'Santorini', lokasi: 'Yunani', gambar: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400', harga: 15000000, tipe: 'luar_negeri', kategori: 'pantai' },
    { id: 9, nama: 'Machu Picchu', lokasi: 'Cusco, Peru', gambar: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400', harga: 18000000, tipe: 'luar_negeri', kategori: 'budaya' },
    { id: 10, nama: 'Maldives', lokasi: 'Male, Maladewa', gambar: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400', harga: 25000000, tipe: 'luar_negeri', kategori: 'pantai' },
    { id: 11, nama: 'Tokyo', lokasi: 'Jepang', gambar: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', harga: 20000000, tipe: 'luar_negeri', kategori: 'kota' },
    { id: 12, nama: 'Dubai', lokasi: 'Uni Emirat Arab', gambar: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', harga: 19000000, tipe: 'luar_negeri', kategori: 'kota' },
  ],

  // ---- INIT ----
  init() {
    this.user = JSON.parse(localStorage.getItem('wj-user') || 'null');

    if (!this.user) {
      document.getElementById('authWall').style.display = 'flex';
      document.getElementById('bookingMain').style.display = 'none';
      return;
    }

    document.getElementById('authWall').style.display = 'none';
    document.getElementById('bookingMain').style.display = 'block';

    // Merge custom destinations from admin
    const custom = JSON.parse(localStorage.getItem('wj-destinations') || '[]');
    this.destinations = [...this.destinations, ...custom];

    this.loadBookings();
    this.populateDestSelect();
    this.renderStats();
    this.applyFilter();
    this.bindTabs();
    this.bindPaymentOptions();

    // Set min date
    const today = new Date().toISOString().split('T')[0];
    const dateEl = document.getElementById('bkDate');
    if (dateEl) dateEl.min = today;
  },

  // ---- LOAD BOOKINGS from localStorage (simulasi MySQL tabel booking) ----
  loadBookings() {
    const all = JSON.parse(localStorage.getItem('wj-bookings') || '[]');

    // Filter booking milik user ini — bandingkan sebagai string supaya aman
    // (userId bisa berupa number atau string tergantung cara login)
    this.allBookings = all.filter(b => String(b.userId) === String(this.user.id));

    // Hanya seed demo kalau user BELUM PERNAH booking sama sekali
    // Cek juga apakah sudah pernah di-seed sebelumnya
    const alreadySeeded = localStorage.getItem(`wj-seeded-${this.user.id}`);
    if (this.allBookings.length === 0 && !alreadySeeded) {
      this.seedDemoBookings();
    }
  },

  seedDemoBookings() {
    // Tandai sudah di-seed — supaya tidak override booking asli di masa depan
    localStorage.setItem(`wj-seeded-${this.user.id}`, '1');

    const demos = [
      {
        id: this.generateCode(),
        userId: this.user.id,
        destId: 1,
        tipe: 'destinasi',
        namaDestinasi: 'Bromo Tengger Semeru',
        lokasi: 'Probolinggo, Jawa Timur',
        gambar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        tanggal: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        pax: 2,
        harga: 250000,
        total: 500000,
        status: 'confirmed',
        payment: 'transfer_bank',
        contactName: this.user.name,
        contactPhone: '08123456789',
        notes: '',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        reviewed: false
      },
      {
        id: this.generateCode(),
        userId: this.user.id,
        destId: 7,
        tipe: 'destinasi',
        namaDestinasi: 'Ubud Bali',
        lokasi: 'Gianyar, Bali',
        gambar: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400',
        tanggal: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
        pax: 3,
        harga: 150000,
        total: 450000,
        status: 'completed',
        payment: 'gopay',
        contactName: this.user.name,
        contactPhone: '08123456789',
        notes: 'Request kamar view sawah',
        createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
        reviewed: false
      },
      {
        id: this.generateCode(),
        userId: this.user.id,
        destId: 4,
        tipe: 'destinasi',
        namaDestinasi: 'Gili Trawangan',
        lokasi: 'Lombok, NTB',
        gambar: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
        tanggal: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        pax: 2,
        harga: 350000,
        total: 700000,
        status: 'pending',
        payment: 'qris',
        contactName: this.user.name,
        contactPhone: '08123456789',
        notes: '',
        createdAt: new Date().toISOString(),
        reviewed: false
      }
    ];

    // Merge with existing bookings
    const all = JSON.parse(localStorage.getItem('wj-bookings') || '[]');
    const merged = [...all, ...demos];
    localStorage.setItem('wj-bookings', JSON.stringify(merged));
    this.allBookings = demos;
  },

  // ---- STATS ----
  renderStats() {
    const b = this.allBookings;
    document.getElementById('bkTotal').textContent = b.length;
    document.getElementById('bkPending').textContent = b.filter(x => x.status === 'pending').length;
    document.getElementById('bkConfirmed').textContent = b.filter(x => x.status === 'confirmed').length;
    document.getElementById('bkCompleted').textContent = b.filter(x => x.status === 'completed').length;

    const spend = b.filter(x => x.status !== 'cancelled').reduce((s, x) => s + (x.total || 0), 0);
    const spendEl = document.getElementById('bkSpend');
    if (spendEl) {
      spendEl.textContent = spend >= 1000000
        ? `Rp ${(spend / 1000000).toFixed(1)}Jt`
        : `Rp ${spend.toLocaleString('id-ID')}`;
    }
  },

  // ---- FILTER / SEARCH / SORT ----
  applyFilter() {
    let data = [...this.allBookings];

    if (this.currentStatus !== 'all') {
      data = data.filter(b => b.status === this.currentStatus);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      data = data.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.namaDestinasi.toLowerCase().includes(q) ||
        (b.lokasi || '').toLowerCase().includes(q)
      );
    }

    // Sort
    data.sort((a, b) => {
      if (this.sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (this.sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (this.sortBy === 'price_high') return (b.total || 0) - (a.total || 0);
      if (this.sortBy === 'price_low') return (a.total || 0) - (b.total || 0);
      return 0;
    });

    this.filtered = data;
    this.page = 1;
    this.render();
  },

  search(q) {
    this.searchQuery = q;
    this.applyFilter();
  },

  sort(by) {
    this.sortBy = by;
    this.applyFilter();
  },

  bindTabs() {
    document.querySelectorAll('.bk-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.bk-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentStatus = tab.dataset.status;
        this.applyFilter();
      });
    });
  },

  // ---- RENDER BOOKING LIST ----
  render() {
    const container = document.getElementById('bookingList');
    const pagination = document.getElementById('bkPagination');

    if (!this.filtered.length) {
      container.innerHTML = `
        <div class="bk-empty">
          <div class="bk-empty-icon">🎫</div>
          <h3>${this.currentStatus === 'all' ? 'Belum ada booking' : `Tidak ada booking ${this.currentStatus}`}</h3>
          <p>${this.searchQuery ? 'Tidak ditemukan booking sesuai pencarian.' : 'Mulai perjalanan impian Anda sekarang!'}</p>
          ${!this.searchQuery ? `<button class="btn-bk-new" onclick="BookingPage.newBooking()">➕ Buat Booking Sekarang</button>` : ''}
        </div>
      `;
      pagination.innerHTML = '';
      return;
    }

    const start = (this.page - 1) * this.perPage;
    const paged = this.filtered.slice(start, start + this.perPage);

    container.innerHTML = paged.map(b => this.cardHTML(b)).join('');

    // Render pagination
    const pages = Math.ceil(this.filtered.length / this.perPage);
    if (pages > 1) {
      let html = '';
      html += `<button onclick="BookingPage.goPage(${this.page - 1})" ${this.page === 1 ? 'disabled' : ''} style="padding:8px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg-card);cursor:pointer;font-family:var(--font)">◀</button>`;
      for (let i = 1; i <= pages; i++) {
        html += `<button onclick="BookingPage.goPage(${i})" style="padding:8px 14px;border-radius:8px;border:1px solid ${i === this.page ? 'var(--primary)' : 'var(--border)'};background:${i === this.page ? 'var(--primary)' : 'var(--bg-card)'};color:${i === this.page ? 'white' : 'var(--text-secondary)'};cursor:pointer;font-weight:700;font-family:var(--font)">${i}</button>`;
      }
      html += `<button onclick="BookingPage.goPage(${this.page + 1})" ${this.page === pages ? 'disabled' : ''} style="padding:8px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg-card);cursor:pointer;font-family:var(--font)">▶</button>`;
      pagination.innerHTML = html;
    } else {
      pagination.innerHTML = '';
    }
  },

  goPage(p) {
    const pages = Math.ceil(this.filtered.length / this.perPage);
    if (p < 1 || p > pages) return;
    this.page = p;
    this.render();
    document.getElementById('bookingMain').scrollIntoView({ behavior: 'smooth' });
  },

  cardHTML(b) {
    const statusLabels = {
      pending: '⏳ Menunggu Konfirmasi',
      confirmed: '✅ Dikonfirmasi',
      completed: '🏁 Selesai',
      cancelled: '❌ Dibatalkan'
    };

    const paymentLabels = {
      transfer_bank: '🏦 Transfer Bank',
      gopay: '💚 GoPay',
      ovo: '💜 OVO',
      qris: '📱 QRIS',
      cod: '💵 Bayar di Tempat',
      cicilan: '📊 Cicilan'
    };

    const total = b.total >= 1000000
      ? `Rp ${(b.total / 1000000).toFixed(1)}Jt`
      : `Rp ${b.total.toLocaleString('id-ID')}`;

    const tglBerangkat = new Date(b.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const tglBooking = new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const isPast = new Date(b.tanggal) < new Date();

    return `
      <div class="booking-card" id="bkcard-${b.id}">
        <div class="booking-card-top">
          <div class="booking-card-img">
            <img src="${b.gambar}" alt="${b.namaDestinasi}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'">
          </div>
          <div class="booking-card-body">
            <div class="booking-card-meta">
              <span class="booking-code"># ${b.id}</span>
              <span class="booking-status-badge ${b.status}">${statusLabels[b.status] || b.status}</span>
            </div>
            <div class="booking-dest-name">${b.namaDestinasi}</div>
            <div class="booking-info-row">
              <div class="booking-info-item">📍 <strong>${b.lokasi || '-'}</strong></div>
              <div class="booking-info-item">📅 <strong>${tglBerangkat}</strong></div>
              <div class="booking-info-item">👥 <strong>${b.pax} Orang</strong></div>
              <div class="booking-info-item">${paymentLabels[b.payment] || b.payment}</div>
            </div>
            <div style="font-size:12px;color:var(--text-muted)">Dipesan pada ${tglBooking}</div>
          </div>
        </div>
        <div class="booking-card-footer">
          <div class="booking-price">
            <span class="label">Total:</span>
            <span class="amount">${total}</span>
          </div>
          <div class="booking-actions">
            <button class="btn-bk-action" onclick="BookingPage.showDetail('${b.id}')">📋 Detail</button>
            ${b.status === 'pending' ? `<button class="btn-bk-action success" onclick="BookingPage.confirmBooking('${b.id}')">✅ Konfirmasi Bayar</button>` : ''}
            ${b.status === 'pending' ? `<button class="btn-bk-action danger" onclick="BookingPage.cancelBooking('${b.id}')">❌ Batalkan</button>` : ''}
            ${b.status === 'confirmed' && !isPast ? `<button class="btn-bk-action" onclick="BookingPage.downloadTicket('${b.id}')">🎫 Tiket</button>` : ''}
            ${b.status === 'completed' && !b.reviewed ? `<button class="btn-bk-action success" onclick="BookingPage.openReview('${b.id}')">⭐ Beri Ulasan</button>` : ''}
            ${b.status === 'completed' && b.reviewed ? `<span style="font-size:12px;color:var(--accent);font-weight:600">✅ Sudah diulas</span>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // ---- DETAIL MODAL ----
  showDetail(id) {
    const b = this.allBookings.find(x => x.id === id);
    if (!b) return;

    const statusLabels = { pending: '⏳ Menunggu', confirmed: '✅ Dikonfirmasi', completed: '🏁 Selesai', cancelled: '❌ Dibatalkan' };
    const total = `Rp ${b.total.toLocaleString('id-ID')}`;
    const harga = `Rp ${b.harga.toLocaleString('id-ID')}`;

    // Timeline
    const steps = [
      { label: 'Pesan', done: true },
      { label: 'Bayar', done: b.status !== 'pending' },
      { label: 'Konfirmasi', done: ['confirmed', 'completed'].includes(b.status) },
      { label: 'Selesai', done: b.status === 'completed' }
    ];

    const modal = document.getElementById('bkDetailContent');
    modal.innerHTML = `
      <div style="position:relative">
        <img src="${b.gambar}" style="width:100%;height:200px;object-fit:cover;border-radius:var(--radius-xl) var(--radius-xl) 0 0" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);border-radius:var(--radius-xl) var(--radius-xl) 0 0"></div>
        <button onclick="document.getElementById('bkDetailModal').classList.remove('open');document.body.style.overflow=''"
          style="position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.9);border:none;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center">×</button>
        <div style="position:absolute;bottom:16px;left:20px;color:white">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;opacity:0.8;margin-bottom:2px">Detail Booking</div>
          <div style="font-size:22px;font-weight:800;font-family:var(--font-display)">${b.namaDestinasi}</div>
        </div>
        <div style="position:absolute;top:12px;left:12px">
          <span style="background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.3);color:white;padding:4px 12px;border-radius:99px;font-size:11px;font-weight:700;font-family:monospace"># ${b.id}</span>
        </div>
      </div>

      <div style="padding:24px">
        <!-- Timeline -->
        <div class="booking-timeline">
          ${steps.map(s => `
            <div class="timeline-step">
              <div class="timeline-dot ${s.done ? 'done' : ''}">${s.done ? '✓' : ''}</div>
              <div class="timeline-label">${s.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Status Badge -->
        <div style="text-align:center;margin-bottom:20px">
          <span class="booking-status-badge ${b.status}" style="font-size:14px;padding:8px 20px">${statusLabels[b.status]}</span>
        </div>

        <!-- Detail Perjalanan -->
        <div class="bk-detail-section">
          <div class="bk-detail-label">🗺️ Detail Perjalanan</div>
          <div class="bk-detail-row"><span class="bk-key">Destinasi</span><span class="bk-val">${b.namaDestinasi}</span></div>
          <div class="bk-detail-row"><span class="bk-key">Lokasi</span><span class="bk-val">📍 ${b.lokasi || '-'}</span></div>
          <div class="bk-detail-row"><span class="bk-key">Jenis</span><span class="bk-val">${b.tipe}</span></div>
          <div class="bk-detail-row"><span class="bk-key">Tanggal Berangkat</span><span class="bk-val">📅 ${new Date(b.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
          <div class="bk-detail-row"><span class="bk-key">Jumlah Peserta</span><span class="bk-val">👥 ${b.pax} Orang</span></div>
          ${b.notes ? `<div class="bk-detail-row"><span class="bk-key">Catatan</span><span class="bk-val">${b.notes}</span></div>` : ''}
        </div>

        <!-- Detail Kontak -->
        <div class="bk-detail-section">
          <div class="bk-detail-label">👤 Informasi Pemesan</div>
          <div class="bk-detail-row"><span class="bk-key">Nama Kontak</span><span class="bk-val">${b.contactName}</span></div>
          <div class="bk-detail-row"><span class="bk-key">Nomor WhatsApp</span><span class="bk-val">📱 ${b.contactPhone}</span></div>
        </div>

        <!-- Detail Pembayaran -->
        <div class="bk-detail-section">
          <div class="bk-detail-label">💳 Rincian Pembayaran</div>
          <div class="bk-detail-row"><span class="bk-key">Harga per orang</span><span class="bk-val">${harga}</span></div>
          <div class="bk-detail-row"><span class="bk-key">Jumlah peserta</span><span class="bk-val">× ${b.pax}</span></div>
          <div class="bk-detail-row"><span class="bk-key">Metode Bayar</span><span class="bk-val">${b.payment}</span></div>
          <div class="bk-detail-row" style="border-top:2px solid var(--border);margin-top:4px;padding-top:8px">
            <span class="bk-key" style="font-weight:700;color:var(--text-primary)">Total</span>
            <span class="bk-val" style="font-size:20px;color:var(--primary)">${total}</span>
          </div>
        </div>

        <!-- Actions -->
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${b.status === 'pending' ? `
            <button onclick="BookingPage.confirmBooking('${b.id}');document.getElementById('bkDetailModal').classList.remove('open');document.body.style.overflow=''"
              style="flex:1;padding:12px;border-radius:var(--radius);background:linear-gradient(135deg,var(--accent),#00a36b);color:white;border:none;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">
              ✅ Konfirmasi Pembayaran
            </button>
            <button onclick="BookingPage.cancelBooking('${b.id}');document.getElementById('bkDetailModal').classList.remove('open');document.body.style.overflow=''"
              style="padding:12px 20px;border-radius:var(--radius);background:#fee2e2;color:#dc2626;border:1px solid #fecaca;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">
              ❌ Batalkan
            </button>
          ` : ''}
          ${b.status === 'confirmed' ? `
            <button onclick="BookingPage.downloadTicket('${b.id}')"
              style="flex:1;padding:12px;border-radius:var(--radius);background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;border:none;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">
              🎫 Download Tiket
            </button>
          ` : ''}
          ${b.status === 'completed' && !b.reviewed ? `
            <button onclick="document.getElementById('bkDetailModal').classList.remove('open');setTimeout(()=>BookingPage.openReview('${b.id}'),300)"
              style="flex:1;padding:12px;border-radius:var(--radius);background:linear-gradient(135deg,#f59e0b,#d97706);color:white;border:none;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">
              ⭐ Beri Ulasan
            </button>
          ` : ''}
          <button onclick="BookingPage.shareBooking('${b.id}')"
            style="padding:12px 20px;border-radius:var(--radius);background:var(--bg);border:1.5px solid var(--border);color:var(--text-secondary);font-size:14px;font-weight:600;cursor:pointer;font-family:var(--font)">
            📤 Bagikan
          </button>
        </div>
      </div>
    `;

    document.getElementById('bkDetailModal').classList.add('open');
    document.body.style.overflow = 'hidden';

    document.getElementById('bkDetailModal').onclick = (e) => {
      if (e.target === document.getElementById('bkDetailModal')) {
        document.getElementById('bkDetailModal').classList.remove('open');
        document.body.style.overflow = '';
      }
    };
  },

  // ---- ACTIONS ----
  confirmBooking(id) {
    const all = JSON.parse(localStorage.getItem('wj-bookings') || '[]');
    const idx = all.findIndex(b => b.id === id);
    if (idx !== -1) {
      all[idx].status = 'confirmed';
      localStorage.setItem('wj-bookings', JSON.stringify(all));
    }
    this.loadBookings();
    this.renderStats();
    this.applyFilter();
    Toast.show('✅ Booking berhasil dikonfirmasi!', 'success');
  },

  cancelBooking(id) {
    const b = this.allBookings.find(x => x.id === id);
    if (!b) return;
    if (!confirm(`Yakin batalkan booking ke ${b.namaDestinasi}?`)) return;

    const all = JSON.parse(localStorage.getItem('wj-bookings') || '[]');
    const idx = all.findIndex(b => b.id === id);
    if (idx !== -1) {
      all[idx].status = 'cancelled';
      localStorage.setItem('wj-bookings', JSON.stringify(all));
    }
    this.loadBookings();
    this.renderStats();
    this.applyFilter();
    Toast.show('❌ Booking berhasil dibatalkan.', 'info');
  },

  downloadTicket(id) {
    const b = this.allBookings.find(x => x.id === id);
    if (!b) return;

    const content = `
TIKET WISATA JOMOKERTO
======================
Kode Booking  : ${b.id}
Destinasi     : ${b.namaDestinasi}
Lokasi        : ${b.lokasi}
Tanggal       : ${new Date(b.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
Peserta       : ${b.pax} Orang
Kontak        : ${b.contactName} (${b.contactPhone})
Total Bayar   : Rp ${b.total.toLocaleString('id-ID')}
Status        : ${b.status.toUpperCase()}
======================
Terima kasih telah memesan di Wisata Jomokerto!
Hubungi kami: info@wisatajomokerto.com
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tiket-${b.id}.txt`;
    a.click();
    Toast.show('🎫 Tiket berhasil diunduh!', 'success');
  },

  shareBooking(id) {
    const b = this.allBookings.find(x => x.id === id);
    if (!b) return;
    const text = `Saya sudah booking ke ${b.namaDestinasi} tanggal ${new Date(b.tanggal).toLocaleDateString('id-ID')} via Wisata Jomokerto! 🌴✈️`;
    if (navigator.share) {
      navigator.share({ title: 'Booking Wisata Jomokerto', text });
    } else {
      navigator.clipboard.writeText(text).then(() => Toast.show('📋 Disalin ke clipboard!', 'info'));
    }
  },

  // ---- NEW BOOKING ----
  populateDestSelect() {
    const select = document.getElementById('bkDestSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Pilih Destinasi --</option>' +
      this.destinations.map(d =>
        `<option value="${d.id}" data-harga="${d.harga}" data-nama="${d.nama}" data-lokasi="${d.lokasi || ''}" data-gambar="${d.gambar}">${d.nama} - ${d.lokasi}</option>`
      ).join('');
  },

  updatePrice() {
    const select = document.getElementById('bkDestSelect');
    const pax = parseInt(document.getElementById('bkPax')?.value || 1);
    const preview = document.getElementById('pricePreview');
    const priceDesc = document.getElementById('priceDesc');
    const priceTotal = document.getElementById('priceTotal');

    if (!select || !select.value) {
      if (preview) preview.style.display = 'none';
      return;
    }

    const opt = select.options[select.selectedIndex];
    const harga = parseInt(opt.dataset.harga || 0);
    const total = harga * pax;

    if (preview) {
      preview.style.display = 'block';
      priceDesc.textContent = `Rp ${harga.toLocaleString('id-ID')} × ${pax} orang`;
      priceTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
  },

  newBooking() {
    document.getElementById('bkNewModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('newBookingForm').reset();
    document.getElementById('pricePreview').style.display = 'none';

    // Prefill contact
    if (this.user) {
      const profileData = JSON.parse(localStorage.getItem(`wj-profile-${this.user.id}`) || '{}');
      const nameEl = document.getElementById('bkContactName');
      const phoneEl = document.getElementById('bkContactPhone');
      if (nameEl) nameEl.value = this.user.name;
      if (phoneEl && profileData.phone) phoneEl.value = profileData.phone;
    }
  },

  closeNew() {
    document.getElementById('bkNewModal').classList.remove('open');
    document.body.style.overflow = '';
  },

  submitNew() {
    const form = document.getElementById('newBookingForm');
    const destSelect = document.getElementById('bkDestSelect');
    const date = document.getElementById('bkDate').value;
    const pax = parseInt(document.getElementById('bkPax').value);
    const contactName = document.getElementById('bkContactName').value.trim();
    const contactPhone = document.getElementById('bkContactPhone').value.trim();
    const notes = document.getElementById('bkNotes').value.trim();
    const tipe = document.querySelector('input[name="bkTipe"]:checked')?.value || 'destinasi';
    const payment = document.querySelector('input[name="payment"]:checked')?.value || 'transfer_bank';

    if (!destSelect.value || !date || !pax || !contactName || !contactPhone) {
      Toast.show('⚠️ Lengkapi semua field yang wajib diisi!', 'warning');
      return;
    }

    const opt = destSelect.options[destSelect.selectedIndex];
    const harga = parseInt(opt.dataset.harga || 0);
    const total = harga * pax;

    const booking = {
      id: this.generateCode(),
      userId: this.user.id,
      destId: parseInt(destSelect.value),
      tipe,
      namaDestinasi: opt.dataset.nama,
      lokasi: opt.dataset.lokasi,
      gambar: opt.dataset.gambar,
      tanggal: date,
      pax,
      harga,
      total,
      status: 'pending',
      payment,
      contactName,
      contactPhone,
      notes,
      createdAt: new Date().toISOString(),
      reviewed: false
    };

    // Simpan ke tabel booking (localStorage)
    const all = JSON.parse(localStorage.getItem('wj-bookings') || '[]');
    all.unshift(booking);
    localStorage.setItem('wj-bookings', JSON.stringify(all));

    this.allBookings.unshift(booking);
    this.closeNew();
    this.renderStats();
    this.applyFilter();

    Toast.show(`🎉 Booking ke ${booking.namaDestinasi} berhasil dibuat! Kode: ${booking.id}`, 'success');

    // Show detail
    setTimeout(() => this.showDetail(booking.id), 500);
  },

  // ---- REVIEW ----
  openReview(id) {
    const b = this.allBookings.find(x => x.id === id);
    if (!b) return;
    this.currentReviewBookingId = id;
    this.selectedRating = 0;

    document.getElementById('reviewDestName').innerHTML = `
      <div style="font-size:20px;font-weight:700;color:var(--text-primary)">${b.namaDestinasi}</div>
      <div style="font-size:13px;color:var(--text-muted);margin-top:4px">📍 ${b.lokasi}</div>
    `;
    document.getElementById('reviewText').value = '';
    document.getElementById('ratingLabel').textContent = 'Pilih rating';
    document.querySelectorAll('.star-btn').forEach(s => s.classList.remove('active'));

    document.getElementById('reviewModal').classList.add('open');
    document.body.style.overflow = 'hidden';

    // Star rating
    document.querySelectorAll('.star-btn').forEach(star => {
      star.onclick = () => {
        this.selectedRating = parseInt(star.dataset.val);
        document.querySelectorAll('.star-btn').forEach(s => {
          s.classList.toggle('active', parseInt(s.dataset.val) <= this.selectedRating);
        });
        const labels = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Luar Biasa!'];
        document.getElementById('ratingLabel').textContent = labels[this.selectedRating];
      };
    });
  },

  submitReview() {
    if (!this.selectedRating) {
      Toast.show('Pilih rating bintang terlebih dahulu!', 'warning');
      return;
    }
    const text = document.getElementById('reviewText').value.trim();
    if (!text) {
      Toast.show('Tulis komentar ulasan Anda!', 'warning');
      return;
    }

    const b = this.allBookings.find(x => x.id === this.currentReviewBookingId);
    if (!b) return;

    // Simpan review ke tabel review
    const reviews = JSON.parse(localStorage.getItem(`wj-reviews-${this.user.id}`) || '[]');
    reviews.unshift({
      id: Date.now(),
      userId: this.user.id,
      destId: b.destId,
      namaDestinasi: b.namaDestinasi,
      rating: this.selectedRating,
      komentar: text,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(`wj-reviews-${this.user.id}`, JSON.stringify(reviews));

    // Mark booking as reviewed
    const all = JSON.parse(localStorage.getItem('wj-bookings') || '[]');
    const idx = all.findIndex(x => x.id === this.currentReviewBookingId);
    if (idx !== -1) { all[idx].reviewed = true; localStorage.setItem('wj-bookings', JSON.stringify(all)); }
    const bIdx = this.allBookings.findIndex(x => x.id === this.currentReviewBookingId);
    if (bIdx !== -1) this.allBookings[bIdx].reviewed = true;

    document.getElementById('reviewModal').classList.remove('open');
    document.body.style.overflow = '';
    this.render();
    Toast.show('⭐ Ulasan berhasil dikirim! Terima kasih!', 'success');
  },

  // ---- UTILS ----
  generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'WJ';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  },

  bindPaymentOptions() {
    document.querySelectorAll('.payment-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.payment-option').forEach(o => {
          o.style.background = 'var(--bg)';
          o.style.borderColor = 'var(--border)';
        });
        opt.style.background = 'var(--primary-light)';
        opt.style.borderColor = 'var(--primary)';
        opt.querySelector('input').checked = true;
      });
    });
  }
};

// Toast fallback
if (typeof Toast === 'undefined') {
  window.Toast = {
    init() { this.container = document.getElementById('toastWrap'); },
    show(msg, type = 'success') {
      let c = document.getElementById('toastWrap');
      if (!c) return;
      const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
      const el = document.createElement('div');
      el.className = `toast ${type}`;
      el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
      c.appendChild(el);
      setTimeout(() => { el.style.animation = 'slideIn 0.3s reverse'; setTimeout(() => el.remove(), 300); }, 4000);
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // Theme
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
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.querySelector('.mobile-nav')?.classList.toggle('open');
  });

  // Close modals on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });

  BookingPage.init();
});
