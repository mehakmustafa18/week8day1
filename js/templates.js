// ===== TEMPLATE RENDERERS =====

function esc(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function contactIcon(type) {
  const icons = {
    email: `<svg width="11" height="11" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    phone: `<svg width="11" height="11" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>`,
    loc:   `<svg width="11" height="11" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    web:   `<svg width="11" height="11" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    li:    `<svg width="11" height="11" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
  };
  return icons[type] || '';
}

function buildContacts(d, cls) {
  const items = [];
  if (d.email)    items.push(`<span class="${cls}">${contactIcon('email')} ${esc(d.email)}</span>`);
  if (d.phone)    items.push(`<span class="${cls}">${contactIcon('phone')} ${esc(d.phone)}</span>`);
  if (d.location) items.push(`<span class="${cls}">${contactIcon('loc')} ${esc(d.location)}</span>`);
  if (d.website)  items.push(`<span class="${cls}">${contactIcon('web')} ${esc(d.website)}</span>`);
  if (d.linkedin) items.push(`<span class="${cls}">${contactIcon('li')} ${esc(d.linkedin)}</span>`);
  return items.join('');
}

function formatDesc(text) {
  if (!text || !text.trim()) return '';
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.some(l => l.trim().startsWith('•') || l.trim().startsWith('-'))) {
    return '<ul>' + lines.map(l => `<li>${esc(l.replace(/^[•\-]\s*/, ''))}</li>`).join('') + '</ul>';
  }
  return lines.map(l => `<p style="margin-bottom:3px">${esc(l)}</p>`).join('');
}

function pct(level) { return Math.round((level / 5) * 100); }

// ============================================================
// TEMPLATE 1: SIDEBAR
// ============================================================
function renderSidebar(d, color) {
  const exp = d.experience.map(e => `
    <div class="exp-item">
      <div class="exp-role">${esc(e.role)}</div>
      <div class="exp-co">${esc(e.company)}</div>
      <div class="exp-meta"><span>${esc(e.start)} – ${esc(e.end)}</span><span>${esc(e.location)}</span></div>
      <div class="exp-desc">${formatDesc(e.desc)}</div>
    </div>`).join('');

  const edu = d.education.map(e => `
    <div class="edu-item">
      <div class="edu-deg">${esc(e.degree)}</div>
      <div class="edu-sch">${esc(e.school)}</div>
      <div class="edu-meta">${esc(e.year)}${e.grade ? ' · ' + esc(e.grade) : ''}</div>
    </div>`).join('');

  const skills = d.skills.map(s => `
    <div class="skill-item"><div class="skill-name">${esc(s.name)}</div>
    <div class="skill-bar"><div class="skill-fill" style="width:${pct(s.level)}%"></div></div></div>`).join('');

  const langs = d.languages.map(l => `
    <div class="lang-row"><span class="lang-name">${esc(l.name)}</span><span class="lang-badge">${esc(l.level)}</span></div>`).join('');

  const certs = d.certs.map(c => `
    <div class="cert-item"><span class="cert-name">${esc(c.name)}</span><span class="cert-yr">${esc(c.year)}</span></div>`).join('');

  return `
  <div class="tpl-sidebar" style="--rc:${color}">
    <div class="rs-header">
      <div class="rs-name">${esc(d.name)}</div>
      <div class="rs-role">${esc(d.title)}</div>
      <div class="rs-contacts">${buildContacts(d, 'rs-ci')}</div>
    </div>
    <div class="rs-body">
      <div class="rs-left">
        ${skills ? `<div class="rs-sec"><div class="rs-slabel">Skills</div>${skills}</div>` : ''}
        ${langs  ? `<div class="rs-sec"><div class="rs-slabel">Languages</div>${langs}</div>` : ''}
        ${certs  ? `<div class="rs-sec"><div class="rs-slabel">Certifications</div>${certs}</div>` : ''}
      </div>
      <div class="rs-right">
        ${d.summary ? `<div class="rs-sec"><div class="rs-slabel">Profile</div><div class="summary-text">${esc(d.summary)}</div></div>` : ''}
        ${exp       ? `<div class="rs-sec"><div class="rs-slabel">Experience</div>${exp}</div>` : ''}
        ${edu       ? `<div class="rs-sec"><div class="rs-slabel">Education</div>${edu}</div>` : ''}
      </div>
    </div>
  </div>`;
}

