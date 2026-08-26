import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { ALL_DISTRICTS } from '@/constants';

const isVercel = process.env.VERCEL === '1' || process.env.NEXT_PUBLIC_VERCEL_ENV !== undefined;
const DB_DIR = isVercel ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');

if (!fs.existsSync(DB_DIR)) {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
  } catch (e) {
    console.warn('DB directory creation notice:', e);
  }
}

const localDbPath = path.join(process.cwd(), 'data', 'findmyfamily.db');
const targetDbPath = path.join(DB_DIR, 'findmyfamily.db');
if (isVercel && !fs.existsSync(targetDbPath) && fs.existsSync(localDbPath)) {
  try {
    fs.copyFileSync(localDbPath, targetDbPath);
  } catch (e) {}
}

const DB_PATH = isVercel ? targetDbPath : path.join(DB_DIR, 'findmyfamily.db');

// Initialize SQLite database instance
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL'); // High concurrency and performance
db.pragma('foreign_keys = ON');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caseId TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'missing' | 'found'
    status TEXT NOT NULL, -- 'missing' | 'safe' | 'injured' | 'deceased' | 'reunited' | 'resolved'
    fullName TEXT NOT NULL,
    nickname TEXT,
    age INTEGER,
    gender TEXT,
    districtId INTEGER NOT NULL,
    lastKnownLocation TEXT NOT NULL,
    dateStr TEXT NOT NULL,
    features TEXT,
    clothing TEXT,
    photoUrl TEXT,
    reporterName TEXT NOT NULL,
    reporterPhone TEXT NOT NULL,
    relationship TEXT,
    privacyConsent INTEGER DEFAULT 1,
    trustTier TEXT DEFAULT 'community', -- 'official' | 'volunteer' | 'community'
    isPublished INTEGER DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caseId TEXT NOT NULL,
    tipText TEXT NOT NULL,
    contactInfo TEXT,
    status TEXT DEFAULT 'new', -- 'new' | 'reviewed' | 'actioned'
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT,
    source TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS community_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    authorRole TEXT DEFAULT 'Citizen', -- 'Citizen' | 'Official' | 'Volunteer'
    content TEXT NOT NULL,
    image TEXT,
    likes INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS community_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postId INTEGER NOT NULL,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(postId) REFERENCES community_posts(id) ON DELETE CASCADE
  );
