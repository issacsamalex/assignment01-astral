/* eslint-disable import/no-unresolved */
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/db_server";
import { Page, Card, Button, DataTable } from "@shopify/polaris";
import { Product } from "~/types/types";
import { EditIcon } from "@shopify/polaris-icons";

type LoaderData = {
  products: Product[];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Inventory Management App" },
    { name: "description", content: "Welcome!" },
  ];
};

export const loader = async () => {
  const products = await prisma.product.findMany();
  return { products };
};

export default function Index() {
  const { products } = useLoaderData<LoaderData>();

  const rows = products.map((product) => [
    product.title,
    product.quantity,
    <Button icon={EditIcon} key={product.id} url={`/products/${product.id}`}>
      Edit
    </Button>,
  ]);

  return (
    <>
      <Page
        title="Inventory Management App"
        primaryAction={
          <Button variant="primary" size="large" url="/products/new">
            Create
          </Button>
        }
      >
        <Card>
          <DataTable
            columnContentTypes={["text", "numeric", "text"]}
            headings={["Product Name", "Quantity", "Actions"]}
            rows={rows}
          />
        </Card>
      </Page>
    </>
  );
}
