import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";
import { useState } from "react";

const LogoutButton = () => {
  const { loading, logout } = useLogout();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full animate-fade-in">
      {showConfirm && !loading ? (
        <div className="space-y-3 p-4 bg-red-500/5 rounded-2xl border border-red-500/10 backdrop-blur-md">
          <p className="text-xs font-bold text-red-200 uppercase tracking-widest text-center">
            Are you sure?
          </p>
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-all"
              onClick={() => setShowConfirm(false)}
            >
              No
            </button>
            <button
              className="flex-1 py-2 text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all border border-red-500/20"
              onClick={logout}
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <button
          className="group flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 transition-all duration-300"
          onClick={() => setShowConfirm(true)}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs text-red-400"></span>
          ) : (
            <>
              <BiLogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
              <span className="text-sm font-bold text-slate-400 group-hover:text-red-400 transition-colors uppercase tracking-widest">
                Logout Session
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
export default LogoutButton;

