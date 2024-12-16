import { Tooltip } from "@nextui-org/tooltip";
import { PropsWithChildren } from "react";
import { ReactNode } from "react";

type Props = {
  content: ReactNode;
}

export const AddressConverterHeaderColTooltip = ({ children, content }: PropsWithChildren<Props>) => (
  <Tooltip content={content}>
    {children}
  </Tooltip>
)