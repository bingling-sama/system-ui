import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import Select from './Select';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: '', label: 'Empty' },
];

const meta = { title: 'Regression/Select', component: Select } satisfies Meta<
  typeof Select
>;
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledHarness({ multiple = false }: { multiple?: boolean }) {
  const [value, setValue] = useState<string | string[]>(multiple ? ['a'] : 'a');
  const [items, setItems] = useState(options);
  return (
    <form>
      <Select
        name="choice"
        multiple={multiple}
        value={value}
        options={items}
        onChange={fn()}
      />
      <button
        type="button"
        onClick={() => setValue(multiple ? ['b', ''] : 'b')}
      >
        Update value
      </button>
      <button
        type="button"
        onClick={() =>
          setItems(
            [...options]
              .reverse()
              .map(item => ({ ...item, label: `${item.label} loaded` }))
          )
        }
      >
        Load options
      </button>
      <button type="button" onClick={() => setValue(multiple ? [] : '')}>
        Clear
      </button>
    </form>
  );
}

export const ControlledSingle: Story = {
  render: () => <ControlledHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvasElement.querySelector('form')!;
    await expect(
      canvas.getByText('Alpha', { selector: '.select-value' })
    ).toBeVisible();
    await userEvent.click(canvas.getByText('Update value'));
    await expect(
      canvas.getByText('Beta', { selector: '.select-value' })
    ).toBeVisible();
    await expect(new FormData(form).get('choice')).toBe('b');
    await userEvent.click(canvas.getByText('Load options'));
    await expect(
      canvas.getByText('Beta loaded', { selector: '.select-value' })
    ).toBeVisible();
    await userEvent.click(
      canvas.getByText('Beta loaded', { selector: '.select-value' })
    );
    await userEvent.click(canvas.getByRole('option', { name: 'Alpha loaded' }));
    await expect(new FormData(form).get('choice')).toBe('b');
    await userEvent.click(canvas.getByText('Clear'));
    await expect(
      canvas.getByText('Empty loaded', { selector: '.select-value' })
    ).toBeVisible();
    await expect(new FormData(form).get('choice')).toBe('');
  },
};

export const ControlledMultiple: Story = {
  render: () => <ControlledHarness multiple />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvasElement.querySelector('form')!;
    await userEvent.click(canvas.getByText('Update value'));
    await expect(canvas.getByText('2 items selected')).toBeVisible();
    await expect(new FormData(form).getAll('choice')).toEqual(['b', '']);
    await userEvent.click(canvas.getByText('Load options'));
    await expect(new FormData(form).getAll('choice')).toEqual(['', 'b']);
    await userEvent.click(canvas.getByText('Clear'));
    await expect(new FormData(form).getAll('choice')).toEqual([]);
  },
};

export const UncontrolledMultiple: Story = {
  render: () => (
    <form>
      <Select name="choice" multiple defaultValue={['a']} options={options} />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByText('Alpha', { selector: '.select-value' })
    );
    await userEvent.click(canvas.getByRole('option', { name: 'Beta' }));
    await expect(
      new FormData(canvasElement.querySelector('form')!).getAll('choice')
    ).toEqual(['a', 'b']);
  },
};

export const AsyncUncontrolled: Story = {
  render: function AsyncOptions() {
    const [items, setItems] = useState<typeof options>([]);
    return (
      <form>
        <Select name="choice" defaultValue="b" options={items} />
        <button type="button" onClick={() => setItems(options)}>
          Load
        </button>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Load'));
    await expect(
      canvas.getByText('Beta', { selector: '.select-value' })
    ).toBeVisible();
    await userEvent.click(
      canvas.getByText('Beta', { selector: '.select-value' })
    );
    await userEvent.click(canvas.getByRole('option', { name: 'Alpha' }));
    await expect(
      new FormData(canvasElement.querySelector('form')!).get('choice')
    ).toBe('a');
  },
};
