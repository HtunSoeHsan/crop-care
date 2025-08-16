import {useLocale, useTranslations} from 'next-intl';
import LocaleSwitcherSelect from './local-switcher-select';

export default function LocaleSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: 'en',
          label: t('english')
        },
        {
          value: 'my',
          label: t('burmese')
        }
      ]}
      label={t('language')}
    />
  );
}