// ============================================================
// TEMPLATE 2: CLASSIC
// ============================================================
function renderClassic(d, color) {
  const exp = d.experience.map(e => `
    <div class="exp-item">
      <div class="exp-row">
        <div class="exp-role">${esc(e.role)}</div>
        <div class="exp-dates">${esc(e.start)} – ${esc(e.end)}</div>
      </div>
      <div class="exp-co">${esc(e.company)}${e.location ? ' · ' + esc(e.location) : ''}</div>
      <div class="exp-desc">${formatDesc(e.desc)}</div>
    </div>`).join('');

  const edu = d.education.map(e => `
    <div class="edu-item">
      <div class="edu-left">
        <div class="edu-deg">${esc(e.degree)}</div>
        <div class="edu-sch">${esc(e.school)}</div>
        ${e.grade ? `<div class="edu-meta">${esc(e.grade)}</div>` : ''}
      </div>
      <div class="edu-meta">${esc(e.year)}</div>
    </div>`).join('');

  const skillTags = d.skills.map(s => `<div class="skill-tag">${esc(s.name)}</div>`).join('');
  const langChips = d.languages.map(l => `<span class="lang-chip">${esc(l.name)} · ${esc(l.level)}</span>`).join('');
  const certs = d.certs.map(c => `<div class="cert-item"><span class="cert-name">${esc(c.name)}</span><span>${esc(c.year)}</span></div>`).join('');

  return `
  <div class="tpl-classic" style="--rc:${color}">
    <div class="rs-header">
      <div class="rs-name">${esc(d.name)}</div>
      <div class="rs-role">${esc(d.title)}</div>
      <div class="rs-contacts">${buildContacts(d, 'rs-ci')}</div>
    </div>
    <div class="rs-body">
      ${d.summary ? `<div class="rs-sec"><div class="rs-slabel">Professional Summary</div><p class="summary-text">${esc(d.summary)}</p></div>` : ''}
      ${exp       ? `<div class="rs-sec"><div class="rs-slabel">Work Experience</div>${exp}</div>` : ''}
      ${edu       ? `<div class="rs-sec"><div class="rs-slabel">Education</div>${edu}</div>` : ''}
      ${skillTags ? `<div class="rs-sec"><div class="rs-slabel">Skills</div><div class="skills-grid">${skillTags}</div></div>` : ''}
      ${langChips ? `<div class="rs-sec"><div class="rs-slabel">Languages</div><div class="langs-row">${langChips}</div></div>` : ''}
      ${certs     ? `<div class="rs-sec"><div class="rs-slabel">Certifications</div>${certs}</div>` : ''}
    </div>
  </div>`;
}

