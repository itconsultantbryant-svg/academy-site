-- Illustrative read queries (copy into a SQL client; placeholders use PostgreSQL $1
-- style — replace with `?` for the Node adapter / SQLite as needed).
--
-- Relationships: courses -> categories, posts -> users, certificates -> courses

-- List courses with category name
-- SELECT c.id, c.title, c.price, cat.name AS category_name
-- FROM courses c
-- LEFT JOIN categories cat ON c.category_id = cat.id
-- ORDER BY c.title;

-- Posts with author email
-- SELECT p.id, p.title, p.content, u.email AS author_email, u.role AS author_role
-- FROM posts p
-- JOIN users u ON p.author_id = u.id
-- ORDER BY p.id DESC;

-- Certificates for a course (by course id = $1)
-- SELECT cert.id, cert.student_name, cert.certificate_id, cert.issue_date, cert.status,
--        c.title AS course_title
-- FROM certificates cert
-- JOIN courses c ON cert.course_id = c.id
-- WHERE cert.course_id = $1
-- ORDER BY cert.issue_date DESC;

-- Site content by section
-- SELECT id, section_name, content
-- FROM site_content
-- WHERE section_name = $1;
