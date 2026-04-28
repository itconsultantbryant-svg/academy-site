-- SQLite: npm run db:migrate
-- content is JSON as TEXT. Enable foreign keys in the app (see db/connection.js).

PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  CHECK (role IN ('admin', 'user', 'instructor', 'student')),
  UNIQUE (email)
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  UNIQUE (name)
);

CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  duration INTEGER,
  price REAL NOT NULL DEFAULT 0,
  category_id INTEGER,
  CHECK (price >= 0),
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_courses_category_id ON courses (category_id);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  image TEXT,
  author_id INTEGER NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_posts_author_id ON posts (author_id);

CREATE TABLE certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_name TEXT NOT NULL,
  course_id INTEGER NOT NULL,
  certificate_id TEXT NOT NULL,
  issue_date TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'pending',
  CHECK (status IN ('pending', 'issued', 'revoked')),
  FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE (certificate_id)
);

CREATE INDEX idx_certificates_course_id ON certificates (course_id);
CREATE INDEX idx_certificates_status ON certificates (status);

CREATE TABLE site_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_name TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT ('{}'),
  UNIQUE (section_name)
);

CREATE TABLE subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (email)
);

CREATE TABLE registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  learning_mode TEXT NOT NULL DEFAULT 'in-person',
  highest_education TEXT,
  address TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_registrations_course_title ON registrations (course_title);
CREATE INDEX idx_registrations_created_at ON registrations (created_at);
