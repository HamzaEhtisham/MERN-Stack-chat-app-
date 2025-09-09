import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import ProfileButton from "./ProfileButton";
import SearchInput from "./SearchInput";

const Sidebar = ({ openGroupModal }) => {
    return (
        <div className='border-r border-slate-500 p-4 flex flex-col'>
            <SearchInput />
            <div className='divider px-3'></div>
            <Conversations />
            <div className="mt-auto flex flex-col gap-2">
                <button className='btn btn-primary' onClick={openGroupModal}>
                    Create Group
                </button>
                <div className="flex justify-between">
                    <LogoutButton />
                    <ProfileButton />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;