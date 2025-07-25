import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = 'ja'; // 默认使用日语

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 