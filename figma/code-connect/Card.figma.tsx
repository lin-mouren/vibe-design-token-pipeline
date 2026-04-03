import figma from "@figma/code-connect";
import { Card } from "@arco-design/web-react";

figma.connect(
  Card,
  "https://www.figma.com/design/qtbgJ5T34iWfFx634uUXto?node-id=0:5",
  {
    props: {
      hoverable: figma.enum("State", { hover: true }),
      loading: figma.enum("State", { loading: true }),
    },
    example: ({ hoverable, loading }) => (
      <Card title="Card Title" hoverable={hoverable} loading={loading}>
        Card content goes here.
      </Card>
    ),
  }
);
