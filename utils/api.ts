export const update = (
  controller: string,
  id: string | number,
  body: any,
  onSuccess: (result: any) => void,
  onFailure: (error: any) => void,
) => {
  fetch(
    `${process.env.APP_URL}/${controller}/${id}`,
    {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    },
  )
    .then(
      (result) => {
        onSuccess(result);
      },
      (error) => {
        onFailure(error);
        console.log(error.message);
      },
    );
};

export const create = (
  controller: string,
  body: any,
  onSuccess: (result: any) => void,
  onFailure: (error: any) => void,
) => {
  fetch(
    `${process.env.APP_URL}/${controller}`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    },
  )
    .then(res => res.json())
    .then(
      (result) => {
        onSuccess(result);
      },
      (error) => {
        onFailure(error);
        console.log(error.message);
      }
    );
};
