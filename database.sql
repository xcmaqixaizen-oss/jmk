-- ============================================
-- DATABASE: wisata_jomokerto
-- Import ke HeidiSQL
-- ============================================

CREATE DATABASE IF NOT EXISTS `wisata_jomokerto`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `wisata_jomokerto`;

-- ==================== TABEL USERS ====================
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user','admin') DEFAULT 'user',
  `avatar` VARCHAR(255) DEFAULT 'default.png',
  `phone` VARCHAR(20) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== TABEL DESTINASI ====================
CREATE TABLE `destinasi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `deskripsi` TEXT,
  `deskripsi_singkat` VARCHAR(500),
  `lokasi` VARCHAR(200),
  `kota` VARCHAR(100),
  `provinsi` VARCHAR(100),
  `negara` VARCHAR(100) DEFAULT 'Indonesia',
  `tipe` ENUM('dalam_negeri','luar_negeri') DEFAULT 'dalam_negeri',
  `kategori` ENUM('pantai','gunung','budaya','kota','alam','religi','kuliner','hiburan') DEFAULT 'alam',
  `gambar` VARCHAR(255) DEFAULT 'default.jpg',
  `gambar_gallery` TEXT DEFAULT NULL,
  `harga_mulai` DECIMAL(12,0) DEFAULT 0,
  `rating` DECIMAL(2,1) DEFAULT 0,
  `jumlah_review` INT DEFAULT 0,
  `lat` DECIMAL(10,8) DEFAULT NULL,
  `lng` DECIMAL(11,8) DEFAULT NULL,
  `fasilitas` TEXT DEFAULT NULL,
  `jam_buka` VARCHAR(100) DEFAULT '08:00 - 17:00',
  `is_featured` TINYINT(1) DEFAULT 0,
  `status` ENUM('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== TABEL PAKET TRANSPORT ====================
CREATE TABLE `transport` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(200) NOT NULL,
  `tipe` ENUM('pesawat','bus','kapal','kereta') NOT NULL,
  `asal` VARCHAR(100) NOT NULL,
  `tujuan` VARCHAR(100) NOT NULL,
  `maskapai_operator` VARCHAR(100),
  `harga` DECIMAL(12,0) NOT NULL,
  `durasi` VARCHAR(50),
  `kelas` ENUM('ekonomi','bisnis','eksekutif','first_class') DEFAULT 'ekonomi',
  `jam_berangkat` TIME,
  `jam_tiba` TIME,
  `fasilitas` TEXT,
  `status` ENUM('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== TABEL PAKET WISATA ====================
CREATE TABLE `paket_wisata` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(200) NOT NULL,
  `destinasi_id` INT,
  `deskripsi` TEXT,
  `durasi_hari` INT DEFAULT 1,
  `harga` DECIMAL(12,0) NOT NULL,
  `gambar` VARCHAR(255) DEFAULT 'default.jpg',
  `include` TEXT,
  `exclude` TEXT,
  `itinerary` TEXT,
  `min_peserta` INT DEFAULT 1,
  `max_peserta` INT DEFAULT 20,
  `tipe` ENUM('dalam_negeri','luar_negeri') DEFAULT 'dalam_negeri',
  `status` ENUM('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`destinasi_id`) REFERENCES `destinasi`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== TABEL BOOKING ====================
CREATE TABLE `booking` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_booking` VARCHAR(20) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `tipe` ENUM('destinasi','paket','transport') NOT NULL,
  `ref_id` INT NOT NULL,
  `tanggal_berangkat` DATE NOT NULL,
  `jumlah_orang` INT DEFAULT 1,
  `total_harga` DECIMAL(12,0) NOT NULL,
  `status` ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `catatan` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== TABEL REVIEW ====================
CREATE TABLE `review` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `destinasi_id` INT NOT NULL,
  `rating` TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  `komentar` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`destinasi_id`) REFERENCES `destinasi`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== TABEL SLIDER/BANNER ====================
