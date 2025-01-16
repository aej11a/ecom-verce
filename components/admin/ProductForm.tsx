"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createProduct, deletePersonalizedDescription, getPersonalizedDescriptions, regeneratePersonalizedDescription, updateProduct } from "@/app/actions/product";
import { Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import { PersonalizedDescriptionForm } from "./PersonalizedDescriptionForm";
import { CustomerSegment } from "@/types";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type ProductFormProps = {
  product?: {
    id: number;
    name: string;
    tagline: string;
    description: string;
    sku: string;
    price: number;
    category_id: number | null;
    image_url: string;
  };
  categories: Category[];
  segments: CustomerSegment[];
};

type PersonalizedDescription = {
  segmentIds: number[];
  segmentNames: string;
  description: string;
};

export default function ProductForm({
  product,
  categories,
  segments,
}: ProductFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>(
    product?.category_id?.toString() || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(product?.name || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [personalizedDescriptions, setPersonalizedDescriptions] = useState<
    PersonalizedDescription[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!product) {
      setSku(generateSlug(name));
    }
  }, [name, product]);

  useEffect(() => {
    if (product) {
      setIsLoading(true);
      getPersonalizedDescriptions(product.id)
        .then(setPersonalizedDescriptions)
        .finally(() => setIsLoading(false));
    }
  }, [product]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    if (image) {
      formData.append("image", image);
    } else if (product?.image_url) {
      formData.append("image_url", product.image_url);
    }

    formData.append("category_id", categoryId);

    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDescription = async (segmentIds: number[]) => {
    if (!product) return;
    try {
      await deletePersonalizedDescription(product.id, segmentIds);
      setPersonalizedDescriptions((prev) =>
        prev.filter((d) => d.segmentIds.join("-") !== segmentIds.join("-"))
      );
    } catch (error) {
      console.error("Error deleting personalized description:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleRegenerateDescription = async (segmentIds: number[]) => {
    if (!product) return;
    try {
      const newDescription = await regeneratePersonalizedDescription(
        product.id,
        segmentIds
      );
      setPersonalizedDescriptions((prev) =>
        prev.map((d) =>
          d.segmentIds.join("-") === segmentIds.join("-")
            ? { ...d, description: newDescription }
            : d
        )
      );
    } catch (error) {
      console.error("Error regenerating personalized description:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Create New Product"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product?.name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              defaultValue={product?.tagline}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                id="price"
                name="price"
                step="0.01"
                defaultValue={product?.price}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center space-x-4">
              {product?.image_url && (
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <Label
                htmlFor="image"
                className="cursor-pointer flex items-center justify-center w-16 h-16 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                <Input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                <Upload className="w-6 h-6 text-gray-400" />
              </Label>
              {image && (
                <span className="text-sm text-gray-500">{image.name}</span>
              )}
            </div>
          </div>
          {product && (
            <>
              <PersonalizedDescriptionForm
                productId={product.id}
                segments={segments}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Personalized Descriptions
                </h3>
                {isLoading ? (
                  <p>Loading personalized descriptions...</p>
                ) : personalizedDescriptions.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Segments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {personalizedDescriptions.map((desc) => (
                        <tr key={desc.segmentIds.join("-")}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {desc.segmentNames}
                          </td>
                          <td className="px-6 py-4">{desc.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteDescription(desc.segmentIds)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRegenerateDescription(desc.segmentIds)
                              }
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No personalized descriptions yet.</p>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {product ? "Updating" : "Creating"}...
              </>
            ) : (
              <>{product ? "Update" : "Create"} Product</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
