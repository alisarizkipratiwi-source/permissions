// auth.js
const { createClient } = supabase;
const client = createClient('https://ivbqgyhwddimmpuccqrz.supabase.co',
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YnFneWh3ZGRpbW1wdWNjcXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzM4MDYsImV4cCI6MjA3ODYwOTgwNn0.NnKktKXQlRspI3IcAyID-CY-m0zf2omjI8_ihqThtpo');

// Elemen HTML
const loginForm = document.getElementById('loginForm');
const authMessage = document.getElementById('authMessage');
const logoutBtn = document.getElementById('logoutBtn');

// --- Login ---
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authMessage.textContent = 'Memproses...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data, error } = await client.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error(error);
            authMessage.textContent = 'Login Gagal: Periksa email atau password.';
        } else if (data.session) {
            window.location.href = 'dashboard.html';
        }
    });
}

// --- Logout ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await client.auth.signOut();
        if (!error) window.location.href = 'login.html';
    });
}
