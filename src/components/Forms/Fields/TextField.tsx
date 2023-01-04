import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

export type TextFieldProps = {
  label: string;
  name: string;
  constraints?: RegisterOptions;
  isTextArea?: boolean;
};

const TextField = ({
  label,
  name,
  constraints,
  isTextArea,
}: TextFieldProps) => {
  const { register, getFieldState } = useFormContext();
  const { error } = getFieldState(name);

  const Conponent = isTextArea ? Textarea : Input;

  return (
    <FormControl isInvalid={error !== undefined}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Conponent {...register(name, constraints)} />
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

export default TextField;
