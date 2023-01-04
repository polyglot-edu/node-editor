import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

export type EnumFieldProps = {
  label: string;
  name: string;
  options: JSX.Element;
  constraints?: RegisterOptions;
};

const EnumField = ({ label, name, options, constraints }: EnumFieldProps) => {
  const { register, getFieldState } = useFormContext();
  const { error } = getFieldState(name);

  return (
    <FormControl isInvalid={error !== undefined}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select {...register(name, constraints)}>{options}</Select>
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

export default EnumField;
