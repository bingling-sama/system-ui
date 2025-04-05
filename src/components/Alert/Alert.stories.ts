import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Alert } from './';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClose: fn() },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Alert',
    description: 'This is a default alert message.',
    type: 'default',
  },
};

export const Success: Story = {
  args: {
    title: 'Success Alert',
    description: 'Operation completed successfully.',
    type: 'success',
  },
};

export const Warning: Story = {
  args: {
    title: 'Warning Alert',
    description: 'Please proceed with caution.',
    type: 'warning',
  },
};

export const Danger: Story = {
  args: {
    title: 'Danger Alert',
    description: 'An error has occurred.',
    type: 'danger',
  },
};

export const NotClosable: Story = {
  args: {
    title: 'Not Closable Alert',
    description: 'This alert cannot be closed.',
    type: 'default',
    closable: false,
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Title Only Alert',
    type: 'default',
  },
};

export const DescriptionOnly: Story = {
  args: {
    description: 'This is an alert with only a description.',
    type: 'success',
  },
};
