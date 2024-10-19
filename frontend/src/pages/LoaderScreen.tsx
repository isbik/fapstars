import Lottie from 'lottie-react';
import { FC } from 'react';

import CarDuckAnimation from '~/assets/stikers/car_duck.json';
import { Fade } from '~/shared/ui';

const LoaderScreen: FC = () => {
  return (
    <Fade duration={1500}>
      <div className="page">
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <h1 style={{ fontSize: 64 }}>FapStars</h1>

          <Lottie animationData={CarDuckAnimation} loop={true} />
        </div>
      </div>
    </Fade>
  );
};

export default LoaderScreen;