`);

// Auto-migrate schema differences if any
try {
  const caseColumns = (db.pragma('table_info(cases)') as any[]).map(c => c.name);
  if (!caseColumns.includes('lastKnownLocation')) {
    if (caseColumns.includes('lastLocation')) {
      db.exec('ALTER TABLE cases RENAME COLUMN lastLocation TO lastKnownLocation;');
    } else {
      db.exec('ALTER TABLE cases ADD COLUMN lastKnownLocation TEXT DEFAULT "";');
    }
  }
  if (!caseColumns.includes('privacyConsent')) {
    db.exec('ALTER TABLE cases ADD COLUMN privacyConsent INTEGER DEFAULT 1;');
  }
  if (!caseColumns.includes('updatedAt')) {
    db.exec("ALTER TABLE cases ADD COLUMN updatedAt TEXT DEFAULT '';");
  }

  const tipColumns = (db.pragma('table_info(tips)') as any[]).map(c => c.name);
  if (!tipColumns.includes('tipText')) {
    if (tipColumns.includes('tip')) {
      db.exec('ALTER TABLE tips RENAME COLUMN tip TO tipText;');
    } else {
      db.exec('ALTER TABLE tips ADD COLUMN tipText TEXT DEFAULT "";');
    }
  }
  if (!tipColumns.includes('status')) {
    db.exec('ALTER TABLE tips ADD COLUMN status TEXT DEFAULT "new";');
  }

  const postColumns = (db.pragma('table_info(community_posts)') as any[]).map(c => c.name);
  if (!postColumns.includes('image')) {
    db.exec('ALTER TABLE community_posts ADD COLUMN image TEXT;');
  }
  if (!postColumns.includes('likes')) {
    db.exec('ALTER TABLE community_posts ADD COLUMN likes INTEGER DEFAULT 0;');
  }
  if (!postColumns.includes('authorRole')) {
    db.exec('ALTER TABLE community_posts ADD COLUMN authorRole TEXT DEFAULT "Citizen";');
  }
  if (!postColumns.includes('createdAt')) {
    db.exec("ALTER TABLE community_posts ADD COLUMN createdAt TEXT DEFAULT '';");
  }

  const commentColumns = (db.pragma('table_info(community_comments)') as any[]).map(c => c.name);
  if (!commentColumns.includes('createdAt')) {
    db.exec("ALTER TABLE community_comments ADD COLUMN createdAt TEXT DEFAULT '';");
  }

  const galleryColumns = (db.pragma('table_info(gallery_images)') as any[]).map(c => c.name);
  if (!galleryColumns.includes('createdAt')) {
    db.exec("ALTER TABLE gallery_images ADD COLUMN createdAt TEXT DEFAULT '';");
  }
  if (!galleryColumns.includes('source')) {
    db.exec("ALTER TABLE gallery_images ADD COLUMN source TEXT DEFAULT 'Verified Source';");
  }
  if (!galleryColumns.includes('caption')) {
    db.exec("ALTER TABLE gallery_images ADD COLUMN caption TEXT DEFAULT '';");
  }
} catch (e) {
  console.warn('Schema migration check notice:', e);
}

// Check system_settings to ensure we ONLY seed initial data once on brand-new DB setup.
// If the user deletes any or all data, is_seeded prevents deleted records from ever resurrecting on reload.
const isSeeded = db.prepare("SELECT value FROM system_settings WHERE key = 'is_seeded'").get() as { value: string } | undefined;

if (!isSeeded) {
  const initialCases = [
    {
      caseId: 'MP-2026-9482',
      type: 'missing',
      status: 'missing',
      fullName: 'Aarav Sharma',
      nickname: 'Aaru',
      age: 8,
      gender: 'male',
      districtId: 1, // Rasuwa
      lastKnownLocation: 'Near Syabrubesi suspension bridge during the initial flood wave.',
      dateStr: '2026-08-25',
      features: 'Has a small scar above the left eyebrow.',
      clothing: 'Red t-shirt, blue jeans, no shoes.',
      photoUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
      reporterName: 'Sunita Sharma',
      reporterPhone: '+977 9841234567',
      relationship: 'parent',
      trustTier: 'official',
      isPublished: 1,
    },
    {
      caseId: 'MP-2026-4821',
      type: 'missing',
      status: 'missing',
      fullName: 'Sita Tamang',
      nickname: 'Maiya',
      age: 62,
      gender: 'female',
      districtId: 1,
      lastKnownLocation: 'Dhunche lower market area.',
      dateStr: '2026-08-26',
      features: 'Wears traditional gold earrings, speaks limited English.',
      clothing: 'Green kurta, dark shawl.',
      photoUrl: '',
      reporterName: 'Dorje Tamang',
      reporterPhone: '+977 9801234568',
      relationship: 'child',
      trustTier: 'volunteer',
      isPublished: 1,
    },
    {
      caseId: 'FP-2026-1193',
      type: 'found',
      status: 'safe',
      fullName: 'Nima Lama',
      nickname: '',
      age: 35,
      gender: 'male',
      districtId: 2, // Nuwakot
      lastKnownLocation: 'Trishuli hospital relief camp.',
      dateStr: '2026-08-26',
      features: 'Tattoo of a mandala on right forearm.',
      clothing: 'Grey jacket.',
      photoUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=400&q=80',
      reporterName: 'Trishuli Red Cross Center',
      reporterPhone: '+977 9851122334',
      relationship: 'volunteer',
      trustTier: 'community',
      isPublished: 1,
    },
    {
      caseId: 'FP-2026-8842',
      type: 'found',
      status: 'injured',
      fullName: 'Unknown Boy',
      nickname: '',
      age: 12,
      gender: 'male',
      districtId: 1,
      lastKnownLocation: 'Rescued near Bhote Koshi banks, currently at Rasuwa District Hospital.',
      dateStr: '2026-08-26',
      features: '',
      clothing: 'Yellow raincoat, torn blue pants.',
      photoUrl: '',
      reporterName: 'Nepal Army Rescue Squad',
      reporterPhone: '+977 100',
      relationship: 'other',
      trustTier: 'official',
      isPublished: 1,
    },
    {
      caseId: 'MP-2026-5512',
      type: 'missing',
      status: 'missing',
      fullName: 'Bikash Thapa',
      nickname: '',
      age: 28,
      gender: 'male',
      districtId: 3, // Dhading
      lastKnownLocation: 'Traveling from Dhading Besi towards Rasuwa.',
      dateStr: '2026-08-25',
      features: 'Carrying a large black trekking backpack.',
      clothing: 'Black hoodie, cargo pants',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      reporterName: 'Prakash Thapa',
      reporterPhone: '+977 9860112233',
      relationship: 'sibling',
      trustTier: 'community',
      isPublished: 1,
    },
    {
      caseId: 'FP-2026-0001',
      type: 'found',
      status: 'deceased',
      fullName: 'Unknown Woman',
      nickname: '',
      age: 45,
      gender: 'female',
      districtId: 1,
      lastKnownLocation: 'Recovered downstream near Kalikasthan.',
      dateStr: '2026-08-26',
      features: '',
      clothing: 'Floral sari',
      photoUrl: '',
      reporterName: 'District Police Office Rasuwa',
      reporterPhone: '+977 100',
      relationship: 'other',
      trustTier: 'official',
      isPublished: 0, // Confidential / not public
    }
  ];

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO cases (
      caseId, type, status, fullName, nickname, age, gender, districtId,
      lastKnownLocation, dateStr, features, clothing, photoUrl,
      reporterName, reporterPhone, relationship, privacyConsent, trustTier, isPublished, createdAt, updatedAt
    ) VALUES (
      @caseId, @type, @status, @fullName, @nickname, @age, @gender, @districtId,
      @lastKnownLocation, @dateStr, @features, @clothing, @photoUrl,
      @reporterName, @reporterPhone, @relationship, @privacyConsent, @trustTier, @isPublished, datetime('now'), datetime('now')
    )
  `);

  const insertMany = db.transaction((cases) => {
    for (const c of cases) {
      insertStmt.run({
        nickname: '',
        features: '',
        clothing: '',
        photoUrl: '',
        relationship: 'other',
        privacyConsent: 1,
        trustTier: 'community',
        isPublished: 1,
        ...c
      });
    }
  });

  insertMany(initialCases);

  // Seed gallery images
  const galleryStmt = db.prepare(`
    INSERT OR IGNORE INTO gallery_images (id, url, caption, source, createdAt)
    VALUES (@id, @url, @caption, @source, @createdAt)
  `);
  galleryStmt.run({
    id: '1',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=800&auto=format&fit=crop',
    caption: 'Flooded streets in Kathmandu Valley following unprecedented monsoon rains.',
    source: 'Verified Source (Photojournalist)',
    createdAt: 'Sept 2024'
  });
  galleryStmt.run({
    id: '2',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=800&auto=format&fit=crop',
    caption: 'Rescue operations underway in Nuwakot district.',
    source: 'Local News Agency',
    createdAt: 'Aug 2026'
  });
  galleryStmt.run({
    id: '3',
    url: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?q=80&w=800&auto=format&fit=crop',
    caption: 'Rising water levels at the Trishuli River.',
    source: 'Community Reporter',
    createdAt: 'Aug 2026'
  });
  galleryStmt.run({
    id: '4',
    url: 'https://images.unsplash.com/photo-1582214959146-5eec253457a4?q=80&w=800&auto=format&fit=crop',
    caption: 'Damaged infrastructure along the Bhotekoshi riverbanks.',
    source: 'Verified Source',
    createdAt: 'Aug 2026'
  });

  // Seed community posts
  const postStmt = db.prepare(`
    INSERT OR IGNORE INTO community_posts (author, authorRole, content, image, likes, createdAt)
    VALUES (@author, @authorRole, @content, @image, @likes, @createdAt)
  `);

  try {
    const p1 = postStmt.run({
      author: 'Ram Shrestha',
      authorRole: 'Citizen',
      content: 'We are currently stranded near the Melamchi bazaar area. The water level is still high but we are on higher ground. Need clean drinking water.',
      image: null,
      likes: 45,
      createdAt: '2 hours ago'
    });

    if (p1 && p1.lastInsertRowid && Number(p1.lastInsertRowid) > 0) {
      db.prepare(`
        INSERT OR IGNORE INTO community_comments (postId, author, text, createdAt)
        VALUES (?, 'Nepal Red Cross', 'A rescue team has been dispatched to your coordinates.', '1 hour ago')
      `).run(p1.lastInsertRowid);
    }

    postStmt.run({
      author: 'Local Authority',
      authorRole: 'Official',
      content: 'Road clearance on the Araniko Highway has begun. Please avoid travel unless it is an absolute emergency. Stay safe.',
      image: null,
      likes: 120,
      createdAt: '5 hours ago'
    });
  } catch (e) {
    console.warn('Community seed notice:', e);
  }

  // Mark database as permanently seeded
  db.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('is_seeded', 'true')").run();
}

