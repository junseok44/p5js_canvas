function getRoomCodeFromUrl(socket) {
  const req = socket.request;
  const {
    headers: { referer },
  } = req;

  let urlParts = referer.split("/");
  let roomCode = urlParts[urlParts.length - 1];

  return roomCode;
}

export { getRoomCodeFromUrl };
