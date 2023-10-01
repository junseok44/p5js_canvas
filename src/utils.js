function formatMessage(sender, msg) {
  return `[${sender}]: ${msg}`;
}

function getRoomCodeFromUrl(socket) {
  const req = socket.request;
  const {
    headers: { referer },
  } = req;

  let urlParts = referer.split("/");
  let roomCode = urlParts[urlParts.length - 1];

  return roomCode;
}

module.exports = {
  formatMessage,
  getRoomCodeFromUrl,
};
