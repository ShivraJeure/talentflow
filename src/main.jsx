import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <ThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </ErrorBoundary>,
);
