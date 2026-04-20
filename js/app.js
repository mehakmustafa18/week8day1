// ===== THEME =====
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('cvcraft_theme', isLight ? 'light' : 'dark');
  updateThemeIcons(isLight);
}

function updateThemeIcons(isLight) {
  const icon = isLight ? '☀️' : '🌙';
  document.querySelectorAll('.theme-toggle').forEach(btn => btn.textContent = icon);
}

function applyTheme() {
  const saved = localStorage.getItem('cvcraft_theme');
  const isLight = saved === 'light';
  if (isLight) document.documentElement.classList.add('light');
  updateThemeIcons(isLight);
}

// ===== PAGE ROUTER =====
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');
  if (name === 'dashboard') renderDashboard();
  if (name === 'builder')   render();
  document.body.style.overflow = name === 'builder' ? 'hidden' : 'auto';
}

// ===== AUTH =====
let CURRENT_USER = null;

async function doSignup() {
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass  = document.getElementById('signup-pass').value;
  const err   = document.getElementById('signup-error');
  const btn   = document.querySelector('#page-signup .btn-auth');

  if (!name || !email || !pass) { showAuthError(err, 'Please fill in all fields.'); return; }
  if (pass.length < 6)          { showAuthError(err, 'Password must be at least 6 characters.'); return; }

  setLoading(btn, true);
  try {
    CURRENT_USER = await apiSignup(name, email, pass);
    err.style.display = 'none';
    showPage('dashboard');
  } catch (e) {
    showAuthError(err, e.message);
  } finally {
    setLoading(btn, false);
  }
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const err   = document.getElementById('login-error');
  const btn   = document.querySelector('#page-login .btn-auth');

  if (!email || !pass) { showAuthError(err, 'Please enter your email and password.'); return; }

  setLoading(btn, true);
  try {
    CURRENT_USER = await apiLogin(email, pass);
    err.style.display = 'none';
    showPage('dashboard');
  } catch (e) {
    showAuthError(err, e.message);
  } finally {
    setLoading(btn, false);
  }
}

function doGuestLogin() {
  CURRENT_USER = { id: 'guest', name: 'Guest', email: '' };
  showPage('dashboard');
}

function doLogout() {
  CURRENT_USER = null;
  clearToken();
  showPage('landing');
}

function showAuthError(el, msg) { el.textContent = msg; el.style.display = 'block'; }
function setLoading(btn, on) {
  if (!btn) return;
  btn.disabled    = on;
  btn.textContent = on ? 'Please wait...' : btn.dataset.label || btn.textContent;
}

async function restoreSession() {
  const token = getToken();
  if (!token) return false;
  try {
    // Verify token by fetching resumes (lightweight check)
    const resumes = await apiGetResumes();
    // Decode name from token payload (base64)
    const payload = JSON.parse(atob(token.split('.')[1]));
    CURRENT_USER  = { id: payload.id, name: 'User', email: '' };
    return true;
  } catch {
    clearToken();
    return false;
  }
}

// ===== DASHBOARD =====
let dashResumes = [];

function setDashTab(name) {
  document.querySelectorAll('.dash-nav-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('onclick').includes(`'${name}'`));
  });
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('dash-tab-' + name).classList.add('active');
}

async function renderDashboard() {
  if (!CURRENT_USER) return;
  const nameEl   = document.getElementById('dashUserName');
  const avatarEl = document.getElementById('dashAvatar');
  if (nameEl)   nameEl.textContent   = CURRENT_USER.name;
  if (avatarEl) avatarEl.textContent = (CURRENT_USER.name || 'G')[0].toUpperCase();

  if (CURRENT_USER.id === 'guest') {
    dashResumes = JSON.parse(sessionStorage.getItem('guest_resumes') || '[]');
  } else {
    try {
      dashResumes = await apiGetResumes();
    } catch {
      dashResumes = [];
    }
  }
  renderResumeCards();
}

function renderResumeCards() {
  const container = document.getElementById('resumeCards');
  if (!container) return;

  let html = dashResumes.map(r => `
    <div class="resume-card">
      <div class="rc-preview">
        <div class="rc-preview-inner" id="rc-prev-${r.resumeId}"></div>
      </div>
      <div class="rc-info">
        <div class="rc-name">${esc(r.data.name || 'Untitled Resume')}</div>
        <div class="rc-meta">${r.template} · ${r.updatedAt || 'Just now'}</div>
      </div>
      <div class="rc-actions">
        <button class="rc-btn" onclick="editResume('${r.resumeId}')">Edit</button>
        <button class="rc-btn danger" onclick="deleteResume('${r.resumeId}')">Delete</button>
      </div>
    </div>`).join('');

  html += `
    <div class="new-resume-card" onclick="openBuilder()">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      <span>New Resume</span>
    </div>`;

  container.innerHTML = html;

  dashResumes.forEach(r => {
    const el = document.getElementById('rc-prev-' + r.resumeId);
    if (el) el.innerHTML = renderTemplate(r.template, r.data, r.color);
  });
}

