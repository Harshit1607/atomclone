"use client";

import { useEffect } from "react";

export function WebComponentRegistrar() {
  useEffect(() => {
    import("./register");
  }, []);

  return null;
}
