"use client";

import { useTranslations } from "next-intl"
import GitHubButton from "react-github-btn"

type Props = {
  className?: string;
}

export const ApplicationLayoutGhWidgets = ({ className }: Props) => {
  const t = useTranslations()
  return (
    <div className={className}>
      <GitHubButton
        href="https://github.com/AlexMubarakshin/tonify"
        data-icon="octicon-star"
        data-size="large"
        aria-label={t('header.gh.ariaLabel')}
      >
        {t('header.gh.buttonText')}
      </GitHubButton>
    </div>
  )
}