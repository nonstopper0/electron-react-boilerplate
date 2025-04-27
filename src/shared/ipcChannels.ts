export const IPC_EXAMPLE_CHANNEL = 'ipc-example';
export const SESSION_UPDATE_CHANNEL = 'session-update';
export const GET_APP_VERSION_CHANNEL = 'get-app-version';
export const SOMETHING_ELSE_CHANNEL = 'something-else';

export type Channels =
  | typeof IPC_EXAMPLE_CHANNEL
  | typeof SESSION_UPDATE_CHANNEL
  | typeof GET_APP_VERSION_CHANNEL
  | typeof SOMETHING_ELSE_CHANNEL;
