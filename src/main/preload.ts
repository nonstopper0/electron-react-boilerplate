// src/main/preload.ts (or wherever your preload script is)

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
// Import the type AND the constants from your shared file
import { Channels } from '../shared/ipcChannels';

// Remove the old Channels type definition if it was here

export type ElectronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]): void;
    on(channel: Channels, func: (...args: any[]) => void): () => void; // Use any[] or define specific payload types later
    once(channel: Channels, func: (...args: any[]) => void): void;
  };
};

const electronHandler: ElectronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      // Wrap the listener to match the expected signature
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      // Return a cleanup function
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
