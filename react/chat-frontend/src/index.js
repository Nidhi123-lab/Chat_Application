/*import React from 'react';
import { createRoot } from 'react-dom/client';  // Note: 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);*/

import React from 'react';
import { createRoot } from 'react-dom/client';  // Note: 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

