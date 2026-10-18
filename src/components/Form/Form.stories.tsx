import type { Meta, StoryObj } from '@storybook/react';
import Form, { RuleItem } from './Form';
import FormItem from './FormItem';
import Input from '../Input';
import Button from '../Button';

const handleFinish = (values: Record<string, unknown>) => {
  console.log('Form values:', values);
};

const handleFinishFailed = (errors: Record<string, string[]>) => {
  console.log('Form validation failed:', errors);
};

const basicRules: Record<string, RuleItem[]> = {
  username: [{ required: true, message: 'Please enter your username' }],
  email: [
    { required: true, message: 'Please enter your email' },
    { type: 'email', message: 'Please enter a valid email' },
  ],
  password: [
    { required: true, message: 'Please enter your password' },
    { min: 6, message: 'Password must be at least 6 characters' },
  ],
};

const simpleRules: Record<string, RuleItem[]> = {
  username: [{ required: true, message: 'Please enter your username' }],
  email: [{ type: 'email', message: 'Please enter a valid email' }],
};

const formStyle = { maxWidth: '600px' };

const meta = {
  title: 'Form',
  component: Form,
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicForm: Story = {
  render: () => (
    <Form
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      style={formStyle}
      rules={basicRules}
    >
      <FormItem label="Username" name="username">
        <Input />
      </FormItem>
      <FormItem label="Email" name="email">
        <Input />
      </FormItem>
      <FormItem label="Password" name="password">
        <Input type="password" />
      </FormItem>
      <FormItem name="submit-button">
        <Button type="submit">Submit</Button>
      </FormItem>
    </Form>
  ),
};

export const HorizontalForm: Story = {
  render: () => (
    <Form
      layout="horizontal"
      style={formStyle}
      rules={simpleRules}
      onFinish={handleFinish}
    >
      <FormItem label="Username" name="username" required>
        <Input placeholder="Please enter your username" />
      </FormItem>
      <FormItem
        label="Email"
        name="email"
        help="We'll never share your email with anyone else."
      >
        <Input type="email" placeholder="Please enter your email" />
      </FormItem>
      <FormItem name="submit-button">
        <Button type="submit">Submit</Button>
      </FormItem>
    </Form>
  ),
};

export const VerticalForm: Story = {
  render: () => (
    <Form
      layout="vertical"
      style={formStyle}
      rules={simpleRules}
      onFinish={handleFinish}
    >
      <FormItem label="Username" name="username" required>
        <Input placeholder="Please enter your username" />
      </FormItem>
      <FormItem label="Email" name="email">
        <Input type="email" placeholder="Please enter your email" />
      </FormItem>
      <FormItem name="submit-button">
        <Button type="submit">Submit</Button>
      </FormItem>
    </Form>
  ),
};
