"use client";

import React, { useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import ConvertModal from "@/components/launch/ConvertModal";
import { useProposal } from "@/app/ProposalProvider";

const ConvertProposal = () => {
  const { proposal, votesPercentage } = useProposal();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex justify-center mt-8">
      <div>
        {/* --------------------------------------- proposal card -------------------  */}
        <div className="w-[500px] text-white/80 text-sm border rounded-sm border-white/20 px-4 py-4 flex flex-col gap-4">
          <div className="">{proposal?.title}</div>
          <div>{proposal?.description}</div>
          <div>
            ✅ <strong>{votesPercentage}%</strong> of voters love your proposal
          </div>
          <div className="flex justify-center mt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setOpen(true);
              }}
            >
              Launch
            </Button>
          </div>
        </div>

        {/* --------------------------------------- proposal card -------------------  */}
      </div>

      <Modal
        open={open}
        width={600}
        onCancel={() => setOpen(false)}
        closable={false}
        centered
        style={{ marginInline: "-24px", background: "#121a2e" }}
      >
        <div className="flex justify-center">
          <ConvertModal />
        </div>
      </Modal>
    </div>
  );
};

export default ConvertProposal;
