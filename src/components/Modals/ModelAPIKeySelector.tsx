import { Flex, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import InfoButton from '../UtilityComponents/InfoButton';

export type ModelAPIKeyProps = {
  model: string;
  setModel: (value: string) => void;
  llm_token: string;
  setLlm_token: (value: string) => void;
  hidden?: boolean;
};

const ModelAPIKey = ({
  model,
  setModel,
  llm_token,
  setLlm_token,
  hidden = false,
}: ModelAPIKeyProps) => {
  return (
    <Flex
      direction={'row'}
      paddingBottom={'10px'}
      alignItems={'center'}
      justifyContent={'space-between'}
      hidden={hidden}
    >
      <FormControl label="Model" width={'40%'}>
        <FormLabel mb={2} fontWeight={'bold'}>
          Model:
          <InfoButton
            title="Model"
            description="Choose which AI model generates your content. 'Default' uses our built-in free use model at no extra cost to you. Gemini or Claude let you use your own API key instead. Note: the default model allows access only to fixed features."
            placement="right"
          />
        </FormLabel>
        <Select
          borderColor={'grey'}
          value={model}
          onChange={(event) => {
            const value = event.currentTarget.value;
            setModel(value);
            if (value === 'default') setLlm_token('');
          }}
        >
          <option value="" disabled hidden>
            Select a model...
          </option>
          <option value="default">Default</option>
          <option value="Gemini">Gemini</option>
          <option value="Claude">Claude</option>
        </Select>
      </FormControl>

      {model && model !== 'default' && (
        <FormControl width={'40%'}>
          <FormLabel mb={2} fontWeight={'bold'}>
            {model} API Key:
            <InfoButton
              title="API Key"
              description={`Your personal ${model} API key. It is used only to call ${model} on your behalf and is not stored on our servers.`}
              placement="right"
            />
          </FormLabel>
          <Input
            borderColor={'grey'}
            type="password"
            placeholder={`Insert your ${model} API key...`}
            value={llm_token}
            onChange={(e) => setLlm_token(e.currentTarget.value)}
          />
        </FormControl>
      )}
    </Flex>
  );
};

export default ModelAPIKey;
