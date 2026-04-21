import { FC, SVGProps } from 'react';

type MailIconProps = SVGProps<SVGSVGElement> & {
  color?: string;
};

export const MailIcon: FC<MailIconProps> = ({ color = '#040404', ...props }) => (
  <svg
    width='21'
    height='17'
    viewBox='0 0 21 17'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M18.638 1.72534H2.36531L10.5017 10.1788L18.638 1.72534ZM1.5 2.92298V14.2253C1.5 14.5015 1.72386 14.7253 2 14.7253H19C19.2761 14.7253 19.5 14.5015 19.5 14.2253V2.91937L10.9774 11.7742C10.6817 12.0814 10.2283 12.0847 9.96473 11.7815C9.91606 11.7256 9.87726 11.6631 9.84821 11.5964L1.5 2.92298ZM0 2.22534C0 1.12077 0.895431 0.225342 2 0.225342H19C20.1046 0.225342 21 1.12077 21 2.22534V14.2253C21 15.3299 20.1046 16.2253 19 16.2253H2C0.89543 16.2253 0 15.3299 0 14.2253V2.22534Z'
      fill={color}
      fillOpacity='0.917'
    />
  </svg>
);
