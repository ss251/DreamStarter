import Button from "@/components/common/Button";
import React, { FC } from "react";

const page: FC = () => {
  return (
    <div>
      <div className="justify-center flex">
        <Button size="md" variant="primary">
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};

export default page;
