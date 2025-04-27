import * as styles from './mainStyles.module.scss';
import { ISessionInfo } from '../../types/iracing-sdk/sessionInfo';
import useSession from '../../hooks/iracing/useSession';
import { celcToFahr } from '../../utils/celcToFahr.ts';
import helmetLogo from '../../renderer/assets/icons/helmet.svg';

export default function Main() {
  const session = useSession<ISessionInfo>();

  if (!session) {
    // Simple loading state - could be styled more nicely too
    return <div className={styles.loading}>Loading Session Info...</div>;
  }

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <div className={styles.trackInfo}>
          {' '}
          {/* Renamed for clarity */}
          <p className={styles.trackName}>
            {' '}
            {/* Renamed */}
            {session.data.WeekendInfo.TrackDisplayName}
          </p>
          <p className={styles.trackConfig}>
            {' '}
            {/* Renamed */}
            {session.data.WeekendInfo.TrackConfigName || 'Default'}{' '}
            {/* Added fallback */}
          </p>
        </div>
        <div className={styles.sessionDetails}>
          {' '}
          {/* Grouped right-side info */}
          <p className={styles.temp}>
            {session.data.WeekendInfo.TrackSurfaceTemp
              ? `${celcToFahr(
                  Number(
                    session.data.WeekendInfo.TrackSurfaceTemp.split(' ')[0],
                  ),
                )}°F`
              : 'N/A'}{' '}
            {/* Improved formatting & fallback */}
          </p>
          <p className={styles.eventType}>
            {session.data.WeekendInfo.EventType || 'Session'}
          </p>{' '}
          {/* Added fallback */}
        </div>
      </header>
      {/* Pass session data to the updated Standings component */}
      <Standings sessionData={session.data} />
    </div>
  );
}

interface StandingsProps {
  sessionData: ISessionInfo['data']; // Pass only the data part
}

function Standings({ sessionData }: StandingsProps) {
  const currentSessionIndex = sessionData.SessionInfo.Sessions.length - 1;
  const currentSession = sessionData.SessionInfo.Sessions[currentSessionIndex];
  const results = currentSession?.ResultsPositions || [];
  const drivers = sessionData.DriverInfo.Drivers || [];
  const driverIratings = [...drivers].map((driver) => driver.IRating); // Extract iRating from drivers
  console.log(driverIratings); // Log iRating for debugging
  if (results.length === 0) {
    return (
      <div className={styles.standings}>
        <p className={styles.standingsTitle}>Standings</p>
        <p className={styles.noResults}>Waiting for results...</p>
      </div>
    );
  }

  return (
    <div className={styles.standings}>
      {/* Optional: Add a title if desired */}
      {/* <h2 className={styles.standingsTitle}>Live Standings</h2> */}

      <table className={styles.standingsTable}>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Driver</th>
            {/* Conditionally show Fastest Lap if available */}
            {results.some((r) => r.FastestTime > 0) && <th>Fastest Lap</th>}
            {/* Add more headers if needed e.g.,<th>Last Lap</th> <th>Gap</th> */}
            <th>Last Lap</th>
          </tr>
        </thead>
        <tbody>
          {results
            // Optional: Sort by position if not guaranteed by API
            .sort((a, b) => a.Position - b.Position)
            .map((result) => {
              const driver = drivers.find((d) => d.CarIdx === result.CarIdx);
              console.log(driver);
              const driverName = driver?.UserName || `Car #${result.CarIdx}`; // Fallback
              const fastestTime =
                result.FastestTime > 0
                  ? convertSecondsToTimeString(result.FastestTime)
                  : '-'; // Handle invalid times

              return (
                <tr key={result.CarIdx} className={styles.standingRow}>
                  <td className={styles.positionCell}>{result.Position}</td>{' '}
                  {/* API Position is 0-based */}
                  <td className={styles.driverCell}>
                    {/* Optional: Add Car Number */}
                    <span className={styles.carNumber}>
                      {result.CarIdx + 1}
                    </span>
                    {driverName}
                    <span className={styles.irating}>
                      <img
                        src={helmetLogo}
                        alt="iRating"
                        className={styles.helmetIcon}
                      />
                      {driver?.IRating || 'N/A'}
                    </span>
                  </td>
                  {/* Conditionally show Fastest Lap cell */}
                  {results.some((r) => r.FastestTime > 0) && (
                    <td className={styles.timeCell}>{fastestTime}</td>
                  )}
                  {/* Add more cells if needed */}
                  <td className={styles.timeCell}>
                    {convertSecondsToTimeString(result.LastTime) || '-'}{' '}
                    {/* Handle invalid times */}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

function convertSecondsToTimeString(secs: number): string {
  if (secs <= 0 || !isFinite(secs)) {
    // Handle invalid inputs
    return '-';
  }
  const time = new Date(secs * 1000);
  const minutes = time.getUTCMinutes(); // Don't pad minutes yet
  const seconds = time.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = time.getUTCMilliseconds().toString().padStart(3, '0');

  return `${minutes}:${seconds}.${milliseconds}`;
}
