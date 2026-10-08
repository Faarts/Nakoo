import React, { useState } from 'react';
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
<<<<<<< HEAD
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-neutral-100 shadow-nav pb-safe z-30">
=======
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-neutral-100/80 pb-safe z-30"
      style={{ boxShadow: '0 -2px 16px rgba(0,0,0,0.07)' }}
    >
>>>>>>> 1ed2701e131f7d51bcddb49f47f1fd849743e0cc
      <div className="flex justify-around items-center h-[72px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
<<<<<<< HEAD
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
=======
              end={item.to === '/'}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              {({ isActive }) => (
                <div
                  className="relative flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(252, 188, 80, 0.12)' : 'transparent',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="transition-all duration-200"
                    style={{
                      transform: isActive ? 'scale(1.15) translateY(-1px)' : 'scale(1)',
                      color: isActive ? '#E3A948' : '#a3a3a3',
                    }}
                  >
                    <Icon
                      className="w-[26px] h-[26px] transition-colors duration-200"
                      style={{ color: isActive ? '#E3A948' : '#a3a3a3' }}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className="text-[10.5px] leading-none transition-all duration-200 whitespace-nowrap"
                    style={{
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#B08338' : '#a3a3a3',
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Active dot indicator */}
                  <div
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? '20px' : '4px',
                      height: '3px',
                      background: isActive ? '#FCBC50' : 'transparent',
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </div>
>>>>>>> 1ed2701e131f7d51bcddb49f47f1fd849743e0cc
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
