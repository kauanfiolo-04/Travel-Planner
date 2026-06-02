"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import createTrip from "@/lib/actions/create-trip";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { useState, useTransition } from "react";

const NewTripPage = () => {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null> (null);

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>New Trip</CardHeader>

        <CardContent>
          <form 
            className="space-y-6" 
            action={formData => {
              if (imageUrl) formData.append("imageUrl", imageUrl);

              startTransition(() => {
                createTrip(formData);
              });
            }}
          >
            <div>
              <label 
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="title"
              >
                Title
              </label>
              <input 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Japan trip..."
                type="text"
                name="title"
                required
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Trip description..."
                name="description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="startDate"
                >
                  Start Date
                </label>
                <input 
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Japan trip..."
                  type="date"
                  name="startDate"
                  required
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <input 
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Japan trip..."
                  type="date"
                  name="endDate"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="">Trip Image</label>
              {imageUrl && (
                <Image 
                  src={imageUrl} 
                  alt="Trip Preview" 
                  className="w-full mb-4 rounded-md max-h-48 object-cover"
                  width={300}
                  height={100}
                />
              )}

              <UploadButton 
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0].ufsUrl) setImageUrl(res[0].ufsUrl);
                }}
                onUploadError={(error) => { console.error("Upload error: ", error); }}
              />
            </div>


            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Creating" : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default NewTripPage;