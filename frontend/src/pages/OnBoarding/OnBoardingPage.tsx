import Lottie from 'lottie-react';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './OnBoardingPage.module.sass';

import CoolDuckAnimation from '~/assets/stikers/cool_duck.json';
import PortalDuckAnimation from '~/assets/stikers/portal_duck.json';
import RichDuckAnimation from '~/assets/stikers/rich_duck.json';
import { Button, ButtonIcon } from '~/shared/ui';
import { RightArrowIcon } from '~/shared/ui/Icons';

const TARGET_PAGE = '/leagues';

const steps = [
  {
    url: null,
    text: "Compete in exciting beauty contests with real and AI models. Show off your team's charm!",
    animation: CoolDuckAnimation,
  },
  {
    url: null,
    text: 'Earn FAP Coins by participating and winning contests. Click, mine, and grow your wealth!',
    animation: RichDuckAnimation,
  },
  {
    url: null,
    text: 'Engage with other participants, form alliances, and build strong teams to dominate the contests',
    animation: PortalDuckAnimation,
  },
];

const OnBoardingPage: FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const handleNext = () => {
    if (stepIndex < steps.length) setStepIndex(prev => prev + 1);
  };

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        minHeight: '100vh',
      }}
    >
      <div className="image" style={{ marginBottom: 'auto' }}>
        <Lottie animationData={steps[stepIndex].animation} loop={true} />
      </div>
      <div
        style={{
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        <p
          style={{
            textAlign: 'center',
          }}
        >
          {steps[stepIndex].text}
        </p>
      </div>
      {stepIndex === steps.length - 1 ? (
        <Button link={TARGET_PAGE} replace state={{ hideBack: true }}>
          Get started
        </Button>
      ) : (
        <div className={styles.footer}>
          <Link to={TARGET_PAGE} replace state={{ hideBack: true }}>
            Skip
          </Link>
          <ButtonIcon onClick={handleNext} className={styles.nextArrow}>
            <RightArrowIcon />
          </ButtonIcon>
        </div>
      )}
    </div>
  );
};

export default OnBoardingPage;
