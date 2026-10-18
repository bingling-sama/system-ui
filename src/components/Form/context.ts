import { createContext } from 'react';

export interface RuleItem {
  type?: 'string' | 'number' | 'email' | 'url' | 'pattern';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (value: unknown) => boolean | Promise<boolean>;
  message?: string;
}

export interface FormContextProps {
  layout?: 'horizontal' | 'vertical';
  initialValues?: Record<string, unknown>;
  rules?: Record<string, RuleItem[]>;
  validateField: (name: string, value: unknown) => Promise<string[]>;
  setFieldValue: (name: string, value: unknown) => void;
  getFieldValue: (name: string) => unknown;
  getFieldErrors: (name: string) => string[];
}

export const FormContext = createContext<FormContextProps>({
  validateField: async () => [],
  setFieldValue: () => {},
  getFieldValue: () => undefined,
  getFieldErrors: () => [],
});
