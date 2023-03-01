import usePagination from "../hooks/usePagination";

import { useState } from "react";
import { ReactComponent as ChevronLeftIcon } from "../assets/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "../assets/icons/chevron-right.svg";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { Modal, ModalTrigger } from "./ui/Modal";

const Pagination = ({ onPageChange, totalCount, siblingCount = 1, currentPage, pageSize }) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  const [jumpTo, setJumpTo] = useState("");
  if (totalCount <= 0 || !totalCount) return null;
  if (totalCount <= pageSize) return null;
  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const jumpToPage = (page) => {
    onPageChange(page);
    setJumpTo("");
  };

  let lastPage = Math.ceil(totalCount / pageSize) - 1;

  return (
    <div className={"pagination-container"}>
      <ol className="pagination-list">
        <li className="page-control">
          <button onClick={onPrevious} aria-disabled={currentPage <= 1}>
            <ChevronLeftIcon className="icon-16" />
          </button>
        </li>
        {paginationRange?.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <div key={index}>
                <ModalTrigger key={`${index}`} id={`${pageNumber}-${index}`} hideChevron>
                  ...
                </ModalTrigger>
                <Modal
                  id={`${pageNumber}-${index}`}
                  footer={
                    <Button block color={"accent"} onClick={() => jumpToPage(jumpTo)}>
                      Go
                    </Button>
                  }
                  header={"Jump to page"}
                >
                  Jump to:
                  <Input min={1} max={lastPage} defaultValue={1} onChange={(event) => setJumpTo(event.target.value)} />
                </Modal>
              </div>
            );
          }

          return (
            <li
              key={index}
              className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}
        <li className="page-control">
          <button onClick={onNext} disabled={currentPage >= lastPage} aria-disabled={currentPage >= lastPage}>
            <ChevronRightIcon className="icon-16" />
          </button>
        </li>
      </ol>
    </div>
  );
};

export default Pagination;
