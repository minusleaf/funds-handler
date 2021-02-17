import React from "react";
import { Field } from "formik";
import { Flex, Text } from "@chakra-ui/react";

export interface FieldAndLabelInterface {
  name: string;
  label: string;
  inputType: string;
  children?: JSX.Element[];
}

export const FieldAndLabel = ({
  name,
  label,
  inputType,
  children,
}: FieldAndLabelInterface) => (
  <Flex justifyContent="space-between" mb="0.5rem">
    <Text mr="1rem">{label}</Text>
    <Field
      name={name}
      as={inputType}
      style={{
        borderRadius: "0.5rem",
        padding: "0.25rem",
        backgroundColor: "rgba(255,255,255,0.8)",
      }}
    >
      {children}
    </Field>
  </Flex>
);