// ============================================================
// TEMPLATE 3: MINIMAL
// ============================================================
function renderMinimal(d, color) {
  const nameParts = (d.name || '').trim().split(' ');
  const first = nameParts.slice(0, -1).join(' ');
  const last  = nameParts.slice(-1)[0] || '';

  const exp = d.experience.map(e => `
    <div class="exp-item">
      <div class="exp-left">
        <div class="exp-dates">${esc(e.start)}<br>${esc(e.end)}</div>
        <div class="exp-loc">${esc(e.location)}</div>
      </div>
      <div class="exp-right">
        <div class="exp-role">${esc(e.role)}</div>
        <div class="exp-co">${esc(e.company)}</div>
        <div class="exp-desc">${formatDesc(e.desc)}</div>
      </div>
    </div>`).join('');

  const edu = d.education.map(e => `
    <div class="edu-item">
      <div class="edu-left"><div class="edu-dates">${esc(e.year)}</div></div>
      <div class="edu-right">
        <div class="edu-deg">${esc(e.degree)}</div>
        <div class="edu-sch">${esc(e.school)}</div>
        ${e.grade ? `<div class="edu-meta">${esc(e.grade)}</div>` : ''}
      </div>
    </div>`).join('');

  const pills = d.skills.map(s => `<span class="skill-pill">${esc(s.name)}</span>`).join('');
  const langs = d.languages.map(l => `<span class="lang-item"><span>${esc(l.name)}</span> <span style="color:#aaa">·</span> <span>${esc(l.level)}</span></span>`).join('');
  const certs = d.certs.map(c => `<div class="cert-item"><span class="cert-name">${esc(c.name)}</span><span class="cert-yr">${esc(c.year)}</span></div>`).join('');

  return `
  <div class="tpl-minimal" style="--rc:${color}">
    <div class="rs-header">
      <div class="rs-name">${esc(first)} <span>${esc(last)}</span></div>
      <div class="rs-role">${esc(d.title)}</div>
      <div class="rs-contacts">${buildContacts(d, 'rs-ci')}</div>
    </div>
    <div class="rs-divider"></div>
    <div class="rs-body">
      ${d.summary ? `<div class="rs-sec"><div class="rs-slabel">About</div><p class="summary-text">${esc(d.summary)}</p></div>` : ''}
      ${exp       ? `<div class="rs-sec"><div class="rs-slabel">Experience</div>${exp}</div>` : ''}
      ${edu       ? `<div class="rs-sec"><div class="rs-slabel">Education</div>${edu}</div>` : ''}
      ${pills     ? `<div class="rs-sec"><div class="rs-slabel">Skills</div><div class="skills-row">${pills}</div></div>` : ''}
      ${langs     ? `<div class="rs-sec"><div class="rs-slabel">Languages</div><div class="langs-row">${langs}</div></div>` : ''}
      ${certs     ? `<div class="rs-sec"><div class="rs-slabel">Certifications</div>${certs}</div>` : ''}
    </div>
  </div>`;
}

// ============================================================
// TEMPLATE 4: MODERN
// ============================================================
function renderModern(d, color) {
  const exp = d.experience.map(e => `
    <div class="exp-item">
      <div class="exp-header">
        <div class="exp-role">${esc(e.role)}</div>
        <span class="exp-dates">${esc(e.start)} – ${esc(e.end)}</span>
      </div>
      <div class="exp-co">${esc(e.company)}${e.location ? ' · ' + esc(e.location) : ''}</div>
      <div class="exp-desc">${formatDesc(e.desc)}</div>
    </div>`).join('');

  const edu = d.education.map(e => `
    <div class="edu-item">
      <div class="edu-deg">${esc(e.degree)}</div>
      <div class="edu-sch">${esc(e.school)}</div>
      <div class="edu-meta">${esc(e.year)}${e.grade ? ' · ' + esc(e.grade) : ''}</div>
    </div>`).join('');

  const skills = d.skills.map(s => `
    <div class="skill-item">
      <div class="skill-top"><span class="skill-name">${esc(s.name)}</span><span class="skill-pct">${pct(s.level)}%</span></div>
      <div class="skill-track"><div class="skill-fill" style="width:${pct(s.level)}%"></div></div>
    </div>`).join('');

  const langs = d.languages.map(l => {
    const lvMap = {Native:5, Fluent:4, Advanced:4, Intermediate:3, Basic:2};
    const n = lvMap[l.level] || 3;
    const ldots = [1,2,3,4,5].map(i => `<div class="ldot${i<=n?' on':''}"></div>`).join('');
    return `<div class="lang-item"><span class="lang-name">${esc(l.name)}</span><div class="lang-dots">${ldots}</div></div>`;
  }).join('');

  const certs = d.certs.map(c => `
    <div class="cert-item"><span style="font-weight:500;color:#2d3748">${esc(c.name)}</span><span style="font-size:10px;color:#718096">${esc(c.year)}</span></div>`).join('');

  return `
  <div class="tpl-modern" style="--rc:${color}">
    <div class="rs-header">
      <div class="rs-name">${esc(d.name)}</div>
      <div class="rs-role">${esc(d.title)}</div>
      <div class="rs-contacts">${buildContacts(d, 'rs-ci')}</div>
    </div>
    <div class="rs-body">
      <div class="rs-left">
        ${skills ? `<div class="rs-sec"><div class="rs-slabel">Skills</div>${skills}</div>` : ''}
        ${langs  ? `<div class="rs-sec"><div class="rs-slabel">Languages</div>${langs}</div>` : ''}
        ${certs  ? `<div class="rs-sec"><div class="rs-slabel">Certifications</div>${certs}</div>` : ''}
      </div>
      <div class="rs-right">
        ${d.summary ? `<div class="rs-sec"><div class="rs-slabel">Profile</div><p class="summary-text">${esc(d.summary)}</p></div>` : ''}
        ${exp       ? `<div class="rs-sec"><div class="rs-slabel">Experience</div>${exp}</div>` : ''}
        ${edu       ? `<div class="rs-sec"><div class="rs-slabel">Education</div>${edu}</div>` : ''}
      </div>
    </div>
  </div>`;
}

