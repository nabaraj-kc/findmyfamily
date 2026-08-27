import { createClient } from '@libsql/client';
import { ALL_DISTRICTS } from '@/constants';

// We fall back to a local SQLite file if TURSO variables are not set
const dbUrl = process.env.TURSO_DATABASE_URL || 'file:data/findmyfamily.db';
const dbAuthToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
  url: dbUrl,
  authToken: dbAuthToken,
});

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;
  
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caseId TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
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
      trustTier TEXT DEFAULT 'community',
      isPublished INTEGER DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caseId TEXT NOT NULL,
      tipText TEXT NOT NULL,
      contactInfo TEXT,
      status TEXT DEFAULT 'new',
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
      authorRole TEXT DEFAULT 'Citizen',
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

  try {
    const caseColumnsRs = await db.execute("PRAGMA table_info('cases')");
    const caseColumns = caseColumnsRs.rows.map(r => r.name as string);
    if (!caseColumns.includes('lastKnownLocation')) {
      if (caseColumns.includes('lastLocation')) {
        await db.execute('ALTER TABLE cases RENAME COLUMN lastLocation TO lastKnownLocation;');
      } else {
        await db.execute('ALTER TABLE cases ADD COLUMN lastKnownLocation TEXT DEFAULT "";');
      }
    }
    if (!caseColumns.includes('privacyConsent')) {
      await db.execute('ALTER TABLE cases ADD COLUMN privacyConsent INTEGER DEFAULT 1;');
    }
    if (!caseColumns.includes('updatedAt')) {
      await db.execute("ALTER TABLE cases ADD COLUMN updatedAt TEXT DEFAULT '';");
    }

    const tipColumnsRs = await db.execute("PRAGMA table_info('tips')");
    const tipColumns = tipColumnsRs.rows.map(r => r.name as string);
    if (!tipColumns.includes('tipText')) {
      if (tipColumns.includes('tip')) {
        await db.execute('ALTER TABLE tips RENAME COLUMN tip TO tipText;');
      } else {
        await db.execute('ALTER TABLE tips ADD COLUMN tipText TEXT DEFAULT "";');
      }
    }
    if (!tipColumns.includes('status')) {
      await db.execute('ALTER TABLE tips ADD COLUMN status TEXT DEFAULT "new";');
    }

    const postColumnsRs = await db.execute("PRAGMA table_info('community_posts')");
    const postColumns = postColumnsRs.rows.map(r => r.name as string);
    if (!postColumns.includes('image')) {
      await db.execute('ALTER TABLE community_posts ADD COLUMN image TEXT;');
    }
    if (!postColumns.includes('likes')) {
      await db.execute('ALTER TABLE community_posts ADD COLUMN likes INTEGER DEFAULT 0;');
    }
    if (!postColumns.includes('authorRole')) {
      await db.execute('ALTER TABLE community_posts ADD COLUMN authorRole TEXT DEFAULT "Citizen";');
    }
    if (!postColumns.includes('createdAt')) {
      await db.execute("ALTER TABLE community_posts ADD COLUMN createdAt TEXT DEFAULT '';");
    }

    const commentColumnsRs = await db.execute("PRAGMA table_info('community_comments')");
    const commentColumns = commentColumnsRs.rows.map(r => r.name as string);
    if (!commentColumns.includes('createdAt')) {
      await db.execute("ALTER TABLE community_comments ADD COLUMN createdAt TEXT DEFAULT '';");
    }

    const galleryColumnsRs = await db.execute("PRAGMA table_info('gallery_images')");
    const galleryColumns = galleryColumnsRs.rows.map(r => r.name as string);
    if (!galleryColumns.includes('createdAt')) {
      await db.execute("ALTER TABLE gallery_images ADD COLUMN createdAt TEXT DEFAULT '';");
    }
    if (!galleryColumns.includes('source')) {
      await db.execute("ALTER TABLE gallery_images ADD COLUMN source TEXT DEFAULT 'Verified Source';");
    }
    if (!galleryColumns.includes('caption')) {
      await db.execute("ALTER TABLE gallery_images ADD COLUMN caption TEXT DEFAULT '';");
    }
  } catch (e) {
    console.warn('Schema migration check notice:', e);
  }

  // Seeding
  const isSeededRs = await db.execute("SELECT value FROM system_settings WHERE key = 'is_seeded'");
  const isSeeded = isSeededRs.rows.length > 0;

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

    for (const c of initialCases) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO cases (
          caseId, type, status, fullName, nickname, age, gender, districtId,
          lastKnownLocation, dateStr, features, clothing, photoUrl,
          reporterName, reporterPhone, relationship, privacyConsent, trustTier, isPublished, createdAt, updatedAt
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
        )`,
        args: [
          c.caseId, c.type, c.status, c.fullName, c.nickname || '', c.age || 0, c.gender, c.districtId,
          c.lastKnownLocation, c.dateStr, c.features || '', c.clothing || '', c.photoUrl || '',
          c.reporterName, c.reporterPhone, c.relationship || 'other', 1, c.trustTier, c.isPublished
        ]
      });
    }

    const galleries = [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=800&auto=format&fit=crop',
        caption: 'Flooded streets in Kathmandu Valley following unprecedented monsoon rains.',
        source: 'Verified Source (Photojournalist)',
        createdAt: 'Sept 2024'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=800&auto=format&fit=crop',
        caption: 'Rescue operations underway in Nuwakot district.',
        source: 'Local News Agency',
        createdAt: 'Aug 2026'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?q=80&w=800&auto=format&fit=crop',
        caption: 'Rising water levels at the Trishuli River.',
        source: 'Community Reporter',
        createdAt: 'Aug 2026'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1582214959146-5eec253457a4?q=80&w=800&auto=format&fit=crop',
        caption: 'Damaged infrastructure along the Bhotekoshi riverbanks.',
        source: 'Verified Source',
        createdAt: 'Aug 2026'
      }
    ];

    for (const g of galleries) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO gallery_images (id, url, caption, source, createdAt)
              VALUES (?, ?, ?, ?, ?)`,
        args: [g.id, g.url, g.caption, g.source, g.createdAt]
      });
    }

    try {
      const p1 = await db.execute({
        sql: `INSERT OR IGNORE INTO community_posts (author, authorRole, content, image, likes, createdAt)
              VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
        args: ['Ram Shrestha', 'Citizen', 'We are currently stranded near the Melamchi bazaar area. The water level is still high but we are on higher ground. Need clean drinking water.', null, 45, '2 hours ago']
      });

      if (p1.rows.length > 0) {
        const postId = p1.rows[0].id as number;
        await db.execute({
          sql: `INSERT OR IGNORE INTO community_comments (postId, author, text, createdAt)
                VALUES (?, ?, ?, ?)`,
          args: [postId, 'Nepal Red Cross', 'A rescue team has been dispatched to your coordinates.', '1 hour ago']
        });
      }

      await db.execute({
        sql: `INSERT OR IGNORE INTO community_posts (author, authorRole, content, image, likes, createdAt)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: ['Local Authority', 'Official', 'Road clearance on the Araniko Highway has begun. Please avoid travel unless it is an absolute emergency. Stay safe.', null, 120, '5 hours ago']
      });
    } catch (e) {
      console.warn('Community seed notice:', e);
    }

    await db.execute("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('is_seeded', 'true')");
  }
  
  isInitialized = true;
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

