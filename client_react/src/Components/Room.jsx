import React from "react";

const Room = ({ title, current, limit, isPlaying, code }) => {
  return (
    <li>
      <a href={`/room/${code}`}>
        <h3>{title}</h3>
        <span>
          {current} / {limit}
        </span>
        <span>{isPlaying ? "게임 진행중" : "모집중!"}</span>
      </a>
    </li>
  );
};

export default Room;
