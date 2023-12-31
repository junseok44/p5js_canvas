import React from "react";

import {
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const Room = ({ title, current, limit, isStarted, code }) => {
  return (
    <ListItemButton disableGutters>
      <a href={`/room/${code}`} style={{ width: "100%" }}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary={title}
            secondary={
              <>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {current} / {limit}
                </Typography>
                {"  "}
                <Typography
                  sx={{
                    display: "inline",
                    color: isStarted ? "red" : "green",
                    fontWeight: "bold",
                  }}
                  component="span"
                  variant="body2"
                >
                  {isStarted ? "게임 진행중" : "대기중..."}
                </Typography>
              </>
            }
          />
        </ListItem>
      </a>
    </ListItemButton>
  );
};

export default Room;
