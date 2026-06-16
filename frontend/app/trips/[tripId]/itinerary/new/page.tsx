import NewLocationClient from "@/components/NewLocation";

const NewLocation = async (
  { params }: { params: Promise<{ tripId: string }> }
) => {
  const { tripId } = await params;

  return <NewLocationClient tripId={tripId} />;
}

export default NewLocation;