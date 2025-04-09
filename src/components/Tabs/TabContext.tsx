import { createContext } from 'react';

export interface TabsContextProps {
  activeKey: string;
  onSelect: (key: string) => void;
}

export const TabsContext = createContext<TabsContextProps>({
  activeKey: '',
  onSelect: () => {},
});
