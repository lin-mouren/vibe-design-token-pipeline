import figma from "@figma/code-connect";
import { Tag } from "@arco-design/web-react";

figma.connect(
  Tag,
  "https://www.figma.com/design/qtbgJ5T34iWfFx634uUXto?node-id=0:7",
  {
    props: {
      color: figma.enum("Type", {
        default: undefined,
        primary: "arcoblue",
        success: "green",
        warning: "orangered",
        danger: "red",
      }),
      size: figma.enum("Size", {
        sm: "small",
        md: "default",
      }),
    },
    example: ({ color, size }) => (
      <Tag color={color} size={size}>
        Tag
      </Tag>
    ),
  }
);
