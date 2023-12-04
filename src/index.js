import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import counterStore from './counterStore';
import { CounterProvider } from './context/counterContext';

// 인스턴스 생성
const store = new counterStore()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CounterProvider value={store}>
        <App />
    </CounterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
