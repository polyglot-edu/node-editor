import '../styles/globals.css';
import '../components/AppMain.css';
import '../components/DrawingArea.css';
import '../components/Card.css';
import "@fontsource/inter"; 
import "@fontsource/work-sans";

import type { AppProps } from 'next/app';
import reportWebVitals from '../reportWebVitals';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { UserProvider } from '../context/user.context';
import { ChakraProvider } from '@chakra-ui/react'
// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  fonts: {
    heading: `Work Sans, system-ui, sans-serif`,
    body: `Inter, system-ui, sans-serif`,
  },
})

export default function App({ Component, pageProps }: AppProps) {
    return (
      <ChakraProvider theme={theme}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ChakraProvider>
    );
}

initializeIcons();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
