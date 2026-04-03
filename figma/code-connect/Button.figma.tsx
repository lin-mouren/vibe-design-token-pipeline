import figma from "@figma/code-connect";
import { Button } from "@arco-design/web-react";

figma.connect(
  Button,
  "https://www.figma.com/design/qtbgJ5T34iWfFx634uUXto?node-id=0:3",
  {
    props: {
      type: figma.enum("Type", {
        primary: "primary",
        secondary: "secondary",
        outline: "outline",
        danger: "danger",
      }),
      size: figma.enum("Size", {
        sm: "mini",
        md: "default",
        lg: "large",
      }),
      disabled: figma.enum("State", { disabled: true }),
    },
    example: ({ type, size, disabled }) => (
      <Button type={type} size={size} disabled={disabled}>
        Button
      </Button>
    ),
  }
);
