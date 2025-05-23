import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

const navItems = [
  {
    label: 'Home',
    page: '/',
  },
  {
    label: 'Projects',
    page: '/projects',
  },
  {
    label: 'Blog',
    page: '/blog',
  },
  {
    label: 'Contact',
    page: '/contact',
  },
];

export default function Header() {
  const [navbar, setNavbar] = useState(false);
  const router = useRouter();

  return (
    <header className="w-full mx-auto  px-4 sm:px-20 fixed top-0 z-50 shadow bg-white dark:bg-stone-900 dark:border-b dark:border-stone-600">
      <div className="justify-between md:items-center md:flex">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <Link href="/">
              <div className="container flex items-center space-x-2">
                <h2 className="text-2xl font-bold">claude code woz ere</h2>
              </div>
            </Link>
            <div className="md:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? <IoMdClose size={30} /> : <FiMenu size={30} />}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            className={
              navbar
                ? 'md:flex flex-col items-start justify-start md:flex-row md:items-center md:justify-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in'
                : 'md:flex flex-col items-start justify-start md:flex-row md:items-center md:justify-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in hidden'
            }
          >
            {navItems.map((item, index) => {
              return (
                <Link key={index} href={item.page} legacyBehavior>
                  <a
                    className={`block md:inline-block text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white md:ml-6 ${router.asPath === item.page
                        ? 'font-bold underline underline-offset-8 decoration-4 decoration-indigo-600'
                        : 'hover:underline hover:underline-offset-8 hover:decoration-4 hover:decoration-indigo-600'
                      }`}
                  >
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
