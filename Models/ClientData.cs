using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PocketDDD.Models
{
    //Outgoing
    public class DDDEvent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; }
        public int Version { get; set; }
        public bool IsActive { get; set; }
    }

    public class DDDEventDetail
    {
        public int DDDEventId { get; set; }
        public IList<Track> Tracks { get; set; }
        public IList<TimeSlot> TimeSlots { get; set; }
        public IList<Session> Sessions { get; set; }
    }

    public class Track
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string RoomName { get; set; }
    }

    public class TimeSlot {
        public int Id { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public string Info { get; set; }
    }

    public class Session{
        public int Id { get; set; }
        public int DDDEventId { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public string FullDescription { get; set; }
        public string Speaker { get; set; }
        public int TrackId { get; set; }
        public int TimeSlotId { get; set; }
    }

    public class UserInfo
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string token { get; set; }
        public int eventScore { get; set; }
    }

    public class AcceptedUserComment
    {
        public int? SessionId { get; set; }
        public string Id { get; set; }
    }

    //incoming
    public class ClientSyncData
    {
        public int eventId { get; set; }
        public string userToken { get; set; }
        public string clientToken { get; set; }
        public int dddEventListVersion { get; set; }
        public int dddEventDataVersion { get; set; }
        public IList<UserComment> sessionComments { get; set; }
        public IList<UserSessionData> userSessionData { get; set; }
        public UserEventData userEventData { get; set; }

        public IList<UserComment> eventMostLikeComments { get; set; }
        public IList<UserComment> eventLeastLikeComments { get; set; }
        public IList<UserComment> pocketDDDComments { get; set; }
        public IList<UserComment> eventComments { get; set; }

    }

    public class UserComment
    {
        public int? sessionId { get; set; }
        public string id { get; set; }
        public DateTime date { get; set; }
        public string comment { get; set; }
    }

    public class UserSessionData{
        public int sessionId { get; set; }
        public bool bookmarked { get; set; }
        public int attendingStatus { get; set; }
        public int? speakerKnowledgeRating { get; set; }
        public int? speakerSkillsRating { get; set; }
    }

    public class UserEventData
    {
        public int? refreshments { get; set; }
        public int? venue { get; set; }
        public int? overall { get; set; }
        public bool easterEggRR { get; set; }
        public bool easterEggP { get; set; }
    }

    public class SpeakerViewUserSessionData
    {
        public bool Bookmarked { get; set; }
        public int AttendingStatus { get; set; }
        public int? SpeakerKnowledgeRating { get; set; }
        public int? SpeakerSkillsRating { get; set; }
    }

    public class SpeakerViewUserComment
    {
        public DateTime date { get; set; }
        public string comment { get; set; }
    }

    public class ManagementViewUserComment
    {
        public string type { get; set; }
        public DateTime date { get; set; }
        public string userName { get; set; }
        public string comment { get; set; }
    }
}