CREATE TABLE `slider` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `judul` VARCHAR(200),
  `subjudul` VARCHAR(300),
  `gambar` VARCHAR(255) NOT NULL,
  `link` VARCHAR(255) DEFAULT '#',
  `urutan` INT DEFAULT 0,
  `status` ENUM('aktif','nonaktif') DEFAULT 'aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== TABEL GALERI ====================
CREATE TABLE `galeri` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `judul` VARCHAR(200),
  `gambar` VARCHAR(255) NOT NULL,
  `destinasi_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`destinasi_id`) REFERENCES `destinasi`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== DATA SAMPLE ====================

-- Admin & User Default (password: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin Jomokerto', 'admin@wisatajomokerto.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Budi Santoso', 'budi@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Siti Rahayu', 'siti@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Destinasi Dalam Negeri
INSERT INTO `destinasi` (`nama`, `slug`, `deskripsi`, `deskripsi_singkat`, `lokasi`, `kota`, `provinsi`, `negara`, `tipe`, `kategori`, `gambar`, `harga_mulai`, `rating`, `jumlah_review`, `lat`, `lng`, `fasilitas`, `jam_buka`, `is_featured`, `status`) VALUES
('Bromo Tengger Semeru', 'bromo-tengger-semeru', 'Taman Nasional Bromo Tengger Semeru adalah salah satu taman nasional di Jawa Timur yang terkenal dengan Gunung Bromo yang masih aktif dan pemandangan sunrise yang memukau. Lautan pasir yang luas mengelilingi Gunung Bromo memberikan pemandangan yang sangat dramatis.', 'Keajaiban alam Jawa Timur dengan sunrise memukau di atas lautan pasir', 'Jl. Raya Bromo, Probolinggo', 'Probolinggo', 'Jawa Timur', 'Indonesia', 'dalam_negeri', 'gunung', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 250000, 4.9, 1240, -7.9425, 112.9530, 'Jeep 4WD, Kuda, Homestay, Restoran, Toilet', '04:00 - 17:00', 1, 'aktif'),

('Raja Ampat', 'raja-ampat', 'Raja Ampat adalah kepulauan yang terletak di provinsi Papua Barat dan merupakan surga bawah laut terbaik di dunia. Keanekaragaman hayati laut yang luar biasa menjadikan Raja Ampat destinasi favorit para penyelam dari seluruh dunia.', 'Surga tersembunyi dengan keindahan bawah laut nomor satu di dunia', 'Kabupaten Raja Ampat', 'Sorong', 'Papua Barat', 'Indonesia', 'dalam_negeri', 'pantai', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', 1500000, 4.8, 890, -0.2350, 130.5252, 'Dive Center, Homestay, Speedboat, Snorkeling', '06:00 - 18:00', 1, 'aktif'),

('Borobudur', 'borobudur', 'Candi Borobudur adalah kuil Buddha terbesar di dunia yang dibangun pada abad ke-9 dan merupakan warisan budaya UNESCO. Terletak di dataran Kedu Jawa Tengah, Borobudur menawarkan pengalaman spiritual dan historis yang tak terlupakan.', 'Candi Buddha terbesar di dunia, warisan UNESCO yang menakjubkan', 'Jl. Badrawati, Borobudur', 'Magelang', 'Jawa Tengah', 'Indonesia', 'dalam_negeri', 'budaya', 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800', 50000, 4.7, 2100, -7.6079, 110.2038, 'Pemandu Wisata, Restoran, Souvenir, Parkir, Toilet', '06:00 - 17:00', 1, 'aktif'),

('Gili Trawangan', 'gili-trawangan', 'Gili Trawangan adalah pulau terbesar dari tiga Gili di Lombok, Nusa Tenggara Barat. Terkenal dengan pantai berpasir putih, air laut jernih berwarna biru toska, dan kehidupan malam yang ramai namun tetap alami.', 'Pulau surga di Lombok dengan pantai putih dan air biru jernih', 'Gili Trawangan, Lombok Utara', 'Lombok', 'Nusa Tenggara Barat', 'Indonesia', 'dalam_negeri', 'pantai', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 350000, 4.6, 756, -8.3520, 116.0291, 'Snorkeling, Diving, Sepeda, Restoran, Bar', '00:00 - 24:00', 1, 'aktif'),

('Danau Toba', 'danau-toba', 'Danau Toba adalah danau vulkanik terbesar di dunia yang terletak di Sumatera Utara. Di tengah danau terdapat Pulau Samosir yang menjadi pusat budaya Batak. Pemandangan danau yang dikelilingi perbukitan hijau sangat memukau.', 'Danau vulkanik terbesar di dunia dengan budaya Batak yang kaya', 'Kabupaten Samosir', 'Medan', 'Sumatera Utara', 'Indonesia', 'dalam_negeri', 'alam', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 200000, 4.5, 630, 2.6845, 98.8756, 'Ferry, Homestay, Restoran Batak, Souvenir', '07:00 - 18:00', 0, 'aktif'),

('Komodo Island', 'komodo-island', 'Taman Nasional Komodo adalah habitat alami komodo, kadal terbesar di dunia. Selain melihat komodo, wisatawan juga dapat menikmati snorkeling di perairan Pink Beach yang terkenal dengan pasir berwarna merah muda.', 'Habitat kadal terbesar di dunia dengan Pink Beach yang memukau', 'Kabupaten Manggarai Barat', 'Labuan Bajo', 'Nusa Tenggara Timur', 'Indonesia', 'dalam_negeri', 'alam', 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800', 500000, 4.7, 920, -8.5544, 119.4897, 'Boat Tour, Trekking Guide, Snorkeling, Pink Beach', '07:00 - 17:00', 1, 'aktif'),

('Ubud Bali', 'ubud-bali', 'Ubud adalah jantung budaya Bali yang terkenal dengan sawah terasering, pura kuno, seniman lokal, dan kelas yoga. Kawasan ini menawarkan pengalaman budaya Bali yang autentik di tengah alam yang hijau dan asri.', 'Jantung seni dan budaya Bali di tengah persawahan hijau', 'Ubud, Gianyar', 'Gianyar', 'Bali', 'Indonesia', 'dalam_negeri', 'budaya', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800', 150000, 4.8, 1890, -8.5069, 115.2625, 'Kelas Yoga, Spa, Restoran Organik, Galeri Seni', '06:00 - 21:00', 1, 'aktif'),

('Kelimutu', 'kelimutu', 'Kelimutu adalah gunung berapi yang memiliki tiga danau kawah dengan warna berbeda-beda di puncaknya. Fenomena alam unik ini terletak di Ende, Flores, Nusa Tenggara Timur dan menjadi salah satu keajaiban alam Indonesia.', 'Tiga danau kawah dengan warna magis yang berubah-ubah', 'Ende, Flores', 'Ende', 'Nusa Tenggara Timur', 'Indonesia', 'dalam_negeri', 'alam', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', 300000, 4.6, 445, -8.7744, 121.8215, 'Sunrise Tour, Trekking, Guide Lokal, Homestay', '04:00 - 12:00', 0, 'aktif');

-- Destinasi Luar Negeri
INSERT INTO `destinasi` (`nama`, `slug`, `deskripsi`, `deskripsi_singkat`, `lokasi`, `kota`, `provinsi`, `negara`, `tipe`, `kategori`, `gambar`, `harga_mulai`, `rating`, `jumlah_review`, `lat`, `lng`, `fasilitas`, `jam_buka`, `is_featured`, `status`) VALUES
('Santorini', 'santorini', 'Santorini adalah pulau vulkanik yang terletak di Laut Aegea, Yunani. Terkenal dengan bangunan putih berkubah biru, matahari terbenam yang spektakuler di Oia, dan pantai-pantai berpasir hitam yang eksotis.', 'Pulau romantis Yunani dengan bangunan putih dan sunset terbaik dunia', 'Santorini, Cyclades', 'Santorini', 'Cyclades', 'Yunani', 'luar_negeri', 'pantai', 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', 15000000, 4.9, 3200, 36.3932, 25.4615, 'Hotel Mewah, Wine Tour, Sunset Cruise, Spa', '00:00 - 24:00', 1, 'aktif'),

('Machu Picchu', 'machu-picchu', 'Machu Picchu adalah kota Inca kuno yang terletak di puncak Andes Peru. Dibangun sekitar tahun 1450 Masehi, situs warisan UNESCO ini ditemukan kembali oleh Hiram Bingham pada tahun 1911 dan kini menjadi salah satu keajaiban dunia.', 'Kota kuno Inca di puncak Andes Peru, keajaiban dunia yang memukau', 'Cusco Region', 'Aguas Calientes', 'Cusco', 'Peru', 'luar_negeri', 'budaya', 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', 18000000, 4.9, 2800, -13.1631, -72.5450, 'Trek Inca, Guide, Bus, Restoran', '06:00 - 17:30', 1, 'aktif'),

('Maldives', 'maldives', 'Maladewa adalah negara kepulauan di Samudra Hindia yang terkenal dengan resort-resort mewah di atas air, laguna biru jernih, dan terumbu karang yang kaya kehidupan laut. Destinasi impian untuk honeymoon dan liburan premium.', 'Surga tropis dengan villa apung mewah di Samudra Hindia', 'Atoll Maladewa', 'Male', '-', 'Maladewa', 'luar_negeri', 'pantai', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', 25000000, 5.0, 4100, 3.2028, 73.2207, 'Overwater Bungalow, Diving, Spa, Fine Dining', '00:00 - 24:00', 1, 'aktif'),

('Tokyo', 'tokyo', 'Tokyo adalah ibukota Jepang yang memadukan tradisi dan modernitas secara harmonis. Dari kuil Senso-ji yang bersejarah hingga distrik Shibuya yang futuristik, Tokyo menawarkan pengalaman urban yang tak tertandingi dengan kuliner terbaik dunia.', 'Kota metropolitan Jepang yang memadukan tradisi dan modernitas', 'Tokyo Metropolis', 'Tokyo', '-', 'Jepang', 'luar_negeri', 'kota', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 20000000, 4.8, 5600, 35.6762, 139.6503, 'JR Pass, City Tour, Ryokan, Ramen Tour', '00:00 - 24:00', 1, 'aktif'),

('Paris', 'paris', 'Paris adalah ibu kota Prancis dan salah satu kota paling romantis di dunia. Menara Eiffel, Museum Louvre, dan kawasan Montmartre hanyalah sebagian dari daya tarik kota yang juga dikenal sebagai pusat mode dan kuliner dunia.', 'Kota cahaya yang romantis dengan Menara Eiffel yang ikonik', 'Île-de-France', 'Paris', '-', 'Prancis', 'luar_negeri', 'kota', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 22000000, 4.8, 7800, 48.8566, 2.3522, 'Museum Pass, River Cruise, Cooking Class, Metro', '00:00 - 24:00', 0, 'aktif'),

('Dubai', 'dubai', 'Dubai adalah kota ultramodern di Uni Emirat Arab yang terkenal dengan gedung-gedung pencakar langit mewah, mal terbesar dunia, dan pengalaman wisata yang eksklusif. Burj Khalifa yang menjulang setinggi 828 meter menjadi ikon kota ini.', 'Kota futuristik di gurun dengan kemewahan yang tak tertandingi', 'Dubai Emirate', 'Dubai', '-', 'Uni Emirat Arab', 'luar_negeri', 'kota', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 19000000, 4.7, 4300, 25.2048, 55.2708, 'Desert Safari, Burj Khalifa, Dubai Mall, Luxury Hotel', '00:00 - 24:00', 1, 'aktif');

-- Data Transport
INSERT INTO `transport` (`nama`, `tipe`, `asal`, `tujuan`, `maskapai_operator`, `harga`, `durasi`, `kelas`, `jam_berangkat`, `jam_tiba`, `fasilitas`) VALUES
('Garuda Indonesia - Jakarta ke Bali', 'pesawat', 'Jakarta (CGK)', 'Denpasar (DPS)', 'Garuda Indonesia', 850000, '1j 40m', 'ekonomi', '06:00:00', '07:40:00', 'Bagasi 20kg, Makanan, Hiburan'),
('Lion Air - Jakarta ke Surabaya', 'pesawat', 'Jakarta (CGK)', 'Surabaya (SUB)', 'Lion Air', 450000, '1j 15m', 'ekonomi', '08:00:00', '09:15:00', 'Bagasi 20kg'),
('Garuda Business - Jakarta ke Singapura', 'pesawat', 'Jakarta (CGK)', 'Singapura (SIN)', 'Garuda Indonesia', 3500000, '1j 45m', 'bisnis', '07:00:00', '10:45:00', 'Bagasi 30kg, Lounge, Fine Dining'),
('Air Asia - Bali ke Tokyo', 'pesawat', 'Denpasar (DPS)', 'Tokyo (NRT)', 'Air Asia', 5200000, '7j 30m', 'ekonomi', '23:00:00', '09:30:00', 'Bagasi 20kg'),
('Bus Malam - Jakarta ke Yogyakarta', 'bus', 'Jakarta (Kampung Rambutan)', 'Yogyakarta (Giwangan)', 'PO Sumber Alam', 180000, '8j', 'eksekutif', '20:00:00', '04:00:00', 'AC, Reclining Seat, Selimut, Toilet'),
('Bus Premium - Surabaya ke Malang', 'bus', 'Surabaya (Bungurasih)', 'Malang (Arjosari)', 'PO Safari Dharma', 65000, '2j', 'ekonomi', '07:00:00', '09:00:00', 'AC, Bagasi'),
('Kapal Feri - Bali ke Lombok', 'kapal', 'Padang Bai (Bali)', 'Lembar (Lombok)', 'ASDP Indonesia Ferry', 85000, '4j 30m', 'ekonomi', '10:00:00', '14:30:00', 'Deck, Toilet, Kantin'),
('Kapal Cepat - Bali ke Gili', 'kapal', 'Sanur (Bali)', 'Gili Trawangan', 'Eka Jaya Fast Boat', 450000, '2j', 'ekonomi', '09:00:00', '11:00:00', 'AC, Minuman, Life Jacket'),
('Kapal Cruise - Sorong ke Raja Ampat', 'kapal', 'Sorong', 'Raja Ampat', 'Liveaboard Raja Ampat', 2500000, '3j', 'eksekutif', '08:00:00', '11:00:00', 'Kabin, Makan, Peralatan Diving');

-- Paket Wisata
INSERT INTO `paket_wisata` (`nama`, `destinasi_id`, `deskripsi`, `durasi_hari`, `harga`, `gambar`, `include`, `exclude`, `tipe`) VALUES
('Paket Bromo Sunrise 3D2N', 1, 'Nikmati pengalaman tak terlupakan menyaksikan matahari terbit di Gunung Bromo dengan paket lengkap 3 hari 2 malam.', 3, 1250000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Hotel 2 malam, Jeep 4WD, Guide, Sarapan, Tiket masuk', 'Penerbangan, Makan siang & malam, Tips guide', 'dalam_negeri'),
('Paket Raja Ampat Diving 5D4N', 2, 'Jelajahi keindahan bawah laut Raja Ampat yang menakjubkan bersama tim diving profesional.', 5, 7500000, 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', 'Penginapan 4 malam, 10x diving, Speedboat, 3x makan/hari, Peralatan diving', 'Penerbangan, Visa', 'dalam_negeri'),
('Paket Bali - Ubud & Seminyak 4D3N', 7, 'Eksplorasi sisi budaya Ubud dan pantai Seminyak yang elegan dalam satu paket wisata premium.', 4, 3500000, 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800', 'Hotel bintang 4, Transportasi, Guide, Sarapan, Kelas memasak', 'Penerbangan, Makan siang & malam', 'dalam_negeri'),
('Paket Japan Explorer 7D6N', NULL, 'Jelajahi Tokyo, Kyoto, dan Osaka dalam paket wisata Jepang yang komprehensif dengan pengalaman budaya mendalam.', 7, 18500000, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 'Hotel 6 malam, JR Pass 7 hari, Guide berbahasa Indonesia, Sarapan', 'Tiket pesawat PP, Makan siang & malam, Tips', 'luar_negeri'),
('Paket Maldives Honeymoon 5D4N', NULL, 'Paket honeymoon eksklusif di Maladewa dengan overwater bungalow dan pengalaman mewah yang tak terlupakan.', 5, 45000000, 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', 'Overwater bungalow 4 malam, Transfer speedboat, 3x makan/hari, Spa 1x, Snorkeling gear', 'Tiket pesawat, Visa', 'luar_negeri');

-- Slider/Banner
INSERT INTO `slider` (`judul`, `subjudul`, `gambar`, `urutan`) VALUES
('Jelajahi Keindahan Indonesia', 'Temukan ribuan destinasi wisata terbaik dari Sabang sampai Merauke', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920', 1),
('Wisata Mancanegara Impian', 'Wujudkan perjalanan ke destinasi impian Anda bersama Wisata Jomokerto', 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920', 2),
('Paket Wisata Terjangkau', 'Harga terbaik dengan pengalaman perjalanan yang tak terlupakan', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920', 3);

-- Review Sample
INSERT INTO `review` (`user_id`, `destinasi_id`, `rating`, `komentar`) VALUES
(2, 1, 5, 'Pengalaman yang luar biasa! Sunrise di Bromo tidak ada duanya. Sangat rekomendasikan!'),
(3, 1, 5, 'Pemandangan yang spektakuler. Jeep-nya nyaman dan guide sangat informatif.'),
(2, 7, 5, 'Ubud memang juara! Tenang, hijau, dan penuh dengan budaya. Pasti balik lagi!'),
(3, 3, 4, 'Borobudur sangat megah, tapi agak ramai wisatawan. Datang pagi-pagi agar lebih tenang.');

-- ==================== UPDATE TABEL USERS (tambah kolom profil) ====================
ALTER TABLE `users`
  ADD COLUMN `phone` VARCHAR(20) DEFAULT NULL AFTER `role`,
  ADD COLUMN `birthdate` DATE DEFAULT NULL AFTER `phone`,
  ADD COLUMN `gender` ENUM('Laki-laki','Perempuan','Tidak ingin menyebutkan') DEFAULT NULL AFTER `birthdate`,
  ADD COLUMN `city` VARCHAR(100) DEFAULT NULL AFTER `gender`,
  ADD COLUMN `address` TEXT DEFAULT NULL AFTER `city`,
  ADD COLUMN `bio` TEXT DEFAULT NULL AFTER `address`,
  ADD COLUMN `nik` VARCHAR(20) DEFAULT NULL AFTER `bio`,
  ADD COLUMN `passport` VARCHAR(30) DEFAULT NULL AFTER `nik`,
  ADD COLUMN `passport_exp` DATE DEFAULT NULL AFTER `passport`,
  ADD COLUMN `nationality` VARCHAR(50) DEFAULT 'Indonesia' AFTER `passport_exp`,
  ADD COLUMN `pref_categories` TEXT DEFAULT NULL AFTER `nationality`,
  ADD COLUMN `pref_budget` VARCHAR(20) DEFAULT NULL AFTER `pref_categories`,
  ADD COLUMN `notif_booking` TINYINT(1) DEFAULT 1 AFTER `pref_budget`,
  ADD COLUMN `notif_promo` TINYINT(1) DEFAULT 1 AFTER `notif_booking`,
  ADD COLUMN `notif_newsletter` TINYINT(1) DEFAULT 0 AFTER `notif_promo`,
  ADD COLUMN `two_fa` TINYINT(1) DEFAULT 0 AFTER `notif_newsletter`,
  ADD COLUMN `last_login` TIMESTAMP NULL AFTER `two_fa`;

-- ==================== UPDATE TABEL BOOKING (tambah kolom) ====================
ALTER TABLE `booking`
  ADD COLUMN `dest_gambar` VARCHAR(500) DEFAULT NULL AFTER `ref_id`,
  ADD COLUMN `nama_destinasi` VARCHAR(200) DEFAULT NULL AFTER `dest_gambar`,
  ADD COLUMN `lokasi` VARCHAR(200) DEFAULT NULL AFTER `nama_destinasi`,
  ADD COLUMN `harga_per_orang` DECIMAL(12,0) DEFAULT 0 AFTER `lokasi`,
  ADD COLUMN `contact_name` VARCHAR(100) DEFAULT NULL AFTER `harga_per_orang`,
  ADD COLUMN `contact_phone` VARCHAR(20) DEFAULT NULL AFTER `contact_name`,
  ADD COLUMN `payment_method` ENUM('transfer_bank','gopay','ovo','qris','cod','cicilan') DEFAULT 'transfer_bank' AFTER `contact_phone`,
  ADD COLUMN `reviewed` TINYINT(1) DEFAULT 0 AFTER `payment_method`;

-- ==================== UPDATE TABEL REVIEW ====================
ALTER TABLE `review`
  ADD COLUMN `judul` VARCHAR(200) DEFAULT NULL AFTER `komentar`,
  ADD COLUMN `foto` TEXT DEFAULT NULL AFTER `judul`,
  ADD COLUMN `status` ENUM('pending','approved','rejected') DEFAULT 'approved' AFTER `foto`;

-- ==================== STORED PROCEDURE: GET USER BOOKINGS ====================
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS `sp_getUserBookings`(IN p_user_id INT)
BEGIN
  SELECT 
    b.*,
    d.nama AS dest_nama,
    d.gambar AS dest_gambar,
    d.lokasi AS dest_lokasi,
    d.kategori AS dest_kategori
  FROM booking b
  LEFT JOIN destinasi d ON b.ref_id = d.id AND b.tipe = 'destinasi'
  WHERE b.user_id = p_user_id
  ORDER BY b.created_at DESC;
END //
DELIMITER ;

-- ==================== STORED PROCEDURE: BOOKING STATS USER ====================
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS `sp_getBookingStats`(IN p_user_id INT)
BEGIN
  SELECT 
    COUNT(*) AS total,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
    SUM(CASE WHEN status != 'cancelled' THEN total_harga ELSE 0 END) AS total_spend
  FROM booking
  WHERE user_id = p_user_id;
END //
DELIMITER ;

-- ==================== VIEW: USER PROFILE LENGKAP ====================
CREATE OR REPLACE VIEW `v_user_profile` AS
SELECT 
  u.*,
  COUNT(DISTINCT b.id) AS total_booking,
  COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) AS completed_trips,
  COUNT(DISTINCT r.id) AS total_reviews,
  SUM(CASE WHEN b.status != 'cancelled' THEN b.total_harga ELSE 0 END) AS total_spent
FROM users u
LEFT JOIN booking b ON u.id = b.user_id
LEFT JOIN review r ON u.id = r.user_id
GROUP BY u.id;

-- Sample data booking
INSERT INTO `booking` (`kode_booking`, `user_id`, `tipe`, `ref_id`, `nama_destinasi`, `lokasi`, `harga_per_orang`, `tanggal_berangkat`, `jumlah_orang`, `total_harga`, `status`, `contact_name`, `contact_phone`, `payment_method`) VALUES
('WJA1B2C3', 2, 'destinasi', 1, 'Bromo Tengger Semeru', 'Probolinggo, Jawa Timur', 250000, DATE_ADD(NOW(), INTERVAL 7 DAY), 2, 500000, 'confirmed', 'Budi Santoso', '08123456789', 'transfer_bank'),
('WJD4E5F6', 2, 'destinasi', 7, 'Ubud Bali', 'Gianyar, Bali', 150000, DATE_ADD(NOW(), INTERVAL 30 DAY), 3, 450000, 'pending', 'Budi Santoso', '08123456789', 'gopay'),
('WJG7H8I9', 3, 'destinasi', 4, 'Gili Trawangan', 'Lombok, NTB', 350000, DATE_SUB(NOW(), INTERVAL 15 DAY), 2, 700000, 'completed', 'Siti Rahayu', '08987654321', 'qris');

-- Sample review
INSERT INTO `review` (`user_id`, `destinasi_id`, `rating`, `komentar`, `status`) VALUES
(3, 4, 5, 'Gili Trawangan sangat indah! Air laut jernih, pantai bersih, dan suasana sangat nyaman. Pasti balik lagi!', 'approved');
