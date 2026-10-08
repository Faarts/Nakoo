import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, FoodIcon, PuzzleIcon, UserIcon } from './BottomNavIcons';

export function BottomNav() {
  const navItems = [
    { to: '/', icon: HomeIcon, label: 'Beranda' },
    { to: '/explore/menu', icon: FoodIcon, label: 'Menu Makan' },
    { to: '/explore/activity', icon: PuzzleIcon, label: 'Aktivitas' },
    { to: '/my-page', icon: UserIcon, label: 'Akun Saya' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-neutral-100 shadow-nav pb-safe z-30">
      <div className="flex justify-around items-center h-[72px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full pt-1 transition-colors ${isActive ? 'text-nakoo-red-500' : 'text-neutral-400 hover:text-neutral-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-[26px] h-[26px] mb-1.5" />
                  <span className={`text-[11px] font-semibold leading-none`}>
                    {item.label}
                  </span>
                  {/* Active Indicator */}
                  <div className={`mt-1.5 h-1 w-4 rounded-full transition-all duration-300 ${isActive ? 'bg-nakoo-red-500' : 'bg-transparent opacity-0'}`} />
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
