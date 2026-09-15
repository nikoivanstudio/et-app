import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Классы кнопки кабинета.
 *
 * Не компонент, а генератор классов: одни и те же кнопки в кабинете — это
 * то `<button>`, то `<Link>`, то `<a href="tel:">`, и оборачивать каждую
 * в отдельный компонент дороже, чем передать className.
 */
export const cabinetAction = cva(
  'inline-flex items-center justify-center gap-2 rounded-[10px] border font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cab-gold',
  {
    variants: {
      tone: {
        /* Главное действие экрана — ровно одно золотое на страницу. */
        gold: 'border-cab-gold bg-cab-gold text-cab-on-gold hover:bg-[#f0bd6a]',
        solid:
          'border-cab-line bg-cab-raise text-cab-ink hover:border-cab-line/80 hover:bg-cab-line/60',
        line: 'border-cab-line bg-transparent text-cab-dim hover:bg-cab-raise hover:text-cab-ink',
        ok: 'border-cab-ok/40 bg-transparent text-cab-ok hover:bg-cab-ok/10',
        bad: 'border-cab-bad/35 bg-transparent text-cab-bad hover:bg-cab-bad/10'
      },
      size: {
        md: 'min-h-11 px-4 text-[13px]',
        sm: 'min-h-9 px-3 text-[12.5px]',
        block: 'min-h-11 w-full px-4 text-[13px]'
      }
    },
    defaultVariants: { tone: 'solid', size: 'md' }
  }
);

export type CabinetActionProps = VariantProps<typeof cabinetAction>;
