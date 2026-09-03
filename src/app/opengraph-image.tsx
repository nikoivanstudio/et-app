import { ImageResponse } from 'next/og';

import { SITE_NAME } from '@/shared/constants/site-constants';

/**
 * Картинка для соцсетей.
 *
 * Раньше корневой layout ссылался на `/og.jpg`, которого в public/ нет —
 * при шаринге ссылки отдавался 404 вместо превью. Отрисовываем картинку
 * кодом, чтобы не тащить бинарник: все фоновые фото в проекте вертикальные
 * (мобильная вёрстка) и под формат 1200×630 не подходят.
 *
 * Важно: у каждого div ровно один дочерний узел — satori требует явный
 * display:flex у любого элемента с несколькими детьми.
 *
 * Шрифт не подключаем: `next/og` поставляется с Geist, в котором есть
 * кириллица — проверено по таблице cmap.
 */
export const alt = 'Energy Tour — джип туры и экскурсии по Крыму';

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 96px',
        background: 'linear-gradient(135deg, #1f1a12 0%, #3b2f1c 100%)'
      }}
    >
      <div
        style={{
          fontSize: 26,
          letterSpacing: 8,
          textTransform: 'uppercase',
          color: '#e8b055'
        }}
      >
        {`${SITE_NAME} · Крым`}
      </div>
      <div
        style={{
          marginTop: 28,
          fontSize: 78,
          lineHeight: 1.05,
          color: '#f6f1e6'
        }}
      >
        Джип туры и экскурсии по Крыму
      </div>
      <div
        style={{
          marginTop: 32,
          fontSize: 32,
          color: '#b8915a'
        }}
      >
        Бахчисарай · Ялта · Севастополь
      </div>
      <div
        style={{
          marginTop: 48,
          height: 4,
          width: 180,
          background: '#e8b055'
        }}
      />
    </div>,
    size
  );
}
