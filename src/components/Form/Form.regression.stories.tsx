import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';
import { Form, FormItem, Input } from '../../index';

const meta = { title: 'Regression/Form', component: Form } satisfies Meta<
  typeof Form
>;
export default meta;
type Story = StoryObj<typeof meta>;
const childChange = fn();
const emptySuggestions: string[] = [];
const validator = fn(() => true);

export const ChildHandlers: Story = {
  args: { onFinish: fn() },
  render: args => (
    <Form {...args}>
      <FormItem name="custom">
        <Input
          suggestions={emptySuggestions}
          aria-label="Custom"
          onChange={childChange}
        />
      </FormItem>
      <FormItem name="native">
        <input aria-label="Native" onChange={childChange} />
      </FormItem>
      <FormItem name="text">
        <textarea aria-label="Text" onChange={childChange} />
      </FormItem>
      <FormItem name="select">
        <select aria-label="Select" onChange={childChange}>
          <option value="">Choose</option>
          <option value="b">Beta</option>
        </select>
      </FormItem>
      <button type="submit">Submit</button>
    </Form>
  ),
  play: async ({ canvasElement, args }) => {
    childChange.mockClear();
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Custom'), 'a');
    await userEvent.type(canvas.getByLabelText('Native'), 'b');
    await userEvent.type(canvas.getByLabelText('Text'), 'c');
    await userEvent.selectOptions(canvas.getByLabelText('Select'), 'b');
    await expect(childChange).toHaveBeenCalledTimes(4);
    await userEvent.click(canvas.getByText('Submit'));
    await waitFor(() =>
      expect(args.onFinish).toHaveBeenCalledWith({
        custom: 'a',
        native: 'b',
        text: 'c',
        select: 'b',
      })
    );
  },
};

export const DebouncedValidation: Story = {
  render: () => (
    <Form rules={{ field: [{ validator }] }}>
      <FormItem name="field">
        <input aria-label="Field" />
      </FormItem>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    validator.mockClear();
    await userEvent.type(within(canvasElement).getByLabelText('Field'), 'abc');
    await waitFor(() => expect(validator).toHaveBeenCalledWith('abc'));
    await expect(validator).toHaveBeenCalledTimes(1);
  },
};

function RaceHarness() {
  const resolveOld = useRef<(valid: boolean) => void>(() => {});
  const [started, setStarted] = useState(false);
  return (
    <>
      <Form
        rules={{
          field: [
            {
              message: 'Stale validation error',
              validator: value => {
                if (value === 'old') {
                  setStarted(true);
                  return new Promise<boolean>(resolve => {
                    resolveOld.current = resolve;
                  });
                }
                return true;
              },
            },
          ],
        }}
      >
        <FormItem name="field">
          <input aria-label="Field" />
        </FormItem>
      </Form>
      <button disabled={!started} onClick={() => resolveOld.current(false)}>
        Resolve old validation
      </button>
    </>
  );
}

export const StaleValidation: Story = {
  render: () => <RaceHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Field');
    await userEvent.type(input, 'old');
    await waitFor(() =>
      expect(canvas.getByText('Resolve old validation')).toBeEnabled()
    );
    await userEvent.clear(input);
    await userEvent.type(input, 'new');
    await userEvent.click(canvas.getByText('Resolve old validation'));
    // A stale result must be ignored even while the new value is still debouncing.
    await new Promise(resolve => setTimeout(resolve, 50));
    await expect(
      canvas.queryByText('Stale validation error')
    ).not.toBeInTheDocument();
    await expect(input).toHaveValue('new');
  },
};

export const UnmountCancelsValidation: Story = {
  render: function UnmountHarness() {
    const [visible, setVisible] = useState(true);
    return (
      <>
        {visible && (
          <Form rules={{ field: [{ validator }] }}>
            <FormItem name="field">
              <input aria-label="Field" />
            </FormItem>
          </Form>
        )}
        <button onClick={() => setVisible(false)}>Unmount</button>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    validator.mockClear();
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Field'), 'abc');
    await userEvent.click(canvas.getByText('Unmount'));
    await new Promise(resolve => setTimeout(resolve, 250));
    await expect(validator).not.toHaveBeenCalled();
  },
};