export async function getAllCases(): Promise<DbCase[]> {
  await initDb();
  const rs = await db.execute('SELECT * FROM cases ORDER BY id DESC');
  return rs.rows as unknown as DbCase[];
}

export function redactCaseData(c: DbCase): DbCase {
  return {
    ...c,
    reporterName: c.reporterName ? c.reporterName.charAt(0) + '*** (Hidden for Privacy)' : '',
    reporterPhone: '***-****-***',
    lastKnownLocation: 'Location hidden for privacy. Viewable by admins.',
  };
}

export async function getPublicCases(): Promise<DbCase[]> {
  await initDb();
  const rs = await db.execute('SELECT * FROM cases WHERE isPublished = 1 ORDER BY id DESC');
  const cases = rs.rows as unknown as DbCase[];
  return cases.map(redactCaseData);
}

export async function getCaseById(caseId: string): Promise<DbCase | undefined> {
  await initDb();
  const rs = await db.execute({
    sql: 'SELECT * FROM cases WHERE caseId = ?',
    args: [caseId]
  });
  return rs.rows.length > 0 ? (rs.rows[0] as unknown as DbCase) : undefined;
}

export async function insertCase(data: Partial<DbCase> & { type: 'missing' | 'found', fullName: string, districtId: number, lastKnownLocation: string, dateStr: string, reporterName: string, reporterPhone: string }): Promise<DbCase> {
  await initDb();
  const prefix = data.type === 'missing' ? 'MP' : 'FP';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const caseId = data.caseId || `${prefix}-2026-${randomSuffix}`;

  await db.execute({
    sql: `INSERT INTO cases (
      caseId, type, status, fullName, nickname, age, gender, districtId,
      lastKnownLocation, dateStr, features, clothing, photoUrl,
      reporterName, reporterPhone, relationship, privacyConsent, trustTier, isPublished, createdAt, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
    )`,
    args: [
      caseId,
      data.type,
      data.status || (data.type === 'missing' ? 'missing' : 'safe'),
      data.fullName,
      data.nickname || '',
      data.age || 0,
      data.gender || 'unknown',
      data.districtId,
      data.lastKnownLocation,
      data.dateStr,
      data.features || '',
      data.clothing || '',
      data.photoUrl || '',
      data.reporterName,
      data.reporterPhone,
      data.relationship || 'other',
      data.privacyConsent ?? 1,
      data.trustTier || 'community',
      data.isPublished ?? 1
    ]
  });

  const inserted = await getCaseById(caseId);
  return inserted!;
}

