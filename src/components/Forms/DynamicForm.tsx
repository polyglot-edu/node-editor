import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useEffect } from 'react';
import {
  Control,
  FieldErrorsImpl,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { Metadata, MetadataField } from '../../types/metadata';
import { isObject } from '../../utils/utils';
import ArrayField from './Fields/ArrayField';
import FileUpload from './Fields/FileUpload';
import MarkDownField from './Fields/MarkDownField';

export type OnChangeDynamicForm = (
  element: any,
  val: MetadataField,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any,
  parentKey?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => (e: any) => void;

export type SetFieldsDynamicForm = (
  element: any,
  setValue: UseFormSetValue<FieldValues>
) => void;

export type DynamicFormProps = {
  element: any;
  metadata: Metadata;
  onChangeProps?: {};
  onChange: OnChangeDynamicForm;
  setFields?: SetFieldsDynamicForm;
  onSubmit?: SubmitHandler<FieldValues>;
};

const default_setFields = (
  element: any,
  setValue: UseFormSetValue<FieldValues>
) => {
  Object.keys(element).forEach((index) => {
    if (isObject(element[index])) {
      Object.keys(element[index]).forEach((field) => {
        setValue(field, element[index][field]);
      });
    } else setValue(index, element[index]);
  });
};

export const parseMetaField = (
  metaField: MetadataField,
  element: any,
  value: any,
  arrayName?: string,
  parentKey?: string
) => {
  if (parentKey) {
    element = element[parentKey];
  }
  switch (metaField.type) {
    case 'any':
      // TODO: need to be implemented
      break;
    case 'number':
      value = parseInt(value);
      break;
    case 'enum':
      if (metaField.name === 'type') return null;
      if (metaField.sub === 'number') {
        value = parseInt(value);
      }
      break;
    case 'array':
      // FIX: handle the errors please!!!
      if (!arrayName) throw Error('ArrayName is not provided!');

      if (!Array.isArray(element[metaField.name])) {
        console.log(metaField.name);
        throw Error('Field is not an array, metadata not correct!');
      }

      // create a deep copy of the array cast as any
      const tmp = [...element[metaField.name]];
      const key = parseInt(arrayName.split('.')?.[1]);
      const operand = arrayName.split('.')?.[2];

      switch (operand) {
        case 'remove':
          tmp.splice(key, 1);
          break;
        case 'value':
          if (tmp.length <= key) tmp.push(value);
          else tmp[key] = value;
          break;
        case 'add':
          tmp.push(value);
          break;
        default:
          console.log('Array Field name not correct!!');
      }
      value = tmp;
      break;
  }
  return value;
};

const default_onSubmit = () => console.log('No submit, implement one!');

const DynamicForm = ({
  metadata,
  onChange,
  onChangeProps,
  onSubmit,
  setFields,
  element,
}: DynamicFormProps) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (element) {
      if (setFields) setFields(element, setValue);
      else default_setFields(element, setValue);
    }
  }, [element]);

  if (!element) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit || default_onSubmit)}>
      <>
        {generateElement(
          metadata,
          element,
          onChange,
          onChangeProps,
          register,
          control,
          errors
        )}
      </>
    </form>
  );
};

const generateElement = (
  meta: Metadata | undefined,
  element: any,
  onChange: OnChangeDynamicForm,
  onChangeProps: {} | undefined,
  register: UseFormRegister<FieldValues>,
  control: Control<FieldValues, any> | undefined,
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >,
  parentKey?: string
) => {
  return meta?.map((val, id) => {
    val.constraints.onChange = onChange(element, val, onChangeProps, parentKey);
    let inputObj;
    const field = parentKey
      ? element?.[parentKey]?.[val.name]
      : element?.[val.name];
    switch (val.type) {
      case 'any':
        if (val.fields) {
          inputObj = generateElement(
            val.fields,
            element,
            onChange,
            onChangeProps,
            register,
            control,
            errors,
            val.name
          );
        }

        break;
      case 'string' || 'number':
        inputObj = (
          <Input
            key={id}
            id={val.name.toString()}
            {...register(val.name.toString(), val.constraints)}
          />
        );
        break;
      case 'enum':
        inputObj = (
          <Select
            key={id}
            id={val.name.toString()}
            {...register(val.name.toString(), val.constraints)}
          >
            {val.options?.map((opt, id) => {
              return (
                <option key={id} value={opt}>
                  {opt}
                </option>
              );
            })}
          </Select>
        );
        break;
      case 'textarea':
        inputObj = (
          <Textarea
            key={id}
            id={val.name.toString()}
            {...register(val.name.toString(), val.constraints)}
          />
        );
        break;
      case 'array':
        // TODO: da riguardare

        inputObj = (
          <ArrayField<string>
            name={val.name.toString()}
            refreshFactor={element._id}
            array={field}
            constraints={val.constraints}
          />
        );
        break;
      case 'file':
        inputObj = <FileUpload name={val.name.toString()} control={control} />;
        break;
      case 'code':
        const language = element?.language;
        inputObj = (
          <Editor
            height={400}
            language={language || 'csharp'}
            defaultValue={field}
            onChange={(value) =>
              val.constraints.onChange?.({ currentTarget: { value: value } })
            }
          />
        );
        break;
      case 'markdown':
        inputObj = (
          <MarkDownField
            value={field}
            onChange={(data) =>
              val.constraints.onChange?.({
                currentTarget: { value: data.text },
              })
            }
          />
        );
    }

    return (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      <FormControl key={id} isInvalid={errors[val.name] ? true : false}>
        <FormLabel htmlFor={val.name}>
          {val.name !== 'data' && val.label}
        </FormLabel>
        {inputObj}
        <FormErrorMessage>
          {errors[val.name] && errors[val.name]?.message?.toString()}
        </FormErrorMessage>
      </FormControl>
    );
  });
};

export default DynamicForm;
