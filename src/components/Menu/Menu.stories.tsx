import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Menu, MenuBar, MenuItem } from './Menu';

const meta = {
  title: 'System UI/Menu',
  component: MenuBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MenuBar>;

export default meta;
type Story = StoryObj<typeof MenuBar>;

export const Default: Story = {
  render: () => (
    <MenuBar>
      <Menu title="File">
        <MenuItem onClick={() => console.log('New')}>New</MenuItem>
        <MenuItem onClick={() => console.log('Open')}>Open</MenuItem>
        <MenuItem onClick={() => console.log('Save')}>Save</MenuItem>
        <MenuItem divider />
        <MenuItem disabled>Print</MenuItem>
      </Menu>
    </MenuBar>
  ),
};

export const CompleteMenuBar: Story = {
  render: () => (
    <MenuBar>
      <Menu title="File">
        <MenuItem onClick={() => console.log('New')}>New</MenuItem>
        <MenuItem onClick={() => console.log('Open')}>Open</MenuItem>
        <MenuItem onClick={() => console.log('Save')}>Save</MenuItem>
        <MenuItem divider />
        <MenuItem disabled>Print</MenuItem>
      </Menu>
      <Menu title="Edit">
        <MenuItem onClick={() => console.log('Cut')}>Cut</MenuItem>
        <MenuItem onClick={() => console.log('Copy')}>Copy</MenuItem>
        <MenuItem onClick={() => console.log('Paste')}>Paste</MenuItem>
        <MenuItem divider />
        <MenuItem onClick={() => console.log('Select All')}>
          Select All
        </MenuItem>
      </Menu>
      <Menu title="Help">
        <MenuItem onClick={() => console.log('About')}>About</MenuItem>
        <MenuItem onClick={() => console.log('Documentation')}>
          Documentation
        </MenuItem>
      </Menu>
    </MenuBar>
  ),
};
