// ClockComponent.tsx
import React, { useState, useEffect } from 'react';

interface ClockProps {
    showSeconds?: boolean;
    showDate?: boolean;
    timeFormat?: '12h' | '24h';
    className?: string;
}

const ClockComponent: React.FC<ClockProps> = ({
    showSeconds = true,
    showDate = false,
    timeFormat = '24h',
    className = ''
}) => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: timeFormat === '12h'
        };

        if (showSeconds) {
            options.second = '2-digit';
        }

        return date.toLocaleTimeString(undefined, options);
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className={`clock ${className}`}>
            {showDate && (
                <div className="clock-date">
                    {formatDate(currentTime)}
                </div>
            )}
            <div className="clock-time">
                {formatTime(currentTime)}
            </div>
        </div>
    );
};

export default ClockComponent;