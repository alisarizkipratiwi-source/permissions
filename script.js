// script.js
// Logika untuk Pengajuan Izin Siswa (INSERT)

// 1. GANTI DENGAN KUNCI PROYEK ANDA!
const SUPABASE_URL = 'https://ivbqgyhwddimmpuccqrz.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YnFneWh3ZGRpbW1wdWNjcXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzM4MDYsImV4cCI6MjA3ODYwOTgwNn0.NnKktKXQlRspI3IcAyID-CY-m0zf2omjI8_ihqThtpo';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const izinForm = document.getElementById('izinForm');

// Pastikan formulir ada sebelum menambahkan event listener
if (izinForm) {
    izinForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah reload halaman

        const formData = new FormData(izinForm);
        const buktiFile = formData.get('dokumenPendukung');
        let proofUrl = null;
        
        // Cek apakah file yang diunggah valid (ukuran > 0)
        const isFileUploaded = buktiFile && buktiFile.size > 0;

        // 2. Proses File Upload ke Supabase Storage (Jika ada file)
        if (isFileUploaded) {
            // Membuat path file unik (misalnya: bukti/1763172000000-surat-dokter.pdf)
            const filePath = `bukti/${Date.now()}-${buktiFile.name.replace(/\s/g, '_')}`;
            
            // Upload file ke bucket 'proof-files'
            const { error: uploadError } = await supabase.storage
                .from('proof-files') 
                .upload(filePath, buktiFile);

            if (uploadError) {
                alert('Gagal mengunggah file bukti. Cek policy Storage Anda. Error: ' + uploadError.message);
                console.error(uploadError);
                return;
            }
            
            // Dapatkan URL publik file yang diunggah
            // Pastikan bucket Anda disetel ke Public di Supabase Storage
            const { data: publicUrlData } = supabase.storage
                .from('proof-files')
                .getPublicUrl(filePath);
                
            proofUrl = publicUrlData.publicUrl;
        }

        // 3. Siapkan Data untuk Database
        const dataToInsert = { 
            student_name: formData.get('namaSiswa'),
            student_class: formData.get('kelasSiswa'),
            type: formData.get('jenisIzin'),
            start_date: formData.get('tanggalMulai'),
            end_date: formData.get('tanggalSelesai'),
            reason: formData.get('alasanIzin'),
            proof_url: proofUrl, // Simpan URL file atau NULL
            status: 'Menunggu Persetujuan',
            // created_at akan terisi otomatis oleh Supabase
        };

        // 4. Simpan Data Formulir ke Database (Tabel 'permissions')
        const { error: insertError } = await supabase
            .from('permissions')
            .insert([dataToInsert]);

        if (insertError) {
            alert('Gagal menyimpan pengajuan. Cek policy RLS INSERT Anda. Error: ' + insertError.message);
            console.error(insertError);
        } else {
            alert('Pengajuan Izin Berhasil Diajukan! Status: Menunggu Persetujuan.');
            izinForm.reset();
        }
    });
}
