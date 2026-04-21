import { FC, SVGProps } from 'react';

export const MaxIcon: FC<SVGProps<SVGSVGElement>> = props => (
  <svg
    width='36'
    height='36'
    viewBox='0 0 36 36'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect width='36' height='36' rx='6' fill='url(#max-icon-gradient)' />
    <g mask='url(#max-icon-cutout)'>
      <path
        d='M18.15 6.85c-5.74 0-9.85 4.02-9.85 9.53 0 2.26.72 4.34 2.03 6.03v3.01c0 .98 1.1 1.53 1.89.95l2.82-2.08c.95.25 2 .39 3.1.39 5.73 0 9.85-4.02 9.85-9.53S23.88 6.85 18.15 6.85Zm0 3.3c3.7 0 6.15 2.24 6.15 5.14 0 3.24-2.48 5.83-6.15 5.83-.95 0-1.85-.18-2.69-.53a.95.95 0 0 0-.9.1l-.57.42v-.74a.95.95 0 0 0-.24-.63 5.57 5.57 0 0 1-1.62-3.8c0-3.24 2.48-5.79 6.02-5.79Z'
        fill='#fff'
      />
    </g>
    <defs>
      <mask
        id='max-icon-cutout'
        x='0'
        y='0'
        width='36'
        height='36'
        maskUnits='userSpaceOnUse'
      >
        <rect width='36' height='36' fill='#fff' />
        <circle cx='18.15' cy='15.18' r='2.72' fill='#000' />
      </mask>
      <linearGradient
        id='max-icon-gradient'
        x1='2'
        y1='31'
        x2='31.5'
        y2='3'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#42C7FF' />
        <stop offset='0.52' stopColor='#3457F6' />
        <stop offset='1' stopColor='#9C35D9' />
      </linearGradient>
    </defs>
  </svg>
);
