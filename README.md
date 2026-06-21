# ✈️ WISATA JOMOKERTO - Website Wisata Lengkap

Platform wisata premium terinspirasi dari Traveloka, dilengkapi dengan sistem admin, login/register, dark mode, dan database MySQL.

---

## 📁 STRUKTUR FILE

```
wisata_jomokerto/
├── index.html              ← Halaman utama website
├── database.sql            ← Script database MySQL (import ke HeidiSQL)
├── css/
│   ├── style.css           ← CSS utama website
│   └── admin.css           ← CSS panel admin
├── js/
│   └── main.js             ← JavaScript utama (interaktif)
├── admin/
│   ├── index.html          ← Panel Admin (dashboard)
│   └── admin.js            ← JavaScript admin
└── README.md               ← File ini
```

---

## 🗄️ SETUP DATABASE (HeidiSQL)

### Langkah Import:
1. Buka **HeidiSQL**
2. Klik **File → New Session** atau gunakan koneksi yang ada
3. Isi: Host: `localhost`, User: `root`, Password: (kosong/sesuai setup)
4. Klik **Open**
5. Di menu atas, klik **File → Run SQL File** atau tekan `Ctrl+O`
6. Pilih file `database.sql`
7. Klik **Run** (F5)
8. Database `wisata_jomokerto` akan otomatis dibuat!

### Koneksi PHP (jika pakai backend):
```php
<?php
$conn = mysqli_connect("localhost", "root", "", "wisata_jomokerto");
if (!$conn) die("Koneksi gagal: " . mysqli_connect_error());
?>
```

---

## 🚀 CARA MENJALANKAN

### Metode 1: Langsung Buka (Frontend Only)
1. Ekstrak semua file ke folder
2. Buka `index.html` dengan browser (Chrome/Firefox/Edge)
3. Selesai! Login, register, dan semua fitur interaktif tersedia

### Metode 2: Dengan Web Server (Lokal)
1. Install XAMPP/Laragon
2. Copy folder ke `C:/xampp/htdocs/wisata_jomokerto/`
3. Import `database.sql` ke HeidiSQL
4. Buka browser: `http://localhost/wisata_jomokerto/`

---

## 🔐 LOGIN DEFAULT

| Role  | Email                          | Password   |
|-------|-------------------------------|------------|
| Admin | admin@wisatajomokerto.com      | admin123   |
| User  | budi@gmail.com                 | admin123   |
| User  | siti@gmail.com                 | admin123   |

---

## ✨ FITUR LENGKAP

### 🌐 Website Utama (index.html)
- ✅ Loading screen animasi 2 detik
- ✅ Navbar lengkap dengan dropdown menu
- ✅ Hero slider otomatis 3 slide
- ✅ Kotak pencarian multi-mode (Pesawat, Bus, Kapal, Kereta, Paket)
- ✅ Section Transportasi (4 pilihan)
- ✅ Destinasi Dalam Negeri & Luar Negeri
- ✅ Filter berdasarkan tipe dan kategori
- ✅ Pencarian real-time
- ✅ Modal detail destinasi
- ✅ Sistem Wishlist
- ✅ Paket wisata (Dalam/Luar Negeri, Honeymoon)
- ✅ Section promosi/banner
- ✅ Galeri foto
- ✅ Testimonial pelanggan
- ✅ Counter animasi (statistik)
- ✅ Newsletter subscription
- ✅ Footer lengkap (sosial media, link, metode bayar)
- ✅ Back to top button
- ✅ Toast notification
- ✅ Dark/Light mode
- ✅ Responsive (Mobile friendly)

### 🔐 Sistem Auth
- ✅ Modal Login dengan validasi
- ✅ Modal Register dengan validasi
- ✅ Dropdown user profile (jika sudah login)
- ✅ Logout
- ✅ Role-based: Admin & User
- ✅ Data tersimpan di localStorage (simulasi)
- ✅ Google/Facebook login placeholder

### ⚙️ Panel Admin (admin/index.html)
- ✅ Auth check (hanya admin yang bisa akses)
- ✅ Sidebar navigation lengkap dengan collapse
- ✅ Dashboard dengan statistik
- ✅ Grafik kunjungan animasi
- ✅ Manajemen destinasi (CRUD):
  - Tambah destinasi baru
  - Edit destinasi existing
  - Hapus destinasi
  - Toggle status aktif/nonaktif
  - Toggle featured
  - Preview gambar real-time
  - Filter & pencarian
  - Pagination
- ✅ Lihat booking terbaru
- ✅ Lihat daftar users
- ✅ Quick actions
- ✅ Info koneksi database
- ✅ Dark/Light mode
- ✅ Toast notifications

---

## 🗄️ TABEL DATABASE

| Tabel         | Keterangan                          |
|---------------|-------------------------------------|
| users         | Data pengguna (admin & user)        |
| destinasi     | Data destinasi wisata               |
| transport     | Data tiket transportasi             |
| paket_wisata  | Paket perjalanan wisata             |
| booking       | Data pemesanan                      |
| review        | Ulasan dan rating                   |
| slider        | Slide/banner homepage               |
| galeri        | Foto galeri                         |

---

## 🎨 DESAIN

- **Font**: Plus Jakarta Sans + Playfair Display
- **Primary**: #0d5bdd (Biru Premium)
- **Secondary**: #ff6b35 (Oranye)
- **Accent**: #00b67a (Hijau)
- **Tema**: Premium Travel (ala Traveloka/Airbnb)
- **Animasi**: CSS transitions, scroll reveal, hero slider, counter

---

## 📱 RESPONSIVE BREAKPOINTS

- Desktop: > 1024px
- Tablet: 768px - 1024px  
- Mobile: < 768px
- Small Mobile: < 480px

---

## 💡 PENGEMBANGAN SELANJUTNYA

Untuk versi production dengan PHP:
1. Integrasikan dengan PHP + MySQL menggunakan PDO
2. Gunakan password_hash() untuk enkripsi password
3. Implementasikan session PHP untuk auth
4. Tambahkan upload foto ke server
5. Integrasikan payment gateway (Midtrans/Xendit)
6. Tambahkan Google Maps API untuk lokasi
7. Deploy ke hosting (cPanel/VPS)

---

## 📞 BANTUAN

Website dibuat dengan ❤️ untuk Wisata Jomokerto
© 2025 Wisata Jomokerto - Mojokerto, Jawa Timur
