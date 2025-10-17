import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import {App} from './App'
import './index.css';
import {AuthProvider} from "./modules/Context/Auth/AuthContext";
import {HelmetProvider} from "react-helmet-async";
import {store} from "./modules/store/store";
import {Provider} from "react-redux";

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');



createRoot(rootElement).render(
  <StrictMode>
      <BrowserRouter>
          <HelmetProvider>
              {/*using redux toolkit*/}
              <Provider store={store}>
                      <App />
          </Provider>
          </HelmetProvider>
      </BrowserRouter>
  </StrictMode>,
)
