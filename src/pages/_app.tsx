import '../styles/globals.css';
import '../components/AppMain.css';
import '../components/DrawingArea.css';
import '../components/Card.css';

import type { AppProps } from 'next/app';
import reportWebVitals from '../reportWebVitals';
import { initializeIcons } from '@fluentui/font-icons-mdl2';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

initializeIcons();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
