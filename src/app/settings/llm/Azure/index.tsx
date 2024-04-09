import { Azure, OpenAI } from '@lobehub/icons';
import { Markdown } from '@lobehub/ui';
import { AutoComplete, Divider, Input } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { ModelProvider } from '@/libs/agent-runtime';
import { useGlobalStore } from '@/store/global';
import { modelConfigSelectors } from '@/store/global/selectors';

import ProviderConfig from '../components/ProviderConfig';
import { LLMProviderApiTokenKey, LLMProviderBaseUrlKey, LLMProviderConfigKey } from '../const';

const useStyles = createStyles(({ css, token }) => ({
  markdown: css`
    p {
      color: ${token.colorTextDescription} !important;
    }
  `,
  tip: css`
    font-size: 12px;
    color: ${token.colorTextDescription};
  `,
}));

const providerKey = ModelProvider.Azure;

const AzureOpenAIProvider = memo(() => {
  const { t } = useTranslation('setting');

  const { styles } = useStyles();

  // Get the first model card's deployment name as the check model
  const checkModel = useGlobalStore((s) => {
    const chatModelCards = modelConfigSelectors.providerModelCards(providerKey)(s);

    if (chatModelCards.length > 0) {
      return chatModelCards[0].deploymentName;
    }

    return 'gpt-35-turbo';
  });

  return (
    <ProviderConfig
      apiKeyItems={[
        {
          children: (
            <Input.Password
              autoComplete={'new-password'}
              placeholder={t('llm.azure.token.placeholder')}
            />
          ),
          desc: t('llm.azure.token.desc'),
          label: t('llm.azure.token.title'),
          name: [LLMProviderConfigKey, providerKey, LLMProviderApiTokenKey],
        },
        {
          children: <Input allowClear placeholder={t('llm.azure.endpoint.placeholder')} />,
          desc: t('llm.azure.endpoint.desc'),
          label: t('llm.azure.endpoint.title'),
          name: [LLMProviderConfigKey, providerKey, LLMProviderBaseUrlKey],
        },
        {
          children: (
            <AutoComplete
              options={[
                '2024-02-01',
                '2024-03-01-preview',
                '2024-02-15-preview',
                '2023-10-01-preview',
                '2023-06-01-preview',
                '2023-05-15',
              ].map((i) => ({ label: i, value: i }))}
              placeholder={'20XX-XX-XX'}
            />
          ),
          desc: (
            <Markdown className={styles.markdown} fontSize={12} variant={'chat'}>
              {t('llm.azure.azureApiVersion.desc')}
            </Markdown>
          ),
          label: t('llm.azure.azureApiVersion.title'),
          name: [LLMProviderConfigKey, providerKey, 'apiVersion'],
        },
      ]}
      checkModel={checkModel}
      modelList={{
        azureDeployName: true,
        notFoundContent: t('llm.azure.empty'),
        placeholder: t('llm.azure.modelListPlaceholder'),
      }}
      provider={providerKey}
      title={
        <Flexbox align={'center'} gap={8} horizontal>
          <Azure.Combine size={24} type={'color'}></Azure.Combine>
          <Divider style={{ margin: '0 4px' }} type={'vertical'} />
          <OpenAI.Combine size={24}></OpenAI.Combine>
        </Flexbox>
      }
    />
  );
});

export default AzureOpenAIProvider;