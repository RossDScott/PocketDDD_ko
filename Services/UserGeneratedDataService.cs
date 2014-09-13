using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using PocketDDD.Models;
using PocketDDD.Models.Azure;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace PocketDDD.Services
{
    class UserEventInfo
    {
        public int EventId { get; set; }
        public string UserName { get; set; }
        public string UserToken { get; set; }
    }

    public class UserGeneratedDataService
    {
        CloudTableClient tableClient;
        CloudTable userCommentsTable;
        CloudTable userSessionDataTable;
        CloudTable userEventDataTable;

        private readonly UserService userService;
        private readonly EventsService eventsService;

        private readonly IList<DDDEventDataInfo> dddEventDataInfo;
        private Dictionary<int, UserEventInfo> userInfo = new Dictionary<int, UserEventInfo>();

        public UserGeneratedDataService(EventsService eventsService, UserService userService, IList<DDDEventDataInfo> dddEventDataInfo)
        {
            this.userService = userService;
            this.eventsService = eventsService;
            this.dddEventDataInfo = dddEventDataInfo;

            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["pocketDDDCloudStorage"].ConnectionString);
            this.tableClient = storageAccount.CreateCloudTableClient();
            this.userCommentsTable = tableClient.GetTableReference("Comments");
            this.userSessionDataTable = tableClient.GetTableReference("UserSessionData");
            this.userEventDataTable = tableClient.GetTableReference("UserEventData");
        }

        private UserEventInfo GetUserEventInfo(int eventId)
        {
            if(!userInfo.ContainsKey(eventId))
            {
                var eventData = dddEventDataInfo.SingleOrDefault(x=>x.eventId == eventId);
                if (eventData == null)
                    return null;

                var userName = eventData.userToken != null ? userService.GetUserName(eventId, eventData.userToken) : null;

                userInfo.Add(eventId, new UserEventInfo { EventId = eventId, UserName = userName, UserToken = eventData.userToken });
            }

            return userInfo[eventId];
        }

        public IList<AcceptedUserComment> AddComments(string type, string clientToken, IList<UserComment> userComments)
        {
            if (userComments == null || userComments.Count == 0)
                return null;

            var acceptedComments = new List<AcceptedUserComment>();
            var commentsForEvents = userComments.GroupBy(x=>x.eventId);
            foreach (var eventGroup in commentsForEvents)
	        {
                var userInfo = GetUserEventInfo(eventGroup.Key);
                var dddEvent = eventsService.GetServerEventData(eventGroup.Key);
                var eventDetail = eventsService.GetEventDetail(dddEvent);

                if (dddEvent.IsActive)
                {
                    var accepted = addComments(type, eventGroup.Key, eventDetail, userInfo != null ? userInfo.UserName : "", userInfo != null ? userInfo.UserToken : null, clientToken, eventGroup.ToList());
                    acceptedComments.AddRange(accepted);
                }
                else
                {
                    //We don't want the client to keep sending the same message, so respond that it is accepted (even though it's not)
                    var accepted = eventGroup.Select(x => new AcceptedUserComment
                    {
                        eventId = x.eventId,
                        id = x.id,
                        sessionId = x.sessionId
                    });

                    return accepted.ToList();
                }
	        }

            return acceptedComments;
        }

        private IList<AcceptedUserComment> addComments(string type, int dddEventId, DDDEventDetail eventDetail, string userName, string userToken, string clientToken, IList<UserComment> userComments)
        {
            if (userComments == null || userComments.Count == 0)
                return null;

            var eventScoreService = LazyLoadEventScoreService(userToken, userName, dddEventId);
            var token = userToken ?? clientToken;
            var comments = userComments.Select(x => new Comment
            {
                PartitionKey = dddEventId.ToString(),
                RowKey = type + token + "_" + x.id + "",
                SessionId = x.sessionId,
                Type = type,
                UserName = userName,
                UserToken = userToken,
                ClientToken = clientToken,
                UserComment = x.comment,
                Date = x.date
            });

            foreach (var comment in userComments)
            {
                if (comment.sessionId != null)
                {
                    var session = eventDetail.Sessions.First(x => x.Id == comment.sessionId);
                    eventScoreService.AddCommentItem(type, session.TimeSlotId);
                }
                else
                {
                    eventScoreService.AddCommentItem(type, null);
                }
            }

            TableBatchOperation batch = new TableBatchOperation();
            foreach (var comment in comments)
            {
                batch.InsertOrReplace(comment);
            }
            userCommentsTable.ExecuteBatch(batch);

            var accepted = userComments.Select(x => new AcceptedUserComment
            {
                eventId = dddEventId,
                id = x.id,
                sessionId = x.sessionId
            });

            return accepted.ToList();
        }

        public void AddOrUpdateSessionData(string clientToken, IList<PocketDDD.Models.UserSessionData> sessionData)
        {
            if (sessionData == null || sessionData.Count == 0)
                return;

            var sessionDataForEvents = sessionData.GroupBy(x => x.eventId);
            foreach (var eventGroup in sessionDataForEvents)
            {
                var userInfo = GetUserEventInfo(eventGroup.Key);
                var dddEvent = eventsService.GetServerEventData(eventGroup.Key);
                var eventDetail = eventsService.GetEventDetail(dddEvent);

                if(dddEvent.IsActive)
                    addOrUpdateSessionData(eventGroup.Key, eventDetail, userInfo != null ? userInfo.UserName : "", userInfo != null ? userInfo.UserToken : null, clientToken, eventGroup.ToList());
            }
        }

        private void addOrUpdateSessionData(int dddEventId, DDDEventDetail eventDetail, string userName, string userToken, string clientToken, IList<PocketDDD.Models.UserSessionData> sessionData)
        {
            if (sessionData == null || sessionData.Count() == 0)
                return;

            var eventScoreService = LazyLoadEventScoreService(userToken, userName, dddEventId);
            var token = userToken ?? clientToken;

            var userSessionDatas = sessionData.Select(x => new PocketDDD.Models.Azure.UserSessionData
            {
                PartitionKey = dddEventId.ToString(),
                RowKey = x.sessionId.ToString() + "_" + token,
                SessionId = x.sessionId,
                UserName = userName,
                UserToken = userToken,
                ClientToken = clientToken,
                Bookmarked = x.bookmarked,
                AttendingStatus = x.attendingStatus,
                SpeakerKnowledgeRating = x.speakerKnowledgeRating,
                SpeakerSkillsRating = x.speakerSkillsRating
            });

            foreach (var sessionDataItem in sessionData)
            {
                var session = eventDetail.Sessions.First(x => x.Id == sessionDataItem.sessionId);

                if (sessionDataItem.bookmarked || sessionDataItem.attendingStatus != 2)
                    eventScoreService.AddBookmarkOrAttendingItem(session.TimeSlotId);

                if(sessionDataItem.speakerKnowledgeRating != null)
                    eventScoreService.AddKnowledgeRatingItem(session.TimeSlotId);

                if (sessionDataItem.speakerSkillsRating != null)
                    eventScoreService.AddSkillRatingItem(session.TimeSlotId);
            }

            TableBatchOperation batch = new TableBatchOperation();
            foreach (var userSessionData in userSessionDatas)
            {
                batch.InsertOrReplace(userSessionData);
            }
            userSessionDataTable.ExecuteBatch(batch);
        }

        public void AddOrUpdateEventData(string clientToken, IList<PocketDDD.Models.UserEventData> eventData)
        {
            if (eventData == null || eventData.Count == 0)
                return;

            foreach (var eventDataItem in eventData)
            {
                var userInfo = GetUserEventInfo(eventDataItem.eventId);
                var dddEvent = eventsService.GetServerEventData(eventDataItem.eventId);

                if(dddEvent.IsActive)
                    addOrUpdateEventData(eventDataItem.eventId, userInfo != null ? userInfo.UserName : "", userInfo != null ? userInfo.UserToken : null, clientToken, eventDataItem);
            }
        }

        private void addOrUpdateEventData(int dddEventId, string userName, string userToken, string clientToken, PocketDDD.Models.UserEventData eventData)
        {
            var eventScoreService = LazyLoadEventScoreService(userToken, userName, dddEventId);
            var token = userToken ?? clientToken;

            var userSessionDatas = new PocketDDD.Models.Azure.UserEventData
            {
                PartitionKey = dddEventId.ToString(),
                RowKey = token,
                UserName = userName,
                UserToken = userToken,
                ClientToken = clientToken,
                Refreshments = eventData.refreshments,
                Venue = eventData.venue,
                Overall = eventData.overall,
                EasterEggP = eventData.easterEggP,
                EasterEggRR = eventData.easterEggRR
            };

            if (eventData.refreshments != null)
                eventScoreService.AddRefreshmentsItem();

            if (eventData.venue != null)
                eventScoreService.AddVenueItem();

            if (eventData.overall != null)
                eventScoreService.AddOverallItem();

            if (eventData.easterEggRR)
                eventScoreService.AddEasterEgg("RR", 5);

            if (eventData.easterEggP)
                eventScoreService.AddEasterEgg("P", 3);

            TableOperation insert = TableOperation.InsertOrReplace(userSessionDatas);
            userEventDataTable.Execute(insert);
        }

        private Dictionary<int, EventScoreService> eventScoreServices = new Dictionary<int, EventScoreService>();
        public EventScoreService LazyLoadEventScoreService(string userToken, string userName, int eventId)
        {
            if (eventScoreServices.ContainsKey(eventId))
                return eventScoreServices[eventId];

            var eventScoreService = new EventScoreService(userToken, eventId, userName);
            eventScoreServices.Add(eventId, eventScoreService);
            return eventScoreService;
        }

        public IList<DDDEventScoreInfo> CommitEventScores()
        {
            var eventScoreInfo = new List<DDDEventScoreInfo>();
            foreach (var eventScoreService in eventScoreServices)
            {
                var score = eventScoreService.Value.CommitChanges();
                eventScoreInfo.Add(new DDDEventScoreInfo { eventId = eventScoreService.Key, score = score });
            }

            return eventScoreInfo;
        }
    }
}