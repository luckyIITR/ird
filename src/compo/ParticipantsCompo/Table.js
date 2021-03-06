import React, { useState, useEffect } from "react";
import RingLoader from "react-spinners/RingLoader";
import Row from "./Row";

const { GoogleSpreadsheet } = require("google-spreadsheet");

function Table({ vh }) {
  const [data, setData] = useState([]);
  const accessSpread = async () => {
    try {
      const creds = require("../client_secret.json"); // the file saved above
      const doc = new GoogleSpreadsheet(
        "1nLtTMzSwVhJMqm46UhTA2MdOPcXG2ovavy1JbJnxz6g"
      );
      await doc.useServiceAccountAuth(creds);

      await doc.loadInfo(); // loads document properties and worksheets

      // append rows
      const sheet = doc.sheetsByIndex[0];
      // read rows
      const rows = await sheet.getRows();
      const temp = [];

      for (let i = rows.length - 1; i >= 0; i--) {
        const data_row = {};
        data_row["name"] = rows[i].Name;
        data_row["post"] = rows[i].Post;
        data_row["institute"] = rows[i].Institute;
        data_row["attendance"] = rows[i].Attendance;

        temp.push(data_row);
      }
      setData(temp);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    accessSpread();
    // eslint-disable-next-line
  }, []);
  //
  // <th>S.No.</th>
  // <th>Name</th>
  // <th>Student/faculty</th>
  // <th>Institute</th>
  return (
    <div className="limiter">
      <div className="register-heading sectionHeading participants">
        <h1 style={{ fontSize: "2em" }}>Participants</h1>
        <br />
        <br />
      </div>
      <div className="container-table100">
        <div className="wrap-table100" style={{ height: vh }}>
          {!data.length ? (
            <div className="table">
              <RingLoader
                color={"#00093c"}
                loading={true}
                css={""}
                size={150}
              />
            </div>
          ) : (
            <div className="table">
              <div className="header-table">
                <div className="cell">S.No.</div>
                <div className="cell">Name</div>
                <div className="cell">Student/Postdoc/Faculty</div>
                <div className="cell" style={{ textAlign: "center" }}>
                  Attendance Mode
                </div>
                <div className="cell">Institution</div>
              </div>
              {data.map((value, index) => {
                return (
                  <Row
                    key={index}
                    props={{ index: data.length - index - 1, row: value }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Table;
