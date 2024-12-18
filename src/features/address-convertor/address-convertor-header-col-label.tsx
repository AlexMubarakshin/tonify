import { useTranslations } from "next-intl"
import { AddressConverterHeaderColTooltip } from "./address-convertor-header-col-tooltip"
import { AddressResultTableDataKey } from "./types"

type Props = {
  colKey: AddressResultTableDataKey;
}

export const AddressConvertorHeaderColLabel = ({ colKey }: Props) => {
  const t = useTranslations()
  if (colKey === "toStringBounceable") {
    const content = t.rich('index-page.bounceableTooltip', {
      link: (children) => (
        <a className="text-blue-400 underline" target="_blank" rel="noreferrer" href="https://docs.ton.org/v3/documentation/smart-contracts/addresses#bounceable-vs-non-bounceable-addresses">
          {children}
        </a>
      )
    })

    return (
      <span>
        {t('index-page.bounceableAddress')}{" "}
        <span className="hidden absolute invisible opacity-0">{content}</span>

        <AddressConverterHeaderColTooltip content={(
          <span
            className="max-w-sm text-current">
            {content}
          </span>
        )}>
          <span className="text-blue-400 cursor-pointer">{t('index-page.bounceable')}</span>
        </AddressConverterHeaderColTooltip>
      </span>
    )
  }

  if (colKey === "toStringNonBounceable") {
    const content = t.rich('index-page.nonBounceableTooltip', {
      link: (children) => (
        <a className="text-blue-400 underline" target="_blank" rel="noreferrer" href="https://docs.ton.org/v3/documentation/smart-contracts/addresses#bounceable-vs-non-bounceable-addresses">
          {children}
        </a>
      )
    });

    return (
      <span>{t('index-page.nonBounceableAddress')}{" "}
        <span className="hidden absolute invisible opacity-0">{content}</span>

        <AddressConverterHeaderColTooltip content={(
          <span className="max-w-sm text-current">{content}</span>
        )}>
          <span className="text-blue-400 cursor-pointer">Non-Bounceable</span>
        </AddressConverterHeaderColTooltip>
      </span>
    )
  }

  if (colKey === "toRawString") {
    const content = t.rich('index-page.rawAddressTooltip', {
      link: (children) => (
        <a className="text-blue-400 underline" target="_blank" rel="noreferrer" href="https://docs.ton.org/v3/documentation/smart-contracts/addresses#raw-address">
          {children}
        </a>
      )
    });

    return (
      <span>{t('index-page.rawAddressString')}{" "}
        <span className="hidden absolute invisible opacity-0">{content}</span>

        (<AddressConverterHeaderColTooltip
          content={(
            <span
              className="max-w-sm text-current">
              {content}
            </span>
          )}>
          <span className="text-blue-400 cursor-pointer">{t('index-page.info')}</span>
        </AddressConverterHeaderColTooltip>)
      </span>
    )
  }

  if (colKey === "normalized") {
    return (
      <span>
        {t('index-page.normalizedAddress')}
      </span>
    )
  }

  return null;
}