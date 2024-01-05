import { Box, Button, HStack, Image, Input } from "@chakra-ui/react";
import React from "react";

type Props = {
  type: "native" | "token";
  tokenImage?: string;
  current: string;
  setValue: (value: string) => void;
  max?: string;
  value: string;
};

export default function SwapInput({
  type,
  tokenImage,
  setValue,
  value,
  current,
  max,
}: Props) {
  return (
    <HStack w="full" bgColor="transparent" px="5">

      <Input
        type="number"
        placeholder="0.0"
        fontSize="3xl"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        outline="none"
        py="10"
        isDisabled={current !== type}
        border="none"
        _focus={{ boxShadow: "none" }}
        style={{padding: "10px", borderRadius: "6px"}}
      />
      {current === type && (
        <Button  onClick={() => setValue(max || "0")}>Max</Button>
      )}
    </HStack>
  );
}
