import { FC } from 'react';

const items = [
  { title: 'Заказ внедорожника', price: 'от 2 000 ₽', unit: 'в час' },
  { title: 'Джип-тур', price: 'от 5 000 ₽', unit: 'за тур' },
  { title: 'Экспедиционный джип-тур', price: 'от 20 000 ₽', unit: 'в день' }
];

/**
 * Форматы и цены. До v2 это была стеклянная таблица поверх фото в шапке:
 * «₽ в час» серым по светлому небу (нечитаемо) и обрезано справа на десктопе.
 * Теперь блок на бумаге под шапкой: строки на мобильном, колонки от md.
 */
export const PriceBanner: FC = () => (
  <div className='border-rule bg-cream rounded-block border p-4 md:flex md:items-stretch md:p-6'>
    <h2 className='font-caladea text-ink relative pl-3.5 text-[17px] font-bold md:hidden'>
      <span className='bg-gold-plate absolute top-1 left-0 h-[18px] w-1 rounded-sm' />
      Форматы и цены
    </h2>

    {items.map(({ title, price, unit }) => (
      <div
        key={title}
        className='border-rule flex items-baseline gap-2 border-b py-3.5 last:border-b-0 md:block md:flex-1 md:border-r md:border-b-0 md:px-5 md:py-0 md:first:pl-0 md:last:border-r-0'
      >
        <span className='font-caladea text-ink min-w-0 flex-1 text-sm md:text-ink-muted md:block'>
          {title}
        </span>
        <span className='font-oswald text-gold-ink text-lg font-medium whitespace-nowrap md:mt-1.5 md:block md:text-2xl'>
          {price}{' '}
          <span className='text-ink-faint text-[12.5px] font-normal md:text-[13px]'>
            {unit}
          </span>
        </span>
      </div>
    ))}

    <p className='font-caladea text-ink-muted mt-3.5 text-[12.5px] leading-relaxed md:mt-0 md:flex md:basis-64 md:items-center md:pl-5 md:text-[13px]'>
      Цена за машину до 6 человек. Точную стоимость гид подтверждает после
      заявки.
    </p>
  </div>
);
