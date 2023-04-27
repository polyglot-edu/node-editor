import { extendTheme } from '@chakra-ui/react';
//import '@fontsource/nunito';
import { transparentize } from 'polished'; // used to shade the color

const config = {
  colors: {
    primary: '#000028',
    accent: {
      200: transparentize(0.8, '#FFCC49'),
      900: '#FFCC49',
    },
    secondary: '#CED4DA',
    background: '#F8F9FA',
    grey: '#8F959E',
    dark_grey: '#495057',
  },

  fonts: {
    heading: 'Exo, sans-serif',
    title: 'Exo, sans-serif',
    //heading: '',
    body: 'Nunito, sans-serif',
    //fontFamily: 'Nunito, sans-serif',
  },

  components: {
    Button: {
      variants: {
        primary: {
          bg: 'primary',
          color: 'white',
          borderRadius: '10px',
          py: '10px', // padding y
          px: '30px', // padding x
          gap: '10px',
        },
        secondary: {
          bg: 'secondary',
          color: 'primary',
          borderRadius: '10px',
          py: '10px', // padding y
          px: '30px', // padding x
          gap: '10px',
        },
        third: {
          bg: 'white',
          color: 'primary',
          borderRadius: '10px',
          py: '10px', // padding y
          px: '30px', // padding x
          gap: '10px',
        },
        link: {
          bg: 'transparent',
          color: 'primary',
          borderRadius: '0px',
          textDecoration: 'underline',
        },
        dropdown: {
          cornerRadius: '10px',
          fillColor: 'white',
          borderColor: 'grey',
          borderWidth: '0.5px',
        },
      },
    },
    Text: {
      variants: {
        label: {
          //fontFamily: 'body',
          fontSize: '12px',
          fontWeight: '600',
          lineHeight: '16px',
          letterSpacing: '0em',
          textAlign: 'left',
          color: 'grey',
        },
      },
    },
  },
};

const theme = extendTheme(config);

export default theme;
