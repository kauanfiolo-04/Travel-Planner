"use client";

import { useTransition } from "react";
import { Button } from "./ui/Button";
import addLocation from "@/lib/actions/add-location";

const NewLocationClient = ({ tripId }: { tripId: string }) => {
  const [isPending, starTransition] = useTransition();
  
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Add New Location</h1>

          <form className="space-y-6" action={(formData: FormData) => 
            starTransition(() => { addLocation(formData, tripId) })
          }>
            <div>
              <label 
                className="block text-sm font-medium text-gray-700 mb-2" 
                htmlFor="address"
              >
                Address
              </label>

              <input 
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                name="address" 
                type="text" 
                required 
              />
            </div>

            <Button className="w-full" type="submit">
              {isPending ? "Adding..." : "Add Location"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewLocationClient;