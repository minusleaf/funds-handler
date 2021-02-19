import { Button, Flex, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { FundInterface, FundType } from "../../App.interface";
import { FieldAndLabel } from "./components/FieldAndLabel/FieldAndLabel";

const FundTypes: FundType[] = [
  FundType.VENTURE_CAPITAL,
  FundType.HEDGE_FUND,
  FundType.REAL_ESTATE,
];

export interface AddFundWindowInterface {
  addFund: (newFund: FundInterface) => void;
}

export const AddFundWindow = ({ addFund }: AddFundWindowInterface) => {
  return (
    <Flex
      position="absolute"
      flexDirection="column"
      alignItems="center"
      left="2rem"
      top="2rem"
      backgroundColor="#aadcee"
      p="1rem"
      borderRadius="1.5rem"
    >
      <Text fontWeight="bold" mb="1rem">
        Add New Fund
      </Text>
      <Formik
        initialValues={
          {
            name: "",
            manager: "",
            year: new Date().getFullYear(),
            type: FundType.VENTURE_CAPITAL,
            isOpen: true,
          } as FundInterface
        }
        onSubmit={(values) => {
          addFund(values);
        }}
      >
        {() => (
          <Form>
            <Flex flexDirection="column">
              <FieldAndLabel label="Name" name="name" inputType="input" />
              <FieldAndLabel label="Manager" name="manager" inputType="input" />
              <FieldAndLabel label="Year" name="year" inputType="input" />
              <FieldAndLabel label="Type" name="type" inputType="select">
                {FundTypes.map((fund, index) => (
                  <option key={`type-${index}`} value={fund}>
                    {fund}
                  </option>
                ))}
              </FieldAndLabel>
              <FieldAndLabel label="Is Open" name="isOpen" inputType="select">
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </FieldAndLabel>
              <Button
                mt="1rem"
                backgroundColor="#7a5087"
                color="white"
                type="submit"
              >
                Submit
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};
