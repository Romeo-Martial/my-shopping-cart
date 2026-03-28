import { forwardRef } from 'react';
import './FormField.css';

/**
 * Enhanced form field component with validation, accessibility, and UX features
 */
export const FormField = forwardRef(function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  helperText,
  error,
  success,
  required,
  disabled,
  className = '',
  inputClassName = '',
  errorProps = {},
  children,
  ...inputProps
}, ref) {
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success);
  const fieldId = inputProps.id || name;
  const errorId = `${fieldId}-error`;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  
  const inputClasses = [
    'form-field__input',
    hasError && 'form-field__input--error',
    hasSuccess && 'form-field__input--success',
    disabled && 'form-field__input--disabled',
    inputClassName
  ].filter(Boolean).join(' ');

  const fieldClasses = [
    'form-field',
    hasError && 'form-field--error',
    hasSuccess && 'form-field--success',
    disabled && 'form-field--disabled',
    className
  ].filter(Boolean).join(' ');

  // Build aria-describedby
  const describedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
    inputProps['aria-describedby']
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={fieldClasses}>
      {label && (
        <label 
          htmlFor={fieldId} 
          className="form-field__label"
        >
          {label}
          {required && (
            <span className="form-field__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      <div className="form-field__input-wrapper">
        {children ? (
          // Custom input (like select, textarea)
          children
        ) : (
          <input
            ref={ref}
            id={fieldId}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            {...inputProps}
          />
        )}

        {/* Success icon */}
        {hasSuccess && !hasError && (
          <div className="form-field__icon form-field__icon--success" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </div>
        )}

        {/* Error icon */}
        {hasError && (
          <div className="form-field__icon form-field__icon--error" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        )}
      </div>

      {/* Helper text */}
      {helperText && !hasError && (
        <div 
          id={helperId}
          className="form-field__helper"
        >
          {helperText}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div 
          id={errorId}
          className="form-field__error"
          role="alert"
          aria-live="polite"
          {...errorProps}
        >
          {error}
        </div>
      )}
    </div>
  );
});

/**
 * Select field component
 */
export function SelectField({
  label,
  name,
  options = [],
  placeholder = 'Select an option',
  error,
  success,
  required,
  disabled,
  className = '',
  ...props
}) {
  return (
    <FormField
      label={label}
      name={name}
      error={error}
      success={success}
      required={required}
      disabled={disabled}
      className={className}
    >
      <select
        id={props.id || name}
        name={name}
        disabled={disabled}
        required={required}
        className={`form-field__input ${error ? 'form-field__input--error' : ''} ${success ? 'form-field__input--success' : ''}`}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

/**
 * Textarea field component
 */
export function TextareaField({
  label,
  name,
  rows = 3,
  error,
  success,
  required,
  disabled,
  className = '',
  ...props
}) {
  return (
    <FormField
      label={label}
      name={name}
      error={error}
      success={success}
      required={required}
      disabled={disabled}
      className={className}
    >
      <textarea
        id={props.id || name}
        name={name}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`form-field__input form-field__textarea ${error ? 'form-field__input--error' : ''} ${success ? 'form-field__input--success' : ''}`}
        aria-invalid={Boolean(error)}
        {...props}
      />
    </FormField>
  );
}

/**
 * Checkbox field component
 */
export function CheckboxField({
  label,
  name,
  error,
  success,
  required,
  disabled,
  className = '',
  children,
  ...props
}) {
  const fieldId = props.id || name;
  const errorId = `${fieldId}-error`;

  return (
    <div className={`form-field form-field--checkbox ${error ? 'form-field--error' : ''} ${className}`}>
      <div className="form-field__checkbox-wrapper">
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          disabled={disabled}
          required={required}
          className="form-field__checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        
        {label && (
          <label htmlFor={fieldId} className="form-field__checkbox-label">
            {label}
            {required && (
              <span className="form-field__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
      </div>

      {children && (
        <div className="form-field__checkbox-content">
          {children}
        </div>
      )}

      {error && (
        <div 
          id={errorId}
          className="form-field__error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}