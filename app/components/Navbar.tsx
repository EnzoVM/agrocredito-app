'use client'

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar () {
  const path = usePathname()
  
  const selectedButtonclass = 'block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
  const unselectedButtonclass = 'block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
  
  return (
    <nav className="bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 fixed w-full z-20 top-0 left-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="https://flowbite.com/" className="flex items-center">
          <Image src="/pebpt.jpg" width={40} height={70} className="h-8 mr-3 rounded" alt="PEBPT" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">AgroCredito</span>
      </a>
      <div className="flex md:order-2">
          <Link href='/login' type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cerrar sesión</Link>
      </div>
      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-800 dark:border-gray-700">
          <li>
            <Link 
              href="/home/campaign" 
              className={path.includes('/home/campaign') ? selectedButtonclass : unselectedButtonclass}
              aria-current="page"
            >
              Campañas
            </Link>
          </li>
          <li>
            <Link 
              href="/home/farmer"
              className={path.includes('/home/farmer') ? selectedButtonclass : unselectedButtonclass}
            >
              Agricultores
            </Link>
          </li>
          <li>
            <Link 
              href="/home/sector"
              className={path.includes('/home/sector') ? selectedButtonclass : unselectedButtonclass}
            >
              Sectores
            </Link>
          </li>
          <li>
            <Link 
              href="/home/project"
              className={path.includes('/home/project') ? selectedButtonclass : unselectedButtonclass}
            >
              Proyectos
            </Link>
          </li>
        </ul>
      </div>
      </div>
    </nav>
  )
}