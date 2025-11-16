const SUPABASE_URL = 'https://ivbqgyhwddimmpuccqrz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YnFneWh3ZGRpbW1wdWNjcXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzM4MDYsImV4cCI6MjA3ODYwOTgwNn0.NnKktKXQlRspI3IcAyID-CY-m0zf2omjI8_ihqThtpo';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const izinForm = document.getElementById('izinForm');

if (izinForm) {
    izinForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(izinForm);
        const buktiFile = formData.get('dokumenPendukung');
        let proofUrl = null;

        const isFileUploaded = buktiFile && buktiFile.size > 0;

        if (isFileUploaded) {
            const filePath = `bukti/${Date.now()}-${buktiFile.name.replace(/\s/g, '_')}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('izin-bukti')
                .upload(filePath, buktiFile);

            if (uploadError) {
                alert('Upload gagal: ' + uploadError.message);
                console.error(uploadError);
                return;
            }

            const { data: publicUrlData } = supabaseClient
                .storage
                .from('izin-bukti')
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

