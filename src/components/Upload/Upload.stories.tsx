import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Upload, { UploadFile } from './Upload';
import Button from '../Button/Button';
import * as React from 'react';

const meta: Meta<typeof Upload> = {
  title: 'Components/Upload',
  component: Upload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // Mock API endpoint
    onSuccess: fn(),
    onError: fn(),
    onProgress: fn(),
    onChange: fn(),
    onRemove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showFileList: true,
  },
};

export const WithDragAndDrop: Story = {
  args: {
    drag: true,
    showFileList: true,
  },
};

export const MultipleFiles: Story = {
  args: {
    multiple: true,
    showFileList: true,
  },
};

export const WithFileTypeRestriction: Story = {
  args: {
    accept: 'image/*',
    showFileList: true,
  },
};

export const WithSizeLimit: Story = {
  args: {
    maxSize: 1024 * 1024, // 1MB
    showFileList: true,
  },
};

export const WithDefaultFileList: Story = {
  args: {
    defaultFileList: [
      {
        uid: '1',
        name: 'example.png',
        size: 1024 * 1024,
        status: 'success',
        raw: new File([], 'example.png'),
      },
      {
        uid: '2',
        name: 'document.pdf',
        size: 2048 * 1024,
        status: 'error',
        error: 'Upload failed',
        raw: new File([], 'document.pdf'),
      },
    ],
    showFileList: true,
  },
};

export const WithCustomButton: Story = {
  args: {
    showFileList: true,
  },
  render: args => (
    <Upload action={''} {...args}>
      <Button isDefault>Custom Upload Button</Button>
    </Upload>
  ),
};

// Mock implementation for custom request
const mockCustomRequest = (file: File): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
    // Simulate a network request
    setTimeout(() => {
      if (file.size < 1024 * 1024 * 2) {
        // Succeed for files smaller than 2MB
        resolve({ url: 'https://example.com/files/' + file.name });
      } else {
        // Fail for larger files
        reject(new Error('File too large'));
      }
    }, 2000);
  });
};

export const WithCustomRequest: Story = {
  args: {
    customRequest: mockCustomRequest,
    showFileList: true,
  },
};

// Component with controlled behavior
const ControlledUploadComponent = () => {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

  const handleChange = (file: UploadFile) => {
    setFileList(prevList => {
      const index = prevList.findIndex(item => item.uid === file.uid);
      if (index === -1) {
        return [...prevList, file];
      }
      const newList = [...prevList];
      newList[index] = file;
      return newList;
    });
    console.log('File changed:', file);
  };

  const handleRemove = (file: UploadFile) => {
    setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
    console.log('File removed:', file);
  };

  return (
    <div>
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        onChange={handleChange}
        onRemove={handleRemove}
        defaultFileList={fileList}
        showFileList={true}
      />
      <div style={{ marginTop: '16px' }}>
        <h4>Current Files:</h4>
        <pre>{JSON.stringify(fileList, null, 2)}</pre>
      </div>
    </div>
  );
};

export const ControlledUpload: Story = {
  render: () => <ControlledUploadComponent />,
};
