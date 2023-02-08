import { useContext, useEffect, useState } from "react";
import Table from "../components/ui/Table.jsx";
import Tags from "../components/ui/Tags.jsx";
// import { TestContext } from "../contexts/TestContext";
import withPagination from "../hocs/withPagination.jsx";
import useKeyPress from "../hooks/use-key-press";
const SmokeTest = () => {
  // const { tests, fetch, totalCount, totalPages } = useContext(TestContext);
  // const [pageSize] = useState(25);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [status, setStatus] = useState();
  // const PaginatedTable = withPagination({
  //   WrappedComponent: Table,
  //   items: tests,
  //   pageSize: pageSize,
  //   totalCount: totalCount,
  //   totalPages: totalPages,
  //   currentPage: currentPage,
  //   paginateWithAPI: true,
  //   setCurrentPage,
  // });

  // useEffect(() => {
  //   fetch({
  //     page: currentPage,
  //     status,
  //     limit: pageSize,
  //   });
  // }, [currentPage, status]);

  useKeyPress({
    key: "Control + Shift + Z",
    handler: () => {
      alert("a key pressed");
    },
  });

  return (
    <>
      <div>Placeholder for table</div>
      {/* {tests.length > 0 && <PaginatedTable />} */}
    </>
  );
};

export default SmokeTest;
