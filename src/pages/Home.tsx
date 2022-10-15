import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { clearBotName, twitchBotName } from "../data/data";

import { ImTwitch } from "react-icons/im";
import { CgScreen } from "react-icons/cg";
import { SiProbot } from "react-icons/si";

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

  const rateBots = (specs: number, bots: number) => {
    const pourcents = (bots * 100) / specs;
    if (pourcents > 15 && specs > 20)
      return (
        <div className="p-2 bg-red-500 text-white">
          Botting streamer : {pourcents.toFixed(2)} %
        </div>
      );
    return (
      <div className="p-2 bg-blue-500 text-white">
        Clean : {pourcents.toFixed(2)} %
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-slate-900">
      <div className="w-full md:w-2/3 lg:w-1/3 bg-slate-800">
        <Header />

        <form
          onSubmit={(event) => onSubmitList(event, form)}
          className="mt-6 flex flex-col items-center w-full p-6"
        >
          <p className="text-white text-xs italic">
            Copy & paste a twitch's spectators list from
            <span className="ml-1 font-bold text-purple-500">Chatty</span>
          </p>
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
            className="p-2 mt-2 ml-auto mr-0 w-max text-sm bg-emerald-400 rounded hover:bg-emerald-600"
          >
            Submit
          </button>
        </form>
        <div className="flex flex-col p-5">
          {result.bots.amount && result.amountSpecs
            ? rateBots(result.amountSpecs, result.bots.amount)
            : ""}
          <div className="flex items-center space-x-2 text-sm text-slate-50 p-2">
            <span className="font-medium">
              <ImTwitch />
            </span>
            <span className="font-medium text-purple-300 text-xl">
              {result.streamer}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-50 p-2">
            <span className="font-medium">
              <CgScreen />
            </span>
            <span className="font-medium text-cyan-500 text-xl">
              {result.amountSpecs !== 0
                ? `${result.amountSpecs} spectators`
                : ""}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-50 p-2">
            <span className="font-medium">
              <SiProbot />
            </span>
            <span className="font-medium text-rose-500 text-xl">
              {result.bots.amount !== 0 ? `${result.bots.amount} bots` : ""}
            </span>
          </div>
          <div className="flex space-x-2 text-sm text-slate-50 p-2">
            <ul className="font-medium text-rose-200 text-xl flex flex-col space-x-1 italic text-xs">
              {result.bots.list.length > 0 &&
                result.bots.list.map((bot: string, index: number) => (
                  <li
                    key={index}
                    className="p-1 hover:bg-slate-500 hover:text-slate-900"
                  >
                    <a href={`https://twitch.tv/${bot}`}>{bot}</a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
