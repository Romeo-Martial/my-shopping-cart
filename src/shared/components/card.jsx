import "./card.css";

/**
 * Responsive Card component with mobile-first design
 * Features: flexible content layout, hover effects, responsive spacing
 */
export function Card({
  variant = "default",
  padding = "medium",
  shadow = "subtle",
  hover = false,
  children,
  className = "",
  as: Component = "div",
  ...props
}) {
  const baseClass = "card";
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--padding-${padding}`,
    `${baseClass}--shadow-${shadow}`,
    hover && `${baseClass}--hover`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

/**
 * Card Header component for consistent card headers
 */
export function CardHeader({ children, className = "", ...props }) {
  return (
    <header className={`card__header ${className}`} {...props}>
      {children}
    </header>
  );
}

/**
 * Card Body component for main card content
 */
export function CardBody({ children, className = "", ...props }) {
  return (
    <div className={`card__body ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * Card Footer component for card actions or secondary content
 */
export function CardFooter({ children, className = "", ...props }) {
  return (
    <footer className={`card__footer ${className}`} {...props}>
      {children}
    </footer>
  );
}
