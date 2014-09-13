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
        public string Address { get; set; }
        public bool RequiresEventbriteLogin { get; set; }
        public bool RequiresEventFeedback { get; set; }
        public bool RequiresSessionFeedback { get; set; }
    }

    public class DDDEventDetail
    {
        public int DDDEventId { get; set; }
        public int Version { get; set; }
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
        public int eventId { get; set; }
        public int? sessionId { get; set; }
        public string id { get; set; }
    }

    public class DDDEventScoreInfo
    {
        public int eventId { get; set; }
        public int score { get; set; }
    }

    public class SyncResult
    {
        public int dddEventListVersion { get; set; }
        public IList<DDDEvent> dddEvents { get; set; }
        public IList<DDDEventDetail> dddEventDetails { get; set; }
        public IList<DDDEventScoreInfo> dddEventScores { get; set; }
        public IList<AcceptedUserComment> acceptedSessionComments { get; set; }
        public IList<AcceptedUserComment> acceptedEventComments { get; set; }
        public IList<AcceptedUserComment> acceptedEventMostLikeComments { get; set; }
        public IList<AcceptedUserComment> acceptedEventLeastLikeComments { get; set; }
        public IList<AcceptedUserComment> acceptedPocketDDDComments { get; set; }
    }

    //    export interface SyncResult {
    //    dddEventListVersion: number;
    //    dddEvents: DDDEvent[];
    //    dddEventDetails: DDDEventDetail[];
    //    dddEventScores: DDDEventScoreInfo[];
    //    acceptedSessionComments: AcceptedUserComment[];
    //    acceptedEventComments: AcceptedUserComment[];
    //    acceptedEventMostLikeComments: AcceptedUserComment[];
    //    acceptedEventLeastLikeComments: AcceptedUserComment[];
    //    acceptedPocketDDDComments: AcceptedUserComment[];
    //}

    //incoming
    public class ClientSyncData
    {
        public string userToken { get; set; }
        public string clientToken { get; set; }
        public int dddEventListVersion { get; set; }
        public IList<DDDEventDataInfo> dddEventDataInfo { get; set; }
        public IList<UserComment> sessionComments { get; set; }
        public IList<UserSessionData> userSessionData { get; set; }
        public IList<UserEventData> userEventData { get; set; }

        public IList<UserComment> eventMostLikeComments { get; set; }
        public IList<UserComment> eventLeastLikeComments { get; set; }
        public IList<UserComment> pocketDDDComments { get; set; }
        public IList<UserComment> eventComments { get; set; }

    }

    public class DDDEventDataInfo {
        public int eventId { get; set; }
        public int dataVersion { get; set; }
        public string userToken { get; set; }
    }

    public class UserComment
    {
        public int eventId { get; set; }
        public int? sessionId { get; set; }
        public string id { get; set; }
        public DateTime date { get; set; }
        public string comment { get; set; }
    }

    public class UserSessionData{
        public int eventId { get; set; }
        public int sessionId { get; set; }
        public bool bookmarked { get; set; }
        public int attendingStatus { get; set; }
        public int? speakerKnowledgeRating { get; set; }
        public int? speakerSkillsRating { get; set; }
    }

    public class UserEventData
    {
        public int eventId { get; set; }
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