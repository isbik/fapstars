import { GoogleAnalytics } from './providers/google-analytics';
import Router from './router/Router';

const App = () => {
  return (
    <>
      <Router />

      <GoogleAnalytics trackingId={import.meta.env.VITE_GOOGLE_ANALYTICS} />
    </>
  );
};

export default App;
