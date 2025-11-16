const SUPABASE_URL = 'https://ivbqgyhwddimmpuccqrz.supabase.co';
const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YnFneWh3ZGRpbW1wdWNjcXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzM4MDYsImV4cCI6MjA3ODYwOTgwNn0.NnKktKXQlRspI3IcAyID-CY-m0zf2omjI8_ihqThtpo';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

async function loadIzinData() {
    const tableBody = document.querySelector('#izinTable tbody');
    if (!tableBody) return;

    const { data, error } = await client
        .from('permissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        tableBody.innerHTML =
            `<tr><td colspan="9">Gagal memuat data: ${error.message}</td></tr>`;
        return;
    }

    tableBody.innerHTML = '';

    data.forEach(izin => {
        const row = tableBody.insertRow();

        row.insertCell().textContent = new Date(izin.created_at).toLocaleString();
        row.insertCell().textContent = izin.student_name;
        row.insertCell().textContent = izin.student_class;
        row.insertCell().textContent = izin.type;
        row.insertCell().textContent = `${izin.star

