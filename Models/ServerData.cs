using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PocketDDD.Models
{
    public class ServerDDDEvent : DDDEvent
    {
        public string EventbriteToken { get; set; }
        public string EventbriteEventId { get; set; }
        public string AdminToken { get; set; }
    }

    public class SpeakerMappingInfo
    {
        public int EventId { get; set; }
        public int SessionId { get; set; }
        public string SpeakerToken { get; set; }
        public string SpeakerName { get; set; }
        public string URL { get; set; }
    }
}