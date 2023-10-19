import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";

import Button from "@/components/common/Button";

interface FormMessage {
  title: string;
  description: string;
  priceperNFT: number;
  funding_goal: number;
  stable_coin_option: string;
  starting_date: string;
  ending_date: string;
}
const initialValues: FormMessage = {
  title: "This is Proposal Title",
  description:
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more-or-lessnormal distribution of letters, as opposed to using Contenthere, content here', making it look like readable English.Many desktop publishing packages and web page editors now useLorem Ipsum as thei",
  priceperNFT: 0.1,
  funding_goal: 500,
  stable_coin_option: ``,
  starting_date: ``,
  ending_date: ``,
};
const ConvertModal = () => {
  return (
    <div className="text-sm">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }}
      >
        {({ values, isSubmitting }: FormikProps<FormMessage>) => (
          <Form>
            <div className="text-white/80">
              <div className="w-[500px] text-white/80 text-sm  px-4 py-4 flex flex-col gap-4">
                <div className="">{values.title}</div>
                <div>{values.description}</div>
                <div>Price Per NFT: {values.priceperNFT}</div>
                <div>Funding Goal: {values.funding_goal} USDC</div>
                {/* ------------------------ */}
                <div>
                  <label htmlFor="stable_coin_option" className="block mb-2">
                    StableCoin for the funding :
                  </label>
                  <Field
                    as="select"
                    id="stable_coin_option"
                    name="stable_coin_option"
                    className="bg-[#121a2e] px-2 py-2 border border-white/70"
                    required
                  >
                    <option
                      className="bg-white/5 px-1 py-1 "
                      value=""
                      label="Select a stable coin"
                    />
                    <option
                      className="bg-[#121a2e] px-1 py-1 "
                      value="USDT"
                      label="USDT"
                    />
                    <option
                      className="bg-[#121a2e] px-1 py-2"
                      value="USDC"
                      label="USDC"
                    />
                    <option
                      className="bg-[#121a2e] px-1 py-1"
                      value="sDAI"
                      label="SDAI"
                    />
                  </Field>
                </div>

                {/* -------------------------------- */}
                {/* ----------------------  */}
                <div className="flex gap-6 items-center">
                  <div>
                    <label htmlFor="starting_date" className="block mb-2">
                      Starting Date
                    </label>
                    <Field
                      type="date"
                      id="starting_date"
                      name="starting_date"
                      min={`${new Date().toLocaleDateString("en-GB")}`}
                      className="bg-white/5 px-1 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="ending_date" className="block mb-2">
                      Ending Date
                    </label>
                    <Field
                      type="date"
                      id="ending_date"
                      name="ending_date"
                      min={`${new Date().toLocaleDateString("en-GB")}`}
                      className="bg-white/5 px-1 py-2"
                      required
                    />
                  </div>
                </div>
                {/* ---------------------- */}

                <div className="flex justify-center mt-2">
                  <Button variant="primary" size="md" type="submit">
                    Launch crowdfunding
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ConvertModal;
