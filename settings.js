// ================================================================
//  settings.js — TKJ XI-9 | Data Global & Konfigurasi
//  Edit file ini untuk mengubah data tanpa menyentuh file lain.
//  Versi 2.0 · Renovasi 2026
// ================================================================
"use strict";

const G = {
  // ── INFO KELAS ──────────────────────────────────────────────
  namaKelas: "XI-9",
  jurusan: "Teknik Komputer dan Jaringan",
  namaSekolah: "SMK Muhammadiyah Belitang",
  tahunAjaran: "2026 / 2027",
  motto: "Solid, Kreatif, dan Berdedikasi Tanpa Batas",
  deskripsi:
    "Kelas Teknik Komputer dan Jaringan yang penuh semangat belajar, inovasi tanpa henti, dan solidaritas yang tak tergoyahkan dalam menguasai dunia teknologi digital.",
  sloganHero:
    "Komunitas pejuang digital yang siap menguasai jaringan, keamanan siber, dan teknologi masa depan dengan semangat, solidaritas, dan kompetensi nyata.",
  ogImage: "https://picsum.photos/seed/tkj-xi9-og/1200/630",
  baseUrl: "./",

  // ── COUNTDOWN ───────────────────────────────────────────────
  // Target: Ujian Akhir Semester Genap 2026/2027 (otomatis "lewat" → tampil pesan)
  countdown: {
    label: "Ujian Akhir Semester",
    target: "2026-06-10T08:00:00",
  },

  // ── SOSIAL MEDIA ────────────────────────────────────────────
  sosmed: {
    instagram: "https://instagram.com/tkj.xi9.smkn1",
    youtube: "https://youtube.com/@tkjxi9smkn1",
    tiktok: "https://www.tiktok.com/@tkjxi9smkn1",
  },

  // ── STATISTIK ───────────────────────────────────────────────
  stats: [
    { icon: "fa-users", angka: 20, suffix: "", label: "Anggota" },
    { icon: "fa-trophy", angka: 15, suffix: "", label: "Prestasi" },
    { icon: "fa-calendar", angka: 2, suffix: "", label: "Tahun Bersama" },
    { icon: "fa-star", angka: 100, suffix: "%", label: "Semangat Belajar" },
  ],

  // ── PRESTASI ────────────────────────────────────────────────
  prestasi: [
    { judul: "Juara 1 LKS Jaringan Komputer", tahun: "2024", tingkat: "Kota" },
    {
      judul: "Juara 2 Olimpiade TIK Pelajar",
      tahun: "2024",
      tingkat: "Provinsi",
    },
    {
      judul: "Finalis Kompetisi Web Design",
      tahun: "2024",
      tingkat: "Nasional",
    },
    {
      judul: "Juara 1 Turnamen e-Sport Sekolah",
      tahun: "2024",
      tingkat: "Sekolah",
    },
    {
      judul: "Sertifikasi Mikrotik MTCNA (3 Siswa)",
      tahun: "2023",
      tingkat: "Nasional",
    },
  ],

  // ── VISI & MISI ─────────────────────────────────────────────
  visi: "Menjadi kelas unggulan yang melahirkan generasi teknisi handal, kreatif, dan berintegritas tinggi dalam menghadapi era transformasi digital dan Industri 4.0.",
  misi: [
    "Meningkatkan kompetensi teknis di bidang jaringan komputer, keamanan siber, dan pengembangan perangkat lunak secara berkelanjutan",
    "Membangun karakter siswa yang disiplin, jujur, bertanggung jawab, dan mampu bekerja dalam tim secara profesional",
    "Mendorong budaya inovasi, kreativitas, dan problem solving dalam setiap kegiatan akademik maupun non-akademik",
    "Memperkuat solidaritas, rasa kekeluargaan, dan semangat gotong royong antar seluruh anggota kelas",
    "Mempersiapkan diri secara optimal untuk dunia kerja, wirausaha mandiri, dan jenjang pendidikan tinggi di bidang teknologi",
  ],

  // ── WALI KELAS ──────────────────────────────────────────────
  waliKelas: {
    nama: "Bpk. Ahmad Fauzi, S.Kom",
    jabatan: "Wali Kelas XI-9 TKJ",
    foto: "https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=7f1d1d&color=fff&size=200&bold=true&font-size=0.33",
  },

  // ── STRUKTUR ORGANISASI ─────────────────────────────────────
  // Urutan: 0-1=Ketua+Wakil, 2-3=Sekretaris I/II, 4-5=Bendahara I/II, 6-7=Keamanan I/II
  strukturOrg: [
    {
      nama: "Rizky Aditya Pratama",
      jabatan: "Ketua Kelas",
      foto: "https://ui-avatars.com/api/?name=Rizky+Aditya&background=7f1d1d&color=fff&size=200&bold=true&font-size=0.33",
    },
    {
      nama: "Nanda Putri Wulandari",
      jabatan: "Wakil Ketua",
      foto: "https://ui-avatars.com/api/?name=Nanda+Putri&background=b91c1c&color=fff&size=200&bold=true&font-size=0.33",
    },
    {
      nama: "Gilang Ramadhan",
      jabatan: "Sekretaris I",
      foto: "https://ui-avatars.com/api/?name=Gilang+Ramadhan&background=7f1d1d&color=fff&size=200&bold=true&font-size=0.33",
    },
    {
      nama: "Sari Dewi Anggraini",
      jabatan: "Sekretaris II",
      foto: "https://ui-avatars.com/api/?name=Sari+Dewi&background=b91c1c&color=fff&size=200&bold=true&font-size=0.33",
    },
    {
      nama: "Bintang Arief Nugroho",
      jabatan: "Bendahara I",
      foto: "https://ui-avatars.com/api/?name=Bintang+Arief&background=7f1d1d&color=fff&size=200&bold=true&font-size=0.33",
    },
    {
      nama: "Kartika Ayu Lestari",
      jabatan: "Bendahara II",
      foto: "https://ui-avatars.com/api/?name=Kartika+Ayu&background=b91c1c&color=fff&size=200&bold=true&font-size=0.33",
    },
    {
      nama: "Dimas Eka Saputra",
      jabatan: "Keamanan I",
      foto: "https://ui-avatars.com/api/?name=Dimas+Eka&background=7f1d1d&color=fff&size=200&bold=true&font-size=0.33",
    },
    {
      nama: "Reza Firmansyah",
      jabatan: "Keamanan II",
      foto: "https://ui-avatars.com/api/?name=Reza+Firmansyah&background=b91c1c&color=fff&size=200&bold=true&font-size=0.33",
    },
  ],

  // ── DATA ANGGOTA (20 siswa) ─────────────────────────────────
  namaSiswa: [
    {
      nama: "Ahmad Andrean Pratama",
      nis: "5958",
      foto: "https://ui-avatars.com/api/?name=Ahmad+Andrean&background=7f1d1d&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Alentian Vidyanata",
      nis: "5961",
      foto: "https://ui-avatars.com/api/?name=Alentian+Vidyanata&background=991b1b&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Alfredo Pratama",
      nis: "5962",
      foto: "https://litter.catbox.moe/iymtztevdwd6y8gu.webp",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Alif Harum Aji Pamungkas",
      nis: "5963",
      foto: "https://ui-avatars.com/api/?name=Alif+Harum&background=7f1d1d&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Alvina Ekawibawani",
      nis: "5964",
      foto: "https://ui-avatars.com/api/?name=Alvina+Eka&background=991b1b&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Anggi Olivia Safitri",
      nis: "5965",
      foto: "https://ui-avatars.com/api/?name=Anggi+Olivia&background=b91c1c&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Anggraini Nurul Amalia",
      nis: "5966",
      foto: "https://ui-avatars.com/api/?name=Anggraini+Nurul&background=7f1d1d&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Anggun Febrita Lustia",
      nis: "5967",
      foto: "https://ui-avatars.com/api/?name=Anggun+Febrita&background=991b1b&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Anka Juan Lianri",
      nis: "5969",
      foto: "https://ui-avatars.com/api/?name=Anka+Juan&background=b91c1c&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Annisa Zahrani",
      nis: "5970",
      foto: "https://ui-avatars.com/api/?name=Annisa+Zahrani&background=7f1d1d&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Aprilia Kartika Sari",
      nis: "5971",
      foto: "https://ui-avatars.com/api/?name=Aprilia+Kartika&background=991b1b&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Apritha Arumdani",
      nis: "5972",
      foto: "https://ui-avatars.com/api/?name=Apritha+Arumdani&background=b91c1c&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Asyifa Elfrida",
      nis: "5973",
      foto: "https://ui-avatars.com/api/?name=Asyifa+Elfrida&background=7f1d1d&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Aulia Abel Pratiwi",
      nis: "5974",
      foto: "https://ui-avatars.com/api/?name=Aulia+Abel&background=991b1b&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Aulia Rahmadani",
      nis: "5975",
      foto: "https://ui-avatars.com/api/?name=Aulia+Rahmadani&background=b91c1c&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Ayshyva Sandrella",
      nis: "5976",
      foto: "https://ui-avatars.com/api/?name=Ayshyva+Sandrella&background=7f1d1d&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Bela Ameliya",
      nis: "5978",
      foto: "https://ui-avatars.com/api/?name=Bela+Ameliya&background=991b1b&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Belva Fedida Eka Callola",
      nis: "5979",
      foto: "https://ui-avatars.com/api/?name=Belva+Fedida&background=b91c1c&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Bilkis Keisa Duwi Pandriya",
      nis: "5980",
      foto: "https://ui-avatars.com/api/?name=Bilkis+Keisa&background=7f1d1d&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
    {
      nama: "Chika Mutia Astri",
      nis: "5981",
      foto: "https://ui-avatars.com/api/?name=Chika+Mutia&background=991b1b&color=fff",
      desc: "Siswa XI TKJ",
      social: { instagram: "#" },
    },
  ],

  // ── SKILLS / KOMPETENSI ─────────────────────────────────────
  skills: [
    {
      nama: "Jaringan Komputer",
      level: 90,
      icon: "fa-network-wired",
      desc: "LAN, WAN, routing, switching, VLAN, serta konfigurasi jaringan enterprise tingkat lanjut.",
    },
    {
      nama: "Web Development",
      level: 80,
      icon: "fa-code",
      desc: "HTML5, CSS3, JavaScript ES6+, responsive design, dan dasar-dasar framework modern.",
    },
    {
      nama: "Hardware & Maintenance",
      level: 88,
      icon: "fa-microchip",
      desc: "Perakitan, troubleshooting, overclocking, dan perawatan preventif perangkat keras komputer.",
    },
    {
      nama: "Keamanan Siber",
      level: 75,
      icon: "fa-shield-halved",
      desc: "Firewall, enkripsi, penetration testing dasar, hardening server, dan keamanan jaringan.",
    },
    {
      nama: "Sistem Operasi Linux",
      level: 78,
      icon: "fa-terminal",
      desc: "Administrasi server Ubuntu/CentOS, shell scripting bash, dan manajemen layanan sistem.",
    },
    {
      nama: "Pemrograman & Algoritma",
      level: 82,
      icon: "fa-laptop-code",
      desc: "Python, logika algoritma, struktur data, dan pengenalan pemrograman berorientasi objek.",
    },
  ],

  galeri: [
    {
      src: "../assets/kenangan/foto-kelas1.webp",
      caption: "Foto Kelas Bersama",
      label: "FOTO KELAS",
    },
    {
      src: "../assets/kenangan/foto-kelas2.webp",
      caption: "Kegiatan Praktikum",
      label: "PRAKTIKUM",
    },
    {
      src: "../assets/kenangan/foto-lab1.webp",
      caption: "Lab Jaringan",
      label: "LAB JARINGAN",
    },
    {
      src: "../assets/kenangan/foto-kelas3.webp",
      caption: "Kompetisi LKS",
      label: "KOMPETISI",
    },
    {
      src: "../assets/kenangan/foto-cewe1.webp",
      caption: "Study Tour SMK",
      label: "STUDY TOUR",
    },
    {
      src: "../assets/kenangan/foto-cewe2.webp",
      caption: "Ekskul Robotika",
      label: "EKSKUL",
    },
    {
      src: "https://picsum.photos/seed/tkj007/400/400",
      caption: "Upacara Bendera",
      label: "UPACARA",
    },
    {
      src: "https://picsum.photos/seed/tkj008/400/400",
      caption: "Momen Hari Guru",
      label: "HARI GURU",
    },
    {
      src: "https://picsum.photos/seed/tkj009/400/400",
      caption: "Olahraga Bersama",
      label: "OLAHRAGA",
    },
    {
      src: "https://picsum.photos/seed/tkj010/400/400",
      caption: "Sertifikasi Mikrotik",
      label: "SERTIFIKASI",
    },
    {
      src: "https://picsum.photos/seed/tkj011/400/400",
      caption: "PKL di Industri",
      label: "PKL",
    },
    {
      src: "https://picsum.photos/seed/tkj012/400/400",
      caption: "Wisuda & Perpisahan",
      label: "WISUDA",
    },
    {
      src: "https://picsum.photos/seed/tkj013/400/400",
      caption: "Belajar Konfigurasi Router",
      label: "PRAKTIKUM",
    },
    {
      src: "https://picsum.photos/seed/tkj014/400/400",
      caption: "Workshop Keamanan Siber",
      label: "KEAMANAN",
    },
    {
      src: "https://picsum.photos/seed/tkj015/400/400",
      caption: "Proyek Akhir Tim",
      label: "PROYEK",
    },
    {
      src: "https://picsum.photos/seed/tkj016/400/400",
      caption: "Kegiatan Ekstrakurikuler",
      label: "EKSKUL",
    },
    {
      src: "https://picsum.photos/seed/tkj017/400/400",
      caption: "Kunjungan Industri",
      label: "KUNJUNGAN",
    },
    {
      src: "https://picsum.photos/seed/tkj018/400/400",
      caption: "Uji Kompetensi",
      label: "UJI",
    },
    {
      src: "https://picsum.photos/seed/tkj019/400/400",
      caption: "Foto Tim Proyek",
      label: "PROYEK",
    },
    {
      src: "https://picsum.photos/seed/tkj020/400/400",
      caption: "Kegiatan Sosial Sekolah",
      label: "SOSIAL",
    },
  ],

  // ── DATA TKJ (Halaman tkj.html) ────────────────────────────
  tkj: {
    deskripsi:
      "Teknik Komputer dan Jaringan (TKJ) adalah program keahlian yang mempelajari instalasi, konfigurasi, pemeliharaan sistem komputer, serta perancangan dan pengelolaan jaringan komunikasi data dari skala lokal hingga enterprise.",
    mapel: [
      { nama: "Dasar Jaringan Komputer", icon: "fa-network-wired" },
      { nama: "Administrasi Server", icon: "fa-server" },
      { nama: "Keamanan Jaringan", icon: "fa-shield-halved" },
      { nama: "Pemrograman Web", icon: "fa-code" },
      { nama: "Sistem Operasi Jaringan", icon: "fa-desktop" },
      { nama: "Perakitan Komputer", icon: "fa-microchip" },
      { nama: "Komunikasi Data & Fiber", icon: "fa-wifi" },
      { nama: "Cloud Computing Dasar", icon: "fa-cloud" },
    ],
    karir: [
      {
        jabatan: "Network Engineer",
        icon: "fa-network-wired",
        desc: "Merancang, mengimplementasikan, dan mengelola infrastruktur jaringan perusahaan skala enterprise.",
      },
      {
        jabatan: "System Administrator",
        icon: "fa-server",
        desc: "Mengelola, memelihara, dan mengoptimalkan server serta sistem operasi dalam lingkungan produksi.",
      },
      {
        jabatan: "Web Developer",
        icon: "fa-code",
        desc: "Membangun aplikasi dan website yang fungsional, responsif, dan berperforma tinggi.",
      },
      {
        jabatan: "IT Support Specialist",
        icon: "fa-headset",
        desc: "Memberikan dukungan teknis komprehensif kepada pengguna, hardware, software, dan sistem.",
      },
      {
        jabatan: "Cyber Security Analyst",
        icon: "fa-shield-halved",
        desc: "Menganalisis, mendeteksi, dan merespons ancaman keamanan siber dalam ekosistem digital.",
      },
      {
        jabatan: "Cloud Engineer",
        icon: "fa-cloud",
        desc: "Mengelola infrastruktur cloud (AWS/GCP/Azure) dan merancang solusi berbasis cloud.",
      },
    ],
    kurikulum: [
      {
        fase: "Kelas X",
        fokus:
          "Fondasi TKJ: perakitan hardware, instalasi OS, konsep jaringan dasar, dan pengantar pemrograman.",
      },
      {
        fase: "Kelas XI",
        fokus:
          "Pendalaman: administrasi jaringan enterprise, server Linux, keamanan siber, dan pengembangan web.",
      },
      {
        fase: "Kelas XII",
        fokus:
          "Aplikasi: proyek akhir, PKL (Praktik Kerja Lapangan), sertifikasi kompetensi, dan persiapan karir.",
      },
    ],
  },
};
