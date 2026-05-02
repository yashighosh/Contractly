/**
 * seedData.js — Demo data for the Yashi account.
 * Only applied once when the user key is missing from the store.
 * New accounts always start empty.
 */

const now = new Date();
const daysAgo = (n) => new Date(now - n * 86400000).toISOString();
const monthsAgo = (n) => new Date(now.getFullYear(), now.getMonth() - n, now.getDate()).toISOString();

export const YASHI_SEED_CONTRACTS = [
  {
    id: 'c_seed_001',
    title: 'Brand Identity Design — Meera Iyer',
    client: 'meera.iyer@gmail.com',
    amount: '45000',
    status: 'signed',
    content: '<h2>Brand Identity Design Agreement</h2><p>This agreement covers the complete brand identity design including logo, color palette, typography, and brand guidelines.</p>',
    variables: { client_name: 'Meera Iyer', freelancer_name: 'Yashi Ghosh', amount: '45,000', scope_of_work: 'Brand Identity Design' },
    createdAt: daysAgo(42),
    updatedAt: daysAgo(30),
    sentAt:    daysAgo(35),
    signedAt:  daysAgo(30),
  },
  {
    id: 'c_seed_002',
    title: 'Website Redesign — Karan Mehta',
    client: 'karan.mehta@startup.in',
    amount: '80000',
    status: 'signed',
    content: '<h2>Website Redesign Contract</h2><p>Full redesign of corporate website including 10 pages, responsive design, and CMS integration.</p>',
    variables: { client_name: 'Karan Mehta', freelancer_name: 'Yashi Ghosh', amount: '80,000', scope_of_work: 'Website Redesign' },
    createdAt: daysAgo(60),
    updatedAt: daysAgo(45),
    sentAt:    daysAgo(55),
    signedAt:  daysAgo(45),
  },
  {
    id: 'c_seed_003',
    title: 'SEO & Content Package — Priya Sharma',
    client: 'priya@priyasharma.co',
    amount: '32000',
    status: 'sent',
    content: '<h2>SEO & Content Agreement</h2><p>3-month SEO optimization package including keyword research, on-page SEO, and 8 blog posts per month.</p>',
    variables: { client_name: 'Priya Sharma', freelancer_name: 'Yashi Ghosh', amount: '32,000', scope_of_work: 'SEO & Content Strategy' },
    createdAt: daysAgo(10),
    updatedAt: daysAgo(5),
    sentAt:    daysAgo(5),
  },
  {
    id: 'c_seed_004',
    title: 'Mobile App UI Design — Rahul Verma',
    client: 'rahul@techstartup.io',
    amount: '65000',
    status: 'viewed',
    content: '<h2>Mobile App UI Design Contract</h2><p>Complete UI/UX design for iOS and Android application including wireframes, prototypes, and final design files.</p>',
    variables: { client_name: 'Rahul Verma', freelancer_name: 'Yashi Ghosh', amount: '65,000', scope_of_work: 'Mobile App UI/UX Design' },
    createdAt: daysAgo(8),
    updatedAt: daysAgo(3),
    sentAt:    daysAgo(6),
    viewedAt:  daysAgo(3),
  },
  {
    id: 'c_seed_005',
    title: 'Social Media Strategy — Ananya Patel',
    client: 'ananya@boutique.in',
    amount: '28000',
    status: 'draft',
    content: '<h2>Social Media Strategy Agreement</h2><p>6-month social media management and content strategy for Instagram, LinkedIn, and Twitter.</p>',
    variables: { client_name: 'Ananya Patel', freelancer_name: 'Yashi Ghosh', amount: '28,000', scope_of_work: 'Social Media Strategy' },
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: 'c_seed_006',
    title: 'Logo Design — Sneha Kapoor',
    client: 'sneha@kapoorstudios.com',
    amount: '18000',
    status: 'signed',
    content: '<h2>Logo Design Agreement</h2><p>Primary logo design with 3 concept variations, revisions, and final delivery in all required formats.</p>',
    variables: { client_name: 'Sneha Kapoor', freelancer_name: 'Yashi Ghosh', amount: '18,000', scope_of_work: 'Logo Design' },
    createdAt: monthsAgo(3),
    updatedAt: monthsAgo(2),
    sentAt:    monthsAgo(3),
    signedAt:  monthsAgo(2),
  },
  {
    id: 'c_seed_007',
    title: 'UX Audit — TechFlow India',
    client: 'contact@techflow.in',
    amount: '40000',
    status: 'signed',
    content: '<h2>UX Audit Contract</h2><p>Comprehensive UX audit of existing web application with heatmap analysis, user testing, and actionable recommendations report.</p>',
    variables: { client_name: 'TechFlow India', freelancer_name: 'Yashi Ghosh', amount: '40,000', scope_of_work: 'UX Audit & Report' },
    createdAt: monthsAgo(4),
    updatedAt: monthsAgo(3),
    sentAt:    monthsAgo(4),
    signedAt:  monthsAgo(3),
  },
  {
    id: 'c_seed_008',
    title: 'Pitch Deck Design — Arjun Nair',
    client: 'arjun@fundmystartup.co',
    amount: '22000',
    status: 'expired',
    content: '<h2>Pitch Deck Design Contract</h2><p>20-slide investor pitch deck design with custom illustrations and data visualizations.</p>',
    variables: { client_name: 'Arjun Nair', freelancer_name: 'Yashi Ghosh', amount: '22,000', scope_of_work: 'Pitch Deck Design' },
    createdAt: monthsAgo(5),
    updatedAt: monthsAgo(4),
    sentAt:    monthsAgo(5),
  },
];