// Database helper functions
export interface DbCase {
  id: number;
  caseId: string;
  type: 'missing' | 'found';
  status: 'missing' | 'safe' | 'injured' | 'deceased' | 'reunited' | 'resolved';
  fullName: string;
  nickname?: string;
  age?: number;
  gender: 'male' | 'female' | 'other' | 'unknown';
  districtId: number;
  lastKnownLocation: string;
  dateStr: string;
  features?: string;
  clothing?: string;
  photoUrl?: string;
  reporterName: string;
  reporterPhone: string;
  relationship?: string;
  privacyConsent: number;
  trustTier: 'official' | 'volunteer' | 'community';
  isPublished: number;
  createdAt: string;
  updatedAt: string;
}

export function getAllCases(): DbCase[] {
  return db.prepare('SELECT * FROM cases ORDER BY id DESC').all() as DbCase[];
}

export function getPublicCases(): DbCase[] {
  return db.prepare('SELECT * FROM cases WHERE isPublished = 1 ORDER BY id DESC').all() as DbCase[];
}

export function getCaseById(caseId: string): DbCase | undefined {
  return db.prepare('SELECT * FROM cases WHERE caseId = ?').get(caseId) as DbCase | undefined;
}

export function insertCase(data: Partial<DbCase> & { type: 'missing' | 'found', fullName: string, districtId: number, lastKnownLocation: string, dateStr: string, reporterName: string, reporterPhone: string }): DbCase {
  const prefix = data.type === 'missing' ? 'MP' : 'FP';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const caseId = data.caseId || `${prefix}-2026-${randomSuffix}`;

  const stmt = db.prepare(`
    INSERT INTO cases (
      caseId, type, status, fullName, nickname, age, gender, districtId,
      lastKnownLocation, dateStr, features, clothing, photoUrl,
      reporterName, reporterPhone, relationship, privacyConsent, trustTier, isPublished, createdAt, updatedAt
    ) VALUES (
      @caseId, @type, @status, @fullName, @nickname, @age, @gender, @districtId,
      @lastKnownLocation, @dateStr, @features, @clothing, @photoUrl,
      @reporterName, @reporterPhone, @relationship, @privacyConsent, @trustTier, @isPublished, datetime('now'), datetime('now')
    )
  `);

  stmt.run({
    nickname: '',
    features: '',
    clothing: '',
    photoUrl: '',
    relationship: 'other',
    privacyConsent: 1,
    trustTier: 'community',
    isPublished: 1,
    status: data.type === 'missing' ? 'missing' : 'safe',
    age: 0,
    gender: 'unknown',
    ...data,
    caseId
  });

  return getCaseById(caseId)!;
}

