// dashboard.js
const SUPABASE_URL = 'https://ivbqgyhwddimmpuccqrz.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YnFneWh3ZGRpbW1wdWNjcXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzM4MDYsImV4cCI6MjA3ODYwOTgwNn0.NnKktKXQlRspI3IcAyID-CY-m0zf2omjI8_ihqThtpo';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fungsi untuk memeriksa sesi login saat memuat dashboard
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        // Jika tidak ada sesi, paksa kembali ke halaman login
        window.location.href = 'login.html'; 
        return;
    }
    // Jika ada sesi, lanjutkan muat data
    loadIzinData();
}

// Fungsi untuk memuat data dari tabel permissions
async function loadIzinData() {
    const { data, error } = await supabase
        .from('permissions')
        .select('*') // Ambil semua kolom
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    const tableBody = document.querySelector('#izinTable tbody');
    tableBody.innerHTML = ''; // Kosongkan tabel

    data.forEach(izin => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = izin.student_name;
        row.insertCell().textContent = izin.student_class;
        row.insertCell().textContent = izin.type;
        row.insertCell().textContent = `${izin.start_date} s/d ${izin.end_date}`;
        
        // Link Bukti
        const buktiCell = row.insertCell();
        if (izin.proof_url) {
            const link = document.createElement('a');
            link.href = izin.proof_url;
            link.textContent = 'Lihat Bukti';
            link.target = '_blank';
            buktiCell.appendChild(link);
        } else {
            buktiCell.textContent = 'N/A';
        }
        
        row.insertCell().textContent = izin.status; // Status saat ini

        // Kolom Aksi (Tombol Update Status)
        const actionCell = row.insertCell();
        actionCell.innerHTML = `
            <button class="status-btn approved" data-id="${izin.id}" data-status="Disetujui">Setujui</button>
            <button class="status-btn rejected" data-id="${izin.id}" data-status="Ditolak">Tolak</button>
        `;
    });

    attachUpdateListeners();
}

// Fungsi untuk menangani update status (perlu policy UPDATE di Supabase)
function attachUpdateListeners() {
    document.querySelectorAll('.status-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            const newStatus = e.target.dataset.status;

            const { error } = await supabase
                .from('permissions')
                .update({ status: newStatus })
                .eq('id', id); // Filter baris berdasarkan ID

            if (error) {
                alert(`Gagal mengubah status. Pastikan policy RLS UPDATE sudah dibuat: ${error.message}`);
                console.error(error);
            } else {
                alert(`Status izin ID ${id} diubah menjadi ${newStatus}.`);
                loadIzinData(); // Muat ulang data setelah update
            }
        });
    });
}

// Jalankan pengecekan auth saat halaman dimuat
checkAuth();
