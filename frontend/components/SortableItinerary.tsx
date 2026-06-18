import { Location } from "@/app/generated/prisma/browser";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { act, useId, useState } from "react";
import { CSS } from "@dnd-kit/utilities";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

const SortableItem = ({ item }: { item: Location }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow"
    >
      <div>
        <h4 className="font-medium text-gray-800">{item.locationTitle}</h4>

        <p className="text-sm text-gray-500 truncate max-w-xs">
          {`Latitude: ${item.lat}, Longitude: ${item.lng}`}
        </p>
      </div>

      <div className="text-sm text-gray-600">Day {item.order + 1}</div>
    </div>
  );
}

const SortableItinerary = (
  { locations, tripId }:
  SortableItineraryProps
) => {
  const id = useId();
  const [locationsVal, setLocationsVal] = useState(locations);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id ) {
      const oldIdx = locationsVal.findIndex(item => item.id === active.id);
      const newIdx = locationsVal.findIndex(item => item.id === over!.id);

      const newLocationsOrder = 
        arrayMove(locationsVal, oldIdx, newIdx).
        map((item, idx) => ({...item, order: idx}));

      setLocationsVal(newLocationsOrder);
    }
  };

  return (
    <DndContext id={id} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext 
        items={locationsVal.map(loc => loc.id)}
        strategy={verticalListSortingStrategy} 
      >
        <div className="space-y-4">
          {locationsVal.map((item, idx) => (
            <SortableItem key={idx} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default SortableItinerary;