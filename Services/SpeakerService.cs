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
    public class SpeakerService
    {
        CloudTableClient tableClient;
        CloudTable userCommentsTable;
        CloudTable userSessionDataTable;
        public SpeakerMapping speakerMapping;

        public SpeakerService(string speakerId)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["pocketDDDCloudStorage"].ConnectionString);
            this.tableClient = storageAccount.CreateCloudTableClient();
            this.userCommentsTable = tableClient.GetTableReference("Comments");
            this.userSessionDataTable = tableClient.GetTableReference("UserSessionData");
            var speakerLookupService = new SpeakerLookupService();
            this.speakerMapping = speakerLookupService.GetSpeakerMapping(speakerId);

            if (this.speakerMapping == null)
                throw new ApplicationException("Invalid speakerId");
        }

        public IList<SpeakerViewUserSessionData> GetMyRatings()
        {
            TableQuery<PocketDDD.Models.Azure.UserSessionData> rangeQuery = new TableQuery<PocketDDD.Models.Azure.UserSessionData>().Where(
                TableQuery.CombineFilters(
                    TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, speakerMapping.EventId.ToString()),
                    TableOperators.And,
                    TableQuery.GenerateFilterConditionForInt("SessionId", QueryComparisons.Equal, speakerMapping.SessionId)));

            var data = userSessionDataTable.ExecuteQuery(rangeQuery).Select(x => new SpeakerViewUserSessionData
            {
                AttendingStatus = x.AttendingStatus,
                Bookmarked = x.Bookmarked,
                SpeakerKnowledgeRating = x.SpeakerKnowledgeRating,
                SpeakerSkillsRating = x.SpeakerSkillsRating
            }).ToList();

            return data;
        }

        public IList<SpeakerViewUserComment> GetMyComments()
        {
            TableQuery<PocketDDD.Models.Azure.Comment> rangeQuery = new TableQuery<PocketDDD.Models.Azure.Comment>().Where(
                TableQuery.CombineFilters(
                    TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, speakerMapping.EventId.ToString()),
                    TableOperators.And,
                    TableQuery.GenerateFilterConditionForInt("SessionId", QueryComparisons.Equal, speakerMapping.SessionId)));

            var data = userCommentsTable.ExecuteQuery(rangeQuery).Select(x => new SpeakerViewUserComment
            {
                date = x.Date,
                comment = x.UserComment
            }).ToList();

            return data;
        }

    }
}