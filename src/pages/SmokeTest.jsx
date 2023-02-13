import { useContext, useEffect, useState } from "react";
import Button from "../components/ui/Button.jsx";
import Card, { CardHeader, CardContent, CardFooter } from "../components/ui/Card.jsx";
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

  return (
    <Card>
      <CardHeader>
        <h2>Smoke Test</h2>
      </CardHeader>
      <CardContent>
        <PaginatedTable />
      </CardContent>
      <CardFooter>
        <Button color={"primary"} onClick={() => setStatus("pending")}>
          Pending
        </Button>
      </CardFooter>
    </Card>
  );
  // return tests?.length > 0 ? <PaginatedTable /> : null;
};

export default SmokeTest;