export function updateCaseStatus(caseId: string, status: string): boolean {
  const stmt = db.prepare('UPDATE cases SET status = ?, updatedAt = datetime("now") WHERE caseId = ?');
  return stmt.run(status, caseId).changes > 0;
}

export function updateCase(caseId: string, data: Partial<DbCase>): boolean {
  const current = getCaseById(caseId);
  if (!current) return false;

  const stmt = db.prepare(`
    UPDATE cases SET
      fullName = ?,
      nickname = ?,
      age = ?,
      gender = ?,
      districtId = ?,
      lastKnownLocation = ?,
      dateStr = ?,
      features = ?,
      clothing = ?,
      photoUrl = ?,
      reporterName = ?,
      reporterPhone = ?,
      relationship = ?,
      status = ?,
      trustTier = ?,
      updatedAt = datetime('now')
    WHERE caseId = ?
  `);

  const result = stmt.run(
    data.fullName !== undefined ? data.fullName : current.fullName,
    data.nickname !== undefined ? data.nickname : current.nickname,
    data.age !== undefined ? Number(data.age) : current.age,
    data.gender !== undefined ? data.gender : current.gender,
    data.districtId !== undefined ? Number(data.districtId) : current.districtId,
    data.lastKnownLocation !== undefined ? data.lastKnownLocation : current.lastKnownLocation,
    data.dateStr !== undefined ? data.dateStr : current.dateStr,
    data.features !== undefined ? data.features : current.features,
    data.clothing !== undefined ? data.clothing : current.clothing,
    data.photoUrl !== undefined ? data.photoUrl : current.photoUrl,
    data.reporterName !== undefined ? data.reporterName : current.reporterName,
    data.reporterPhone !== undefined ? data.reporterPhone : current.reporterPhone,
    data.relationship !== undefined ? data.relationship : current.relationship,
    data.status !== undefined ? data.status : current.status,
    data.trustTier !== undefined ? data.trustTier : current.trustTier,
    caseId
  );

  return result.changes > 0;
}

