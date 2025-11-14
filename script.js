// HARUS ADA di HTML kamu:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>

// =====================================================
// SETUP SUPABASE CLIENT (FIXED)
// =====================================================
const SUPABASE_URL = 'https://ivbqgyhwddimmpuccqrz.supabase.co';
const SUPABASE_ANON_KEY = 'your_anon_key_here';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// =====================================================

const izinForm = document.getElementById('izinForm');

if (izinForm) {
    izinForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(izinForm);
        const buktiFile = formData.get('dokumenPendukung');
        let proofUrl = null;

        const isFileUploaded = buktiFile && buktiFile.size > 0;

        // Upload file
        if (isFileUploaded) {
            const filePath = `bukti/${Date.now()}-${buktiFile.name.replace(/\s/g, '_')}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('proof-files')
                .upload(filePath, buktiFile);

            if (uploadError) {
                alert('Upload gagal: ' + uploadError.message);
                console.error(uploadError);
                return;
            }

            const { data: publicUrlData } = supabaseClient
                .storage
                .from('proof-files')
                .getPublicUrl(filePath);

            proofUrl = publicUrlData.publicUrl;
        }

        const dataToInsert = {
            student_name: formData.get('namaSiswa'),
            student_class: formData.get('kelasSiswa'),
            type: formData.get('jenisIzin'),
            start_date: formData.get('tanggalMulai'),
            end_date: formData.get('tanggalSelesai'),
            reason: formData.get('alasanIzin'),
            proof_url: proofUrl,
            status: 'Menunggu Persetujuan'
        };

        const { error: insertError } = await supabaseClient
            .from('permissions')
            .insert([dataToInsert]);

        if (insertError) {
            alert('Insert gagal: ' + insertError.message);
            console.error(insertError);
        } else {
            alert('Pengajuan Berhasil!');
            izinForm.reset();
        }
    });
}
