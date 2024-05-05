const CREATE_REPORT_QUERY = "INSERT INTO report(text) VALUES(?)";

const createReport = async (text) => {
  return new Promise((res, rej) => {
    connection.query(CREATE_REPORT_QUERY, [text], (err, result) => {
      if (err) rej(err);
      res(result);
    });
  });
};

module.exports = {
  createReport,
};