export async function updateCaseStatus(caseId: string, status: string): Promise<boolean> {
  await initDb();
  const rs = await db.execute({
    sql: 'UPDATE cases SET status = ?, updatedAt = datetime("now") WHERE caseId = ?',
    args: [status, caseId]
  });
  return rs.rowsAffected > 0;
}

export async function updateCase(caseId: string, data: Partial<DbCase>): Promise<boolean> {
  await initDb();
  const current = await getCaseById(caseId);
  if (!current) return false;

  const rs = await db.execute({
    sql: `UPDATE cases SET
      fullName = ?, nickname = ?, age = ?, gender = ?, districtId = ?,
      lastKnownLocation = ?, dateStr = ?, features = ?, clothing = ?, photoUrl = ?,
      reporterName = ?, reporterPhone = ?, relationship = ?, status = ?, trustTier = ?,
      updatedAt = datetime('now')
    WHERE caseId = ?`,
    args: [
      (data.fullName !== undefined ? data.fullName : current.fullName) ?? null,
      (data.nickname !== undefined ? data.nickname : current.nickname) ?? null,
      (data.age !== undefined ? Number(data.age) : current.age) ?? null,
      (data.gender !== undefined ? data.gender : current.gender) ?? null,
      (data.districtId !== undefined ? Number(data.districtId) : current.districtId) ?? null,
      (data.lastKnownLocation !== undefined ? data.lastKnownLocation : current.lastKnownLocation) ?? null,
      (data.dateStr !== undefined ? data.dateStr : current.dateStr) ?? null,
      (data.features !== undefined ? data.features : current.features) ?? null,
      (data.clothing !== undefined ? data.clothing : current.clothing) ?? null,
      (data.photoUrl !== undefined ? data.photoUrl : current.photoUrl) ?? null,
      (data.reporterName !== undefined ? data.reporterName : current.reporterName) ?? null,
      (data.reporterPhone !== undefined ? data.reporterPhone : current.reporterPhone) ?? null,
      (data.relationship !== undefined ? data.relationship : current.relationship) ?? null,
      (data.status !== undefined ? data.status : current.status) ?? null,
      (data.trustTier !== undefined ? data.trustTier : current.trustTier) ?? null,
      caseId
    ]
  });

  return rs.rowsAffected > 0;
}

export async function deleteCase(caseId: string): Promise<boolean> {
  await initDb();
  try {
    await db.execute({ sql: 'DELETE FROM tips WHERE caseId = ?', args: [caseId] });
  } catch (e) {}
  const rs = await db.execute({ sql: 'DELETE FROM cases WHERE caseId = ?', args: [caseId] });
  return rs.rowsAffected > 0;
}

export async function deleteCasesBulk(caseIds: string[]): Promise<number> {
  if (!caseIds || caseIds.length === 0) return 0;
  await initDb();
  const placeholders = caseIds.map(() => '?').join(',');
  try {
    await db.execute({ sql: `DELETE FROM tips WHERE caseId IN (${placeholders})`, args: caseIds });
  } catch (e) {}
  const rs = await db.execute({ sql: `DELETE FROM cases WHERE caseId IN (${placeholders})`, args: caseIds });
  return rs.rowsAffected;
}

export async function deleteAllCases(): Promise<number> {
  await initDb();
  try {
    await db.execute('DELETE FROM tips');
  } catch (e) {}
  const rs = await db.execute('DELETE FROM cases');
  try {
    await db.execute("DELETE FROM sqlite_sequence WHERE name IN ('cases', 'tips');");
  } catch (e) {}
  return rs.rowsAffected;
}

