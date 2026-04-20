// ===== API CLIENT =====
// Local: http://localhost:5000/api  |  Vercel: /api (same domain)
const API = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/api';

function getToken() { return localStorage.getItem('cvcraft_token'); }
function setToken(t) { localStorage.setItem('cvcraft_token', t); }
function clearToken() { localStorage.removeItem('cvcraft_token'); }

async function apiCall(method, endpoint, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token   = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API + endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ---- Auth ----
async function apiSignup(name, email, password) {
  const data = await apiCall('POST', '/auth/signup', { name, email, password });
  setToken(data.token);
  return data.user;
}

async function apiLogin(email, password) {
  const data = await apiCall('POST', '/auth/login', { email, password });
  setToken(data.token);
  return data.user;
}

// ---- Resumes ----
async function apiGetResumes() {
  return apiCall('GET', '/resumes');
}

async function apiSaveResume(resumeId, template, color, data) {
  return apiCall('POST', '/resumes', { resumeId, template, color, data });
}

async function apiDeleteResume(resumeId) {
  return apiCall('DELETE', `/resumes/${resumeId}`);
}

// ---- AI ----
async function apiGenerateSummary(name, title, skills, experience) {
  const skillNames = (skills || []).map(s => s.name).filter(Boolean).join(', ');
  return apiCall('POST', '/ai/summary', { name, title, skills: skillNames, experience });
}

async function apiImproveBullet(bullet, title) {
  return apiCall('POST', '/ai/improve-bullet', { bullet, title });
}