// ============================================================
// TEMPLATE 5: EXECUTIVE
// ============================================================
function renderExecutive(d, color) {
  const exp = d.experience.map(e => `
    <div class="exp-item">
      <div class="exp-role">${esc(e.role)}</div>
      <div class="exp-row">
        <div class="exp-co">${esc(e.company)}${e.location ? ' · ' + esc(e.location) : ''}</div>
        <div class="exp-dates">${esc(e.start)} – ${esc(e.end)}</div>
      </div>
      <div class="exp-desc">${formatDesc(e.desc)}</div>
    </div>`).join('');

  const edu = d.education.map(e => `
    <div class="edu-item">
      <div class="edu-deg">${esc(e.degree)}</div>
      <div class="edu-sch">${esc(e.school)}</div>
      <div class="edu-meta">${esc(e.year)}${e.grade ? ' · ' + esc(e.grade) : ''}</div>
    </div>`).join('');

  const skills = d.skills.map(s => `
    <div class="skill-item">
      <div class="skill-name">${esc(s.name)}</div>
      <div class="skill-bar"><div class="skill-fill" style="width:${pct(s.level)}%"></div></div>
    </div>`).join('');

  const langs = d.languages.map(l => `
    <div class="lang-item">
      <div class="lang-name">${esc(l.name)}</div>
      <div class="lang-level">${esc(l.level)}</div>
    </div>`).join('');

  const certs = d.certs.map(c => `
    <div class="cert-item"><span>${esc(c.name)}</span><span style="color:#aaa">${esc(c.year)}</span></div>`).join('');

  return `
  <div class="tpl-executive" style="--rc:${color}">
    <div class="rs-topbar"></div>
    <div class="rs-header">
      <div class="rs-header-inner">
        <div>
          <div class="rs-name">${esc(d.name)}</div>
          <div class="rs-role">${esc(d.title)}</div>
        </div>
        <div class="rs-contacts">${buildContacts(d, 'rs-ci')}</div>
      </div>
    </div>
    <div class="rs-body">
      <div class="rs-left">
        ${skills ? `<div class="rs-sec"><div class="rs-slabel">Core Skills</div>${skills}</div>` : ''}
        ${langs  ? `<div class="rs-sec"><div class="rs-slabel">Languages</div>${langs}</div>` : ''}
        ${certs  ? `<div class="rs-sec"><div class="rs-slabel">Certifications</div>${certs}</div>` : ''}
      </div>
      <div class="rs-right">
        ${d.summary ? `<div class="rs-sec"><div class="rs-slabel">Executive Summary</div><p class="summary-text">${esc(d.summary)}</p></div>` : ''}
        ${exp       ? `<div class="rs-sec"><div class="rs-slabel">Professional Experience</div>${exp}</div>` : ''}
        ${edu       ? `<div class="rs-sec"><div class="rs-slabel">Education</div>${edu}</div>` : ''}
      </div>
    </div>
  </div>`;
}

