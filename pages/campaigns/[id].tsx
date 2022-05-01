import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import _ from "lodash";
import Select from "react-dropdown-select";
import { create, update } from "../../utils/api";
import DataCheckerById from "../../utils/dataCheckerById";
import Loading from "../../components/Loading";
import FormInput from "../../components/FormInput";

type CampaignType = {
  id?: number,
  name: string,
  banners: any,
  activityChart: any,
  status: 0 | 1,
}

type BannerType = {
  id: number,
  name: string,
};

type BannersData = {
  data: BannerType[],
  count: number,
}

type activityChartType = {
  from: string,
  to: string,
}

const Campaign = ({ id, data }: { id: number, data: CampaignType }) => {
  const router = useRouter();

  const [campaign, setCampaign] = useState<CampaignType>({
    id: data.id,
    name: data.name,
    banners: JSON.parse(data.banners),
    activityChart: JSON.parse(data.activityChart),
    status: data.status,
  });

  const hourValidationRegex = useMemo(
    () => new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"),
    [],
  );

  const [bannersData, setBannersData] = useState<BannersData>({
    data: [],
    count: 0,
  });

  const [isLoading, setLoading] = useState<boolean>(true);

  const [date, setDate] = useState<activityChartType>({
    from: "00:00",
    to: "",
  });

  const nameOnChange = useCallback(
    (value: string) => {
      setCampaign(prev => ({
        ...prev,
        name: value,
      }));
    },
    [setCampaign],
  );

  const updateLoadingState = useCallback(
    (state: boolean) => {
      setLoading(state);
    },
    [setLoading],
  );

  useEffect(
    () => {
      fetch(`${process.env.APP_URL}/banners?limit=100&offset=0`)
        .then(res => res.json())
        .then(
          (result) => {
            setBannersData(result);
            updateLoadingState(false);
          },
          (error) => {
            console.log(error.message);
            alert("Something went wrong");
          }
        );
    },
    [updateLoadingState],
  );

  const checkDateValidation = useCallback(
    (value?: string) => {
      if (!value || value === "") return true;

      return hourValidationRegex.test(value);
    },
    [hourValidationRegex]
  );

  const saveChanges = useCallback(
    async () => {
      const activityValidation = campaign.activityChart.every((hour: any) => {
        return checkDateValidation(hour.from) && checkDateValidation(hour.to);
      })
      if (!activityValidation) {
        alert("Correct Hours in Activity");
        return;
      }
      await update(
        "campaigns",
        id,
        {
          "campaign": {
            "name": campaign.name,
            "banners": JSON.stringify(campaign.banners),
            "activityChart": JSON.stringify(campaign.activityChart),
          },
        },
        (result) => {
          router.push("/campaigns")
        },
        (error) => {},
      );
    },
    [campaign.activityChart, campaign.banners, campaign.name, checkDateValidation, id, router],
  );

  const createCampaign = useCallback(
    async () => {
      updateLoadingState(true);
      await create(
        "campaigns",
        {
          "campaign": {
            "name": campaign.name,
            "banners": JSON.stringify(campaign.banners),
            "activityChart": JSON.stringify(campaign.activityChart),
            "status": campaign.status,
          },
        },
        (result) => {
          router.push('/campaigns')
        },
        (error) => {},
      );
    },
    [campaign, router, updateLoadingState],
  );

  const campaignListOnChange = useCallback(
    (banners: { value: number, label: string }[]) => {
      setCampaign(prev => ({
        ...prev,
        banners: banners.map(banner => banner.value),
      }))
    },
    [],
  );

  const onFromChanges = useCallback(
    (value: string) => {
      setDate(prev => ({
        ...prev,
        from: value,
      }));
    },
    [],
  );

  const onToChanges = useCallback(
    (value: string) => {
      setDate(prev => ({
        ...prev,
        to: value,
      }));
    },
    [],
  );

  const onDateAdd = useCallback(
    () => {
      if (!checkDateValidation(date.from) || !checkDateValidation(date.to)) {
        alert("Write date correctly");
        return;
      }

      setCampaign(prev => ({
        ...prev,
        activityChart: [
          ...prev.activityChart,
          {
            from: date.from,
            to: date.to,
          },
        ],
      }));
    },
    [checkDateValidation, date.from, date.to],
  );

  const changeActivityChartItem = useCallback(
    (index: number, { from, to }: { from?: string, to?: string } ) => {
      setCampaign(prev => ({
        ...prev,
        activityChart: [
          ...prev.activityChart.slice(0, index),
          {
            from: from || prev.activityChart[index].from,
            to: to || prev.activityChart[index].to,
          },
          ...prev.activityChart.slice(index+1),
        ],
      }));
    },
    [],
  );

  const deleteActivityChartItem = useCallback(
    (index: number) => {
      setCampaign(prev => ({
        ...prev,
        activityChart: _.remove(prev.activityChart, (n, ind) => !(ind === index)),
      }));
    },
    [],
  );

  return (
    <div className="flex justify-center py-[20px]">
      <div className="flex flex-col gap-y-[20px] w-[90%]">
        <FormInput onChange={nameOnChange} title="Name" value={campaign.name} />
        <Select
          multi
          placeholder="Banners"
          values={campaign.banners.map((banner: number) => ({
            value: banner,
            label: _.find(bannersData.data, { id: banner })?.name,
          }))}
          onChange={campaignListOnChange}
          options={bannersData.data.map(banner => ({
            value: banner.id,
            label: banner.name,
          }))}
        />
        <div>
          <div>
            <div className="flex gap-[5px] items-end pb-[10px] border-b-[1px] border-black mb-[10px]">
              <FormInput onChange={onFromChanges} title="From" value={date.from} />
              <FormInput onChange={onToChanges} title="To" value={date.to} />
              <button className="px-[10px] py-[5px] bg-gray-200 inline-flex rounded" onClick={onDateAdd}>Add</button>
            </div>
            {
              campaign.activityChart.map((hour: { from: string, to: string }, index: number) => (
                <div key={index} className="flex gap-[5px] items-end">
                  <FormInput onChange={(value) => {changeActivityChartItem(index, { from: value })}} title="From" value={hour.from} />
                  <FormInput onChange={(value) => {changeActivityChartItem(index, { to: value })}} title="To" value={hour.to} />
                  <button className="px-[10px] py-[5px] bg-gray-200 inline-flex rounded" onClick={() => {deleteActivityChartItem(index)}}>delete</button>
                </div>
              ))
            }
          </div>
        </div>
        <button onClick={campaign.id ? saveChanges : createCampaign}>Save</button>
      </div>
      <Loading isLoading={isLoading} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id;
  return await DataCheckerById(
    id as string,
    "campaigns",
    {
      name: "",
      banners: "[]",
      activityChart: "[]",
      status: 0,
    },
  );
}


export default Campaign;
