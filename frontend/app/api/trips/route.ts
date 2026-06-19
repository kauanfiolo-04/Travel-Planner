import { TransformedLocation } from "@/app/globe/page";
import { auth } from "@/auth";
import getCountryFromCoordinates from "@/lib/actions/geocode";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (): Promise<NextResponse<TransformedLocation[] | unknown>> => {
  try {
      const session = await auth();
    
      if (!session) return new NextResponse("Not authenticated", { status: 401 });

      const locations = await prisma.location.findMany({
        where : { trip: { userId: session.user?.id } },
        select: { 
          locationTitle: true,
          lat: true,
          lng: true,
          trip: { select: { title: true } }
        }
      });

      const transformedLocations: TransformedLocation[] = await Promise.all(locations.map(async (loc) => {
        const geocodeResult = await getCountryFromCoordinates(loc.lat, loc.lng);

        return { 
          name: `${loc.trip.title} = ${geocodeResult.formattedAddress}`,
          lat: loc.lat,
          lng: loc.lng,
          country: geocodeResult.country
        }
      }));

      return NextResponse.json(transformedLocations);
  } catch (error) {
    return new NextResponse("Iternal Error", { status: 500 });
  }
};