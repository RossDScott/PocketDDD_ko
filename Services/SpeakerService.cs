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

        Dictionary<string, int> speakerIdMapping = new Dictionary<string, int>();
        public SpeakerService()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["pocketDDDCloudStorage"].ConnectionString);
            this.tableClient = storageAccount.CreateCloudTableClient();
            this.userCommentsTable = tableClient.GetTableReference("Comments");
            this.userSessionDataTable = tableClient.GetTableReference("UserSessionData");

            //was hardcoded, need to move to db
            speakerIdMapping.Add("GUID GOES HERE", 1);
        }

        public IList<SpeakerViewUserSessionData> GetMyRatings(string id)
        {
            var sessionId = speakerIdMapping[id];

            TableQuery<PocketDDD.Models.Azure.UserSessionData> rangeQuery = new TableQuery<PocketDDD.Models.Azure.UserSessionData>().Where(
                TableQuery.CombineFilters(
                    TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "1"),
                    TableOperators.And,
                    TableQuery.GenerateFilterConditionForInt("SessionId", QueryComparisons.Equal, sessionId)));

            var data = userSessionDataTable.ExecuteQuery(rangeQuery).Select(x => new SpeakerViewUserSessionData
            {
                AttendingStatus = x.AttendingStatus,
                Bookmarked = x.Bookmarked,
                SpeakerKnowledgeRating = x.SpeakerKnowledgeRating,
                SpeakerSkillsRating = x.SpeakerSkillsRating
            }).ToList();

            return data;
        }

        public IList<SpeakerViewUserComment> GetMyComments(string id)
        {
            var sessionId = speakerIdMapping[id];

            TableQuery<PocketDDD.Models.Azure.Comment> rangeQuery = new TableQuery<PocketDDD.Models.Azure.Comment>().Where(
                TableQuery.CombineFilters(
                    TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "1"),
                    TableOperators.And,
                    TableQuery.GenerateFilterConditionForInt("SessionId", QueryComparisons.Equal, sessionId)));

            var data = userCommentsTable.ExecuteQuery(rangeQuery).Select(x => new SpeakerViewUserComment
            {
                date = x.Date,
                comment = x.UserComment
            }).ToList();

            return data;
        }

    }
}