import { useEffect } from "react";
import { useRef } from "react";

export const useBeforeUnload = (raw: string) => {
  const onbeforeUnloadRef = useRef<(e: BeforeUnloadEvent) => void>(() => null);

  useEffect(() => {
    onbeforeUnloadRef.current = (e: BeforeUnloadEvent) => {
      if (!raw.length || !raw.trim()) {
        return;
      }

      e.preventDefault();
    };
  }, [raw]);

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeUnloadRef.current);

    return () => {
      window.removeEventListener("beforeunload", onbeforeUnloadRef.current);
    };
  }, [raw]);
};
