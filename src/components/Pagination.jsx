import usePagination from "../hooks/use-pagination";

import { ReactComponent as ChevronLeftIcon } from "../assets/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "../assets/icons/chevron-right.svg";
import { Dropdown, DropdownContent, DropdownToggle } from "./ui/Dropdown";
import { useState } from "react";
import Input from "./ui/Input";
import { Modal, ModalContent, ModalHeader, ModalTrigger } from "./ui/Modal";
import Button from "./ui/Button";

const Pagination = ({ onPageChange, totalCount, siblingCount = 1, currentPage, pageSize }) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const [jumpTo, setJumpTo] = useState("");

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
          <button onClick={onPrevious} aria-disabled={currentPage === 1}>
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
                <Modal id={`${pageNumber}-${index}`}>
                  <ModalHeader>Jump to page</ModalHeader>
                  <ModalContent>
                    Jump to:
                    <Input
                      min={1}
                      max={lastPage}
                      defaultValue={1}
                      onChange={(event) => setJumpTo(event.target.value)}
                    />
                    <Button block color={"accent"} onClick={() => jumpToPage(jumpTo)}>
                      Go
                    </Button>
                  </ModalContent>
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
          <button onClick={onNext} aria-disabled={currentPage === lastPage}>
            <ChevronRightIcon className="icon-16" />
          </button>
        </li>
      </ol>
    </div>
  );
};

export default Pagination;
