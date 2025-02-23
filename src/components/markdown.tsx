import type { ComponentProps } from "react";
import RMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown(props: ComponentProps<typeof RMarkdown>) {
  return <RMarkdown remarkPlugins={[remarkGfm]} {...props} />;
}
