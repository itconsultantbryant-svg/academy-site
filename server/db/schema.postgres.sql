-- PostgreSQL: npm run db:migrate

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL,
  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT ck_users_role CHECK (role IN ('admin', 'user', 'instructor', 'student'))
);

CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  CONSTRAINT uq_categories_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(512) NOT NULL,
  description TEXT,
  image TEXT,
  duration INTEGER,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  category_id BIGINT REFERENCES categories (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT ck_courses_price_nonneg CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses (category_id);

CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(512) NOT NULL,
  content TEXT,
  image TEXT,
  author_id BIGINT NOT NULL REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts (author_id);

CREATE TABLE IF NOT EXISTS certificates (
  id BIGSERIAL PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  course_id BIGINT NOT NULL REFERENCES courses (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  certificate_id VARCHAR(64) NOT NULL,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  CONSTRAINT uq_certificates_public_id UNIQUE (certificate_id),
  CONSTRAINT ck_certificates_status CHECK (status IN ('pending', 'issued', 'revoked'))
);

CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates (course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates (status);

CREATE TABLE IF NOT EXISTS site_content (
  id BIGSERIAL PRIMARY KEY,
  section_name VARCHAR(128) NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT uq_site_content_section UNIQUE (section_name)
);

CREATE TABLE IF NOT EXISTS subscribers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_subscribers_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  course_id VARCHAR(255) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  learning_mode VARCHAR(32) NOT NULL DEFAULT 'in-person',
  highest_education VARCHAR(255),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_course_title ON registrations (course_title);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations (created_at);
