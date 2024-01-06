import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

export type EnumFieldProps = {
  label: string;
  name: string;
  width?: string;
  align?: string;
  options: JSX.Element;
  constraints?: RegisterOptions;
};

const EnumField = ({
  label,
  name,
  options,
  constraints,
  width,
}: EnumFieldProps) => {
  const { register, getFieldState } = useFormContext();
  const { error } = getFieldState(name);

  return (
    <Box p={2} width={width}>
      <FormControl isInvalid={error !== undefined}>
        <Select {...register(name, constraints)} borderColor={'grey'}>
          {options}
        </Select>
        <FormLabel
          htmlFor={name}
          style={{
            font: '15px',
            top: '-13px',
            left: '15px',
            zIndex: '2px',
            position: 'absolute',
            backgroundColor: 'white',
          }}
        >
          {label}
        </FormLabel>
        <FormErrorMessage>{error && error.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
};

export default EnumField;
