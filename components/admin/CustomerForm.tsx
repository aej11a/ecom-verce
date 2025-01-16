"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createCustomer, updateCustomer } from "@/app/actions/customer";

type CustomerFormProps = {
  customer?: {
    id: number;
    name: string;
    email: string;
    segment_ids: number[];
  };
  segments: {
    id: number;
    name: string;
  }[];
};

export default function CustomerForm({
  customer,
  segments,
}: CustomerFormProps) {
  const [name, setName] = useState(customer?.name || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [selectedSegments, setSelectedSegments] = useState<number[]>(
    customer?.segment_ids.filter(Boolean) || []
  );
  const router = useRouter();
  console.log(selectedSegments)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (customer) {
        await updateCustomer(customer.id, {
          name,
          email,
          segment_ids: selectedSegments,
        });
      } else {
        await createCustomer({ name, email, segment_ids: selectedSegments });
      }
      router.push("/admin/customers");
      router.refresh();
    } catch (error) {
      console.error("Error saving customer:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleSegmentChange = (segmentId: number) => {
    setSelectedSegments((prev) =>
      prev.includes(segmentId)
        ? prev.filter((id) => id !== segmentId)
        : [...prev, segmentId]
    );
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
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Segments
        </label>
        <div className="space-y-2">
          {segments.map((segment) => (
            <div key={segment.id} className="flex items-center">
              <Checkbox
                id={`segment-${segment.id}`}
                checked={selectedSegments.includes(segment.id)}
                onCheckedChange={() => handleSegmentChange(segment.id)}
              />
              <label
                htmlFor={`segment-${segment.id}`}
                className="ml-2 text-sm text-gray-700"
              >
                {segment.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full">
        {customer ? "Update" : "Add"} Customer
      </Button>
    </form>
  );
}
