import React from 'react';
import '../css/App.css';

function Table({ data, setTable }) {
  if (!data || !data.length) {
    return <div>No data available</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(data[0]).map(key => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, index) => (
              <td key={index}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
      <button onClick={()=>{setTable(false)}}>
        Close
      </button>
    </table>
  );
}

export default Table;

