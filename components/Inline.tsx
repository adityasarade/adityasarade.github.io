import { Fragment } from "react";

/* Renders `backticked` spans in copy as real <code> elements. */
export default function Inline({ text }: { text: string }) {
  const parts = text.split("`");
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <code key={i}>{p}</code> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}
