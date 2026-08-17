"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Chip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import {
  fetchAccount,
  formatInterface,
  OnChainError,
  type OnChainAccount,
  type OnChainErrorCode,
} from "./on-chain";

type State =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "loaded"; account: OnChainAccount }
  | { phase: "error"; code: OnChainErrorCode };

type Props = {
  /** Mainnet non-bounceable form of the validated address. */
  address: string;
  /** Testnet addresses do not exist on the mainnet API this panel queries. */
  disabled?: boolean;
};

const STATUS_COLOR: Record<string, "success" | "warning" | "default"> = {
  active: "success",
  uninit: "warning",
  frozen: "warning",
  nonexist: "warning",
};

/** Statuses we have a translation for; anything else is shown verbatim. */
const KNOWN_STATUSES = ["active", "uninit", "frozen", "nonexist"];

/**
 * Opt-in on-chain lookup. Nothing is requested until the user presses the
 * button, which keeps the "your address never leaves the browser" promise true
 * for the validation itself.
 */
export const AddressCheckerOnChain = ({ address, disabled }: Props) => {
  const t = useTranslations("checker");
  const [state, setState] = useState<State>({ phase: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  // A new address invalidates whatever is on screen.
  useEffect(() => {
    abortRef.current?.abort();
    setState({ phase: "idle" });
  }, [address]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleCheck = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ phase: "loading" });

    try {
      const account = await fetchAccount(address, controller.signal);
      if (!controller.signal.aborted) {
        setState({ phase: "loaded", account });
      }
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }
      setState({
        phase: "error",
        code: error instanceof OnChainError ? error.code : "network",
      });
    }
  }, [address]);

  if (disabled) {
    return (
      <p className="text-sm text-default-400">{t("onchain.testnetUnavailable")}</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          color="primary"
          variant="flat"
          isLoading={state.phase === "loading"}
          onPress={handleCheck}
        >
          {t("onchain.action")}
        </Button>
        <span className="text-xs text-default-400">{t("onchain.hint")}</span>
      </div>

      {state.phase === "error" && (
        <p className="text-sm text-danger">{t(`onchain.error.${state.code}`)}</p>
      )}

      {state.phase === "loaded" && (
        <div className="rounded-medium border border-divider bg-default-50 px-4 py-3 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              size="sm"
              variant="flat"
              color={STATUS_COLOR[state.account.status] ?? "default"}
            >
              {KNOWN_STATUSES.includes(state.account.status)
                ? t(`onchain.status.${state.account.status}`)
                : state.account.status}
            </Chip>
            {state.account.isWallet && (
              <Chip size="sm" variant="flat">
                {t("onchain.isWallet")}
              </Chip>
            )}
            {state.account.isScam && (
              <Chip size="sm" variant="flat" color="danger">
                {t("onchain.isScam")}
              </Chip>
            )}
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs uppercase tracking-wide text-default-400">
                {t("onchain.balance")}
              </dt>
              <dd className="font-medium font-mono">{state.account.balance} TON</dd>
            </div>

            {state.account.interfaces.length > 0 && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-default-400">
                  {t("onchain.contract")}
                </dt>
                <dd className="font-medium">
                  {state.account.interfaces.map(formatInterface).join(", ")}
                </dd>
              </div>
            )}

            {state.account.name && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-default-400">
                  {t("onchain.label")}
                </dt>
                <dd className="font-medium">{state.account.name}</dd>
              </div>
            )}
          </dl>

          {state.account.status === "uninit" && (
            <p className="text-sm text-default-500 leading-relaxed">
              {t("onchain.uninitExplainer")}
            </p>
          )}

          <p className="text-xs text-default-400">{t("onchain.source")}</p>
        </div>
      )}
    </div>
  );
};
