import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "proto-ai-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "api-key"?: string },
        HTMLElement
      >;
    }
  }
}
