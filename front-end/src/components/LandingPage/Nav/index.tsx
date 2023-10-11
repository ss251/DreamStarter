import React, { FC } from "react";
import { GiTakeMyMoney } from "react-icons/gi";
const Nav: FC = () => {
  return (
    <div className="px-4 py-8 text-lg">
      <div className="flex gap-2 items-center">
        <div className="text-3xl">
          <GiTakeMyMoney />
        </div>
        <div>DreamStarter</div>
      </div>
    </div>
  );
};

export default Nav;
