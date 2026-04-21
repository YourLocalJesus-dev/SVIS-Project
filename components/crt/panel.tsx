import * as React from "react"
import { cn } from "@/lib/utils"

/* Bordered panel with a label strip header. Used everywhere. */
export function Panel({
  label,
  right,
  children,
  className,
  accent = false,
}: {
  label?: string
  right?: React.ReactNode
  children: React.ReactNode
  className?: string
  accent?: boolean
}) {
  return (
    <section
      className={cn(
        "flex flex-col border-2 border-foreground bg-card text-card-foreground",
        "shadow-[4px_4px_0_0_var(--foreground)]",
        className,
      )}
    >
      {label && (
        <header
          className={cn(
            "flex items-center justify-between gap-2 border-b-2 border-foreground px-3 py-1.5",
            accent ? "bg-primary text-primary-foreground" : "bg-foreground text-background",
          )}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 bg-background/80" aria-hidden />
            <span className="font-display text-lg leading-none tracking-[0.25em]">{label}</span>
          </div>
          {right && <div className="font-mono text-[10px] uppercase tracking-widest">{right}</div>}
        </header>
      )}
      <div className="flex-1">{children}</div>
    </section>
  )
}

export function PageTitle({
  chip,
  title,
  sub,
}: {
  chip: string
  title: string
  sub?: string
}) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <span className="inline-block h-2 w-2 bg-primary" aria-hidden />
        {chip}
      </div>
      <h1 className="font-display text-5xl leading-none tracking-widest sm:text-6xl">{title}</h1>
      {sub && <p className="max-w-prose font-mono text-sm text-muted-foreground">{sub}</p>}
      <div className="dotted-rule mt-2" />
    </div>
  )
}

export function Chip({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode
  tone?: "default" | "primary" | "accent" | "secondary" | "muted"
  className?: string
}) {
  const tones: Record<string, string> = {
    default: "border-foreground bg-background text-foreground",
    primary: "border-primary bg-primary text-primary-foreground",
    accent: "border-foreground bg-accent text-accent-foreground",
    secondary: "border-secondary bg-secondary text-secondary-foreground",
    muted: "border-border bg-muted text-muted-foreground",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
