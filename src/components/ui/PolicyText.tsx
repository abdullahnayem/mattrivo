import { Fragment } from "react";

/**
 * Renders copy containing {{unconfirmed}} segments. Those segments are shown
 * as visible, editable placeholders so the business can confirm them.
 */
export function PolicyText({ text }: { text: string }) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("{{") ? (
          <span key={i} className="placeholder-chip" title="To be confirmed by mattrivo">
            {part.slice(2, -2)}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
