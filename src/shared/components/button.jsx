import { forwardRef } from "react";
import "./button.css";

/**
 * Responsive Button component with mobile-first design
 * Features: proper touch targets, loading states, variants, accessibility
 */
export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "medium",
    isLoading = false,
    disabled = false,
    fullWidth = false,
    children,
    className = "",
    onClick,
    type = "button",
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  const baseClass = "button";
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    fullWidth && `${baseClass}--full-width`,
    isLoading && `${baseClass}--loading`,
    disabled && `${baseClass}--disabled`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (event) => {
    if (disabled || isLoading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="button__spinner" aria-hidden="true">
          <svg className="button__spinner-icon" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 31.416;15.708 15.708;0 31.416;0 31.416"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-15.708;-31.416;-31.416"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      )}
      <span
        className={isLoading ? "button__content--loading" : "button__content"}
      >
        {children}
      </span>
    </button>
  );
});
