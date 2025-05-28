const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;
const USERS_FILE = './users.json';

app.use(cors());
app.use(express.json());

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const users = loadUsers();
    if (users[username]) return res.status(400).json({ error: 'User exists' });
    users[username] = { password, inventory: [] };
    saveUsers(users);
    res.json({ ok: true });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ ok: true });
});

app.post('/progress', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ inventory: users[username].inventory });
});

app.post('/progress/update', (req, res) => {
    const { username, password, inventory } = req.body;
    const users = loadUsers();
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    users[username].inventory = inventory;
    saveUsers(users);
    res.json({ ok: true });
});

// Admin: edit any user's inventory
app.post('/admin/setprogress', (req, res) => {
    const { adminpass, username, inventory } = req.body;
    if (adminpass !== 'iHATEpickles1') return res.status(403).json({ error: 'Forbidden' });
    const users = loadUsers();
    if (!users[username]) return res.status(404).json({ error: 'User not found' });
    users[username].inventory = inventory;
    saveUsers(users);
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});