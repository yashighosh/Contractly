-- ============================================================
-- Contractly — Seed Data v2
-- PostgreSQL
-- ============================================================

-- 1. Demo User
INSERT INTO users (id, email, password_hash, full_name, company_name, role)
VALUES (1, 'yashi@contractly.in', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGjGzd.m4kG.wX.fR5d2', 'Yashi Ghosh', 'Contractly', 'USER')
ON CONFLICT (email) DO NOTHING;

-- Reset sequence for users
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. Templates (Default System Templates)
INSERT INTO templates (id, user_id, title, description, content, variables, is_public)
VALUES 
(1, 1, 'Web Development Agreement', 'Standard web development contract', '<h2>Web Development Agreement</h2><p>This agreement covers the complete web development lifecycle...</p>', '{"client_name": "", "amount": ""}', true),
(2, 1, 'Design Contract', 'Graphic and UI/UX design contract', '<h2>Design Contract</h2><p>Full design services including revisions...</p>', '{"client_name": "", "amount": ""}', true),
(3, 1, 'Freelance NDA', 'Non-Disclosure Agreement for freelancers', '<h2>Non-Disclosure Agreement</h2><p>The parties agree to keep all confidential information private...</p>', '{"client_name": ""}', true)
ON CONFLICT DO NOTHING;

SELECT setval('templates_id_seq', (SELECT MAX(id) FROM templates));

-- 3. Contracts
INSERT INTO contracts (id, user_id, template_id, title, content, variables_data, status, recipient_name, recipient_email, amount, created_at, updated_at, sent_at, viewed_at, signed_at)
VALUES
(1, 1, null, 'Brand Identity Design — Meera Iyer', '<h2>Brand Identity Design Agreement</h2><p>This agreement covers the complete brand identity design including logo, color palette, typography, and brand guidelines.</p>', '{"client_name": "Meera Iyer", "freelancer_name": "Yashi Ghosh", "amount": "45000", "scope_of_work": "Brand Identity Design"}', 'SIGNED', 'Meera Iyer', 'meera.iyer@gmail.com', 45000.00, CURRENT_TIMESTAMP - INTERVAL '42 days', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_TIMESTAMP - INTERVAL '31 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),

(2, 1, null, 'Website Redesign — Karan Mehta', '<h2>Website Redesign Contract</h2><p>Full redesign of corporate website including 10 pages, responsive design, and CMS integration.</p>', '{"client_name": "Karan Mehta", "freelancer_name": "Yashi Ghosh", "amount": "80000", "scope_of_work": "Website Redesign"}', 'SIGNED', 'Karan Mehta', 'karan.mehta@startup.in', 80000.00, CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_TIMESTAMP - INTERVAL '48 days', CURRENT_TIMESTAMP - INTERVAL '45 days'),

(3, 1, null, 'SEO & Content Package — Priya Sharma', '<h2>SEO & Content Agreement</h2><p>3-month SEO optimization package including keyword research, on-page SEO, and 8 blog posts per month.</p>', '{"client_name": "Priya Sharma", "freelancer_name": "Yashi Ghosh", "amount": "32000", "scope_of_work": "SEO & Content Strategy"}', 'SENT', 'Priya Sharma', 'priya@priyasharma.co', 32000.00, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days', null, null),

(4, 1, null, 'Mobile App UI Design — Rahul Verma', '<h2>Mobile App UI Design Contract</h2><p>Complete UI/UX design for iOS and Android application including wireframes, prototypes, and final design files.</p>', '{"client_name": "Rahul Verma", "freelancer_name": "Yashi Ghosh", "amount": "65000", "scope_of_work": "Mobile App UI/UX Design"}', 'VIEWED', 'Rahul Verma', 'rahul@techstartup.io', 65000.00, CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '3 days', null),

(5, 1, null, 'Social Media Strategy — Ananya Patel', '<h2>Social Media Strategy Agreement</h2><p>6-month social media management and content strategy for Instagram, LinkedIn, and Twitter.</p>', '{"client_name": "Ananya Patel", "freelancer_name": "Yashi Ghosh", "amount": "28000", "scope_of_work": "Social Media Strategy"}', 'DRAFT', 'Ananya Patel', 'ananya@boutique.in', 28000.00, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 days', null, null, null)
ON CONFLICT DO NOTHING;

SELECT setval('contracts_id_seq', (SELECT MAX(id) FROM contracts));

-- 4. Audit Logs
INSERT INTO audit_logs (contract_id, user_id, action, metadata, created_at)
VALUES
(1, 1, 'SIGNED', '{"actor": "Meera Iyer"}', CURRENT_TIMESTAMP - INTERVAL '30 days'),
(4, 1, 'VIEWED', '{"actor": "Rahul Verma"}', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(4, 1, 'SENT', '{"actor": "Yashi Ghosh"}', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(3, 1, 'SENT', '{"actor": "Yashi Ghosh"}', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(5, 1, 'CREATED', '{"actor": "Yashi Ghosh"}', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 1, 'CREATED', '{"actor": "Yashi Ghosh"}', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(2, 1, 'SIGNED', '{"actor": "Karan Mehta"}', CURRENT_TIMESTAMP - INTERVAL '45 days');
