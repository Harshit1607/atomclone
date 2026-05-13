"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { setSessionId } from "./sessionSlice";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    // Hydrate sessionId from sessionStorage after mount (client-only)
    const savedId = sessionStorage.getItem("protoai_session_id");
    if (savedId) {
      store.dispatch(setSessionId(savedId));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
