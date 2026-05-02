import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Plus, LogOut, User, ChevronDown, Menu } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { toggleMobileNav } = useUIStore();
  const navigate = useNavigate();
  const [searchFocus, setSearchFocus] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    { label: 'Profile', icon: <User size={14} />, onClick: () => navigate('/settings') },
    { divider: true },
    { label: 'Log out', icon: <LogOut size={14} />, onClick: handleLogout, danger: true },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={toggleMobileNav}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className={cn(
          'hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-150 bg-gray-50',
          searchFocus ? 'border-brand-400 bg-white ring-2 ring-brand-500/10 w-80' : 'border-gray-200 w-64'
        )}>
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search contracts, clients…"
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none flex-1 min-w-0"
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          />
          {searchFocus && (
            <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 rounded border border-gray-200 font-mono">⌘K</kbd>
          )}
        </div>
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => navigate('/contracts/new')}
          className="hidden sm:inline-flex"
        >
          New Contract
        </Button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* User menu */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
              <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                {user?.name || 'User'}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
}
