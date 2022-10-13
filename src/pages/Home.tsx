import { useState } from "react";
import { Header } from "../components/Header";
import { sortingUsersList } from "../misc/usersList";
import { twitchBotName } from "../data/data";

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

  const onSubmit = (event: React.FormEvent, data: FormProps) => {
    event.preventDefault();
    if (data.list) {
      const sortList = sortingUsersList(data.list);
      const findStreamer = sortList.find((user) => user.startsWith("~")) || "";
      const botsNames = clearBotName(twitchBotName);
      const findingBots: string[] = [];
      sortList.forEach((spec) => {
        const findBots = botsNames.findIndex((bot) => bot === spec);
        if (findBots !== -1) {
          findingBots.push(botsNames[findBots]);
        }
      });
      setResult({
        streamer: findStreamer.slice(1),
        amountSpecs: sortList.length,
        bots: { list: findingBots, amount: findingBots.length },
      });
    }
  };

  console.log(result);

  return (
    <div className="flex justify-center w-full min-h-screen bg-slate-800">
      <div className="w-full md:w-2/3 lg:w-1/3 bg-slate-700">
        <Header />
        <p className="text-center text-slate-50 italic font-medium">
          track bots in spectator's list
        </p>
        <form
          onSubmit={(event) => onSubmit(event, form)}
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

function clearBotName(array: string[]): string[] {
  const newArray: string[] = [];
  array.forEach((el: string) => {
    newArray.push(el.split("	")[0].toLowerCase());
  });
  return newArray;
}
