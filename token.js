function randomBytes(n) {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return Array.from(a).map(b => b.toString(16).padStart(2, '0')).join('');
}

function b64url(hex) {
  const bytes = hex.match(/.{2}/g).map(h => parseInt(h, 16));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function gerarToken() {
  return b64url(randomBytes(6)) + '.' + b64url(randomBytes(10)) + '.' + b64url(randomBytes(8));
}

function desenharQR() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 21;
  const cell = Math.floor(180 / size);
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const fg = isDark ? '#e2e2e2' : '#1a1a1a';
  const bg = isDark ? '#1e1e1e' : '#ffffff';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 180, 180);

  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => (Math.random() > 0.5 ? 1 : 0))
  );

  function corner(ox, oy) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        grid[oy + r][ox + c] =
          r === 0 || r === 6 || c === 0 || c === 6 ? 1
          : r >= 2 && r <= 4 && c >= 2 && c <= 4 ? 1
          : 0;
      }
    }
    for (let i = 0; i < 8; i++) {
      if (grid[oy + 7]) grid[oy + 7][ox + i] = 0;
      if (grid[oy + i] && grid[oy + i][ox + 7] !== undefined) grid[oy + i][ox + 7] = 0;
    }
  }

  corner(0, 0);
  corner(size - 7, 0);
  corner(0, size - 7);

  ctx.fillStyle = fg;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c]) ctx.fillRect(c * cell, r * cell, cell, cell);
    }
  }
}

function copiarToken() {
  const el = document.getElementById('token-gerado');
  const fb = document.getElementById('feedback');
  if (!el || !fb) return;
  const text = el.textContent.trim();
  if (!text || text === '—') return;
  navigator.clipboard.writeText(text).then(() => {
    fb.style.opacity = '1';
    setTimeout(() => (fb.style.opacity = '0'), 2000);
  });
}

function gerarNovoToken() {
  const el = document.getElementById('token-gerado');
  if (el) el.textContent = gerarToken();
  desenharQR();
}

document.addEventListener('DOMContentLoaded', function () {
  const tokenEl = document.getElementById('token-gerado');
  if (tokenEl) tokenEl.addEventListener('click', copiarToken);

  const btnGerar = document.getElementById('btn-gerar');
  if (btnGerar) btnGerar.addEventListener('click', gerarNovoToken);

  const popoverEl = document.getElementById('gerar-token');
  if (popoverEl) {
    popoverEl.addEventListener('toggle', function (e) {
      if (e.newState === 'open') gerarNovoToken();
    });
  }
});