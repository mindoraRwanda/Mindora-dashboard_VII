import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const initialEvents = [
  {
    id: 0,
    title: 'All Day Event',
    allDay: true,
    start: new Date(2024, 7, 1),
    end: new Date(2024, 7, 1),
    description: 'This is an all-day event.',
  },
  {
    id: 1,
    title: 'Long Event',
    start: new Date(2024, 7, 7),
    end: new Date(2024, 7, 10),
    description: 'This event spans multiple days.',
  },
];

const CalendarPage = () => {
  const [events, setEvents] = useState(initialEvents);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const openModal = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedEvent(null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewEventTitle('');
    setSelectedEvent(null);
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setEventModalIsOpen(true);
  };

  const closeEventModal = () => {
    setEventModalIsOpen(false);
    setSelectedEvent(null);
  };

  const handleAddEvent = () => {
    if (selectedDate && newEventTitle) {
      const newEvent = {
        id: selectedEvent ? selectedEvent.id : events.length,
        title: newEventTitle,
        start: selectedDate,
        end: selectedDate,
        allDay: true,
        description: 'No description available.', // Default description
      };

      if (selectedEvent) {
        setEvents(events.map((event) => (event.id === selectedEvent.id ? newEvent : event)));
      } else {
        setEvents([...events, newEvent]);
      }

      closeModal();
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setNewEventTitle(event.title);
    setSelectedDate(event.start);
    setModalIsOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
    closeEventModal();
  };

  const EventComponent = ({ event }) => (
    <div className="relative group">
      <span onClick={() => openEventModal(event)}>{event.title}</span>
      <div className="absolute top-0 right-0 hidden group-hover:flex space-x-2">
        <button
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => handleEditEvent(event)}
        >
          Edit
        </button>
        <button
          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => handleDeleteEvent(event.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen p-4">
      <div className="bg-white text-gray-600 rounded-lg shadow-xl p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          style={{ height: '80vh' }}
          selectable
          onSelectSlot={openModal}
          components={{
            event: EventComponent,
          }}
        />
      </div>

      {/* Add/Edit Event Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Event"
        className="bg-purple-500 text-black p-6 rounded-lg shadow-xl max-w-md mx-auto mt-24"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
      >
        <h2 className="text-2xl mb-4">{selectedEvent ? 'Edit Event' : 'Add Event'}</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
        />
        <div className="flex space-x-4">
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {selectedEvent ? 'Update Event' : 'Add Event'}
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Event Details Modal */}
      <Modal
        isOpen={eventModalIsOpen}
        onRequestClose={closeEventModal}
        contentLabel="Event Details"
        className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto mt-24"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
      >
        <h2 className="text-2xl mb-4">Event Details</h2>
        {selectedEvent && (
          <>
            <p><strong>Title:</strong> {selectedEvent.title}</p>
            <p><strong>Start:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}</p>
            <p><strong>End:</strong> {moment(selectedEvent.end).format('MMMM Do YYYY, h:mm a')}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <div className="mt-4 flex space-x-2">
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={() => handleEditEvent(selectedEvent)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDeleteEvent(selectedEvent.id)}
              >
                Delete
              </button>
              <button
                onClick={closeEventModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CalendarPage;
