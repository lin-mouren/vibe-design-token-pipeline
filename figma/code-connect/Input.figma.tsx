import figma from "@figma/code-connect";
import { Input } from "@arco-design/web-react";

figma.connect(
  Input,
  "https://www.figma.com/design/qtbgJ5T34iWfFx634uUXto?node-id=0:4",
  {
    props: {
      size: figma.enum("Size", {
        sm: "mini",
        md: "default",
        lg: "large",
      }),
      disabled: figma.enum("State", { disabled: true }),
      error: figma.enum("State", { error: true }),
    },
    example: ({ size, disabled, error }) => (
      <Input
        size={size}
        disabled={disabled}
        status={error ? "error" : undefined}
        placeholder="Placeholder text"
      />
    ),
  }
);
