// App.jsx
import React from 'react';
import './App.css';
import AppComponent from './Appcomponets';
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
