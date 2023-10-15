"use client";

import Button from "@/components/common/Button";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

interface FormMessage {
  message: string;
}
const initialValues: FormMessage = {
  message: "",
};

const Launch = () => {
  return (
    <>
      <div>
        {/* --------------------------------------- form --------------------------  */}
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            console.log({ values, actions });
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }}
        >
          <Form>
            <div className="text-center">
              Submit your project proposals and ideas for community votes and
              crowdfunding
            </div>
            <div className="flex justify-center mt-5">
              <Field
                as="textarea"
                id="message"
                name="message"
                rows="8"
                cols="50"
                className="bg-black border px-2 py-2"
              />
            </div>
            <div className="flex justify-center mt-5">
              <Button variant="primary" size="md" type="submit">
                Create Proposal
              </Button>
            </div>
          </Form>
        </Formik>
        {/* --------------------------------------- form --------------------------  */}
      </div>
    </>
  );
};

export default Launch;