export async function getGalleryImages(): Promise<any[]> {
  await initDb();
  const rs = await db.execute('SELECT * FROM gallery_images ORDER BY rowid DESC');
  return rs.rows;
}

export async function insertGalleryImage(data: { id?: string, url: string, caption?: string, source?: string }) {
  await initDb();
  const id = data.id || Date.now().toString();
  await db.execute({
    sql: `INSERT INTO gallery_images (id, url, caption, source, createdAt)
          VALUES (?, ?, ?, ?, datetime('now'))`,
    args: [id, data.url, data.caption || '', data.source || 'Community Member']
  });
  return { id, ...data };
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  await initDb();
  const rs = await db.execute({ sql: 'DELETE FROM gallery_images WHERE id = ?', args: [id] });
  return rs.rowsAffected > 0;
}

export async function deleteGalleryImagesBulk(ids: string[]): Promise<number> {
  if (!ids || ids.length === 0) return 0;
  await initDb();
  const placeholders = ids.map(() => '?').join(',');
  const rs = await db.execute({ sql: `DELETE FROM gallery_images WHERE id IN (${placeholders})`, args: ids });
  return rs.rowsAffected;
}

export async function deleteAllGalleryImages(): Promise<number> {
  await initDb();
  const rs = await db.execute('DELETE FROM gallery_images');
  return rs.rowsAffected;
}

export async function getCommunityPosts(): Promise<any[]> {
  await initDb();
  const postsRs = await db.execute('SELECT * FROM community_posts ORDER BY id DESC');
  const commentsRs = await db.execute('SELECT * FROM community_comments ORDER BY id ASC');
  
  const comments = commentsRs.rows;
  return postsRs.rows.map((p: any) => ({
    id: p.id.toString(),
    author: p.author,
    authorRole: p.authorRole,
    content: p.content,
    image: p.image,
    likes: p.likes || 0,
    timestamp: p.createdAt,
    comments: comments.filter((c: any) => c.postId === p.id).map((c: any) => ({
      id: c.id.toString(),
      author: c.author,
      text: c.text,
      timestamp: c.createdAt
    }))
  }));
}

export async function insertCommunityPost(data: { author?: string, authorRole?: string, content: string, image?: string }) {
  await initDb();
  const rs = await db.execute({
    sql: `INSERT INTO community_posts (author, authorRole, content, image, likes, createdAt)
          VALUES (?, ?, ?, ?, 0, datetime('now')) RETURNING id`,
    args: [data.author || 'Citizen', data.authorRole || 'Citizen', data.content, data.image || null]
  });
  const id = rs.rows[0].id;
  return { id: id?.toString(), ...data, likes: 0, comments: [] };
}

export async function deleteCommunityPost(id: number | string): Promise<boolean> {
  await initDb();
  try {
    await db.execute({ sql: 'DELETE FROM community_comments WHERE postId = ?', args: [Number(id)] });
  } catch (e) {}
  const rs = await db.execute({ sql: 'DELETE FROM community_posts WHERE id = ?', args: [Number(id)] });
  return rs.rowsAffected > 0;
}

export async function deleteCommunityPostsBulk(ids: (number | string)[]): Promise<number> {
  if (!ids || ids.length === 0) return 0;
  await initDb();
  const numIds = ids.map(Number);
  const placeholders = numIds.map(() => '?').join(',');
  try {
    await db.execute({ sql: `DELETE FROM community_comments WHERE postId IN (${placeholders})`, args: numIds });
  } catch (e) {}
  const rs = await db.execute({ sql: `DELETE FROM community_posts WHERE id IN (${placeholders})`, args: numIds });
  return rs.rowsAffected;
}

export async function deleteAllCommunityPosts(): Promise<number> {
  await initDb();
  try {
    await db.execute('DELETE FROM community_comments');
  } catch (e) {}
  const rs = await db.execute('DELETE FROM community_posts');
  return rs.rowsAffected;
}

export async function insertCommunityComment(postId: number | string, author: string, text: string) {
  await initDb();
  const rs = await db.execute({
    sql: `INSERT INTO community_comments (postId, author, text, createdAt)
          VALUES (?, ?, ?, datetime('now')) RETURNING id`,
    args: [Number(postId), author || 'Citizen', text]
  });
  const id = rs.rows[0].id;
  return { id: id?.toString(), postId, author, text, timestamp: 'Just now' };
}

