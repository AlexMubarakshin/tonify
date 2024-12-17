import { DEFAULT_LOCALE } from "@/i18n/constants";
import { redirect } from "next/navigation";

export default function NotFound() {
  redirect(`/${DEFAULT_LOCALE}`);
}