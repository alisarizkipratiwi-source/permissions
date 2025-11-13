// auth.js
const SUPABASE_URL = 'https://ivbqgyhwddimmpuccqrz.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YnFneWh3ZGRpbW1wdWNjcXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzM4MDYsImV4cCI6MjA3ODYwOTgwNn0.NnKktKXQlRspI3IcAyID-CY-m0zf2omjI8_ihqThtpo';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginForm = document.getElementById('loginForm');
const authMessage = document.getElementById('authMessage');
const logoutBtn = document.getElementById('logoutBtn');

// --- Logika Login ---
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authMessage.textContent = 'Memproses...';
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error(error);
            authMessage.textContent = 'Login Gagal: Periksa email/sandi Anda.';
        } else {
            // Jika berhasil, arahkan ke dashboard.html
            window.location.href = 'dashboard.html';
        }
    });
}

// --- Logika Logout ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
        } else {
            // Arahkan kembali ke halaman login setelah logout
            window.location.href = 'login.html'; 
        }
    });
}
