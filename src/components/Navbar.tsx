// app/components/Navbar.tsx
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  dropdownItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { 
    label: 'Home',
    href: '/',
  },
  { 
    label: 'About',
    href: '/about',
    dropdownItems: [
      { label: 'Our Team', href: '/about/team' },
      { label: 'Our History', href: '/about/history' },
    ]
  },
  { 
    label: 'Contests',
    href: '/contest',
    // dropdownItems: [
    //   { label: 'Web Development', href: '/services/web-development' },
    //   { label: 'Mobile Apps', href: '/services/mobile-apps' },
    //   { label: 'Consulting', href: '/services/consulting' },
    // ]
  },
  { 
    label: 'Contact',
    href: '/contact',
  },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const NavLink: React.FC<{ item: NavItem, mobile?: boolean }> = ({ item, mobile }) => {
    const active = pathname === item.href || pathname.startsWith(item.href + '/');
    const hasDropdown = item.dropdownItems && item.dropdownItems.length > 0;

    return (
      <div className={`relative ${mobile ? 'block' : 'inline-block'}`}>
        {hasDropdown ? (
          <button
            onClick={() => toggleDropdown(item.label)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              active
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.label}
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        ) : (
          <Link
            href={item.href}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              active
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        )}
        {hasDropdown && openDropdown === item.label && (
          <div className={`${mobile ? 'static' : 'absolute'} z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}>
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {item.dropdownItems?.map((dropdownItem) => (
                <Link
                  key={dropdownItem.href}
                  href={dropdownItem.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  {dropdownItem.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold">
              Logo
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} mobile />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;