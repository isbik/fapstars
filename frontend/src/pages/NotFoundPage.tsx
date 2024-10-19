import { FC } from 'react';

import { Button } from '~/shared/ui';

const NotFoundPage: FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: 36,
        padding: 24,
      }}
    >
      <h1>Not Found</h1>
      <Button link="/">To Main Page</Button>
    </div>
  );
};

export default NotFoundPage;
