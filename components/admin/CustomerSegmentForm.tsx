"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createCustomerSegment,
  updateCustomerSegment,
} from "@/app/actions/customer-segment";
import type { CustomerSegment } from "@/types";

export default function CustomerSegmentForm({
  segment,
}: {
  segment?: CustomerSegment;
}) {
  const [name, setName] = useState(segment?.name || "");
  const [slug, setSlug] = useState(segment?.slug || "");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (segment) {
        await updateCustomerSegment(segment.id, { name, slug });
      } else {
        await createCustomerSegment({ name, slug });
      }
      router.push("/admin/customer-segments");
      router.refresh();
    } catch (error) {
      console.error("Error saving customer segment:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700"
        >
          Slug
        </label>
        <Input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {segment ? "Update" : "Create"} Customer Segment
      </Button>
    </form>
  );
}
