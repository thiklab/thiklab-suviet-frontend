import type { SVGProps } from "react";

export type IconName =
  | "logo"
  | "sparkles"
  | "clock"
  | "chevron-right"
  | "chevron-left"
  | "compass"
  | "bookmark"
  | "book-open"
  | "external-link"
  | "list"
  | "menu"
  | "x";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" {...props}>
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}
