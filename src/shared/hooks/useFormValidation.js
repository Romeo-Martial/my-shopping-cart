import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for form validation with real-time feedback and good UX patterns
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @param {Object} options - Additional options
 * @returns {Object} Form state and handlers
 */
export function useFormValidation(initialValues = {}, validationRules = {}, options = {}) {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    validateOnSubmit = true,
    ...restOptions
  } = options;

  // Form state
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Validation function for a single field
  const validateField = useCallback((fieldName, value) => {
    const rule = validationRules[fieldName];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.requiredMessage || `${fieldName} is required`;
    }

    // Min length validation
    if (rule.minLength && value && value.length < rule.minLength) {
      return rule.minLengthMessage || `${fieldName} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (rule.maxLength && value && value.length > rule.maxLength) {
      return rule.maxLengthMessage || `${fieldName} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation (regex)
    if (rule.pattern && value && !rule.pattern.test(value)) {
      return rule.patternMessage || `${fieldName} format is invalid`;
    }

    // Email validation
    if (rule.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return rule.emailMessage || 'Please enter a valid email address';
      }
    }

    // Custom validation function
    if (rule.validate && typeof rule.validate === 'function') {
      const customError = rule.validate(value, values);
      if (customError) {
        return customError;
      }
    }

    return null;
  }, [validationRules, values]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [validationRules, values, validateField]);

  // Handle field value change
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Real-time validation if enabled or form was submitted
    if (validateOnChange || submitAttempted) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [validateField, validateOnChange, submitAttempted]);

  // Handle field blur
  const handleBlur = useCallback((event) => {
    const { name } = event.target;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur if enabled or form was submitted
    if (validateOnBlur || submitAttempted) {
      const error = validateField(name, values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [validateField, validateOnBlur, values, submitAttempted]);

  // Handle form submission
  const handleSubmit = useCallback(async (onSubmit) => {
    setSubmitAttempted(true);
    setIsSubmitting(true);

    try {
      if (validateOnSubmit) {
        const isValid = validateForm();
        if (!isValid) {
          // Mark all fields as touched to show errors
          const allTouched = {};
          Object.keys(validationRules).forEach(key => {
            allTouched[key] = true;
          });
          setTouched(allTouched);
          return false;
        }
      }

      // Call the submit handler
      if (onSubmit) {
        await onSubmit(values);
      }
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, validateOnSubmit, validationRules, values]);

  // Reset form
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitAttempted(false);
  }, [initialValues]);

  // Set field value programmatically
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate if needed
    if (validateOnChange || submitAttempted) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [validateField, validateOnChange, submitAttempted]);

  // Set field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  // Get field props for easy integration
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': !!(errors[name] && (touched[name] || submitAttempted)),
    'aria-describedby': errors[name] && (touched[name] || submitAttempted) ? `${name}-error` : undefined
  }), [values, handleChange, handleBlur, errors, touched, submitAttempted]);

  // Get field error props
  const getFieldErrorProps = useCallback((name) => ({
    id: `${name}-error`,
    role: 'alert',
    'aria-live': 'polite'
  }), []);

  // Computed values
  const isValid = useMemo(() => {
    return Object.keys(errors).every(key => !errors[key]);
  }, [errors]);

  const hasErrors = useMemo(() => {
    return Object.keys(errors).some(key => errors[key] && (touched[key] || submitAttempted));
  }, [errors, touched, submitAttempted]);

  return {
    // Form state
    values,
    errors,
    touched,
    isSubmitting,
    submitAttempted,
    isValid,
    hasErrors,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
    setFieldError,
    validateField,
    validateForm,

    // Helper functions
    getFieldProps,
    getFieldErrorProps
  };
}

// Validation helper functions
export const validationRules = {
  required: (message = 'This field is required') => ({
    required: true,
    requiredMessage: message
  }),

  minLength: (length, message) => ({
    minLength: length,
    minLengthMessage: message || `Must be at least ${length} characters`
  }),

  maxLength: (length, message) => ({
    maxLength: length,
    maxLengthMessage: message || `Must be no more than ${length} characters`
  }),

  email: (message = 'Please enter a valid email address') => ({
    type: 'email',
    emailMessage: message
  }),

  pattern: (regex, message) => ({
    pattern: regex,
    patternMessage: message
  }),

  custom: (validator, message) => ({
    validate: validator,
    customMessage: message
  })
};

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  postalCode: /^[A-Za-z0-9\s-]+$/,
  phoneNumber: /^[\+]?[1-9][\d]{0,15}$/,
  creditCard: /^[0-9]{13,19}$/,
  name: /^[a-zA-ZÀ-ÿ\s'-]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};