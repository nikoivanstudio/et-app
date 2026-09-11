import { optimizeContentImages } from './content-images';

const WP_IMAGE =
  'https://energy-tur.ru/wp-content/uploads/2018/06/Photo_jeep-300x116.png';

describe('optimizeContentImages', () => {
  test('переписывает картинку WordPress на оптимизатор', () => {
    // Снять images.unoptimized было мало: теги <img> внутри текста статьи
    // идут мимо next/image в любом случае, и фото грузились оригиналами.
    const html = optimizeContentImages(`<img src="${WP_IMAGE}" alt="" />`);

    expect(html).toContain('/_next/image?url=');
    expect(html).toContain(encodeURIComponent(WP_IMAGE));
    expect(html).toContain('q=75');
  });

  test('добавляет srcset на несколько ширин', () => {
    const html = optimizeContentImages(`<img src="${WP_IMAGE}" />`);

    expect(html).toContain('640w');
    expect(html).toContain('828w');
    expect(html).toContain('1080w');
    expect(html).toContain('sizes="');
  });

  test('берёт размеры из имени файла WordPress', () => {
    // Против сдвига вёрстки: картинка без размеров раздвигает текст
    // в момент загрузки, и это прямой вклад в CLS.
    const html = optimizeContentImages(`<img src="${WP_IMAGE}" />`);

    expect(html).toContain('width="300"');
    expect(html).toContain('height="116"');
  });

  test('не трогает уже заданные размеры', () => {
    const html = optimizeContentImages(
      `<img src="${WP_IMAGE}" width="800" height="600" />`
    );

    expect(html).toContain('width="800"');
    expect(html).not.toContain('width="300"');
  });

  test('ставит отложенную загрузку и асинхронное декодирование', () => {
    const html = optimizeContentImages(`<img src="${WP_IMAGE}" />`);

    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
  });

  test('не переписывает чужой хост', () => {
    // Адрес вне remotePatterns оптимизатор отвергает с кодом 400,
    // и картинка молча исчезла бы со страницы.
    const src = 'https://example.com/photo.jpg';
    const html = optimizeContentImages(`<img src="${src}" />`);

    expect(html).toContain(`src="${src}"`);
    expect(html).not.toContain('/_next/image');
    // Но отложенная загрузка полезна и ей.
    expect(html).toContain('loading="lazy"');
  });

  test('локальные пути переписываются: это тот же origin', () => {
    const html = optimizeContentImages(
      '<img src="/api/files/content/photo.jpg" />'
    );

    expect(html).toContain('/_next/image?url=');
  });

  test('выбрасывает прежний srcset от WordPress', () => {
    // Иначе браузер выбирал бы между оптимизированной версией
    // и миниатюрой WordPress — и часто в пользу второй.
    const html = optimizeContentImages(
      `<img src="${WP_IMAGE}" srcset="${WP_IMAGE} 300w" sizes="100vw" />`
    );

    expect(html.match(/srcset=/g)).toHaveLength(1);
    expect(html.match(/sizes=/g)).toHaveLength(1);
    expect(html).not.toContain(`${WP_IMAGE} 300w`);
  });

  test('обрабатывает все картинки в тексте', () => {
    const html = optimizeContentImages(
      `<p>Текст</p><img src="${WP_IMAGE}"><p>Ещё</p><img src="${WP_IMAGE}">`
    );

    expect(html.match(/_next\/image/g)?.length).toBeGreaterThanOrEqual(8);
  });

  test('тег без src остаётся как был', () => {
    const html = optimizeContentImages('<img alt="без адреса" />');

    expect(html).toBe('<img alt="без адреса" />');
  });

  test('амперсанд в адресе экранируется в атрибуте', () => {
    const html = optimizeContentImages(`<img src="${WP_IMAGE}" />`);

    // В HTML-атрибуте «сырой» & — ошибка разметки; браузер простит,
    // но валидаторы и парсеры сниппетов — нет.
    expect(html).not.toMatch(/&(?!amp;|quot;)/);
  });
});
