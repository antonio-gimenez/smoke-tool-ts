const Table = ({ items }) => {
  console.log(
    items.map((item) => {
      return item.files?.map((file) => file);
    })
  );
  return (
    <table className="table ">
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Files</th>
        </tr>
      </thead>
      <tbody>
        {items?.map((test, index) => (
          <tr key={test._id + index}>
            <td>{test.name}</td>
            <td>
              {test.files.length > 0 ? test.files.map((file, index) => <p key={index}>{file.name}</p>) : "No files"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
