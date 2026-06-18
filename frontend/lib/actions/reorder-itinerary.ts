"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";

const reorderItinerary = async (tripId: string, newOrder: string[]) => {
  const session = await auth();
  
  if (!session) throw new Error("User is not autenticated.");

  await prisma.$transaction(
    newOrder.map((locationId, idx) => prisma.location.update({
      where: { id: locationId },
      data: { order: idx }
    }))
  );
}

export default reorderItinerary;