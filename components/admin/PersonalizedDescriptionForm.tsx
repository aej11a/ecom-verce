"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  addPersonalizedDescription,
  generatePersonalizedDescription,
} from "@/app/actions/product";
import { CustomerSegment } from "@/types";

type PersonalizedDescriptionFormProps = {
  productId: number;
  segments: CustomerSegment[];
};

export function PersonalizedDescriptionForm({
  productId,
  segments,
}: PersonalizedDescriptionFormProps) {
  const [selectedSegments, setSelectedSegments] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSegmentChange = (segmentId: number) => {
    setSelectedSegments((prev) =>
      prev.includes(segmentId)
        ? prev.filter((id) => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generatedDescription = await generatePersonalizedDescription(
        productId,
        selectedSegments
      );
      setDescription(generatedDescription);
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await addPersonalizedDescription(
        productId,
        selectedSegments,
        description
      );
      setDescription("");
      setSelectedSegments([]);
    } catch (error) {
      console.error("Error saving personalized description:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Add Personalized Description</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Select up to 3 segments:</p>
        {segments.map((segment) => (
          <div key={segment.id} className="flex items-center space-x-2">
            <Checkbox
              id={`segment-${segment.id}`}
              checked={selectedSegments.includes(segment.id)}
              onCheckedChange={() => handleSegmentChange(segment.id)}
              disabled={
                selectedSegments.length >= 3 &&
                !selectedSegments.includes(segment.id)
              }
            />
            <label htmlFor={`segment-${segment.id}`} className="text-sm">
              {segment.name}
            </label>
          </div>
        ))}
      </div>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Personalized description"
        rows={4}
      />
      <div className="flex space-x-2">
        <Button
          onClick={handleGenerate}
          disabled={selectedSegments.length === 0 || isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Description"}
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            selectedSegments.length === 0 ||
            description.trim() === "" ||
            isSaving
          }
        >
          {isSaving ? "Saving..." : "Save Description"}
        </Button>
      </div>
    </div>
  );
}
