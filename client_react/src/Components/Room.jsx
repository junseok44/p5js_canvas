import React from "react";

const Room = ({ title, current, limit, isStarted, code }) => {
  return (
    <li>
      <a href={`/room/${code}`}>
        <h3>{title}</h3>
        <span>
          {current} / {limit}
        </span>
        <span>{isStarted ? "게임 진행중" : "대기중"}</span>
      </a>
    </li>
  );
};

export default Room;
