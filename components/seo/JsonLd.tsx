interface Props {
  data: Record<string, unknown> | Record<string, unknown>[];
}

// Escape "<" để chuỗi trong JSON không thể đóng thẻ script sớm
export function JsonLd({ data }: Props) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
