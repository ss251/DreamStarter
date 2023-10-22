"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@/components/common/Button";
import { useProposal } from "@/app/ProposalProvider";

interface FormMessage {
  description: string;
  title: string;
  priceperNFT: number;
  funding_goal: number;
  proposal_type: string;
  date: string;
}
const initialValues: FormMessage = {
  title: "hello",
  description: "fine",
  priceperNFT: 0.1,
  funding_goal: 500,
  proposal_type: "holder",
  date: ``,
};
const CreateProposal = () => {
  const { setProposal } = useProposal();
  return (
    <div className="text-sm mt-8">
      <div className="flex justify-center">
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            setProposal(values);
            console.log({ values, actions });
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }}
        >
          <Form>
            <div className="text-center mb-2">
              Submit your project proposals and ideas for community votes and
              crowdfunding
            </div>
            <div className="flex flex-col gap-4">
              {/* ------------------------  */}
              <div>
                <label htmlFor="title">Title</label>
                <div className="mt-2">
                  <Field
                    required
                    type="text"
                    id="title"
                    name="title"
                    className="bg-white/5 border border-white/40 px-2 py-2 rounded-sm backdrop-blur-lg text-sm"
                  />
                </div>
              </div>
              {/* -------------  */}

              {/* ------------------------  */}
              <div>
                <label htmlFor="description">Description</label>
                <div className=" mt-2">
                  <Field
                    required
                    as="textarea"
                    id="description"
                    name="description"
                    rows="8"
                    cols="50"
                    className="bg-white/5 border border-white/40 px-2 py-2 rounded-sm backdrop-blur-lg text-sm"
                  />
                </div>
              </div>

              {/* -------------  */}
              {/* ------------------------  */}
              <div>
                <label htmlFor="priceperNFT">Price per NFT</label>
                <div className="mt-2">
                  <Field
                    required
                    type="number"
                    id="priceperNFT"
                    name="priceperNFT"
                    className="bg-white/5 border border-white/40 px-2 py-2 rounded-sm backdrop-blur-lg text-sm"
                  />
                </div>
              </div>

              {/* -------------  */}

              {/* ------------------------  */}
              <div>
                <label htmlFor="funding_goal">Funding Goal</label>
                <div className="mt-2">
                  <Field
                    required
                    type="number"
                    id="funding_goal"
                    name="funding_goal"
                    className="bg-white/5 border border-white/40 px-2 py-2 rounded-sm backdrop-blur-lg text-sm"
                  />
                </div>
              </div>

              {/* -------------  */}

              {/* ------------ */}
              <div className="flex gap-4">
                <label className="text-sm">
                  <Field
                    type="radio"
                    name="proposal_type"
                    value="collab"
                    required
                  />
                  DreamStarter Collab
                </label>
                <label className="text-sm">
                  <Field
                    type="radio"
                    name="proposal_type"
                    value="holder"
                    required
                  />
                  DreamStarter Holder
                </label>
              </div>

              {/* ----------  */}

              {/* ----------------------  */}
              <div>
                <div>
                  <label htmlFor="date" className="block mb-2">
                    Valid till
                  </label>
                  <Field
                    type="date"
                    id="date"
                    name="date"
                    min={`${new Date().toLocaleDateString("en-GB")}`}
                    className="bg-white/5"
                    required
                  />
                </div>
              </div>

              {/* ---------------------- */}
            </div>

            <div className="flex justify-center mt-5">
              <Button variant="primary" size="md" type="submit">
                Create Proposal
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CreateProposal;
