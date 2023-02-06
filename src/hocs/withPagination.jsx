import Pagination from "../components/Pagination";

const withPagination = ({
  WrappedComponent,
  items,
  pageSize,
  totalPages,
  totalCount,
  currentPage = 1,
  setCurrentPage,
  paginateWithAPI,
}) => {
  if (pageSize === 0) return (props) => <WrappedComponent {...props} items={items} />;

  var currentItems = [];
  if (paginateWithAPI) {
    currentItems = items;
    totalPages = Math.ceil(totalCount / pageSize);
  } else {
    const begin = (currentPage - 1) * pageSize;
    const end = begin + pageSize;
    currentItems = items.slice(begin, end);
  }

  return (props) => {
    return (
      <>
        <WrappedComponent {...props} items={currentItems} />
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          siblingCount={1}
          onPageChange={setCurrentPage}
        />
      </>
    );
  };
};

export default withPagination;
