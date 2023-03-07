import { useContext, useEffect, useState } from "react";
import Table from "../components/ui/Table.jsx";
import { TestContext } from "../contexts/TestContext";
import withPagination from "../hocs/withPagination.jsx";
import { ReactComponent as PlusIcon } from "../assets/icons/plus.svg";
const SmokeTest = () => {
  const { tests, fetch, totalCount, totalPages } = useContext(TestContext);
  const [pageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [status] = useState();
  const PaginatedTable = withPagination({
    WrappedComponent: Table,
    items: tests || [],
    fetch: () =>
      fetch({
        page: currentPage,
        pageSize,
      }),
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

  return (
    <>
      <button className="button button-primary">
        <PlusIcon className="icon-mini" /> Add new test
      </button>
      {tests?.length > 0 ? <PaginatedTable /> : null}
    </>
  );
};

export default SmokeTest;
