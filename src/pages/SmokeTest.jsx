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
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  return (
    <>
      {/* <div className="dropdown " ref={dropdownRef}>
        <button
          className="button button-ghost"
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          DropdownTest
        </button>

        <div
          className={`dropdown-content menu ${open ? "visible" : "hidden"}`}
          role="listbox"
          aria-labelledby="theme-selector"
          tabIndex={0}
        >
          <ul className="">
            {tests?.map((theme) => {
              return <li key={theme._id}>{theme.name}</li>;
            })}
          </ul>
        </div>
      </div> */}
      <Card>
        <CardHeader>
          <h2 className="">Smoke Test</h2>
        </CardHeader>
        <CardContent>
          <Tabs>
            <div label="Pending" />
            <div label="Running" />
          </Tabs>
          <PaginatedTable />
        </CardContent>
      </Card>
    </>
  );
  // return tests?.length > 0 ? <PaginatedTable /> : null;
};

export default SmokeTest;