function openBuilder() {
  APP.template = 'sidebar';
  APP.color    = '#1a365d';
  APP.tab      = 0;
  APP.data     = JSON.parse(JSON.stringify(DEFAULT_DATA));
  APP.resumeId = uid();
  showPage('builder');
}

function openBuilderWithTemplate(tpl) {
  APP.template = tpl;
  APP.color    = '#1a365d';
  APP.tab      = 0;
  APP.data     = JSON.parse(JSON.stringify(DEFAULT_DATA));
  APP.resumeId = uid();
  showPage('builder');
}

function editResume(id) {
  const r = dashResumes.find(r => r.resumeId === id);
  if (!r) return;
  APP.template = r.template;
  APP.color    = r.color;
  APP.tab      = 0;
  APP.data     = JSON.parse(JSON.stringify(r.data));
  APP.resumeId = r.resumeId;
  showPage('builder');
}

async function deleteResume(id) {
  if (!confirm('Delete this resume?')) return;
  try {
    if (CURRENT_USER.id === 'guest') {
      dashResumes = dashResumes.filter(r => r.resumeId !== id);
      sessionStorage.setItem('guest_resumes', JSON.stringify(dashResumes));
    } else {
      await apiDeleteResume(id);
      dashResumes = dashResumes.filter(r => r.resumeId !== id);
    }
    renderResumeCards();
  } catch (e) {
    alert('Could not delete: ' + e.message);
  }
}

// Auto-save with debounce
let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCurrentResume, 1200);
}

async function saveCurrentResume() {
  if (!CURRENT_USER || !APP.resumeId) return;
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  try {
    if (CURRENT_USER.id === 'guest') {
      const idx = dashResumes.findIndex(r => r.resumeId === APP.resumeId);
      const entry = { resumeId: APP.resumeId, template: APP.template, color: APP.color, data: APP.data, updatedAt: now };
      if (idx > -1) dashResumes[idx] = entry; else dashResumes.push(entry);
      sessionStorage.setItem('guest_resumes', JSON.stringify(dashResumes));
    } else {
      await apiSaveResume(APP.resumeId, APP.template, APP.color, APP.data);
    }
  } catch (e) {
    console.warn('Auto-save failed:', e.message);
  }
}

// ===== AI FEATURES =====
async function generateAISummary() {
  const btn = document.getElementById('ai-summary-btn');
  const out = document.getElementById('ai-summary-out');
  if (!btn || !out) return;

  btn.disabled    = true;
  btn.textContent = '✨ Generating...';
  out.style.display = 'none';

  try {
    const result = await apiGenerateSummary(
      APP.data.name,
      APP.data.title,
      APP.data.skills,
      APP.data.experience
    );
    APP.data.summary = result.summary;
    renderPreview();
    scheduleSave();

    // Update textarea
    const ta = document.querySelector('#editorForm textarea.fi');
    if (ta) ta.value = result.summary;

    out.textContent   = '✓ Summary generated!';
    out.style.display = 'block';
    out.style.color   = '#4ade80';
  } catch (e) {
    out.textContent   = 'Error: ' + e.message;
    out.style.display = 'block';
    out.style.color   = '#e85d5d';
  } finally {
    btn.disabled    = false;
    btn.textContent = '✨ Generate with AI';
  }
}

async function improveBullet(idx) {
  const exp = APP.data.experience[idx];
  if (!exp || !exp.desc.trim()) { alert('Please write something in the description first.'); return; }

  const btn = document.getElementById(`improve-btn-${idx}`);
  if (btn) { btn.disabled = true; btn.textContent = '...'; }

  try {
    const result = await apiImproveBullet(exp.desc, exp.role);
    APP.data.experience[idx].desc = result.improved;
    renderForm();
    renderPreview();
    scheduleSave();
  } catch (e) {
    alert('Could not improve: ' + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '✨ AI Improve'; }
  }
}

// ===== BUILDER =====
function uid() { return Date.now() + Math.random().toString(36).slice(2, 6); }

