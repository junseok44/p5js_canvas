import React from "react";

const Room = ({ title, current, limit, isPlaying }) => {
  return (
    <li>
      <h3>{title}</h3>
      <span>
        {current} / {limit}
      </span>
      <span>{isPlaying ? "게임 진행중" : "모집중!"}</span>
    </li>
  );
};

export default Room;
