type Variant = 'clear-blur' | 'black-white' | 'fact';

export type DurationLabelProps = {
  duration: number | string;
  variant?: Variant;
  color?: 'black' | 'white';
};
