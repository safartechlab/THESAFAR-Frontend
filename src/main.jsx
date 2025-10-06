import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Authprovider from './store/provider/authprovider.jsx'
import './safar_css/safar.css'
import { Provider } from 'react-redux'
import store from './store/store.jsx'
import ToastProvider from './store/provider/toastprovider.jsx'
import 'primereact/resources/themes/lara-light-blue/theme.css';   
import 'primereact/resources/primereact.min.css';                 
import 'primeicons/primeicons.css';                               


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Authprovider>
          <ToastProvider>
            <App/>
          </ToastProvider>
        </Authprovider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)