function renderTemplateGrid() {
  const grid = document.getElementById('templateGrid');
  if (!grid) return;
  grid.innerHTML = TEMPLATES.map(t => `
    <div>
      <div class="tpl-thumb${APP.template === t.id ? ' active' : ''}" onclick="setTemplate('${t.id}')" title="${t.name}">
        <canvas id="thumb_${t.id}" width="60" height="85"></canvas>
      </div>
      <div class="tpl-name">${t.name}</div>
    </div>
  `).join('');
  TEMPLATES.forEach(t => {
    const c = document.getElementById('thumb_' + t.id);
    if (c) drawThumbnail(c, t.id);
  });
}

function renderColorDots() {
  const el = document.getElementById('colorDots');
  if (!el) return;
  el.innerHTML = COLORS.map(c => `
    <div class="color-dot${APP.color === c.hex ? ' active' : ''}"
         style="background:${c.hex}"
         onclick="setColor('${c.hex}')"
         title="${c.name}"></div>
  `).join('');
}

function renderTabs() {
  const el = document.getElementById('sectionTabs');
  if (!el) return;
  el.innerHTML = TABS.map((t, i) => `
    <div class="stab${APP.tab === i ? ' active' : ''}" onclick="setTab(${i})">${t}</div>
  `).join('');
}

function renderForm() {
  const el = document.getElementById('editorForm');
  if (!el) return;
  el.innerHTML = buildForm();
}

function field(label, key, val, type = 'text', ph = '') {
  if (type === 'textarea') {
    return `<div class="fg"><label class="fl">${label}</label>
      <textarea class="fi" rows="4" placeholder="${ph}" onchange="sf('${key}',this.value)">${esc(val)}</textarea></div>`;
  }
  return `<div class="fg"><label class="fl">${label}</label>
    <input class="fi" type="${type}" value="${esc(val)}" placeholder="${ph}" oninput="sf('${key}',this.value)"></div>`;
}

function buildForm() {
  const d = APP.data;
  switch (APP.tab) {
    case 0: return `
      <div class="section-title">Contact Information</div>
      ${field('Full Name', 'name', d.name, 'text', 'e.g. John Smith')}
      ${field('Professional Title', 'title', d.title, 'text', 'e.g. Software Engineer')}
      <div class="g2">${field('Email', 'email', d.email, 'email')}${field('Phone', 'phone', d.phone, 'text')}</div>
      ${field('Location', 'location', d.location, 'text', 'City, Country')}
      <div class="g2">${field('Website', 'website', d.website, 'text')}${field('LinkedIn', 'linkedin', d.linkedin, 'text')}</div>`;

    case 1: return `
      <div class="section-title">Professional Summary</div>
      <button class="btn-ai" id="ai-summary-btn" onclick="generateAISummary()">✨ Generate with AI</button>
      <div id="ai-summary-out" style="display:none;font-size:11px;margin-bottom:8px;padding:6px 10px;border-radius:5px;background:rgba(74,222,128,0.08)"></div>
      ${field('', 'summary', d.summary, 'textarea', 'Write a summary or click Generate with AI above...')}`;

    case 2: return `
      <div class="section-title">Work Experience</div>
      ${d.experience.map((e, i) => `
        <div class="entry-card">
          <div class="entry-head">
            <span class="entry-head-title">${esc(e.role) || 'New Position'}</span>
            <button class="btn-rm" onclick="removeEntry('experience',${i})">×</button>
          </div>
          <div class="g2">${field('Job Title', `experience.${i}.role`, e.role, 'text', 'e.g. Software Engineer')}${field('Company', `experience.${i}.company`, e.company, 'text', 'e.g. Google')}</div>
          <div class="g3">${field('Start', `experience.${i}.start`, e.start, 'text', 'Jan 2020')}${field('End', `experience.${i}.end`, e.end, 'text', 'Present')}${field('Location', `experience.${i}.location`, e.location, 'text', 'City, ST')}</div>
          ${field('Description', `experience.${i}.desc`, e.desc, 'textarea', '• Key achievement\n• Another responsibility...')}
          <button class="btn-ai" id="improve-btn-${i}" onclick="improveBullet(${i})" style="margin-top:4px">✨ AI Improve Description</button>
        </div>`).join('')}
      <button class="btn-add" onclick="addEntry('experience')">+ Add Experience</button>`;

    case 3: return `
      <div class="section-title">Education</div>
      ${d.education.map((e, i) => `
        <div class="entry-card">
          <div class="entry-head"><span class="entry-head-title">${esc(e.degree) || 'New Degree'}</span>
            <button class="btn-rm" onclick="removeEntry('education',${i})">×</button></div>
          ${field('Degree / Major', `education.${i}.degree`, e.degree, 'text', 'e.g. B.S. Computer Science')}
          <div class="g2">${field('University', `education.${i}.school`, e.school, 'text', 'School Name')}${field('Years', `education.${i}.year`, e.year, 'text', '2018 – 2022')}</div>
          ${field('Grade / Honors (optional)', `education.${i}.grade`, e.grade, 'text', 'e.g. 3.8 GPA')}
        </div>`).join('')}
      <button class="btn-add" onclick="addEntry('education')">+ Add Education</button>`;

    case 4: return `
      <div class="section-title">Skills</div>
      ${d.skills.map((s, i) => `
        <div class="skill-row">
          <input class="fi" style="flex:1;min-width:0" placeholder="Skill name" value="${esc(s.name)}" oninput="sf('skills.${i}.name',this.value)">
          <div class="dots">${[1,2,3,4,5].map(n => `<div class="dot${s.level >= n ? ' on' : ''}" onclick="sf('skills.${i}.level',${n})" title="${n}/5"></div>`).join('')}</div>
          <button class="btn-rm" onclick="removeEntry('skills',${i})">×</button>
        </div>`).join('')}
      <button class="btn-add" onclick="addEntry('skills')">+ Add Skill</button>`;

    case 5: return `
      <div class="section-title">Languages</div>
      ${d.languages.map((l, i) => `
        <div class="skill-row">
          <input class="fi" style="flex:1;min-width:0" placeholder="Language" value="${esc(l.name)}" oninput="sf('languages.${i}.name',this.value)">
          <select class="fi" style="width:120px;flex-shrink:0" onchange="sf('languages.${i}.level',this.value)">
            ${LANG_LEVELS.map(lv => `<option${l.level === lv ? ' selected' : ''}>${lv}</option>`).join('')}
          </select>
          <button class="btn-rm" onclick="removeEntry('languages',${i})">×</button>
        </div>`).join('')}
      <button class="btn-add" onclick="addEntry('languages')">+ Add Language</button>`;

    case 6: return `
      <div class="section-title">Certifications &amp; Awards</div>
      ${d.certs.map((c, i) => `
        <div class="skill-row">
          <input class="fi" style="flex:1;min-width:0" placeholder="Certificate or award name" value="${esc(c.name)}" oninput="sf('certs.${i}.name',this.value)">
          <input class="fi" style="width:65px;flex-shrink:0" placeholder="Year" value="${esc(c.year)}" oninput="sf('certs.${i}.year',this.value)">
          <button class="btn-rm" onclick="removeEntry('certs',${i})">×</button>
        </div>`).join('')}
      <button class="btn-add" onclick="addEntry('certs')">+ Add Certification</button>`;
  }
}

