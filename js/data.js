// ===== DEFAULT STATE =====
const TEMPLATES = [
  { id: 'sidebar',    name: 'Sidebar' },
  { id: 'classic',    name: 'Classic' },
  { id: 'minimal',    name: 'Minimal' },
  { id: 'modern',     name: 'Modern' },
  { id: 'executive',  name: 'Executive' },
  { id: 'creative',   name: 'Creative' },
];

const COLORS = [
  { name: 'Navy',     hex: '#1a365d' },
  { name: 'Forest',   hex: '#1a4731' },
  { name: 'Crimson',  hex: '#7b1c1c' },
  { name: 'Slate',    hex: '#2d3748' },
  { name: 'Indigo',   hex: '#312e81' },
  { name: 'Teal',     hex: '#0f4c5c' },
  { name: 'Plum',     hex: '#4a1942' },
  { name: 'Copper',   hex: '#7c3d12' },
  { name: 'Steel',    hex: '#374151' },
  { name: 'Ruby',     hex: '#881337' },
  { name: 'Olive',    hex: '#3d4a1a' },
  { name: 'Midnight', hex: '#0f172a' },
];

const TABS = ['Personal', 'Summary', 'Experience', 'Education', 'Skills', 'Languages', 'Certifications'];

const LANG_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

const DEFAULT_DATA = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  summary: '',
  experience: [
    {
      id: 1, role: '', company: '',
      start: '', end: '', location: '',
      desc: ''
    },
    {
      id: 2, role: '', company: '',
      start: '', end: '', location: '',
      desc: ''
    },
  ],
  education: [
    {
      id: 1, degree: '',
      school: '',
      year: '', grade: ''
    },
  ],
  skills: [
    { id: 1, name: '',    level: 5 },
    { id: 2, name: '',      level: 5 },
    { id: 3, name: '',        level: 4 },
    { id: 4, name: '',     level: 5 },
    { id: 5, name: '',         level: 3 },
  ],
  languages: [
    { id: 1, name: '',  level: '' },
    { id: 2, name: '',  level: '' },
  ],
  certs: [
    { id: 1, name: '', year: '' },
    { id: 2, name: '',          year: '' },
  ],
};

let APP = {
  template: 'sidebar',
  color: '#1a365d',
  tab: 0,
  data: JSON.parse(JSON.stringify(DEFAULT_DATA)),
  resumeId: null,
};
