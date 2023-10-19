import React, { useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import ConvertModal from "./ConvertModal";
const ConvertProposal = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex justify-center">
      <div>
        {/* --------------------------------------- proposal card -------------------  */}
        <div className="w-[500px] text-white/80 text-sm border rounded-sm border-white/20 px-4 py-4 flex flex-col gap-4">
          <div className="">This is Proposal Title</div>
          <div>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum as thei
          </div>
          <div>
            ✅ <strong>70%</strong> of voters love your proposal
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
        bodyStyle={{ marginInline: "-24px", background: "#121a2e" }}
      >
        <div className="flex justify-center">
          <ConvertModal />
        </div>
      </Modal>
    </div>
  );
};

export default ConvertProposal;
