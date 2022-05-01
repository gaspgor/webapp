import DataTable from "../../components/DataTable";

const Campaigns = () => (
  <DataTable
    controller="campaigns"
    tableColumns={[
      {
        name: 'Name',
        selector: (row: any) => row.name,
      },
      {
        name: 'Status',
        selector: (row: any) => parseInt(row.status, 10) === 1 ? "active" : "inactive",
      },
    ]}
    title="Campaigns"
  />
);

export default Campaigns;
