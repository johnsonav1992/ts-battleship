import React from 'react';
import ReactDOM from 'react-dom/client';

// MUI
import {
    CssBaseline
    , CssVarsProvider
} from '@mui/joy';
import { theme } from './theme/theme.ts';

// Components
import App from './App.tsx';

ReactDOM.createRoot( document.getElementById( 'root' )! ).render(
    <React.StrictMode>
        <CssBaseline>
            <CssVarsProvider theme={ theme }>
                <App />
            </CssVarsProvider>
        </CssBaseline>
    </React.StrictMode>,
);
