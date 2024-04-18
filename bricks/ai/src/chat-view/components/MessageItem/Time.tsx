import moment from "moment";
import React from "react";

export function Time({ time }: { time?: string | number }) {
  return (
    <div className="time">
      {time
        ? typeof time === "string"
          ? time
          : moment(time).format("YYYY-MM-DD HH:mm:ss")
        : null}
    </div>
  );
}
