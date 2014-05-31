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
    public class UserGeneratedDataService
    {
        CloudTableClient tableClient;
        CloudTable userCommentsTable;
        CloudTable userSessionDataTable;
        CloudTable userEventDataTable;

        EventScoreService eventScoreService;
        HardCodedDataService dataService;

        DDDEventDetail eventDetail;
        public UserGeneratedDataService(EventScoreService eventScoreService)
        {
            this.eventScoreService = eventScoreService;
            this.dataService = new HardCodedDataService();
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["pocketDDDCloudStorage"].ConnectionString);
            this.tableClient = storageAccount.CreateCloudTableClient();
            this.userCommentsTable = tableClient.GetTableReference("Comments");
            this.userSessionDataTable = tableClient.GetTableReference("UserSessionData");
            this.userEventDataTable = tableClient.GetTableReference("UserEventData");
            this.eventDetail = this.dataService.GetEventDetail(0);
        }


        public IList<AcceptedUserComment> AddComments(string type, int dddEventId, string userName, string userToken, string clientToken, IList<UserComment> userComments)
        {
            if (userComments == null || userComments.Count == 0)
                return null;

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
                if(comment.sessionId != null)
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
                Id = x.id,
                SessionId = x.sessionId
            });

            return accepted.ToList();
        }

        public void AddOrUpdateSessionData(int dddEventId, string userName, string userToken, string clientToken, IList<PocketDDD.Models.UserSessionData> sessionData)
        {
            if (sessionData == null || sessionData.Count() == 0)
                return;

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

        public void AddOrUpdateEventData(int dddEventId, string userName, string userToken, string clientToken, PocketDDD.Models.UserEventData eventData)
        {
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
    }
}