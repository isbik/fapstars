import React from 'react';

import StarImage from '~/assets/star.png';

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

const Star = (props: Props) => {
  return <img height={18} width={18} {...props} src={StarImage} alt="Star Icon" draggable="false" />;
};

export { Star };
