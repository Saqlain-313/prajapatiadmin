// App.jsx
import React from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import AppComponent from './Appcomponets';
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <AppComponent />
           <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#000000',
        },
      }}
    />
    </BrowserRouter>
  );
}

export default App;
