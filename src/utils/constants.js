export const CONTRACT_STATUS = {
  DRAFT:   'draft',
  SENT:    'sent',
  VIEWED:  'viewed',
  SIGNED:  'signed',
  EXPIRED: 'expired',
  RENEWED: 'renewed',
};

export const STATUS_LABELS = {
  draft:   'Draft',
  sent:    'Sent',
  viewed:  'Viewed',
  signed:  'Signed',
  expired: 'Expired',
  renewed: 'Renewed',
};

export const ROUTES = {
  LOGIN:           '/login',
  REGISTER:        '/register',
  DASHBOARD:       '/dashboard',
  CONTRACTS:       '/contracts',
  CONTRACT_NEW:    '/contracts/new',
  CONTRACT_EDIT:   (id) => `/contracts/${id}/edit`,
  CONTRACT_VIEW:   (id) => `/contracts/${id}`,
  SIGN:            (token) => `/sign/${token}`,
  CLIENTS:         '/clients',
  TEMPLATES:       '/templates',
  CLAUSES:         '/clauses',
  SETTINGS:        '/settings',
};

export const NAV_ITEMS = [
  { label: 'Dashboard',     path: '/dashboard',  icon: 'LayoutDashboard' },
  { label: 'Contracts',     path: '/contracts',  icon: 'FileText' },
  { label: 'Templates',     path: '/templates',  icon: 'Copy' },
  { label: 'Clause Library',path: '/clauses',    icon: 'BookOpen' },
  { label: 'Clients',       path: '/clients',    icon: 'Users' },
  { label: 'Settings',      path: '/settings',   icon: 'Settings' },
];

export const PLANS = {
  FREELANCER: 'freelancer',
  AGENCY:     'agency',
};

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];
