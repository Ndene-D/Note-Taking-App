interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const Icon: React.FC<IconProps> = ({ src, ...imgProps }) => (
  <img src={src} alt="" {...imgProps} />
);
