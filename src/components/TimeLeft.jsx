// src/components/TimeLeft.js
import React, { useEffect, useState } from "react";

const calculateTimeLeft = (deadline) => {
  const now = new Date();
  const deadlineDate =
    typeof deadline === "string" ? new Date(deadline) : deadline;

  if (isNaN(deadlineDate.getTime())) {
    throw new Error("Invalid deadline date");
  }

  const nowTime = now.getTime();
  const deadlineTime = deadlineDate.getTime();

  let days = Math.floor((deadlineTime - nowTime) / (1000 * 60 * 60 * 24));
  let hours = Math.floor(
    ((deadlineTime - nowTime) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  let minutes = Math.floor(
    ((deadlineTime - nowTime) % (1000 * 60 * 60)) / (1000 * 60)
  );
  let seconds = Math.floor(((deadlineTime - nowTime) % (1000 * 60)) / 1000);

  if (deadlineDate <= now) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "마감" };
  }

  return { days, hours, minutes, seconds, status: "" };
};

const TimeLeft = ({ deadline, detail }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft(deadline);
      setTimeLeft(updatedTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div>
      {timeLeft.status === "마감" ? (
        <p className="text-red-500 text-xl font-bold">마감</p>
      ) : detail ? (
        <p className="text-[18px] font-bold">
          {timeLeft.days}일 {timeLeft.hours}시간 {timeLeft.minutes}분{" "}
          {timeLeft.seconds}초
        </p>
      ) : (
        <p className="text-[18px] font-bold">
          {timeLeft.days}일 {timeLeft.hours}시간
        </p>
      )}
    </div>
  );
};

export default React.memo(TimeLeft);