export const YASHI_SEED_CLIENTS = [
  { id: 'cl_seed_001', name: 'Meera Iyer',     email: 'meera.iyer@gmail.com',      company: 'Iyer Designs',        createdAt: daysAgo(42) },
  { id: 'cl_seed_002', name: 'Karan Mehta',    email: 'karan.mehta@startup.in',    company: 'Mehta Startup Labs',  createdAt: daysAgo(60) },
  { id: 'cl_seed_003', name: 'Priya Sharma',   email: 'priya@priyasharma.co',      company: 'Priya Sharma Co.',    createdAt: daysAgo(10) },
  { id: 'cl_seed_004', name: 'Rahul Verma',    email: 'rahul@techstartup.io',      company: 'TechStartup IO',      createdAt: daysAgo(8)  },
  { id: 'cl_seed_005', name: 'Ananya Patel',   email: 'ananya@boutique.in',        company: 'Ananya Boutique',     createdAt: daysAgo(2)  },
  { id: 'cl_seed_006', name: 'Sneha Kapoor',   email: 'sneha@kapoorstudios.com',   company: 'Kapoor Studios',      createdAt: monthsAgo(3) },
  { id: 'cl_seed_007', name: 'TechFlow India', email: 'contact@techflow.in',       company: 'TechFlow India Pvt.', createdAt: monthsAgo(4) },
  { id: 'cl_seed_008', name: 'Arjun Nair',     email: 'arjun@fundmystartup.co',    company: 'FundMyStartup',       createdAt: monthsAgo(5) },
];

export const YASHI_SEED_ACTIVITY = [
  { label: 'Contract signed by Meera Iyer',   action: 'signed', sub: 'Brand Identity Design', timestamp: daysAgo(30) },
  { label: 'Contract viewed by Rahul Verma',  action: 'viewed', sub: 'Mobile App UI Design',   timestamp: daysAgo(3)  },
  { label: 'Contract sent to Rahul Verma',    action: 'sent',   sub: 'Mobile App UI Design',   timestamp: daysAgo(6)  },
  { label: 'Contract sent to Priya Sharma',   action: 'sent',   sub: 'SEO & Content Package',  timestamp: daysAgo(5)  },
  { label: 'Created "Social Media Strategy"', action: 'draft',  sub: 'Ananya Patel',           timestamp: daysAgo(2)  },
  { label: 'Created "SEO & Content Package"', action: 'draft',  sub: 'Priya Sharma',           timestamp: daysAgo(10) },
  { label: 'Contract signed by Karan Mehta',  action: 'signed', sub: 'Website Redesign',       timestamp: daysAgo(45) },
];

/** The email that gets demo data — matches the yashi account */
export const DEMO_EMAIL = 'yashi@contractly.in';
