const DataCheckerById = async (
  id: string,
  controller: string,
  defaultDataValue: any,
) => {
  if (id === "new") {
    return {
      props: {
        id: id,
        data: defaultDataValue,
      },
    };
  }
  const data = await fetch(`${process.env.APP_URL}/${controller}/${id}`);
  if (data.status != 200) return { props: {}, redirect: { destination: `/${controller}` } };

  return {
    props: {
      id: id,
      data: await data.json(),
    },
  };
};

export default DataCheckerById;
