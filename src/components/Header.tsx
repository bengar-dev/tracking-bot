import { FaRobot } from 'react-icons/fa'

export const Header = (props: {}) => {
  return (
    <header className="p-5">
      <h1 className="flex justify-center items-center text-2xl text-slate-300"><FaRobot className="text-cyan-300 mr-4"/>tracking<span className="font-bold">bot</span></h1>
    </header>
  );
};
