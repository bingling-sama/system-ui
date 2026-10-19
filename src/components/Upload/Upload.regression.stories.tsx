import type { Meta, StoryObj } from '@storybook/react';
import {
  expect,
  fn,
  mocked,
  userEvent,
  waitFor,
  within,
} from '@storybook/test';
import Upload, { type UploadFile } from './Upload';

const meta: Meta<typeof Upload> = {
  title: 'Regression/Upload',
  component: Upload,
  args: {
    action: '/upload',
    onChange: fn((file: UploadFile) => Object.freeze(file)),
    onError: fn(),
    onSuccess: fn(),
    onProgress: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
const file = () => new File(['example'], 'example.txt', { type: 'text/plain' });
const input = (element: HTMLElement) =>
  element.querySelector<HTMLInputElement>('input[type=file]')!;

export const ImmutableSuccess: Story = {
  args: { customRequest: fn(async () => ({ ok: true })) },
  play: async ({ canvasElement, args }) => {
    await userEvent.upload(input(canvasElement), file());
    await waitFor(() => expect(args.onSuccess).toHaveBeenCalled());
    const changes: UploadFile[] = mocked(args.onChange!).mock.calls.map(
      ([file]: [UploadFile]) => file
    );
    await expect(changes.map(file => file.status)).toEqual([
      'ready',
      'uploading',
      'success',
    ]);
    await expect(new Set(changes).size).toBe(3);
    await expect(new Set(changes.map(file => file.uid)).size).toBe(1);
    await expect(changes[0].percent).toBeUndefined();
    await expect(changes[1].percent).toBe(0);
    await expect(changes[2].percent).toBe(100);
    await expect(
      canvasElement.querySelector('.upload-file-item--success')
    ).toBeVisible();
  },
};

export const RejectedValidation: Story = {
  args: {
    beforeUpload: async () => {
      throw new Error('Validation failed');
    },
    customRequest: fn(async () => ({})),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.upload(input(canvasElement), file());
    await waitFor(() => expect(args.onError).toHaveBeenCalled());
    await expect(
      within(canvasElement).getByText('Validation failed')
    ).toBeVisible();
    await expect(args.customRequest).not.toHaveBeenCalled();
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await expect(mocked(args.onChange!).mock.calls[0][0].status).toBe('error');
    await expect(mocked(args.onError!).mock.calls[0][1]).toBe(
      mocked(args.onChange!).mock.calls[0][0]
    );
  },
};

export const RejectedString: Story = {
  ...RejectedValidation,
  args: {
    ...RejectedValidation.args,
    beforeUpload: () => Promise.reject('Validation failed'),
  },
};

export const SkippedValidation: Story = {
  args: {
    beforeUpload: async () => false,
    customRequest: fn(async () => ({})),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.upload(input(canvasElement), file());
    await expect(args.customRequest).not.toHaveBeenCalled();
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvasElement.querySelector('.upload-file-item')).toBeNull();
  },
};

export const FailedRequest: Story = {
  args: {
    customRequest: fn(async () => {
      throw new Error('Network failed');
    }),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.upload(input(canvasElement), file());
    await waitFor(() => expect(args.onError).toHaveBeenCalled());
    await expect(
      mocked(args.onChange!).mock.calls.map(
        ([file]: [UploadFile]) => file.status
      )
    ).toEqual(['ready', 'uploading', 'error']);
    await expect(
      within(canvasElement).getByText('Network failed')
    ).toBeVisible();
  },
};

export const NativeProgress: Story = {
  play: async ({ canvasElement, args }) => {
    const requests: FakeXHR[] = [];
    class FakeXHR extends EventTarget {
      upload = new EventTarget();
      status = 200;
      response = { ok: true };
      constructor() {
        super();
        requests.push(this);
      }
      open() {}
      send() {
        this.upload.dispatchEvent(
          new ProgressEvent('progress', {
            lengthComputable: true,
            loaded: 5,
            total: 10,
          })
        );
      }
    }
    const original = window.XMLHttpRequest;
    window.XMLHttpRequest = FakeXHR as unknown as typeof XMLHttpRequest;
    try {
      await userEvent.upload(input(canvasElement), file());
      await waitFor(() =>
        expect(
          canvasElement.querySelector<HTMLElement>('.upload-progress-bar')
            ?.style.width
        ).toBe('50%')
      );
      await expect(args.onProgress).toHaveBeenCalledWith(
        50,
        expect.objectContaining({ status: 'uploading', percent: 50 })
      );
      requests[0].dispatchEvent(new Event('load'));
      await waitFor(() => expect(args.onSuccess).toHaveBeenCalled());
      await expect(mocked(args.onChange!).mock.calls[0][0].status).toBe(
        'ready'
      );
    } finally {
      window.XMLHttpRequest = original;
    }
  },
};
