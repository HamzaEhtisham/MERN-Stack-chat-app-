import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";

const Sidebar = () => {
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col h-full max-w-[100vw] w-full md:w-[380px]">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome</h1>
        <SearchInput />
        <div className="divider px-3"></div>
        <ProfileButton />
        <Conversations />
        <LogoutButton />
      </div>
    </div>
  );
};
export default Sidebar;

// STARTER CODE FOR THIS FILE
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
// 			<Conversations />
// 			<LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;
