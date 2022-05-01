import DataTable from "../../components/DataTable";

const Banners = () => (
  <DataTable
    controller="banners"
    tableColumns={[
      {
        name: 'Name',
        selector: (row: any) => row.name,
      },
      {
        name: 'Text',
        selector: (row: any) => row.text,
      },
    ]}
    title="Banners"
  />
);

export default Banners;
