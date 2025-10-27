import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                Hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
                Jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
                Menit: Math.floor((difference / 1000 / 60) % 60),
                Detik: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clear the interval on component unmount
        return () => clearInterval(timer);
    }, [targetDate]); // Rerun effect if targetDate changes

    const timerComponents = [];

    Object.keys(timeLeft).forEach(interval => {
        // Add a leading zero if the number is less than 10
        const value = timeLeft[interval] < 10 ? `0${timeLeft[interval]}` : timeLeft[interval];
        timerComponents.push(
            <div key={interval} className="countdown-item">
                <span className="countdown-value">{value}</span>
                <span className="countdown-label">{interval}</span>
            </div>
        );
    });

    return (
        <div className="countdown-container">
            {timerComponents.length ? timerComponents : <span className="countdown-finished">Waktu Habis!</span>}
        </div>
    );
};

export default Countdown;