function renderPreview() {
  const sheet = document.getElementById('resumeSheet');
  if (!sheet) return;
  sheet.innerHTML = renderTemplate(APP.template, APP.data, APP.color);
}

function render() {
  renderTemplateGrid();
  renderColorDots();
  renderTabs();
  renderForm();
  renderPreview();
}

function setTemplate(id) { APP.template = id; render(); scheduleSave(); }
function setColor(hex)    { APP.color = hex; renderColorDots(); renderPreview(); scheduleSave(); }
function setTab(i)        { APP.tab = i; renderTabs(); renderForm(); }

function sf(path, val) {
  const parts = path.split('.');
  let obj = APP.data;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = isNaN(parts[i]) ? parts[i] : parseInt(parts[i]);
    obj = obj[k];
  }
  const last = parts[parts.length - 1];
  const k    = isNaN(last) ? last : parseInt(last);
  obj[k]     = (last === 'level') ? Number(val) : val;
  renderPreview();
  scheduleSave();
}

function addEntry(section) {
  const defaults = {
    experience: { id: uid(), role: '', company: '', start: '', end: 'Present', location: '', desc: '' },
    education:  { id: uid(), degree: '', school: '', year: '', grade: '' },
    skills:     { id: uid(), name: '', level: 3 },
    languages:  { id: uid(), name: '', level: 'Intermediate' },
    certs:      { id: uid(), name: '', year: '' },
  };
  APP.data[section].push(defaults[section]);
  renderTabs(); renderForm(); renderPreview();
}

function removeEntry(section, idx) {
  APP.data[section].splice(idx, 1);
  renderTabs(); renderForm(); renderPreview();
}

function toggleEditor() {
  const ep = document.getElementById('editorPanel');
  ep.style.display = ep.style.display === 'none' ? '' : 'none';
  document.querySelector('.app-layout').style.gridTemplateColumns =
    ep.style.display === 'none' ? '1fr' : '320px 1fr';
}

function exportPDF() { window.print(); }

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', async () => {
  applyTheme();
  const ok = await restoreSession();
  showPage(ok ? 'dashboard' : 'landing');
});
