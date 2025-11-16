// ==== KONFIGURASI SUPABASE ====
const SUPABASE_URL = 'https://ivbqgyhwddimmpuccqrz.supabase.co';
const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YnFneWh3ZGRpbW1wdWNjcXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzM4MDYsImV4cCI6MjA3ODYwOTgwNn0.NnKktKXQlRspI3IcAyID-CY-m0zf2omjI8_ihqThtpo';

// === CREATE CLIENT (Supabase v2) ===
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



// =======================================================
//                 AUTH CHECK (Login Validation)
// =======================================================
function checkAuth() {
    client.auth.onAuthStateChange((event, session) => {
        if (!session) {
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'login.html';
            }
        } else {
            loadIzinData();
        }
    });
}



// =======================================================
//                   LOAD IZIN DATA
// =======================================================
async function loadIzinData() {
    const tableBody = document.querySelector('#izinTable tbody');
    if (!tableBody) return;

    const { data, error } = await client
        .from('permissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        tableBody.innerHTML =
            `<tr><td colspan="9">Gagal memuat data. Error: ${error.message}</td></tr>`;
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

        // === BUKTI ===
        const buktiCell = row.insertCell();
        if (izin.proof_url) {
            const link = document.createElement('a');
            link.href = izin.proof_url;
            link.target = '_blank';
            link.textContent = 'Lihat Bukti';
            buktiCell.appendChild(link);
        } else {
            buktiCell.textContent = 'N/A';
        }

        // === STATUS ===
        row.insertCell().textContent = izin.status;

        // === ACTION ===
        const actionCell = row.insertCell();

        // tombol approve / reject
        if (izin.status === 'Menunggu Persetujuan') {
            actionCell.innerHTML = `
                <button class="status-btn approved" data-id="${izin.id}" data-status="Disetujui">Setujui</button>
                <button class="status-btn rejected" data-id="${izin.id}" data-status="Ditolak">Tolak</button>
            `;
        }

        // tombol hapus (SELALU ADA)
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Hapus";
        btnDelete.classList.add("delete-btn");
        btnDelete.dataset.id = izin.id;

        actionCell.appendChild(btnDelete);
    });

    attachListeners();
}



// =======================================================
//          ATTACH LISTENER (UPDATE + DELETE)
// =======================================================
function attachListeners() {

    // === LISTENER UPDATE STATUS ===
    document.querySelectorAll('.status-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            const newStatus = e.target.dataset.status;

            const { error } = await client
                .from('permissions')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) {
                alert(`Gagal update: ${error.message}`);
            } else {
                loadIzinData();
            }
        });
    });

    // === LISTENER DELETE IZIN ===
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;

            const konfirmasi = confirm("Apakah kamu yakin ingin menghapus izin ini?");
            if (!konfirmasi) return;

            const { error } = await client
                .from('permissions')
                .delete()
                .eq('id', id);

            if (error) {
                alert(`Gagal menghapus: ${error.message}`);
            } else {
                loadIzinData();
            }
        });
    });
}



// =======================================================
//                     INIT PAGE
// =======================================================
if (
    document.body.classList.contains('dashboard-page') ||
    window.location.pathname.includes('dashboard.html')
) {
    checkAuth();
}
