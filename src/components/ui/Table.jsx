import React, { useEffect, useState } from "react";

const Table = ({ items }) => {
  return (
    <table className="table ">
      <thead>
        <tr>
          <th>Date Scheduled</th>
          <th>Product</th>
          <th>Branch</th>
          <th>Release</th>
          <th>Test Name</th>
          <th>Requestor</th>
          <th>Machine</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Test Executor</th>
        </tr>
      </thead>
      <tbody>
        {items?.map((test, index) => (
          <tr key={test._id + index}>
            <td>{test.dateScheduled}</td>
            <td>{test.product}</td>
            <td>{test.branch}</td>
            <td>{test.release}</td>
            <td>{test.testName}</td>
            <td>{test.requestor}</td>
            <td>{test.machine}</td>
            <td>{test.priority}</td>
            <td>{test.status}</td>
            <td>{test.testExecutor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
