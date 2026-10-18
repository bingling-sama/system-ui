'use client';

import React, { ReactNode, forwardRef } from 'react';
import './Form.scss';
import { FormContext, type RuleItem } from './context';
export type { RuleItem, FormContextProps } from './context';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  name?: string;
  initialValues?: Record<string, unknown>;
  layout?: 'horizontal' | 'vertical';
  rules?: Record<string, RuleItem[]>;
  onFinish?: (values: Record<string, unknown>) => void;
  onFinishFailed?: (errors: Record<string, string[]>) => void;
  children?: ReactNode;
  className?: string;
}

export const Form = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  const {
    name,
    initialValues = {},
    layout = 'horizontal',
    rules = {},
    onFinish,
    onFinishFailed,
    children,
    className,
    ...restProps
  } = props;

  const [formValues, setFormValues] =
    React.useState<Record<string, unknown>>(initialValues);
  const [formErrors, setFormErrors] = React.useState<Record<string, string[]>>(
    {}
  );

  const validateField = React.useCallback(
    async (name: string, value: unknown): Promise<string[]> => {
      const fieldRules = rules[name];
      if (!fieldRules) return [];

      try {
        const validations = fieldRules.map(async rule => {
          if (rule.required && !value) {
            return rule.message || 'This field is required';
          }

          if (!value) return null;

          if (
            rule.type === 'email' &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
          ) {
            return rule.message || 'Invalid email format';
          }
          if (rule.min && String(value).length < rule.min) {
            return rule.message || `Minimum length is ${rule.min}`;
          }
          if (rule.max && String(value).length > rule.max) {
            return rule.message || `Maximum length is ${rule.max}`;
          }
          if (rule.pattern && !rule.pattern.test(String(value))) {
            return rule.message || 'Invalid format';
          }
          if (rule.validator) {
            try {
              const result = await rule.validator(value);
              if (!result) {
                return rule.message || 'Validation failed';
              }
            } catch {
              return rule.message || 'Validation failed';
            }
          }
          return null;
        });

        const results = await Promise.all(validations);
        return results.filter((error): error is string => error !== null);
      } catch {
        return [];
      }
    },
    [rules]
  );

  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const validationVersions = React.useRef(new Map<string, number>());
  const valuesRef = React.useRef(formValues);
  const submissionVersion = React.useRef(0);
  const mounted = React.useRef(true);

  React.useEffect(() => {
    const pendingTimers = timers.current;
    const versions = validationVersions.current;
    mounted.current = true;
    return () => {
      mounted.current = false;
      pendingTimers.forEach(clearTimeout);
      pendingTimers.clear();
      versions.clear();
      submissionVersion.current += 1;
    };
  }, []);

  const setFieldValue = React.useCallback(
    (name: string, value: unknown) => {
      valuesRef.current = { ...valuesRef.current, [name]: value };
      setFormValues(valuesRef.current);
      submissionVersion.current += 1;
      clearTimeout(timers.current.get(name));
      const version = (validationVersions.current.get(name) ?? 0) + 1;
      validationVersions.current.set(name, version);
      timers.current.set(
        name,
        setTimeout(() => {
          timers.current.delete(name);
          void validateField(name, value).then(errors => {
            if (
              mounted.current &&
              validationVersions.current.get(name) === version
            ) {
              setFormErrors(prev => ({ ...prev, [name]: errors }));
            }
          });
        }, 200)
      );
    },
    [validateField]
  );

  const getFieldValue = React.useCallback(
    (name: string) => {
      return formValues[name];
    },
    [formValues]
  );

  const getFieldErrors = React.useCallback(
    (name: string) => {
      return formErrors[name] || [];
    },
    [formErrors]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const version = ++submissionVersion.current;
    const values = valuesRef.current;
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    validationVersions.current.forEach((version, name) => {
      validationVersions.current.set(name, version + 1);
    });
    const results = await Promise.all(
      Object.keys(rules).map(
        async name => [name, await validateField(name, values[name])] as const
      )
    );
    if (!mounted.current || submissionVersion.current !== version) return;

    const allErrors = Object.fromEntries(
      results.filter(([, errors]) => errors.length > 0)
    );
    setFormErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      onFinishFailed?.(allErrors);
    } else {
      onFinish?.(values);
    }
  };

  const classes =
    `viking-form ${layout ? `viking-form-${layout}` : ''} ${className || ''}`.trim();

  const contextValue = React.useMemo(
    () => ({
      layout,
      initialValues,
      rules,
      validateField,
      setFieldValue,
      getFieldValue,
      getFieldErrors,
    }),
    [
      layout,
      initialValues,
      rules,
      validateField,
      setFieldValue,
      getFieldValue,
      getFieldErrors,
    ]
  );

  return (
    <form
      name={name}
      className={classes}
      ref={ref}
      onSubmit={handleSubmit}
      {...restProps}
    >
      <FormContext.Provider value={contextValue}>
        {children}
      </FormContext.Provider>
    </form>
  );
});

Form.displayName = 'Form';

export default Form;
