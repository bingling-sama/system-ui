'use client';

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  SelectHTMLAttributes,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import './Select.scss';

export type SelectSize = 'lg' | 'sm';

export interface SelectOption {
  /**
   * Option value
   */
  value: string;
  /**
   * Option label
   */
  label: string;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple'> {
  /**
   * Select size
   */
  size?: SelectSize;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Whether multiple selection is allowed
   */
  multiple?: boolean;
  /**
   * Select options
   */
  options?: SelectOption[];
  /**
   * Callback when select value changes
   */
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Select component for selecting from a list of options
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size,
      disabled = false,
      multiple = false,
      options = [],
      onChange,
      className = '',
      style,
      ...restProps
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndices, setSelectedIndices] = useState<number[]>(() => {
      if (multiple) {
        // Handle multiple selection initialization
        if (restProps.defaultValue) {
          const defaultValues = Array.isArray(restProps.defaultValue)
            ? restProps.defaultValue
            : [restProps.defaultValue];
          return defaultValues
            .map(value => options.findIndex(option => option.value === value))
            .filter(index => index >= 0);
        }
        if (restProps.value) {
          const values = Array.isArray(restProps.value)
            ? restProps.value
            : [restProps.value];
          return values
            .map(value => options.findIndex(option => option.value === value))
            .filter(index => index >= 0);
        }
        return [];
      } else {
        // Single selection initialization
        if (restProps.defaultValue) {
          const index = options.findIndex(
            option => option.value === restProps.defaultValue
          );
          return index >= 0 ? [index] : [0];
        }
        if (restProps.value) {
          const index = options.findIndex(
            option => option.value === restProps.value
          );
          return index >= 0 ? [index] : [0];
        }
        return [0];
      }
    });
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Scroll to highlighted option
    useEffect(() => {
      if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
        const highlightedElement = dropdownRef.current.children[
          highlightedIndex
        ] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
          });
        }
      }
    }, [isOpen, highlightedIndex]);

    const handleToggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen) {
          setHighlightedIndex(selectedIndices[0] || 0);
        }
      }
    };

    const handleOptionClick = (index: number) => {
      if (options[index].disabled) return;

      if (multiple) {
        // For multiple selection, toggle the selected state
        setSelectedIndices(prevIndices => {
          const isSelected = prevIndices.includes(index);
          const newIndices = isSelected
            ? prevIndices.filter(i => i !== index)
            : [...prevIndices, index];

          // Create a synthetic event to pass to onChange
          if (onChange && selectRef.current) {
            const selectedValues = newIndices.map(i => options[i].value);
            const syntheticEvent = {
              target: {
                value: selectedValues,
                name: restProps.name,
                selectedOptions: newIndices.map(i => ({
                  value: options[i].value,
                })),
              },
            } as unknown as ChangeEvent<HTMLSelectElement>;

            onChange(syntheticEvent);
          }

          return newIndices;
        });
        // Don't close dropdown for multiple selection
      } else {
        // For single selection
        setSelectedIndices([index]);
        setIsOpen(false);

        // Create a synthetic event to pass to onChange
        if (onChange && selectRef.current) {
          const syntheticEvent = {
            target: {
              value: options[index].value,
              name: restProps.name,
            },
          } as unknown as ChangeEvent<HTMLSelectElement>;

          onChange(syntheticEvent);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            handleOptionClick(highlightedIndex);
          } else {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setHighlightedIndex(selectedIndices[0] || 0);
            }
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex(prevIndex => {
              let newIndex = prevIndex + 1;
              while (newIndex < options.length && options[newIndex].disabled) {
                newIndex++;
              }
              return newIndex >= options.length ? prevIndex : newIndex;
            });
          } else {
            setIsOpen(true);
            setHighlightedIndex(selectedIndices[0] || 0);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex(prevIndex => {
              let newIndex = prevIndex - 1;
              while (newIndex >= 0 && options[newIndex].disabled) {
                newIndex--;
              }
              return newIndex < 0 ? prevIndex : newIndex;
            });
          } else {
            setIsOpen(true);
            setHighlightedIndex(selectedIndices[0] || 0);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
        default:
          break;
      }
    };

    const classes = [
      'select-wrapper',
      size ? `select-size-${size}` : '',
      disabled ? 'is-disabled' : '',
      multiple ? 'select-multiple' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Format selected values for display
    const displayValue = () => {
      if (options.length === 0 || selectedIndices.length === 0) return '';

      if (multiple) {
        if (selectedIndices.length === 0) {
          return '';
        } else if (selectedIndices.length === 1) {
          return options[selectedIndices[0]]?.label || '';
        } else {
          return `${selectedIndices.length} items selected`;
        }
      } else {
        return options[selectedIndices[0]]?.label || '';
      }
    };

    return (
      <div
        className={classes}
        style={style}
        ref={selectRef}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        role="combobox"
        aria-multiselectable={multiple}
      >
        <div
          className={`select-trigger ${isOpen ? 'select-trigger--open' : ''}`}
          onClick={handleToggleDropdown}
        >
          <span className="select-value">{displayValue()}</span>
          <span className="select-arrow"></span>
        </div>

        {isOpen && (
          <ul
            className="select-dropdown"
            role="listbox"
            ref={dropdownRef}
            aria-activedescendant={`select-option-${highlightedIndex}`}
            aria-multiselectable={multiple}
          >
            {options.map((option, index) => {
              const isSelected = selectedIndices.includes(index);
              return (
                <li
                  key={option.value}
                  id={`select-option-${index}`}
                  className={`select-option ${
                    isSelected ? 'select-option--selected' : ''
                  } ${
                    index === highlightedIndex
                      ? 'select-option--highlighted'
                      : ''
                  } ${option.disabled ? 'select-option--disabled' : ''}`}
                  onClick={() => handleOptionClick(index)}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                >
                  {multiple && (
                    <span className="select-option-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        tabIndex={-1}
                        onClick={e => e.stopPropagation()}
                      />
                    </span>
                  )}
                  <span className="select-option-label">{option.label}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Hidden native select for form submission */}
        <select
          ref={ref}
          name={restProps.name}
          disabled={disabled}
          multiple={multiple}
          value={
            multiple
              ? selectedIndices.map(i => options[i]?.value)
              : options[selectedIndices[0]]?.value
          }
          onChange={onChange}
          className="select-native"
          aria-hidden="true"
          tabIndex={-1}
          {...restProps}
        >
          {options.map((option, index) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              selected={selectedIndices.includes(index)}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
