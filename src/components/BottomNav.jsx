import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, Puzzle, User } from 'lucide-react';

export function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Beranda' },
    { to: '/explore/menu', icon: Utensils, label: 'Menu' },
    { to: '/explore/activity', icon: Puzzle, label: 'Aktivitas' },
    { to: '/my-page', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-neutral-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe z-30">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-primary-500' : 'text-neutral-400 hover:text-neutral-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-xs font-medium ${isActive ? 'text-primary-600' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
