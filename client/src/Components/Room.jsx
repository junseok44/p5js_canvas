import React from "react";

import {
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { ROOM_STATUS } from "../constants/room_status";

const Room = ({ title, current, limit, status, code }) => {
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
                  {limit ? (
                    <Typography
                      sx={{
                        display: "inline",
                        color: current >= limit ? "red" : "green",
                      }}
                      component="span"
                      variant="body2"
                    >
                      {current} / {limit}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        display: "inline",
                        color: "green",
                      }}
                      component="span"
                      variant="body2"
                    >
                      {current}명
                    </Typography>
                  )}
                </Typography>
                {"  "}
                <Typography
                  sx={{
                    display: "inline",
                    color: status === ROOM_STATUS.WAITING ? "green" : "red",
                    fontWeight: "bold",
                  }}
                  component="span"
                  variant="body2"
                >
                  {status}
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
