import { useTranslations } from "next-intl"

type Props = {
  empty: boolean;
  nonValid: boolean;
}

export const AddressConvertorTablePlaceholder = ({ nonValid, empty }: Props) => {
  const t = useTranslations()


  if (nonValid) {
    return (
      <span>
        {t.rich('index-page.invalid', {
          highlight: (children) => <b className="text-red-300">{children}</b>
        })}
      </span>
    )
  }

  if (empty) {
    return (
      <span>{t('index-page.empty')}</span>
    )
  }
}