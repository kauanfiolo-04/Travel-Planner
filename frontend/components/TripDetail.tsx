"use client";

import { Trip } from "@/app/generated/prisma/client";
import Image from "next/image";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import { useState } from "react";

interface TripDetailClientProps {
  trip: Trip;
}

const TripDetailClient = ({ trip }: TripDetailClientProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
          <Image
            className="object-cover"
            src={trip.imageUrl}
            alt={trip.title}
            fill
            priority
          />
        </div>
      )}

      <div className="bg-white p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">{trip.title}</h1>

          <div className="flex items-center text-gray-500 mt-2">
            <Calendar className="h-5 w-5 mr-2" />

            <span className="text-lg">
              {trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Button>
              <Plus className="mr-2 h-5 w-5" />
              Add Location
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger className="text-lg" value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger className="text-lg" value="itinerary">
              Itinerary
            </TabsTrigger>
            <TabsTrigger className="text-lg" value="map">
              Map
            </TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-6" value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Trip summary</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 mr-3 text-gray-500" />

                    <div>
                      <p className="font-medium text-gray-700">Dates</p>
                      <p className="text-sm text-gray-500">
                        {trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}
                        <br />
                        {`${Math.round( (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24) )} days(s)`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">

                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default TripDetailClient;