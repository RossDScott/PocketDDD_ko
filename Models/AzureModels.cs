using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PocketDDD.Models.Azure
{
    public class DDDEventEntity : TableEntity
    {
        public string Name { get; set; }

    }

    public class EventBriteUserTokenMapping : TableEntity
    {
        public string UserToken { get; set; }
        public string ClientToken { get; set; }
    }

    public class User : TableEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public class Comment : TableEntity
    {
        //partition = eventId + "_" + sessionId;
        //row = clientId + userToken + commentId
        public string Type { get; set; }
        public int? SessionId { get; set; }
        public string UserName { get; set; }
        public string UserToken { get; set; }
        public string ClientToken { get; set; }
        public DateTime Date { get; set; }
        public string UserComment { get; set; }
    }

    public class UserSessionData : TableEntity
    {
        //partition = eventId;
        //row = clientId + userToken

        public int SessionId { get; set; }
        public string UserName { get; set; }
        public string UserToken { get; set; }
        public string ClientToken { get; set; }
        public bool Bookmarked { get; set; }
        public int AttendingStatus { get; set; }
        public int? SpeakerKnowledgeRating { get; set; }
        public int? SpeakerSkillsRating { get; set; }
    }

    public class UserEventData : TableEntity
    {
        //partition = eventId;
        //row = clientId + userToken
        public string UserName { get; set; }
        public string UserToken { get; set; }
        public string ClientToken { get; set; }
        public int? Refreshments { get; set; }
        public int? Venue { get; set; }
        public int? Overall { get; set; }
        public bool EasterEggRR { get; set; }
        public bool EasterEggP { get; set; }
    }

    public class EventScoreItem: TableEntity
    {
        //partition = token
        //row = timeslotid + key
        public int DDDEventId { get; set; }
        public string UserName { get; set; }
        public int Score { get; set; }
    }
}