/* eslint-disable import/no-unresolved */
import { useLoaderData, useNavigate, Form, useParams } from "@remix-run/react";
import { prisma } from "~/utils/db_server";
import {
  Page,
  Card,
  TextField,
  Button,
  BlockStack,
  Layout,
  InlineStack,
  Text,
} from "@shopify/polaris";
import { Product } from "~/types/types";
import { useState } from "react";

type LoaderData = {
  product: Product;
};

export const loader = async ({ params }: { params: { id: string } }) => {
  if (params.id === "new") {
    return { product: null };
  }
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });
  return { product };
};

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);

  if (formData.get("_action") === "delete") {
    await prisma.product.delete({ where: { id: parseInt(params.id) } });
    return { deleted: true };
  }

  if (params.id === "new") {
    await prisma.product.create({ data: { title, quantity } });
  } else {
    await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: { title, quantity },
    });
  }
  return null;
};

const EditPage = () => {
  const { id } = useParams();
  const { product } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: product?.title || "",
    quantity: product?.quantity || 0,
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleReset = () => {
    setFormData({
      title: product?.title || "",
      quantity: product?.quantity || 0,
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`/products/${product?.id}`, {
        method: "POST",
        body: new URLSearchParams({ _action: "delete" }),
      }).then(() => navigate("/"));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    fetch(`/products/${product?.id || "new"}`, {
      method: "POST",
      body: new URLSearchParams({
        title: formData.title,
        quantity: formData.quantity.toString(),
      }),
    })
      .then(() => {
        alert(
          product?.id
            ? "Product updated successfully."
            : "Product added successfully."
        );
        navigate("/");
      })
      .catch(() => {
        alert("Failed to save product.");
      });
  };

  return (
    <>
      <Page
        title={id === "new" ? "Create New Product" : "Edit Product"}
        backAction={{ content: "Products", url: "/" }}
      >
        <Form method="POST" onSubmit={handleSubmit}>
          <Card>
            <BlockStack gap="500">
              <div
                onDoubleClick={() => setIsEditingTitle(true)}
                style={{ marginBottom: "16px" }}
              >
                {isEditingTitle ? (
                  <TextField
                    label="Product Name"
                    value={formData.title}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, title: value }))
                    }
                    name="title"
                    autoComplete="off"
                  />
                ) : (
                  <Text variant="headingXl" as="h4">
                    {formData.title || "Double-click to add the product title"}
                  </Text>
                )}
              </div>

              <TextField
                label="Quantity"
                type="number"
                name="quantity"
                value={formData.quantity.toString()}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Number(value) || 0,
                  }))
                }
                autoComplete="off"
              />
            </BlockStack>
          </Card>

          <Layout.Section>
            <BlockStack inlineAlign="start">
              {id !== "new" ? (
                <>
                  <Button
                    tone="critical"
                    variant="primary"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <></>
              )}
            </BlockStack>
            <BlockStack inlineAlign="end">
              <InlineStack gap="400">
                <Button onClick={handleReset}>Reset</Button>
                <Button variant="primary" submit>
                  Save
                </Button>
              </InlineStack>
            </BlockStack>
          </Layout.Section>
        </Form>
      </Page>
    </>
  );
};

export default EditPage;
