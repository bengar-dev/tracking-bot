import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { clearBotName, twitchBotName } from "../data/data";

interface FormProps {
  list: string;
}

interface ResultsProps {
  amountSpecs: number;
  streamer: string;
  bots: {
    list: string[];
    amount: number;
  };
}

export default function Home() {
  const [bots, setBots] = useState<any[]>([]);
  const [form, setForm] = useState<FormProps>({
    list: "",
  });
  const [result, setResult] = useState<ResultsProps>({
    amountSpecs: 0,
    streamer: "",
    bots: {
      list: [],
      amount: 0,
    },
  });

  useEffect(() => {
    getBotsFromApi("https://api.twitchbots.info/v2/bot");
  }, []);

  const getBotsFromApi = async (api: string): Promise<any> => {
    const newArray: string[] = [];

    const getData = async (url: string): Promise<any> => {
      const { data } = await axios.get(url);
      data.bots.forEach((bot: any) => newArray.push(bot.username));
      if (data._links.next) await getData(data._links.next);
      else return true;
    };

    await getData(api);
    setBots(newArray);
  };

  const onSubmitList = (event: React.FormEvent, data: FormProps) => {
    event.preventDefault();

    const dataArray = data.list.split("\n");
    const filteredData: string[] = [];

    dataArray.forEach((data) => {
      const dataFilter = data.split(" ")[0];
      filteredData.push(dataFilter.toLowerCase());
    });

    const streamer = filteredData.find((user) => user.startsWith("~")) || "";

    const botsNames = clearBotName(twitchBotName).concat(bots);

    const findingBots: string[] = [];

    filteredData.forEach((spec) => {
      const findBot = botsNames.findIndex((bot) => bot === spec);
      if (findBot !== -1) findingBots.push(botsNames[findBot]);
      if (spec.includes("bot")) findingBots.push(spec);
    });

    const deleteDuplicateBots = [...new Set(findingBots)];

    setResult({
      streamer: streamer.slice(1),
      amountSpecs: filteredData.length,
      bots: { list: deleteDuplicateBots, amount: deleteDuplicateBots.length },
    });
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-slate-800">
      <div className="w-full md:w-2/3 lg:w-1/3 bg-slate-700">
        <Header />
        <p className="text-center text-slate-50 italic font-medium">
          track bots in spectator's list
        </p>
        <form
          onSubmit={(event) => onSubmitList(event, form)}
          className="mt-6 flex flex-col items-center w-full p-2"
        >
          <label htmlFor="list" className="p-2 mr-auto ml-0 text-cyan-300">
            Spectator list
          </label>
          <textarea
            id="list"
            onChange={(event) => setForm({ ...form, list: event.target.value })}
            className="w-full h-40 outline-none resize-none p-2 text-sm rounded-lg"
          ></textarea>
          <button
            type="submit"
            className="p-2 mt-2 w-full text-sm bg-emerald-400 rounded hover:bg-emerald-600"
          >
            Submit
          </button>
        </form>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-sm text-slate-50 p-2">
            <span className="font-medium">Streamer :</span>
            <span className="font-medium text-cyan-500 text-xl">
              {result.streamer}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-50 p-2">
            <span className="font-medium">Spectators :</span>
            <span className="font-medium text-cyan-500 text-xl">
              {result.amountSpecs}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-50 p-2">
            <span className="font-medium">Bots amount :</span>
            <span className="font-medium text-cyan-500 text-xl">
              {result.bots.amount}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-50 p-2">
            <span className="font-medium">Bot's names :</span>
            <span className="font-medium text-cyan-500 text-xl flex flex-wrap space-x-1 italic text-xs">
              {result.bots.list.length > 0 &&
                result.bots.list.map((bot: string, index: number) => (
                  <p key={index}>{bot}</p>
                ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
