import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import styles from '@/entities/duration/assets/styles.module.scss';
import { DurationLabelProps } from '@/entities/duration/model/types';

import { BlackClockIcon } from '@/shared/ui/black-clock-icon';
import { ClockIcon } from '@/shared/ui/clock-icon';

const cnDurationLabel = cnBem('DurationLabel');

export const DurationLabelLayout: FC<DurationLabelProps> = ({
  duration,
  variant,
  color
}) => {
  const isDurationNumber = typeof duration === 'number';

  const durationSting = isDurationNumber
    ? `${(duration / 3600).toFixed(0)} ч`
    : duration;

  return (
    <>
      {!!duration && (
        <div
          className={cnDurationLabel(null, [
            'flex',
            'justify-between',
            'gap-2',
            'backdrop-blur-xs',
            'py-1',
            'px-4',
            'rounded-full',
            styles.DurationLabel,
            variant === 'black-white'
              ? styles.DurationLabel_type_blackWhite
              : styles.DurationLabel_type_clearBlur
          ])}
        >
          <div className={isDurationNumber ? 'flex gap-2' : 'text-xs'}>
            {!!color && color === 'black' ? <BlackClockIcon /> : <ClockIcon />}
            {isDurationNumber ? 'От ' : ''}
            {isDurationNumber ? (
              durationSting
            ) : (
              <span
                className='whitespace-nowrap'
                dangerouslySetInnerHTML={{ __html: durationSting }}
              ></span>
            )}
          </div>
        </div>
      )}
    </>
  );
};
