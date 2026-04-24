import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "~/lib/utils";

type CommonProps = {
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type BeamButtonProps = ButtonProps | LinkProps;

/**
 * Aceternity-style moving-border button. The beam slice is always visible,
 * but the full ring animation fades in on hover/focus for a subtle hint of
 * motion on first paint.
 */
export function BeamButton({ className, children, ...props }: BeamButtonProps) {
  if ("href" in props && props.href) {
    const { href, ...rest } = props as LinkProps;
    return (
      <a href={href} className={cn("btn-beam", className)} {...rest}>
        <span>{children}</span>
      </a>
    );
  }
  const rest = props as ButtonProps;
  return (
    <button className={cn("btn-beam", className)} {...rest}>
      <span>{children}</span>
    </button>
  );
}
