import React, { useState, useEffect, useMemo } from "react";

type DateDisplayProps = {
  UTC?: number;
};

export const DateDisplay = ({ UTC }: DateDisplayProps) => {
  const dateOptions = {
    day: 'numeric' as const,
    month: 'short' as const,
    year: 'numeric' as const,
  };

  const timeOptions = useMemo(() => ({
    hour: '2-digit' as const,
    minute: '2-digit' as const,
  }), []);

  // Calculate the time offset once
  const timeOffset = useMemo(() => ((UTC ?? 0) - 3600) * 1000, [UTC]);
  
  const [time, setTime] = useState(
    new Date(Date.now() + timeOffset).toLocaleTimeString(
      'en-GB',
      timeOptions
    )
  );

  const date = new Date(
    Date.now() + timeOffset
  ).toLocaleDateString('en-GB', dateOptions);

  useEffect(() => {
    const getTime = () => {
      setTime(
        new Date(Date.now() + timeOffset).toLocaleTimeString(
          'en-GB',
          timeOptions
        )
      );
    };

    const intervalID = setInterval(getTime, 1000);

    return () => clearInterval(intervalID);
  }, [timeOffset, timeOptions]);

  return (
    <>
      {UTC ? (
        <div className="flex flex-col items-start px-2 py-1 text-foreground bg-transparent">
          <span className="text-xs text-muted-foreground font-light mb-1">Local time</span>
          <span className="text-base font-semibold tracking-tight">{date}</span>
          <span className="text-lg font-mono font-bold">{time}</span>
        </div>
      ) : (
        <div className="flex flex-col items-start px-2 py-1 text-foreground bg-transparent">
          <span className="text-base font-semibold tracking-tight">{date} {time}</span>
        </div>
      )}
    </>
  );
};
