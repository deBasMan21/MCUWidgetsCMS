using System;
namespace Infrastructure
{
    public class Event
    {
        public readonly Guid EventId;
        public readonly string EventType;

        public Event() : this(Guid.NewGuid())
        {
        }

        public Event(Guid eventId)
        {
            EventId = eventId;
            EventType = this.GetType().Name;
        }

        public Event(string eventType) : this(Guid.NewGuid())
        {
            EventType = eventType;
        }

        public Event(Guid eventId, string eventType)
        {
            EventId = eventId;
            EventType = eventType;
        }
    }
}

