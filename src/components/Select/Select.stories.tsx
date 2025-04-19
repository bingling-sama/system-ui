import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Select from './Select';
import * as React from 'react';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
  decorators: [
    Story => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { value: 'name', label: 'name' },
      { value: 'age', label: 'age' },
      { value: 'dob', label: 'date of birth' },
    ],
  },
};

export const WithDefaultValue: Story = {
  args: {
    options: [
      { value: 'name', label: 'name' },
      { value: 'age', label: 'age' },
      { value: 'dob', label: 'date of birth' },
    ],
    defaultValue: 'dob',
  },
};

export const Disabled: Story = {
  args: {
    options: [
      { value: 'name', label: 'name' },
      { value: 'age', label: 'age' },
      { value: 'dob', label: 'date of birth' },
    ],
    disabled: true,
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { value: 'name', label: 'name' },
      { value: 'age', label: 'age', disabled: true },
      { value: 'dob', label: 'date of birth' },
    ],
  },
};

export const LargeSize: Story = {
  args: {
    options: [
      { value: 'name', label: 'name' },
      { value: 'age', label: 'age' },
      { value: 'dob', label: 'date of birth' },
    ],
    size: 'lg',
  },
};

export const SmallSize: Story = {
  args: {
    options: [
      { value: 'name', label: 'name' },
      { value: 'age', label: 'age' },
      { value: 'dob', label: 'date of birth' },
    ],
    size: 'sm',
  },
};

const ControlledSelectComponent = () => {
  const [value, setValue] = React.useState('name');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    console.log(`Selected: ${e.target.value}`);
  };

  return (
    <Select
      options={[
        { value: 'name', label: 'name' },
        { value: 'age', label: 'age' },
        { value: 'dob', label: 'date of birth' },
        { value: 'email', label: 'email address' },
        { value: 'phone', label: 'phone number' },
      ]}
      value={value}
      onChange={handleChange}
    />
  );
};

export const ControlledSelect: Story = {
  render: () => <ControlledSelectComponent />,
};

export const ManyOptions: Story = {
  args: {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'date', label: 'Date' },
      { value: 'elderberry', label: 'Elderberry' },
      { value: 'fig', label: 'Fig' },
      { value: 'grape', label: 'Grape' },
      { value: 'honeydew', label: 'Honeydew' },
      { value: 'kiwi', label: 'Kiwi' },
      { value: 'lemon', label: 'Lemon' },
      { value: 'mango', label: 'Mango' },
      { value: 'nectarine', label: 'Nectarine' },
      { value: 'orange', label: 'Orange' },
      { value: 'papaya', label: 'Papaya' },
    ],
  },
};

const MultipleSelectComponent = () => {
  const [values, setValues] = React.useState<string[]>(['apple', 'banana']);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValues = Array.isArray(e.target.value)
      ? e.target.value
      : [e.target.value];
    setValues(newValues);
    console.log('Selected values:', newValues);
  };

  return (
    <Select
      multiple
      options={[
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'date', label: 'Date' },
        { value: 'elderberry', label: 'Elderberry' },
        { value: 'fig', label: 'Fig' },
        { value: 'grape', label: 'Grape' },
      ]}
      value={values}
      onChange={handleChange}
    />
  );
};

export const MultipleSelect: Story = {
  render: () => <MultipleSelectComponent />,
};

export const SimpleMultipleSelect: Story = {
  args: {
    multiple: true,
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'date', label: 'Date' },
      { value: 'elderberry', label: 'Elderberry' },
    ],
    defaultValue: ['apple', 'cherry'],
  },
};
