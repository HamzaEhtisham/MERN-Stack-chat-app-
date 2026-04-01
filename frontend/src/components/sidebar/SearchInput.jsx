import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else toast.error("No such user found!");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full group"
    >
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search messages or users..."
          className="w-full premium-input h-10 md:h-11 xl:h-12 pl-4 pr-10 text-[13px] md:text-sm xl:text-base border-white/5 bg-white/5 hover:bg-white/10 text-white placeholder-slate-400 focus:bg-white/10 transition-all rounded-xl md:rounded-2xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-10 md:h-11 xl:h-12 w-10 md:w-12 flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-colors"
        >
          <IoSearchSharp size={18} className="md:w-5 md:h-5" />
        </button>
      </div>
    </form>
  );
};
export default SearchInput;

// STARTER CODE SNIPPET
// import { IoSearchSharp } from "react-icons/io5";

// const SearchInput = () => {
// 	return (
// 		<form className='flex items-center gap-2'>
// 			<input type='text' placeholder='Search…' className='input input-bordered rounded-full' />
// 			<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
// 				<IoSearchSharp className='w-6 h-6 outline-none' />
// 			</button>
// 		</form>
// 	);
// };
// export default SearchInput;
