import { notFound } from "next/navigation"
import { LocaleKey } from "./constants"

export async function getMessages(locale: LocaleKey) {
  try {
    return (await import(`./messages/${locale}.json`)).default
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error: unknown) {
    notFound()
  }
}