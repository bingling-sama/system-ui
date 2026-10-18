import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import Tabs from './Tabs';
import TabItem from './TabItem';

const meta = { title: 'Regression/Tabs', component: Tabs } satisfies Meta<
  typeof Tabs
>;
export default meta;
type Story = StoryObj<typeof meta>;

const children = (
  <>
    <TabItem itemKey="disabled" tab="Disabled" disabled>
      Disabled content
    </TabItem>
    <>
      {null}
      <TabItem itemKey="first" tab="First">
        First content
      </TabItem>
    </>
    <TabItem itemKey="second" tab="Second">
      Second content
    </TabItem>
  </>
);

export const FirstEnabled: Story = {
  args: { children },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'First' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(canvas.getByText('First content')).toBeVisible();
    await userEvent.click(canvas.getByRole('tab', { name: 'Disabled' }));
    await expect(canvas.getByText('First content')).toBeVisible();
    await userEvent.click(canvas.getByRole('tab', { name: 'Second' }));
    await expect(canvas.getByText('Second content')).toBeVisible();
  },
};

export const ExplicitDefault: Story = {
  args: { children, defaultActiveKey: 'second' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Second content')
    ).toBeVisible();
  },
};

export const AllDisabled: Story = {
  args: {
    children: (
      <TabItem itemKey="disabled" tab="Disabled" disabled>
        Hidden content
      </TabItem>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab')).toHaveAttribute(
      'aria-selected',
      'false'
    );
    await expect(canvas.queryByText('Hidden content')).not.toBeInTheDocument();
  },
};
