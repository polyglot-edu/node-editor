import '../styles/globals.css'
import "../components/AppMain.css"
import "../components/DrawingArea.css"
import "../components/Card.css"

import type { AppProps } from 'next/app'

import { initializeIcons } from '@fluentui/font-icons-mdl2';

initializeIcons();

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