export async function deleteCommunityComment(commentId: number | string): Promise<boolean> {
  await initDb();
  const rs = await db.execute({ sql: 'DELETE FROM community_comments WHERE id = ?', args: [Number(commentId)] });
  return rs.rowsAffected > 0;
}

export async function hardPurgeAllData() {
  await initDb();
  const casesRs = await db.execute('DELETE FROM cases');
  const tipsRs = await db.execute('DELETE FROM tips');
  const galleryRs = await db.execute('DELETE FROM gallery_images');
  let commentsDeleted = 0;
  let postsDeleted = 0;
  try {
    const commRs = await db.execute('DELETE FROM community_comments');
    commentsDeleted = commRs.rowsAffected;
    const pRs = await db.execute('DELETE FROM community_posts');
    postsDeleted = pRs.rowsAffected;
    await db.execute("DELETE FROM sqlite_sequence WHERE name IN ('cases', 'tips', 'community_posts', 'community_comments', 'gallery_images');");
    await db.execute('VACUUM;');
  } catch (e) {
    console.warn('Vacuum warning:', e);
  }

  return {
    casesDeleted: casesRs.rowsAffected,
    tipsDeleted: tipsRs.rowsAffected,
    galleryDeleted: galleryRs.rowsAffected,
    commentsDeleted,
    postsDeleted
  };
}

export async function deleteTip(tipId: number | string): Promise<boolean> {
  await initDb();
  const rs = await db.execute({ sql: 'DELETE FROM tips WHERE id = ?', args: [Number(tipId)] });
  return rs.rowsAffected > 0;
}

export async function deleteTipsBulk(tipIds: (number | string)[]): Promise<number> {
  if (!tipIds || tipIds.length === 0) return 0;
  await initDb();
  const numericIds = tipIds.map(id => Number(id)).filter(id => !isNaN(id));
  if (numericIds.length === 0) return 0;
  const placeholders = numericIds.map(() => '?').join(',');
  const rs = await db.execute({ sql: `DELETE FROM tips WHERE id IN (${placeholders})`, args: numericIds });
  return rs.rowsAffected;
}

export async function deleteAllTips(): Promise<number> {
  await initDb();
  const rs = await db.execute('DELETE FROM tips');
  try {
    await db.execute("DELETE FROM sqlite_sequence WHERE name = 'tips';");
  } catch (e) {}
  return rs.rowsAffected;
}

export async function updateTipStatus(tipId: number | string, status: string): Promise<boolean> {
  await initDb();
  const rs = await db.execute({ sql: 'UPDATE tips SET status = ? WHERE id = ?', args: [status, Number(tipId)] });
  return rs.rowsAffected > 0;
}

export async function insertTip(caseId: string, tipText: string, contactInfo?: string) {
  await initDb();
  const rs = await db.execute({
    sql: `INSERT INTO tips (caseId, tipText, contactInfo, status, createdAt)
          VALUES (?, ?, ?, 'new', datetime('now'))`,
    args: [caseId, tipText, contactInfo || '']
  });
  return rs.rowsAffected > 0;
}

export async function getAllTips(): Promise<any[]> {
  await initDb();
  const rs = await db.execute('SELECT * FROM tips ORDER BY id DESC');
  return rs.rows;
}

export async function getDashboardMetrics() {
  await initDb();
  const missingRs = await db.execute("SELECT count(*) as count FROM cases WHERE status = 'missing'");
  const foundRs = await db.execute("SELECT count(*) as count FROM cases WHERE status != 'missing'");
  const modRs = await db.execute("SELECT count(*) as count FROM cases WHERE trustTier = 'community' OR status = 'deceased'");
  const tipsRs = await db.execute("SELECT count(*) as count FROM tips");

  return {
    totalMissing: Number((missingRs.rows[0] as any).count),
    totalFound: Number((foundRs.rows[0] as any).count),
    pendingModeration: Number((modRs.rows[0] as any).count),
    totalTips: Number((tipsRs.rows[0] as any).count),
    totalMatches: 24,
  };
}

export async function getRecentActivity(limit = 10): Promise<DbCase[]> {
  await initDb();
  const rs = await db.execute({ sql: 'SELECT * FROM cases ORDER BY id DESC LIMIT ?', args: [limit] });
  return rs.rows as unknown as DbCase[];
}

export function getDistrictName(id: number, locale: 'en' | 'ne' = 'en'): string {
  const district = ALL_DISTRICTS.find(d => d.id === id);
  if (!district) return 'Unknown';
  return locale === 'en' ? district.nameEn : district.nameNe;
}

export default db;
