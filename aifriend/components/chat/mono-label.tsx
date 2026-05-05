import { cn } from "@/lib/utils"

export function MonoLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] font-medium tracking-[0.08em] uppercase",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
