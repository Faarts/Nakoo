# Tinjauan UI dan alur mobile Nakoo

Tema yang dipertahankan: Inter, oranye Nakoo, hijau lembut, latar hangat, ilustrasi dan logo yang sudah tersedia. Referensi visual: gambar lokal dalam `.figma` untuk eksplor makanan, aktivitas, filter, detail, profil, dan beranda pengguna terdaftar.

## Temuan dan perbaikan

- Halaman eksplor sebelumnya memiliki proporsi kartu, kepadatan tombol, dan filter yang tidak konsisten. Kini keduanya memakai komponen bersama, kartu dua kolom dengan gambar berjarak, carousel rekomendasi, chip pastel, dan kategori horizontal mengikuti referensi.
- Beberapa filter hanya mengubah tampilan pilihan. Kini semua kelompok memengaruhi hasil berdasarkan metadata yang tersedia, dengan jumlah hasil sebelum diterapkan, reset menyeluruh, serta pembatalan perubahan sementara.
- Pencarian sebelumnya tidak ikut kosong saat reset. Nilai pencarian, kategori, dan filter kini disimpan dalam URL sehingga tidak hilang setelah kembali dari detail/login.
- Halaman detail sebelumnya memakai data contoh berdasarkan ID; ID server dapat memunculkan resep generik atau aktivitas pertama. Kini detail menggunakan ID katalog sebenarnya, menampilkan status tidak ditemukan, dan tidak mengarang bahan/langkah yang belum tersedia.
- Aksi tambah rencana pada detail sebelumnya hanya menampilkan toast sukses. Kini resep dan aktivitas benar-benar disimpan melalui API, memiliki status proses/gagal, lalu membuka jadwal di Beranda. Penggantian resep mencocokkan kategori menu dan mengembalikan statusnya menjadi belum selesai.
- Favorit detail tersimpan di server, tetap ada setelah muat ulang, dan dapat ditemukan melalui tautan favorit di Profil.
- Pengguna kembali ke pilihan awal setelah login dan pengisian profil. Rute profil dilindungi, sedangkan katalog tetap bisa dijelajahi tanpa akun.
- Jadwal tidak lagi dianggap selesai otomatis karena waktunya terlewati, dan tidak lagi menambahkan slot contoh saat rencana hanya berisi sedikit item. Tautan rencana membuka jadwal, bukan halaman profil.
- Panel bawah memakai dialog native: fokus keyboard tertahan di panel, Escape menutupnya, fokus kembali ke pemicu, konten bisa digulir, dan tombol aksi tetap terlihat.
- Safe area ponsel, target sentuh, zoom browser, dan preferensi reduced motion didukung. Proporsi kartu beranda dirapikan. Notifikasi contoh serta alergi/gender rekaan pada profil dihilangkan; bahan tersedia tetap dipertahankan ketika profil disimpan.

## Verifikasi

- `npm run build`: berhasil.
- `npm run lint`: selesai tanpa error; 8 warning yang sudah terdapat pada kode lama (ekspor context, parameter/variabel tidak terpakai).
- `node --check server/index.js`: berhasil.
- Chromium mobile: lebar 320, 375, 390, dan 430 px, tinggi 844 px. Beranda, eksplor makanan, eksplor aktivitas, login, dan profil tidak memiliki overflow horizontal.
- Alur pencarian, reset, kembali dari detail, filter apply/cancel, login, onboarding, simpan resep dan aktivitas, persistensi favorit, daftar favorit, status selesai setelah reload, detail tidak ditemukan, dan kegagalan server telah diuji.
- Logika filter diuji untuk usia, tekstur, bahan, metode, durasi, skill, tag, serta normalisasi alergen Indonesia/Inggris.
- Tidak ada runtime page error pada skenario yang diuji. Database pengujian terpisah digunakan; database pengguna tidak diubah.

## Batasan data

Sebagian data resep server belum menyediakan bahan, cara memasak, tekstur, atau metode masak. Halaman detail memberi keterangan jika data belum tersedia. Filter metadata dapat menghasilkan nol hasil ketika informasi tersebut belum ada. Foto yang tidak tersedia tetap memakai aset ilustrasi katalog yang sudah dimiliki aplikasi. Pengujian dilakukan dengan emulasi Chromium, belum pada perangkat iOS/Android fisik.

## Screenshot akhir (390 × 844)

- [Beranda](beranda-mobile.png)
- [Makanan](makanan-mobile.png)
- [Aktivitas](aktivitas-mobile.png)
- [Filter](filter.png)
- [Profil](profil-mobile.png)

Login Google/Apple belum memiliki integrasi server pada proyek ini. Tombol kini dinonaktifkan dengan penjelasan yang terlihat, sehingga pengguna diarahkan memakai email dan tidak menemui tombol tanpa aksi.
