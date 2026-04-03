import figma from "@figma/code-connect";
import { Switch } from "@arco-design/web-react";

figma.connect(
  Switch,
  "https://www.figma.com/design/qtbgJ5T34iWfFx634uUXto?node-id=0:6",
  {
    props: {
      checked: figma.enum("State", { on: true }),
      disabled: figma.enum("State", { disabled: true }),
    },
    example: ({ checked, disabled }) => (
      <Switch checked={checked} disabled={disabled} />
    ),
  }
);
