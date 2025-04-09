import type { Meta, StoryObj } from '@storybook/react';
import { Menu, MenuItem, SubMenu } from './';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Menu>
      <MenuItem>Home</MenuItem>
      <MenuItem>About</MenuItem>
      <MenuItem>Contact</MenuItem>
    </Menu>
  ),
};

export const WithSubmenus: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Menu>
      <SubMenu title="File">
        <MenuItem>New</MenuItem>
        <MenuItem>Open</MenuItem>
        <MenuItem>Save</MenuItem>
        <MenuItem className="divider">Exit</MenuItem>
      </SubMenu>
      <SubMenu title="Edit">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </SubMenu>
      <SubMenu title="View">
        <MenuItem>Zoom In</MenuItem>
        <MenuItem>Zoom Out</MenuItem>
        <MenuItem>Reset</MenuItem>
      </SubMenu>
      <MenuItem>Help</MenuItem>
    </Menu>
  ),
};

export const WithLinks: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Menu>
      <SubMenu title="Links">
        <MenuItem href="https://github.com">GitHub</MenuItem>
        <MenuItem href="https://google.com">Google</MenuItem>
        <MenuItem href="https://bing.com">Bing</MenuItem>
      </SubMenu>
      <MenuItem href="https://example.com">External Link</MenuItem>
    </Menu>
  ),
};

export const WithDisabledItems: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Menu>
      <MenuItem>Enabled Item</MenuItem>
      <MenuItem disabled>Disabled Item</MenuItem>
      <SubMenu title="Options">
        <MenuItem>Option 1</MenuItem>
        <MenuItem disabled>Option 2 (Disabled)</MenuItem>
        <MenuItem>Option 3</MenuItem>
      </SubMenu>
      <SubMenu title="More" disabled>
        <MenuItem>More 1</MenuItem>
        <MenuItem>More 2</MenuItem>
      </SubMenu>
    </Menu>
  ),
};
