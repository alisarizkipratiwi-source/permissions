// dashboard.js
const SUPABASE_URL = 'https://ivbqgyhwddimmpuccqrz.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YnFneWh3ZGRpbW1wdWNjcXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzM4MDYsImV4cCI6MjA3ODYwOTgwNn0.NnKktKXQlRspI3IcAyID-CY-m0zf2omjI8_ihqThtpo';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Fungsi untuk memeriksa sesi login (mengatasi masalah loop redirect)
function checkAuth() {
    supabase.auth.onAuthStateChange((event, session) => {
        if (!session) {
            // Jika tidak ada sesi (pengguna logout atau belum login)
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'login.html'; 
            }
        } else {
            // Jika sesi aktif, muat data
            loadIzinData();
        }
    });
}

// Fungsi untuk memuat data dari tabel permissions
async function loadIzinData() {
    // Memastikan tabel body ada sebelum memuat data
    const tableBody = document.querySelector('#izinTable tbody');
    if (!tableBody) return; 

    const { data, error } = await supabase
        .from('permissions')
        .select('*') 
        .order('created_at', { ascending: false });

    if (error) {
        tableBody.innerHTML = `<tr><td colspan="8">Gagal memuat data. Cek RLS SELECT Anda. Error: ${error.message}</td></tr>`;
        return;
    }

    tableBody.innerHTML = ''; 

    data.forEach(izin => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = new Date(izin.created_at).toLocaleString();
        row.insertCell().textContent = izin.student_name;
        row.insertCell().textContent = izin.student_class;
        row.insertCell().textContent = izin.type;
        row.insertCell().textContent = `${izin.start_date} s/d ${izin.end_date}`;
        
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
        
        const statusCell = row.insertCell();
        statusCell.textContent = izin.status;
        statusCell.className = `status-${izin.status.replace(/\s/g, '').toLowerCase()}`;


        const actionCell = row.insertCell();
        // Hanya tampilkan tombol jika status masih Menunggu Persetujuan
        if (izin.status === 'Menunggu Persetujuan') {
            actionCell.innerHTML = `
                <button class="status-btn approved" data-id="${izin.id}" data-status="Disetujui">Setujui</button>
                <button class="status-btn rejected" data-id="${izin.id}" data-status="Ditolak">Tolak</button>
            `;
        } else {
            actionCell.textContent = izin.status;
        }
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
                .eq('id', id); 

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
if (document.querySelector('body').classList.contains('dashboard-page') || window.location.pathname.includes('dashboard.html')) {
    checkAuth();
}