export function deleteCase(caseId: string): boolean {
  try {
    db.prepare('DELETE FROM tips WHERE caseId = ?').run(caseId);
  } catch (e) {}
  const stmt = db.prepare('DELETE FROM cases WHERE caseId = ?');
  return stmt.run(caseId).changes > 0;
}

export function deleteCasesBulk(caseIds: string[]): number {
  if (!caseIds || caseIds.length === 0) return 0;
  const placeholders = caseIds.map(() => '?').join(',');
  try {
    db.prepare(`DELETE FROM tips WHERE caseId IN (${placeholders})`).run(...caseIds);
  } catch (e) {}
  const stmt = db.prepare(`DELETE FROM cases WHERE caseId IN (${placeholders})`);
  return stmt.run(...caseIds).changes;
}

export function deleteAllCases(): number {
  try {
    db.prepare('DELETE FROM tips').run();
  } catch (e) {}
  const stmt = db.prepare('DELETE FROM cases');
  const count = stmt.run().changes;
  try {
    db.exec("DELETE FROM sqlite_sequence WHERE name IN ('cases', 'tips');");
  } catch (e) {}
  return count;
}

// Gallery Database Helpers
export function getGalleryImages() {
  return db.prepare('SELECT * FROM gallery_images ORDER BY rowid DESC').all() as any[];
}