// ============================================================
// TEMPLATE 6: CREATIVE
// ============================================================
function renderCreative(d, color) {
  const exp = d.experience.map(e => `
    <div class="exp-item">
      <span class="exp-tag">${esc(e.start)} – ${esc(e.end)}</span>
      <div class="exp-role">${esc(e.role)}</div>
      <div class="exp-co">${esc(e.company)}${e.location ? ' · ' + esc(e.location) : ''}</div>
      <div class="exp-desc">${formatDesc(e.desc)}</div>
    </div>`).join('');

  const edu = d.education.map(e => `
    <div class="edu-item">
      <span class="edu-tag">${esc(e.year)}</span>
      <div class="edu-deg">${esc(e.degree)}</div>
      <div class="edu-sch">${esc(e.school)}</div>
      ${e.grade ? `<div class="edu-meta">${esc(e.grade)}</div>` : ''}
    </div>`).join('');

  const skills = d.skills.map(s => `
    <div class="skill-item">
      <div class="skill-top"><span class="skill-name">${esc(s.name)}</span></div>
      <div class="skill-track"><div class="skill-fill" style="width:${pct(s.level)}%"></div></div>
    </div>`).join('');

  const langs = d.languages.map(l => `
    <div class="lang-item">
      <span class="lang-name">${esc(l.name)}</span>
      <span class="lang-lv">${esc(l.level)}</span>
    </div>`).join('');

  const certs = d.certs.map(c => `
    <div class="cert-item"><span style="font-weight:600;color:#333">${esc(c.name)}</span><span style="color:#aaa">${esc(c.year)}</span></div>`).join('');

  return `
  <div class="tpl-creative" style="--rc:${color}">
    <div class="rs-header">
      <div>
        <div class="rs-name">${esc(d.name)}</div>
        <div class="rs-role">${esc(d.title)}</div>
        <div class="rs-contacts">${buildContacts(d, 'rs-ci')}</div>
      </div>
      <div class="rs-accent-box"></div>
    </div>
    <div class="rs-body">
      <div class="rs-left">
        ${skills ? `<div class="rs-sec"><div class="rs-slabel">Skills</div>${skills}</div>` : ''}
        ${langs  ? `<div class="rs-sec"><div class="rs-slabel">Languages</div>${langs}</div>` : ''}
        ${certs  ? `<div class="rs-sec"><div class="rs-slabel">Certifications</div>${certs}</div>` : ''}
      </div>
      <div class="rs-right">
        ${d.summary ? `<div class="rs-sec"><div class="rs-slabel">Profile</div><div class="summary-text">${esc(d.summary)}</div></div>` : ''}
        ${exp       ? `<div class="rs-sec"><div class="rs-slabel">Experience</div>${exp}</div>` : ''}
        ${edu       ? `<div class="rs-sec"><div class="rs-slabel">Education</div>${edu}</div>` : ''}
      </div>
    </div>
  </div>`;
}

// ============================================================
// ROUTER
// ============================================================
function renderTemplate(template, data, color) {
  switch (template) {
    case 'sidebar':   return renderSidebar(data, color);
    case 'classic':   return renderClassic(data, color);
    case 'minimal':   return renderMinimal(data, color);
    case 'modern':    return renderModern(data, color);
    case 'executive': return renderExecutive(data, color);
    case 'creative':  return renderCreative(data, color);
    default:          return renderSidebar(data, color);
  }
}

