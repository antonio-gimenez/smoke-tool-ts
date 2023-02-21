import { useContext, useEffect, useRef, useState } from "react";
import Card, { CardContent, CardHeader } from "../components/ui/Card.jsx";
import Table from "../components/ui/Table.jsx";
import Tabs from "../components/ui/Tabs.jsx";
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

  return (
    <>
      <Card>
        <CardHeader>
          <Tabs>
            <div label="Pending" />
            <div label="Running" />
          </Tabs>
        </CardHeader>
        <CardContent>{tests?.length > 0 ? <PaginatedTable /> : null}</CardContent>
      </Card>
    </>
  );
};

export default SmokeTest;
