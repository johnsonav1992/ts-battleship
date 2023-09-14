import React from 'react';
import ReactDOM from 'react-dom/client';

// MUI
import { CssBaseline } from '@mui/joy';

// Components
import App from './App.tsx';

ReactDOM.createRoot( document.getElementById( 'root' )! ).render(
    <React.StrictMode>
        <CssBaseline>
            <App />
        </CssBaseline>
    </React.StrictMode>,
);
