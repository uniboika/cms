import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

// Error fallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" style={{ padding: '20px', color: 'red' }}>
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  );
}

// Add a debug log to check if the root element exists
const rootElement = document.getElementById("root");
console.log('Root element:', rootElement);

if (!rootElement) {
  console.error('Failed to find the root element');
} else {
  try {
    createRoot(rootElement).render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Failed to render the app:', error);
  }
}
