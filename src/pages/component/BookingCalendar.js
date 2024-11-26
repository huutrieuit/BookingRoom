import React from 'react';
import { Calendar } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const DnDCalendar = withDragAndDrop(Calendar);

const BookingCalendar = ({
  events,
  localizer,
  slotPropGetter,
  handleSelectSlot,
  eventStyleGetter,
  handleEventDrop,
  handleEventResize,
  renderEvent,
}) => (
  <DnDCalendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    selectable
    defaultView="week"
    slotPropGetter={slotPropGetter}
    defaultDate={new Date()}
    onSelectSlot={handleSelectSlot}
    eventPropGetter={eventStyleGetter}
    onEventDrop={handleEventDrop}
    onEventResize={handleEventResize}
    style={{ height: 700, borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
    resizable
    components={{ event: renderEvent }}
    formats={{ timeGutterFormat: 'HH:mm', eventTimeRangeFormat: () => '' }}
    min={new Date(1970, 1, 1, 7)} // Start displaying from 6 AM
    max={new Date(1970, 1, 1, 19)} // End displaying at 10 PM
  />
);

export default BookingCalendar;
