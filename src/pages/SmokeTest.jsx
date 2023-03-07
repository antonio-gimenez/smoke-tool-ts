import { useContext, useEffect, useState } from "react";
import Table from "../components/ui/Table.jsx";
import { TestContext } from "../contexts/TestContext";
import withPagination from "../hocs/withPagination.jsx";
import { ReactComponent as PlusIcon } from "../assets/icons/plus.svg";
import { Modal, ModalTrigger } from "../components/ui/Modal";
import NewTestForm from "../components/forms/NewTestForm";
import useGenerateReport from "../hooks/useGenerateReport";

const SmokeTest = () => {
  const { tests, fetch, totalCount, totalPages } = useContext(TestContext);
  const [pageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [status] = useState();
  const [isGenerating, generateReportAndAlert] = useGenerateReport({
    items: tests,
  });
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
      <div className="actions">
        <ModalTrigger id="create-test">
          <button className="button button-primary">
            <PlusIcon className="icon-mini" /> Add new test
          </button>
        </ModalTrigger>
        {isGenerating ? (
          <button className="button button-primary loading" disabled>
            Working on it...
          </button>
        ) : (
          <button className="button button-secondary" onClick={generateReportAndAlert}>
            Generate report
          </button>
        )}
      </div>
      <Modal header={"New Test"} closeOnEscape={false} id="create-test">
        <NewTestForm modalId="create-test" />
      </Modal>
      {tests?.length > 0 ? <PaginatedTable /> : null}
    </>
  );
};

export default SmokeTest;