export function insertGalleryImage(data: { id?: string, url: string, caption?: string, source?: string }) {
  const id = data.id || Date.now().toString();
  const stmt = db.prepare(`
    INSERT INTO gallery_images (id, url, caption, source, createdAt)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
  stmt.run(id, data.url, data.caption || '', data.source || 'Community Member');
  return { id, ...data };
}

export function deleteGalleryImage(id: string): boolean {
  return db.prepare('DELETE FROM gallery_images WHERE id = ?').run(id).changes > 0;
}

export function deleteGalleryImagesBulk(ids: string[]): number {
  if (!ids || ids.length === 0) return 0;
  const placeholders = ids.map(() => '?').join(',');
  return db.prepare(`DELETE FROM gallery_images WHERE id IN (${placeholders})`).run(...ids).changes;
}

export function deleteAllGalleryImages(): number {
  return db.prepare('DELETE FROM gallery_images').run().changes;
}

// Community Database Helpers
export function getCommunityPosts() {
  const posts = db.prepare('SELECT * FROM community_posts ORDER BY id DESC').all() as any[];
  const comments = db.prepare('SELECT * FROM community_comments ORDER BY id ASC').all() as any[];
  return posts.map(p => ({
    id: p.id.toString(),
    author: p.author,
    authorRole: p.authorRole,
    content: p.content,
    image: p.image,
    likes: p.likes || 0,
    timestamp: p.createdAt,
    comments: comments.filter(c => c.postId === p.id).map(c => ({
      id: c.id.toString(),
      author: c.author,
      text: c.text,
      timestamp: c.createdAt
    }))
  }));
}

export function insertCommunityPost(data: { author?: string, authorRole?: string, content: string, image?: string }) {
  const stmt = db.prepare(`
    INSERT INTO community_posts (author, authorRole, content, image, likes, createdAt)
    VALUES (?, ?, ?, ?, 0, datetime('now'))
  `);
  const info = stmt.run(data.author || 'Citizen', data.authorRole || 'Citizen', data.content, data.image || null);
  return { id: info.lastInsertRowid.toString(), ...data, likes: 0, comments: [] };
}

export function deleteCommunityPost(id: number | string): boolean {
  try {
    db.prepare('DELETE FROM community_comments WHERE postId = ?').run(Number(id));
  } catch (e) {}
  return db.prepare('DELETE FROM community_posts WHERE id = ?').run(Number(id)).changes > 0;
}

export function deleteCommunityPostsBulk(ids: (number | string)[]): number {
  if (!ids || ids.length === 0) return 0;
  const numIds = ids.map(Number);
  const placeholders = numIds.map(() => '?').join(',');
  try {
    db.prepare(`DELETE FROM community_comments WHERE postId IN (${placeholders})`).run(...numIds);
  } catch (e) {}
  return db.prepare(`DELETE FROM community_posts WHERE id IN (${placeholders})`).run(...numIds).changes;
}

export function deleteAllCommunityPosts(): number {
  try {
    db.prepare('DELETE FROM community_comments').run();
  } catch (e) {}
  return db.prepare('DELETE FROM community_posts').run().changes;
}

export function insertCommunityComment(postId: number | string, author: string, text: string) {
  const stmt = db.prepare(`
    INSERT INTO community_comments (postId, author, text, createdAt)
    VALUES (?, ?, ?, datetime('now'))
  `);
  const info = stmt.run(Number(postId), author || 'Citizen', text);
  return { id: info.lastInsertRowid.toString(), postId, author, text, timestamp: 'Just now' };
}

export function deleteCommunityComment(commentId: number | string): boolean {
  return db.prepare('DELETE FROM community_comments WHERE id = ?').run(Number(commentId)).changes > 0;
}

// Hard Purge All Data
export function hardPurgeAllData() {
  const casesDeleted = db.prepare('DELETE FROM cases').run().changes;
  const tipsDeleted = db.prepare('DELETE FROM tips').run().changes;
  const galleryDeleted = db.prepare('DELETE FROM gallery_images').run().changes;
  let commentsDeleted = 0;
  let postsDeleted = 0;
  try {
    commentsDeleted = db.prepare('DELETE FROM community_comments').run().changes;
    postsDeleted = db.prepare('DELETE FROM community_posts').run().changes;
    db.exec("DELETE FROM sqlite_sequence WHERE name IN ('cases', 'tips', 'community_posts', 'community_comments', 'gallery_images');");
    db.exec('VACUUM;');
  } catch (e) {
    console.warn('Vacuum warning:', e);
  }

  return {
    casesDeleted,
    tipsDeleted,
    galleryDeleted,
    commentsDeleted,
    postsDeleted
  };
}

export function deleteTip(tipId: number | string): boolean {
  const stmt = db.prepare('DELETE FROM tips WHERE id = ?');
  return stmt.run(Number(tipId)).changes > 0;
}

export function deleteTipsBulk(tipIds: (number | string)[]): number {
  if (!tipIds || tipIds.length === 0) return 0;
  const numericIds = tipIds.map(id => Number(id)).filter(id => !isNaN(id));
  if (numericIds.length === 0) return 0;
  const placeholders = numericIds.map(() => '?').join(',');
  const stmt = db.prepare(`DELETE FROM tips WHERE id IN (${placeholders})`);
  return stmt.run(...numericIds).changes;
}

export function deleteAllTips(): number {
  const stmt = db.prepare('DELETE FROM tips');
  const count = stmt.run().changes;
  try {
    db.exec("DELETE FROM sqlite_sequence WHERE name = 'tips';");
  } catch (e) {}
  return count;
}

export function updateTipStatus(tipId: number | string, status: string): boolean {
  const stmt = db.prepare('UPDATE tips SET status = ? WHERE id = ?');
  return stmt.run(status, Number(tipId)).changes > 0;
}

export function insertTip(caseId: string, tipText: string, contactInfo?: string) {
  const stmt = db.prepare(`
    INSERT INTO tips (caseId, tipText, contactInfo, status, createdAt)
    VALUES (?, ?, ?, 'new', datetime('now'))
  `);
  return stmt.run(caseId, tipText, contactInfo || '');
}

export function getAllTips() {
  return db.prepare('SELECT * FROM tips ORDER BY id DESC').all();
}

export function getDashboardMetrics() {
  const totalMissing = (db.prepare("SELECT count(*) as count FROM cases WHERE status = 'missing'").get() as any).count;
  const totalFound = (db.prepare("SELECT count(*) as count FROM cases WHERE status != 'missing'").get() as any).count;
  const pendingModeration = (db.prepare("SELECT count(*) as count FROM cases WHERE trustTier = 'community' OR status = 'deceased'").get() as any).count;
  const totalTips = (db.prepare("SELECT count(*) as count FROM tips").get() as any).count;

  return {
    totalMissing,
    totalFound,
    pendingModeration,
    totalTips,
    totalMatches: 24,
  };
}

export function getRecentActivity(limit = 10): DbCase[] {
  return db.prepare('SELECT * FROM cases ORDER BY id DESC LIMIT ?').all(limit) as DbCase[];
}

export function getDistrictName(id: number, locale: 'en' | 'ne' = 'en'): string {
  const district = ALL_DISTRICTS.find(d => d.id === id);
  if (!district) return 'Unknown';
  return locale === 'en' ? district.nameEn : district.nameNe;
}

export default db;
