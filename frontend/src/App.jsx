import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import Portfolio from './components/Portfolio';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <Portfolio />
      </ErrorBoundary>
    </I18nextProvider>
  );
}

export default App;