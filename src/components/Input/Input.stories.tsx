import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Input from './Input';

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
