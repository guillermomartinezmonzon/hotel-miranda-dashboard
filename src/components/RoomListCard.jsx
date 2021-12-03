import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { StyledData } from "./BookingList";
import Button from "./Button";

export const ItemTypes = {
    CARD: 'card',
  }
export const RoomListCard = ({
  photo,
  roomNumber,
  id,
  room_type,
  amenities,
  price,
  offer_price,
  index,
  moveCard,
}) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <StyledData ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <td>
        <img src={photo}/>
        <div style={{display: 'inline-block'}}>
            <div style={{display: 'block'}}>
                {roomNumber}
            </div>
            <div style={{display: 'block'}}>  
                {id}
            </div>  
        </div>
      </td>
      <td>{room_type}</td>
      <td>{amenities}</td>
      <td>{price}</td>
      <td>{offer_price}</td>
      <td>
        <Button checkIn>Available</Button>
      </td>
    </StyledData>
  );
};