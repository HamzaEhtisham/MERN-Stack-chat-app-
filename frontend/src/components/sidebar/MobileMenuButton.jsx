import { HiMenuAlt2 } from 'react-icons/hi';

const MobileMenuButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed top-4 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg"
      aria-label="Toggle sidebar"
    >
      <HiMenuAlt2 className="w-6 h-6" />
    </button>
  );
};

export default MobileMenuButton;