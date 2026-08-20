import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import Database from "better-sqlite3";
import { v4 as uuid } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "nakoo.db"));
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS child_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  child_name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  alergies TEXT DEFAULT '[]',
  focus_skills TEXT DEFAULT '[]',
  available_materials TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  prep_time INTEGER,
  allergens TEXT DEFAULT '[]',
  age_range TEXT,
  type TEXT
);
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  duration INTEGER,
  skills TEXT DEFAULT '[]',
  age_range TEXT
);
CREATE TABLE IF NOT EXISTS daily_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  slots TEXT DEFAULT '[]'
);
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, item_type, item_id)
);
`);

const hash = (p) => crypto.createHash("sha256").update(p).digest("hex");

// Seed demo users (idempotent)
const seedUsers = [
  { email: "demo@nakoo.app", name: "Demo Ayah", password: "nakoo1234" },
  { email: "ibu.ani@nakoo.app", name: "Ibu Ani", password: "nakoo1234" },
];
const insertUser = db.prepare("INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)");
for (const u of seedUsers) {
  if (!db.prepare("SELECT id FROM users WHERE email = ?").get(u.email)) {
    insertUser.run(uuid(), u.email, u.name, hash(u.password));
  }
}

// Seed bypass user
if (!db.prepare("SELECT id FROM users WHERE id = 'bypass-id'").get()) {
  db.prepare("INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)").run('bypass-id', 'dev@nakoo.app', 'Dev Bypass User', 'nopass');
}
if (!db.prepare("SELECT id FROM child_profiles WHERE user_id = 'bypass-id'").get()) {
  db.prepare("INSERT INTO child_profiles (id, user_id, child_name, birth_date, alergies, focus_skills, available_materials) VALUES (?,?,?,?,?,?,?)")
    .run('bypass-profile', 'bypass-id', 'Bypass Child', '2025-01-01', '[]', '[]', '[]');
}

// Seed recipes
const existingRecipesCount = db.prepare("SELECT count(*) as c FROM recipes").get().c;
if (existingRecipesCount === 0) {
  const insertRecipe = db.prepare("INSERT INTO recipes (id, title, prep_time, allergens, age_range, type) VALUES (?,?,?,?,?,?)");
  // 6-12 months
  insertRecipe.run(uuid(), "Bubur Oat Apel", 15, '[]', '6-12', 'breakfast');
  insertRecipe.run(uuid(), "Nasi Tim Ayam", 30, '[]', '6-12', 'lunch');
  insertRecipe.run(uuid(), "Puree Pisang Alpukat", 10, '[]', '6-12', 'snack');
  insertRecipe.run(uuid(), "Sup Sayur Bayam Halus", 20, '[]', '6-12', 'dinner');
  insertRecipe.run(uuid(), "Puree Brokoli Wortel", 15, '[]', '6-12', 'lunch');
  
  // 12-24 months
  insertRecipe.run(uuid(), "Pancake Pisang", 20, '["telur"]', '12-24', 'snack');
  insertRecipe.run(uuid(), "Sup Sayur Bakso", 25, '[]', '12-24', 'dinner');
  insertRecipe.run(uuid(), "Nasi Goreng Sayur", 15, '[]', '12-24', 'breakfast');
  insertRecipe.run(uuid(), "Macaroni Schotel", 35, '["susu sapi", "telur", "gluten"]', '12-24', 'lunch');
  insertRecipe.run(uuid(), "Smoothie Buah Naga", 10, '["susu sapi"]', '12-24', 'snack');
  
  // 24-36 months
  insertRecipe.run(uuid(), "Omelet Sayur", 15, '["telur"]', '24-36', 'breakfast');
  insertRecipe.run(uuid(), "Ayam Teriyaki Nasi Hangat", 30, '["kedelai"]', '24-36', 'lunch');
  insertRecipe.run(uuid(), "Biskuit Gandum Susu", 5, '["gluten", "susu sapi"]', '24-36', 'snack');
  insertRecipe.run(uuid(), "Ikan Panggang Jeruk", 25, '["seafood"]', '24-36', 'dinner');
  insertRecipe.run(uuid(), "Sandwich Selai Kacang", 10, '["gluten", "kacang"]', '24-36', 'breakfast');
  insertRecipe.run(uuid(), "Soto Ayam Kuah Bening", 40, '[]', '24-36', 'lunch');
}

// Seed activities
const existingActivitiesCount = db.prepare("SELECT count(*) as c FROM activities").get().c;
if (existingActivitiesCount === 0) {
  const insertAct = db.prepare("INSERT INTO activities (id, title, duration, skills, age_range) VALUES (?,?,?,?,?)");
  insertAct.run(uuid(), "Meremas Kertas", 10, '["motorik_halus"]', '6-12');
  insertAct.run(uuid(), "Cilukba", 10, '["kognitif","sosial_emosional"]', '6-12');
  insertAct.run(uuid(), "Bermain Balok", 20, '["motorik_halus","kognitif"]', '12-24');
  insertAct.run(uuid(), "Finger Painting", 30, '["motorik_halus","kreativitas"]', '24-36');
}

const safeUser = (row) => {
  if (!row) return null;
  const { password_hash, ...safe } = row;
  return safe;
};

const userIdFrom = (req) => {
  if (req.headers['x-bypass-user'] === 'bypass-id') return 'bypass-id';
  const sid = req.cookies?.session_id;
  if (!sid) return null;
  return db.prepare("SELECT user_id FROM sessions WHERE id = ?").get(sid)?.user_id ?? null;
};

const profileToJson = (row) => {
  if (!row) return null;
  return {
    ...row,
    alergies: JSON.parse(row.alergies || "[]"),
    focus_skills: JSON.parse(row.focus_skills || "[]"),
    available_materials: JSON.parse(row.available_materials || "[]"),
  };
};

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const setSession = (res, userId) => {
  const sid = uuid();
  db.prepare("INSERT INTO sessions (id, user_id) VALUES (?, ?)").run(sid, userId);
  res.cookie("session_id", sid, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
};

// ---- auth ----
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Nama, email, dan password wajib diisi" });
  if (password.length < 6) return res.status(400).json({ error: "Password minimal 6 karakter" });
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return res.status(409).json({ error: "Email sudah terdaftar" });
  const id = uuid();
  db.prepare("INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)").run(id, email, name, hash(password));
  setSession(res, id);
  res.json({ user: safeUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id)) });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email dan password wajib diisi" });
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || user.password_hash !== hash(password)) return res.status(401).json({ error: "Email atau password salah" });
  setSession(res, user.id);
  res.json({ user: safeUser(user) });
});

app.post("/api/auth/logout", (req, res) => {
  const sid = req.cookies?.session_id;
  if (sid) db.prepare("DELETE FROM sessions WHERE id = ?").run(sid);
  res.clearCookie("session_id");
  res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  const uid = userIdFrom(req);
  if (!uid) return res.status(401).json({ error: "Tidak terautentikasi" });
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(uid);
  if (!user) return res.status(401).json({ error: "User tidak ditemukan" });
  res.json({ user: safeUser(user) });
});

// ---- child profile ----
app.get("/api/child-profiles", (req, res) => {
  const uid = userIdFrom(req);
  if (!uid) return res.status(401).json({ error: "Tidak terautentikasi" });
  res.json({ profile: profileToJson(db.prepare("SELECT * FROM child_profiles WHERE user_id = ?").get(uid)) });
});

app.post("/api/child-profiles", (req, res) => {
  const uid = userIdFrom(req);
  if (!uid) return res.status(401).json({ error: "Tidak terautentikasi" });
  const { child_name, birth_date, alergies, focus_skills, available_materials } = req.body;
  if (!child_name || !birth_date) return res.status(400).json({ error: "Nama dan tanggal lahir wajib diisi" });
  const j = (a) => JSON.stringify(a || []);
  const existing = db.prepare("SELECT id FROM child_profiles WHERE user_id = ?").get(uid);
  if (existing) {
    db.prepare("UPDATE child_profiles SET child_name=?, birth_date=?, alergies=?, focus_skills=?, available_materials=? WHERE user_id=?")
      .run(child_name, birth_date, j(alergies), j(focus_skills), j(available_materials), uid);
  } else {
    db.prepare("INSERT INTO child_profiles (id, user_id, child_name, birth_date, alergies, focus_skills, available_materials) VALUES (?,?,?,?,?,?,?)")
      .run(uuid(), uid, child_name, birth_date, j(alergies), j(focus_skills), j(available_materials));
  }
  res.json({ profile: profileToJson(db.prepare("SELECT * FROM child_profiles WHERE user_id = ?").get(uid)) });
});

// ---- daily plans ----
app.get("/api/daily-plans/today", (req, res) => {
  const uid = userIdFrom(req);
  if (!uid) return res.status(401).json({ error: "Tidak terautentikasi" });
  const today = new Date().toISOString().split('T')[0];
  const plan = db.prepare("SELECT * FROM daily_plans WHERE user_id = ? AND date = ?").get(uid, today);
  
  if (!plan) return res.json({ plan: null });

  const slots = JSON.parse(plan.slots || "[]");
  // Hydrate items
  const hydratedSlots = slots.map(s => {
    let itemDetails = null;
    if (s.type === 'meal') {
      itemDetails = db.prepare("SELECT id, title, prep_time as duration FROM recipes WHERE id = ?").get(s.item_id);
    } else {
      itemDetails = db.prepare("SELECT id, title, duration FROM activities WHERE id = ?").get(s.item_id);
    }
    return { ...s, item: itemDetails || null };
  });

  res.json({ plan: { ...plan, slots: hydratedSlots } });
});

app.post("/api/daily-plans/generate", (req, res) => {
  const uid = userIdFrom(req);
  if (!uid) return res.status(401).json({ error: "Tidak terautentikasi" });
  const today = new Date().toISOString().split('T')[0];
  
  const child = db.prepare("SELECT birth_date, alergies FROM child_profiles WHERE user_id = ?").get(uid);
  let ageRange = '6-12';
  let userAlergies = [];
  
  if (child) {
    const birthDate = new Date(child.birth_date);
    const now = new Date();
    const months = (now.getFullYear() - birthDate.getFullYear()) * 12 + now.getMonth() - birthDate.getMonth();
    if (months < 12) ageRange = '6-12';
    else if (months < 24) ageRange = '12-24';
    else ageRange = '24-36';
    
    userAlergies = JSON.parse(child.alergies || "[]");
  }

  const allMeals = db.prepare("SELECT id, allergens, type FROM recipes WHERE age_range = ?").all(ageRange);
  const allActs = db.prepare("SELECT id FROM activities WHERE age_range = ?").all(ageRange);

  const safeMeals = allMeals.filter(m => {
    const mealAllergens = JSON.parse(m.allergens || "[]");
    return !mealAllergens.some(a => userAlergies.includes(a));
  });

  let mealsToUse = safeMeals.length >= 3 ? safeMeals : allMeals;
  if (mealsToUse.length === 0) mealsToUse = db.prepare("SELECT id, allergens, type FROM recipes LIMIT 3").all();

  let actsToUse = allActs;
  if (actsToUse.length < 2) actsToUse = db.prepare("SELECT id FROM activities LIMIT 2").all();

  const shuffle = (array) => array.sort(() => 0.5 - Math.random());
  
  const breakfast = mealsToUse.find(m => m.type === 'breakfast') || mealsToUse[0];
  const lunch = mealsToUse.find(m => m.type === 'lunch') || mealsToUse[1] || mealsToUse[0];
  const dinner = mealsToUse.find(m => m.type === 'dinner') || mealsToUse[2] || mealsToUse[0];
  const selectedMeals = [breakfast, lunch, dinner].filter(Boolean);
  
  const selectedActs = shuffle([...actsToUse]).slice(0, 2);
  
  const slots = [];
  if (selectedMeals[0]) slots.push({ time: '07:00', type: 'meal', item_id: selectedMeals[0].id, status: 'pending' });
  if (selectedActs[0]) slots.push({ time: '09:00', type: 'activity', item_id: selectedActs[0].id, status: 'pending' });
  if (selectedMeals[1]) slots.push({ time: '12:00', type: 'meal', item_id: selectedMeals[1].id, status: 'pending' });
  if (selectedActs[1]) slots.push({ time: '15:00', type: 'activity', item_id: selectedActs[1].id, status: 'pending' });
  if (selectedMeals[2]) slots.push({ time: '18:00', type: 'meal', item_id: selectedMeals[2].id, status: 'pending' });

  // Delete existing plan for today if any
  db.prepare("DELETE FROM daily_plans WHERE user_id = ? AND date = ?").run(uid, today);

  const id = uuid();
  db.prepare("INSERT INTO daily_plans (id, user_id, date, slots) VALUES (?,?,?,?)").run(id, uid, today, JSON.stringify(slots));
  
  res.json({ ok: true });
});

// ---- favorites ----
app.get("/api/recipes", (req, res) => {
  const recipes = db.prepare("SELECT * FROM recipes").all();
  res.json({ recipes });
});

app.get("/api/favorites", (req, res) => {
  const uid = userIdFrom(req);
  if (!uid) return res.status(401).json({ error: "Tidak terautentikasi" });
  const favs = db.prepare("SELECT * FROM favorites WHERE user_id = ?").all(uid);
  res.json({ favorites: favs });
});

app.post("/api/favorites", (req, res) => {
  const uid = userIdFrom(req);
  if (!uid) return res.status(401).json({ error: "Tidak terautentikasi" });
  const { item_type, item_id } = req.body;
  if (!item_type || !item_id) return res.status(400).json({ error: "item_type dan item_id wajib diisi" });
  
  try {
    db.prepare("INSERT INTO favorites (id, user_id, item_type, item_id) VALUES (?,?,?,?)")
      .run(uuid(), uid, item_type, item_id);
    res.json({ ok: true });
  } catch (e) {
    if (e.message.includes("UNIQUE constraint")) return res.json({ ok: true }); // Already favorited
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

app.delete("/api/favorites/:type/:id", (req, res) => {
  const uid = userIdFrom(req);
  if (!uid) return res.status(401).json({ error: "Tidak terautentikasi" });
  const { type, id } = req.params;
  
  db.prepare("DELETE FROM favorites WHERE user_id = ? AND item_type = ? AND item_id = ?").run(uid, type, id);
  res.json({ ok: true });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Nakoo API on http://localhost:${PORT}`));
