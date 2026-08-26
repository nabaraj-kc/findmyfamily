# Find My Family - Data Model

This document outlines the PostgreSQL + PostGIS database schema.

## 1. persons
```sql
CREATE TABLE persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  age_known INTEGER,
  age_range_min INTEGER,
  age_range_max INTEGER,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'unknown')),
  height_cm INTEGER,
  build VARCHAR(50),
  distinguishing_features TEXT,
  clothing_last_worn TEXT,
  photo_urls TEXT[], 
  photo_embeddings FLOAT8[], 
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2. cases
```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., MP-2026-0842
  case_type VARCHAR(20) NOT NULL CHECK (case_type IN ('missing', 'found')),
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'found_safe', 'found_injured', 'found_deceased', 'reunited', 'resolved', 'archived')),
  person_id UUID NOT NULL REFERENCES persons(id),
  reporter_id UUID NOT NULL REFERENCES reporters(id),
  last_known_location GEOGRAPHY(POINT, 4326),
  last_known_location_name VARCHAR(500),
  last_known_district VARCHAR(100),
  last_seen_at TIMESTAMPTZ,
  context_description TEXT, 
  trust_tier VARCHAR(20) DEFAULT 'community' CHECK (trust_tier IN ('official', 'volunteer', 'community')),
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  phone_verified BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE, 
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cases_case_id ON cases(case_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_location ON cases USING GIST(last_known_location);
CREATE INDEX idx_cases_district ON cases(last_known_district);
CREATE INDEX idx_cases_created ON cases(created_at DESC);
CREATE INDEX idx_cases_person ON cases(person_id);
```

## 3. reporters
```sql
CREATE TABLE reporters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL, -- NEVER shown publicly
  phone_verified BOOLEAN DEFAULT FALSE,
  relationship VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 4. case_status_log
```sql
CREATE TABLE case_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id),
  old_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,
  changed_by UUID REFERENCES users(id),
  changed_by_name VARCHAR(255),
  source VARCHAR(50), 
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_status_log_case ON case_status_log(case_id, created_at);
```

## 5. matches
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  missing_case_id UUID NOT NULL REFERENCES cases(id),
  found_case_id UUID NOT NULL REFERENCES cases(id),
  confidence_score FLOAT NOT NULL DEFAULT 0,
  name_similarity FLOAT,
  location_proximity_km FLOAT,
  age_match BOOLEAN,
  gender_match BOOLEAN,
  photo_similarity FLOAT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'confirmed', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matches_missing ON matches(missing_case_id);
CREATE INDEX idx_matches_found ON matches(found_case_id);
CREATE INDEX idx_matches_status ON matches(status);
```

## 6. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20),
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'public' CHECK (role IN ('public', 'volunteer', 'official', 'admin')),
  organization VARCHAR(255), 
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 7. comments
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id),
  author_name VARCHAR(255) NOT NULL,
  author_phone VARCHAR(20), 
  content TEXT NOT NULL,
  moderation_status VARCHAR(20) DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  moderated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_case ON comments(case_id, created_at);
CREATE INDEX idx_comments_moderation ON comments(moderation_status);
```

## 8. districts
```sql
CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_ne VARCHAR(100) NOT NULL,
  province VARCHAR(100),
  boundary GEOGRAPHY(POLYGON, 4326),
  is_affected BOOLEAN DEFAULT FALSE
);
```

## 9. district_posts
```sql
CREATE TABLE district_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id INTEGER NOT NULL REFERENCES districts(id),
  author_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  post_type VARCHAR(30) DEFAULT 'general' CHECK (post_type IN ('general', 'sighting', 'need', 'offer', 'update')),
  moderation_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 10. notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_phone VARCHAR(20),
  recipient_user_id UUID REFERENCES users(id),
  channel VARCHAR(10) NOT NULL CHECK (channel IN ('sms', 'push', 'in_app')),
  notification_type VARCHAR(30) NOT NULL,
  case_id UUID REFERENCES cases(id),
  title VARCHAR(500),
  body TEXT NOT NULL,
  delivery_status VARCHAR(20) DEFAULT 'queued' CHECK (delivery_status IN ('queued', 'sent', 'delivered', 'failed')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_status ON notifications(delivery_status);
```

## 11. case_followers
```sql
CREATE TABLE case_followers (
  case_id UUID NOT NULL REFERENCES cases(id),
  phone_number VARCHAR(20),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (case_id, COALESCE(phone_number, ''), COALESCE(user_id::text, ''))
);
```
