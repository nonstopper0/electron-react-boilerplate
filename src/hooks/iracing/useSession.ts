import { useEffect, useState } from 'react';
import { SESSION_UPDATE_CHANNEL } from '../../shared/ipcChannels';
import { ISessionInfo } from '../../types/iracing-sdk/sessionInfo';

const useSession = () => {
  const [session, setSession] = useState<ISessionInfo>();

  useEffect(() => {
    window.electron.ipcRenderer.on(
      SESSION_UPDATE_CHANNEL,
      (session: ISessionInfo) => {
        setSession(session);
      },
    );
  }, []);

  return session;
};

export default useSession;
