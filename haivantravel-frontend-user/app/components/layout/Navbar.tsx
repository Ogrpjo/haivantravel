"use client";

import { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Link, Button } from "@heroui/react";
import {
  PhoneCall,
  Facebook,
  YouTube,
  Play,
  Menu,
  X,
} from "@deemlol/next-icons";
import Image from "next/image";
import ButtonGradient from "../button-gradient";

function TopNavbar() {
  return (
    <div className="px-[20px] justify-between flex w-full bg-[#2E2E2E] text-white max-sm:hidden">
      <div className="flex items-center justify-start">
        <div className="flex gap-3 items-center border-r pr-[20px] my-[10px]">
          <PhoneCall size={20} />
          <p>+84 (853 566 556)</p>
        </div>
        <p className="pl-[20px]">Info.hcmc@haivantravelvn.com</p>
      </div>
      <div className="flex items-center md:px-[20px] gap-3 hidden sm:flex">
        <Link href="https://www.facebook.com/haivantravelhcmc">
          <Facebook size={20} />
        </Link>
        <Link href="https://www.youtube.com/@haivantravel9872">
          <YouTube size={20} />
        </Link>
        <Link href="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917" />
          </svg>
        </Link>
        <Link href="">
          <Image
            src="/socialbutton/zalo.svg"
            alt="zalo"
            width={25}
            height={20}
          />
        </Link>
      </div>
    </div>
  );
}

function BottomNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = [
    {name: "Trang chủ", href: "/"}, 
    {name: "Case Study", href: "/case-study"},
    {name: "Dịch vụ", href: "/service"}, 
    {name: "Về chúng tôi", href: "about-us"}
  ]

  return (
    <>
      <Navbar className="h-auto py-[24px] bg-[#121212] lg:px-[84px] border-b-2 border-white/5">
        <NavbarContent className="lg:px-[40px]" justify="start">
          <Link href="/">
            <NavbarBrand>
              <Image
                src="/HaivantravelLogo.webp"
                alt="Logo"
                width={120}
                height={104}
              />
            </NavbarBrand>
          </Link>
        </NavbarContent>

        <NavbarContent className="hidden lg:flex" justify="center">
          {menuItems.map((item, index) => (
            <NavbarItem key={`${item}-${index}`}>
              <Link className="no-underline hover:text-white/70 text-[16px]" href={item.href}>
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent className="lg:px-[40px]" justify="end">
          <Link href="/contact" className="no-underline decoration-transparent hover:no-underline">
          <ButtonGradient name="Nhận Brief ngay" />
          </Link>

          <button
            className="lg:hidden cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={30} />
          </button>
        </NavbarContent>
      </Navbar>

      <div
        className={`fixed inset-0 flex transition-opacity duration-300 ${isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex-1" onClick={() => setIsMenuOpen(false)} />

        <div
          className={`w-full sm:max-w-sm bg-[#121212] text-white h-screen z-100 relative p-6 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex justify-end mb-6">
            <button
              className="cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href} className="no-underline hover:text-white/70 cursor-pointer text-[16px]">
                {item.name}
              </Link>
            ))}

            <ButtonGradient name="Nhận Brief" />
          </div>
        </div>
      </div>
    </>
  );
}

export default function NavigationBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScollY = window.scrollY;

      if (currentScollY < 50) {
        setIsVisible(true);
      } else if (currentScollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScollY);
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <section
      className={`fixed top-0 left-0 w-full z-[100] bg-black transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <TopNavbar />
      <BottomNavbar />
    </section>
  );
}
