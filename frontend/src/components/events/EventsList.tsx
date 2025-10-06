import React from 'react';
import { Plus, MapPin, Users } from 'lucide-react';

interface EventsListProps {
  events: any[];
  rsvpEvent: (eventId: number) => void;
  createEvent: (eventData: any) => void;
}

const EventsList: React.FC<EventsListProps> = ({ events, rsvpEvent, createEvent }) => {
  const sampleEvents = [
    { id: 1, title: 'Tech Career Fair 2025', date: '2025-10-15', category: 'Career', location: 'Main Campus', attendees: 45, description: 'Meet top tech companies' },
    { id: 2, title: 'AI Research Symposium', date: '2025-10-20', category: 'Academic', location: 'Science Building', attendees: 32, description: 'Latest AI research presentations' },
    { id: 3, title: 'Alumni Networking Night', date: '2025-10-25', category: 'Networking', location: 'Student Center', attendees: 78, description: 'Connect with successful alumni' },
  ];

  const displayEvents = events.length > 0 ? events : sampleEvents;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Campus Events</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 inline mr-2" />
            Create Event
          </button>
        </div>

        <div className="space-y-4">
          {displayEvents.map(event => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                      {event.category}
                    </span>
                    <span className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {event.attendees} attending
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => rsvpEvent(event.id)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  RSVP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsList;