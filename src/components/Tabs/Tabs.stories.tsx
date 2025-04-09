import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Tabs, TabItem } from './';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
  args: { onSelect: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultActiveKey: 'tab1',
    children: <></>,
  },
  render: args => (
    <Tabs {...args}>
      <TabItem itemKey="tab1" tab="Tab 1">
        <p>Content for Tab 1</p>
      </TabItem>
      <TabItem itemKey="tab2" tab="Tab 2">
        <p>Content for Tab 2</p>
      </TabItem>
      <TabItem itemKey="tab3" tab="Tab 3">
        <p>Content for Tab 3</p>
      </TabItem>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  args: {
    defaultActiveKey: 'tab1',
    children: <></>,
  },
  render: args => (
    <Tabs {...args}>
      <TabItem itemKey="tab1" tab="Tab 1">
        <p>Content for Tab 1</p>
      </TabItem>
      <TabItem itemKey="tab2" tab="Tab 2" disabled>
        <p>Content for Tab 2 (Disabled)</p>
      </TabItem>
      <TabItem itemKey="tab3" tab="Tab 3">
        <p>Content for Tab 3</p>
      </TabItem>
    </Tabs>
  ),
};

export const WithCustomContent: Story = {
  args: {
    defaultActiveKey: 'tab1',
    children: <></>,
  },
  render: args => (
    <Tabs {...args}>
      <TabItem itemKey="tab1" tab="Info">
        <div>
          <h3>Information Tab</h3>
          <p>This tab contains information about the product.</p>
        </div>
      </TabItem>
      <TabItem itemKey="tab2" tab="Settings">
        <div>
          <h3>Settings Tab</h3>
          <p>Configure your settings here.</p>
          <button>Save Settings</button>
        </div>
      </TabItem>
      <TabItem itemKey="tab3" tab="Help">
        <div>
          <h3>Help Tab</h3>
          <p>Need help? Contact support at support@example.com</p>
        </div>
      </TabItem>
    </Tabs>
  ),
};
