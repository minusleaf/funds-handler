import { Button, Flex, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Switch from "react-switch";
import React, { useState } from "react";
import {
  SelectionFundAttributes,
  FundInterface,
  FundType,
  SelectedConnectionTypesInterface,
} from "../../App.interface";
import { FieldAndLabel } from "./components/FieldAndLabel/FieldAndLabel";

const FundTypes: FundType[] = [
  FundType.VENTURE_CAPITAL,
  FundType.HEDGE_FUND,
  FundType.REAL_ESTATE,
];

export interface FundOptionsWindowInterface {
  addFund: (newFund: FundInterface) => void;
  updateConnectedTypes: (
    attribute: SelectionFundAttributes,
    newBoolValue: boolean
  ) => void;
  defaultConnectedTypes: SelectedConnectionTypesInterface;
}

export const FundOptionsWindow = ({
  addFund,
  updateConnectedTypes,
  defaultConnectedTypes,
}: FundOptionsWindowInterface) => {
  const [
    connectedTypes,
    setConnectedTypes,
  ] = useState<SelectedConnectionTypesInterface>(defaultConnectedTypes);

  const handleSwitchChange = (attribute: SelectionFundAttributes) => {
    setConnectedTypes({
      ...connectedTypes,
      [attribute]: !connectedTypes[attribute],
    });
    updateConnectedTypes(attribute, !connectedTypes[attribute]);
  };

  return (
    <Flex
      position="absolute"
      flexDirection="column"
      alignItems="center"
      left="2rem"
      top="2rem"
      backgroundColor="rgba(255, 255, 255, 0.65)"
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
            year: new Date().getFullYear().toString(),
            type: FundType.VENTURE_CAPITAL,
            isOpen: true,
          } as FundInterface
        }
        onSubmit={(values) => {
          let isOpen: string | boolean = values.isOpen;
          if (typeof isOpen === "string") {
            if (isOpen === "1") isOpen = true;
            else isOpen = false;
          }
          addFund({
            ...values,
            isOpen: isOpen,
          });
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
                backgroundColor="#4b2457"
                color="white"
                type="submit"
              >
                Submit
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
      <Flex flexDirection="column" mt="2rem" width="100%">
        <Text fontWeight="bold" textAlign="center" mb="1rem">
          Connect By
        </Text>
        {Object.entries(connectedTypes).map(([attribute, boolValue]) => (
          <label key={`connect-by-${attribute}`}>
            <Flex justifyContent="space-between" my="0.25rem">
              <Text>{attribute}</Text>
              <Switch
                onChange={() =>
                  handleSwitchChange(attribute as SelectionFundAttributes)
                }
                checked={boolValue}
              />
            </Flex>
          </label>
        ))}
      </Flex>
    </Flex>
  );
};
