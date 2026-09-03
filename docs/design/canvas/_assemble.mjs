// Сборщик артбордов: подставляет общий блок токенов в место /*TOKENS*/ и
// оборачивает фрагмент в каркас .dc.html. Служебный, удаляется после сборки.
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
const tokens = readFileSync('./_tokens.css.txt', 'utf8');
const head = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poiret+One&family=Oswald:wght@300;400;500;600&family=Caladea:wght@400;700&display=swap">
  <style>
`;
for (const f of readdirSync('.').filter(f => f.startsWith('_body_'))) {
  const src = readFileSync(f, 'utf8');
  const [style, body] = src.split('<!--BODY-->');
  const name = f.replace('_body_', '').replace('.html', '');
  const out = head + tokens + (style || '') + `  </style>\n</helmet>\n\n` + body.trim() + `\n</x-dc>\n</body>\n</html>\n`;
  writeFileSync(`${name}.dc.html`, out);
  console.log('OK', name + '.dc.html', (out.length / 1024).toFixed(1), 'KB');
  unlinkSync(f);
}
