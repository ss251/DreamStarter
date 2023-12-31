import React, { FC, useState } from "react";
import { GiTakeMyMoney } from "react-icons/gi";
import Button from "@/components/common/Button";
import Link from "next/link";
import { ConnectWallet } from "@thirdweb-dev/react";

const Nav = ({
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks = [
    {
      title: "Launch",
      path: "/launch",
      subItems: [
        { title: "Create Proposal", path: "/home/launch/create-proposal" },
        { title: "Convert Proposal", path: "/home/launch/convert-proposal" },
      ],
    },
    {
      title: "Explore",
      path: "/explore",
      subItems: [
        { title: "Ongoing Proposals", path: "/home/explore/ongoing-proposals" },
        { title: "Crowdfunding Events", path: "/home/explore/crowdfunding-events" },
      ],
    },
    {
      title: "Dashboard",
      path: "/dashboard",
      subItems: [
        { title: "Crowdfunding Events", path: "/home/dashboard/crowdfunding-events" },
        { title: "Started Events", path: "/home/dashboard/started-events" },
      ],
    },
  ];

  return (
    <div className="px-6 py-4 shadow-sm flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <div className="text-2xl">
          <GiTakeMyMoney />
        </div>
        <div className="text-xl font-semibold">Dreamstarter</div>
      </div>

      <div className="flex gap-4 items-center">
        {navLinks.map((navItem) => (
          <div
            key={navItem.title}
            className="relative group hover:text-red-500 cursor-pointer"
            onMouseEnter={() => setActiveDropdown(navItem.title)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {navItem.title}
            {navItem.subItems && (
              <div
                className={`absolute left-0 w-48 py-2 bg-white rounded-md shadow-xl border ${
                  activeDropdown === navItem.title ? "block" : "hidden"
                }`}
              >
                {navItem.subItems.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.path}
                    className="block px-4 py-2 text-sm hover:bg-red-50"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        
          <ConnectWallet
            theme={"dark"}
            modalSize={"wide"}
          />
        
      </div>
    </div>
  );
};

export default Nav;
