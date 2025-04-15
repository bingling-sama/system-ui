import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Input from './Input';
import * as React from 'react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Please input',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithPrefix: Story = {
  args: {
    placeholder: 'Input with prefix',
    prefix: '@',
  },
};

export const WithSuffix: Story = {
  args: {
    placeholder: 'Input with suffix',
    suffix: '.com',
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    placeholder: 'Input with prefix and suffix',
    prefix: 'https://',
    suffix: '.com',
  },
};

export const LargeSize: Story = {
  args: {
    placeholder: 'Large input',
    size: 'lg',
  },
};

export const SmallSize: Story = {
  args: {
    placeholder: 'Small input',
    size: 'sm',
  },
};

export const WithAutocomplete: Story = {
  args: {
    placeholder: 'Type your name',
    autocomplete: 'name',
  },
};

export const WithAutocompleteOff: Story = {
  args: {
    placeholder: 'No autocomplete',
    autocomplete: 'off',
  },
};

export const WithCustomSuggestions: Story = {
  args: {
    placeholder: 'Type a fruit',
    suggestions: [
      'Apple',
      'Banana',
      'Cherry',
      'Durian',
      'Elderberry',
      'Fig',
      'Grape',
      'Honeydew',
    ],
    onSelectSuggestion: fn(),
  },
};

const WithFilteredSuggestionsComponent = () => {
  const [value, setValue] = React.useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div style={{ width: '300px' }}>
      <Input
        placeholder="Type 'a' to see suggestions"
        value={value}
        onChange={handleChange}
        suggestions={[
          'Apple',
          'Apricot',
          'Avocado',
          'Banana',
          'Blackberry',
          'Blueberry',
          'Cherry',
        ]}
        onSelectSuggestion={val => console.log(`Selected: ${val}`)}
      />
    </div>
  );
};

export const WithFilteredSuggestions: Story = {
  render: () => <WithFilteredSuggestionsComponent />,
};
