import {
  FC,
  useCallback,
  useEffect,
  useState
} from "react";
import { useRouter } from "next/router";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import DataTableComponent from "react-data-table-component";
import Loading from "../Loading";

type DataTableType = {
  controller: string,
  tableColumns: object[],
  title: string,
}

type ResponseType = {
  data: any,
  count: number,
}

const DataTable: FC<DataTableType> = ({
  controller,
  tableColumns,
  title,
}) => {
  const router = useRouter();
  const [data, setData] = useState<ResponseType>({ data: [], count: 0 });
  const [isLoading, setLoading] = useState<boolean>(true);
  const [paginationLimit, setPaginationLimit] = useState<number>(10);
  const [paginationOffset, setPaginationOffset] = useState<number>(0);
  const updateLoadingState = useCallback(
    (state: boolean) => {
      setLoading(state);
    },
    [setLoading],
  );

  const dataFetcher = useCallback(
    () => {
      updateLoadingState(true);
      fetch(`${process.env.APP_URL}/${controller}?limit=${paginationLimit}&offset=${paginationOffset * paginationLimit}`)
        .then(res => res.json())
        .then(
          (result) => {
            setData(result);
            updateLoadingState(false);
          },
          (error) => {
            console.log(error.message)
            alert("Something went wrong");
          },
        );
    },
    [controller, paginationLimit, paginationOffset, updateLoadingState],
  )

  useEffect(
    () => {
      dataFetcher();
    },
    [dataFetcher],
  );

  const deleteData = useCallback(
    (id: number) => {
      if(confirm("Are you sure you want delete?")) {
        updateLoadingState(true);
        fetch(`${process.env.APP_URL}/${controller}/${id}`, {
          method: "DELETE",
        })
          .then(
            (result) => {
              router.reload();
            },
            (error) => {
              console.log(error.message)
              alert("Something went wrong");
            },
          );
      }
    },
    [controller, router, updateLoadingState],
  );

  const handlePageChange = (page: any) => {
    setPaginationOffset(page-1);
  };

  const handlePerRowsChange = async (newPerPage: any, page: any) => {
    setPaginationLimit(newPerPage);
    setPaginationOffset(page-1);
  };

  return (
    <div>
      <DataTableComponent
        title={title}
        paginationServer
        data={data.data}
        paginationTotalRows={data.count}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        pagination
        columns={[
          {
            cell: (row: any) => (
              <div className="flex gap-[10px]">
                <button onClick={() => {router.push(`/${controller}/${row.id}`)}}>
                  <FaPen size={15}/>
                </button>
                <button onClick={() => {deleteData(row.id)}}>
                  <FaTrashAlt size={15}/>
                </button>
              </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            name: <>
              <button
                onClick={() => {
                  router.push(`/${controller}/new`);
                }}
              >
                <FaPlus />
              </button>
            </>
          },
          ...tableColumns,
        ]}
      />
      <Loading isLoading={isLoading} />
    </div>
  );
};

export default DataTable;
