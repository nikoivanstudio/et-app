// Собирает index.html — офлайн-версию канваса: все артборды на одной странице.
// Запуск: node build-index.mjs   (из docs/design/canvas)
import { readFileSync, writeFileSync } from 'node:fs';

const canvas = JSON.parse(readFileSync('./canvas.json', 'utf8'));

const extract = (file) => {
  const src = readFileSync(file, 'utf8');
  const m = src.match(/<x-dc>([\s\S]*)<\/x-dc>/);
  if (!m) throw new Error(`нет <x-dc> в ${file}`);
  return m[1].trim();
};

const doc = (inner) =>
  `<!doctype html><html><head><meta charset="utf-8">` +
  `<meta name="viewport" content="width=device-width,initial-scale=1">` +
  `</head><body>${inner}</body></html>`;

const boards = canvas.artboards.map((a) => ({
  ...a,
  id: a.file.replace('.dc.html', ''),
  html: doc(extract(a.file))
}));

const esc = (s) => s.replace(/<\/script/gi, '<\\/script');

const notes = canvas.annotations
  .map((n) => `<p>${n.text.replace(/\n/g, '<br>')}</p>`)
  .join('');

const nav = boards
  .map((b) => `<a href="#${b.id}">${b.title.split(' — ')[0]}</a>`)
  .join('');

const frames = boards
  .map(
    (b) => `
  <section class="board" id="${b.id}">
    <h2>${b.title} <span>${b.w}×${b.h}</span></h2>
    <div class="frame" style="width:${b.w}px;height:${b.h}px">
      <script type="text/html" data-board="${b.id}">${esc(b.html)}</script>
    </div>
  </section>`
  )
  .join('');

const out = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Energy Tour — макеты экранов</title>
<style>
  :root { color-scheme: light dark; --bg:#111114; --panel:#1b1b20; --line:#2c2c33; --ink:#f4f4f5; --dim:#a1a1aa; --accent:#e0a955; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font:14px/1.55 ui-sans-serif, system-ui, -apple-system, sans-serif; }
  header { padding:32px 28px 20px; border-bottom:1px solid var(--line); }
  h1 { margin:0 0 8px; font-size:22px; font-weight:600; letter-spacing:-0.01em; }
  header p { margin:0 0 6px; color:var(--dim); max-width:80ch; }
  header a.link { color:var(--accent); }
  nav { position:sticky; top:0; z-index:5; display:flex; flex-wrap:wrap; gap:6px; padding:12px 28px; background:color-mix(in oklab, var(--bg) 88%, transparent); backdrop-filter:blur(8px); border-bottom:1px solid var(--line); }
  nav a { padding:5px 11px; border:1px solid var(--line); border-radius:999px; color:var(--ink); text-decoration:none; font-size:12.5px; white-space:nowrap; }
  nav a:hover { border-color:var(--accent); color:var(--accent); }
  main { display:flex; flex-wrap:wrap; align-items:flex-start; gap:40px; padding:32px 28px 80px; }
  .board h2 { margin:0 0 10px; font-size:14px; font-weight:600; }
  .board h2 span { color:var(--dim); font-weight:400; margin-left:6px; }
  .frame { border:1px solid var(--line); border-radius:10px; overflow:hidden; background:#fff; box-shadow:0 12px 32px #0006; max-width:100%; }
  .frame iframe { display:block; width:100%; height:100%; border:0; }
  footer { padding:0 28px 60px; color:var(--dim); }
  footer code { color:var(--ink); }
</style>
</head>
<body>
<header>
  <h1>Energy Tour — макеты основных экранов</h1>
  ${notes}
  <p>Живой канвас: <a class="link" href="https://claude.ai/code/artifact/c57b4036-c2ba-40c2-975c-6f1448d11df7">claude.ai/code/artifact/c57b4036…</a></p>
</header>
<nav>${nav}</nav>
<main>${frames}</main>
<footer>
  <p>Страница собрана из <code>*.dc.html</code> + <code>canvas.json</code> скриптом <code>build-index.mjs</code>. Правки вносим в артборды, потом <code>node build-index.mjs</code>.</p>
  <p>Шрифты Poiret One и Oswald подтягиваются из Google Fonts — без интернета вёрстка та же, но начертания системные.</p>
</footer>
<script>
  for (const tpl of document.querySelectorAll('script[type="text/html"]')) {
    const f = document.createElement('iframe');
    f.setAttribute('loading', 'lazy');
    f.setAttribute('title', tpl.dataset.board);
    f.srcdoc = tpl.textContent;
    tpl.replaceWith(f);
  }
</script>
</body>
</html>
`;

writeFileSync('./index.html', out);
console.log('index.html:', (out.length / 1024).toFixed(1), 'КБ,', boards.length, 'артбордов');
