import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // 这行会寻找 App.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
