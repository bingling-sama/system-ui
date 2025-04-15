'use client';

import React, {
  ChangeEvent,
  InputHTMLAttributes,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from 'react';
import './Input.scss';

export type InputSize = 'lg' | 'sm';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /**
   * Input size
   */
  size?: InputSize;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Input prefix
   */
  prefix?: React.ReactNode;
  /**
   * Input suffix
   */
  suffix?: React.ReactNode;
  /**
   * Callback when input value changes
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Enable autocomplete functionality
   * @example 'on' | 'off' | 'name' | 'email' | 'username' | 'current-password' | etc.
   */
  autocomplete?: string;
  /**
   * Custom autocomplete suggestions
   * @example ['apple', 'banana', 'cherry']
   */
  suggestions?: string[];
  /**
   * Callback when a suggestion is selected
   */
  onSelectSuggestion?: (value: string) => void;
}

/**
 * Input component for user text input
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      disabled = false,
      prefix,
      suffix,
      className = '',
      style,
      autocomplete,
      suggestions = [],
      onChange,
      onSelectSuggestion,
      ...restProps
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(
      restProps.value?.toString() || ''
    );
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(
      []
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);

    // Update input value when value prop changes
    useEffect(() => {
      if (restProps.value !== undefined) {
        setInputValue(restProps.value.toString());
      }
    }, [restProps.value]);

    // Filter suggestions based on input value
    useEffect(() => {
      if (suggestions.length > 0 && inputValue) {
        const filtered = suggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions([]);
      }
    }, [inputValue, suggestions]);

    // Handle click outside to close suggestions
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          suggestionsRef.current &&
          !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1);

      if (onChange) {
        onChange(e);
      }
    };

    const handleSuggestionClick = (suggestion: string) => {
      setInputValue(suggestion);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);

      if (onSelectSuggestion) {
        onSelectSuggestion(suggestion);
      }

      // Create a synthetic event to pass to onChange
      if (onChange && inputRef.current) {
        const syntheticEvent = {
          target: { ...inputRef.current, value: suggestion },
          currentTarget: inputRef.current,
        } as unknown as ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Only handle keys if suggestions are showing
      if (!showSuggestions || filteredSuggestions.length === 0) return;

      // Arrow down
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex =>
          prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
        );
      }
      // Arrow up
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
        );
      }
      // Enter
      else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
      }
      // Escape
      else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    };

    const handleFocus = () => {
      if (suggestions.length > 0 && inputValue) {
        setShowSuggestions(true);
      }
    };

    const classes = [
      'input-wrapper',
      size ? `input-size-${size}` : '',
      disabled ? 'is-disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classes} style={style}>
        {prefix && <div className="input-prefix">{prefix}</div>}
        <input
          className="input-inner"
          disabled={disabled}
          autoComplete={autocomplete}
          ref={node => {
            // Handle both the forwardRef and our local ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            inputRef.current = node;
          }}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          {...restProps}
        />
        {suffix && <div className="input-suffix">{suffix}</div>}

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="input-suggestions" ref={suggestionsRef}>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className={`input-suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