// ============================================================
// MINI THUMBNAILS (drawn on canvas)
// ============================================================
function drawThumbnail(canvas, tpl) {
  const w = canvas.width, h = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,w,h);

  const c = '#1a365d';
  const g = '#e8e4de';

  const miniLine = (x,y,len,col='#ccc',thick=1) => {
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+len,y);
    ctx.strokeStyle=col; ctx.lineWidth=thick; ctx.stroke();
  };
  const miniRect = (x,y,w2,h2,col) => {
    ctx.fillStyle=col; ctx.fillRect(x,y,w2,h2);
  };

  switch(tpl) {
    case 'sidebar':
      miniRect(0,0,w,5,c);
      miniLine(4,10,w-8,c,1.5);
      miniLine(4,15,w*0.5,g);
      miniRect(0,20,w*0.38,h-20,'#f7f5f2');
      miniRect(0,20,1,h-20,g);
      for(let i=0;i<5;i++) { miniLine(3,28+i*7,w*0.33,g); }
      for(let i=0;i<4;i++) { miniLine(w*0.42,28+i*10,w*0.55,g); }
      break;
    case 'classic':
      miniRect(0,0,w,2,c);
      miniLine(w/2-(w*0.3),8,w*0.6,c,1.5);
      miniLine(w/2-(w*0.2),13,w*0.4,g);
      miniLine(w/2-(w*0.35),18,w*0.7,g,0.5);
      miniRect(0,21,w,1,g);
      for(let i=0;i<4;i++) {
        miniLine(4,26+i*11,w*0.45,c,1.2);
        miniLine(4,30+i*11,w*0.8,g,0.5);
        miniLine(4,33+i*11,w*0.65,g,0.5);
      }
      break;
    case 'minimal':
      miniLine(4,8,w*0.7,'#1a1a1a',2);
      miniLine(4,13,w*0.4,g);
      miniLine(4,18,w*0.9,g,0.3);
      for(let i=0;i<5;i++) {
        miniLine(w*0.22,26+i*9,'#e8e4de',0.5);
        miniLine(w*0.25,26+i*9,w*0.65,g,0.5);
        miniLine(w*0.25,30+i*9,w*0.5,g,0.5);
      }
      break;
    case 'modern':
      miniRect(0,0,w,22,c);
      miniLine(4,6,w*0.6,'rgba(255,255,255,0.9)',1.5);
      miniLine(4,11,w*0.4,'rgba(255,255,255,0.5)',0.8);
      miniLine(4,16,w*0.8,'rgba(255,255,255,0.3)',0.5);
      miniRect(0,22,w*0.38,'#f7f5f2');
      for(let i=0;i<4;i++) { miniLine(3,26+i*7,w*0.33,g); }
      for(let i=0;i<3;i++) { miniLine(w*0.42,26+i*12,w*0.55,g); }
      break;
    case 'executive':
      miniRect(0,0,w,3,c);
      miniLine(4,10,w*0.55,'#1a1a1a',2);
      miniLine(4,15,w*0.4,c,1);
      miniRect(0,20,w,0.5,g);
      miniRect(0,21,w*0.35,h-21,'#fff');
      miniRect(w*0.35,21,1,h-21,c);
      for(let i=0;i<4;i++) { miniLine(3,27+i*7,w*0.3,g); }
      for(let i=0;i<3;i++) { miniLine(w*0.38,27+i*12,w*0.58,g); }
      break;
    case 'creative':
      miniRect(0,0,w,24,'#1a1a2e');
      miniLine(4,7,w*0.55,'rgba(255,255,255,0.8)',1.5);
      miniLine(4,12,w*0.35,c,1);
      miniRect(w-5,0,5,24,c);
      miniRect(0,24,w*0.38,'#f8f7f4');
      miniRect(0,24,1,h-24,g);
      for(let i=0;i<4;i++) { miniLine(3,28+i*8,w*0.33,g); }
      for(let i=0;i<3;i++) {
        miniRect(w*0.41,27+i*12,8,3,c);
        miniLine(w*0.42,33+i*12,w*0.55,g,0.5);
      }
      break;
  }
}
