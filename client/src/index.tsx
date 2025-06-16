import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles, including Tailwind
import App from './App';
// import reportWebVitals from './reportWebVitals'; // Optional: for performance measuring

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element. The 'root' div is missing in your index.html.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
