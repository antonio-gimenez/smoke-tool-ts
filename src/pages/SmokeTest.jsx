import { useContext, useEffect, useState } from "react";
import Table from "../components/ui/Table.jsx";
import { TestContext } from "../contexts/TestContext";
import withPagination from "../hocs/withPagination.jsx";
const SmokeTest = () => {
  const { tests, fetch, totalCount, totalPages } = useContext(TestContext);
  const [pageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState();
  const PaginatedTable = withPagination({
    WrappedComponent: Table,
    items: tests || [],
    pageSize: pageSize,
    totalCount: totalCount,
    totalPages: totalPages,
    currentPage: currentPage,
    paginateWithAPI: true,
    setCurrentPage,
  });

  useEffect(() => {
    fetch({
      page: currentPage,
      pageSize,
    });
  }, [currentPage, status]);

  return tests?.length > 0 ? <PaginatedTable /> : null;
};

export default SmokeTest;
