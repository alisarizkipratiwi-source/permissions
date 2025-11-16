Aplikasi Perizinan Siswa SMAN 1 Grati

Aplikasi ini digunakan untuk mengelola pengajuan izin siswa secara digital. Sistem menyediakan formulir izin untuk siswa dan dashboard verifikasi untuk guru. Data disimpan menggunakan Supabase sebagai backend.

Deskripsi Singkat

Aplikasi ini memungkinkan:

1. Siswa mengajukan izin secara online melalui formulir.

2. Guru memverifikasi izin melalui dashboard.

3. Penyimpanan bukti izin menggunakan Supabase Storage.

4. Pengelolaan data termasuk persetujuan, penolakan, dan penghapusan izin.

5. Aplikasi dirancang untuk membantu sekolah mempermudah proses dokumentasi dan pencatatan izin siswa.

Fitur
Fitur untuk Siswa

Pengajuan izin melalui formulir online.

Unggah bukti berupa gambar atau PDF.

Pemilihan jenis izin.

Input tanggal mulai dan selesai izin.

Fitur untuk Guru

Login menggunakan Supabase Auth.

Melihat daftar seluruh pengajuan izin.

Menyetujui atau menolak izin siswa.

Teknologi yang Digunakan

HTML untuk struktur halaman.

CSS untuk desain dan tampilan.

JavaScript untuk logika aplikasi.

Supabase sebagai backend (Auth, Database, Storage).

project-root
│── index.html               Halaman formulir izin untuk siswa
│── login.html               Halaman login guru
│── dashboard.html           Dashboard verifikasi izin
│── style.css                Berkas gaya tampilan
│── script.js                Logika pengajuan izin
│── dashboard.js             Logika dashboard guru
│── README.md

Konfigurasi Supabase
1. Membuat Proyek Supabase

Buat proyek baru melalui situs resmi Supabase.

2. Membuat Tabel "permissions"
   create table permissions (
  id uuid primary key default gen_random_uuid(),
  student_name text,
  student_class text,
  type text,
  start_date date,
  end_date date,
  proof_url text,
  status text default 'Menunggu Persetujuan',
  created_at timestamp default now()
);
3. Menyiapkan Storage

Buat bucket bernama "proof" untuk menyimpan bukti izin.

4. Menambahkan Konfigurasi ke JavaScript
   const SUPABASE_URL = "URL_SUPABASE";
const SUPABASE_ANON_KEY = "ANON_KEY_SUPABASE";

Cara Menjalankan Aplikasi

Unduh atau clone repository.

Buka berkas HTML langsung melalui browser.

Pastikan internet aktif agar dapat terhubung ke Supabase.

Gunakan halaman:

index.html untuk siswa

login.html untuk guru

dashboard.html untuk verifikasi izin

Pengembangan yang Disarankan

Menambahkan peran pengguna lengkap (siswa, guru, admin).

Membuat fitur pencarian data izin.

Menambahkan filter tanggal atau kelas.

Menambahkan fitur ekspor data ke Excel.

Menambahkan notifikasi email untuk siswa.

Lisensi

Proyek ini bebas digunakan untuk pembelajaran maupun implementasi sekolah.

Menghapus data izin yang sudah tidak diperlukan.

Membuka bukti izin melalui tautan.
