import {getRequestConfig} from 'next-intl/server'

export default getRequestConfig(async ({locale: _locale}) => {
  // 只支持日语
  const validLocale = 'ja'
  
  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default
  }
}) 