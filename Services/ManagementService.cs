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
    public class ManagementService
    {
        CloudTableClient tableClient;
        CloudTable userCommentsTable;
        CloudTable userEventDataTable;
        CloudTable eventScoreTable;

        Dictionary<string, int> speakerIdMapping = new Dictionary<string, int>();
        public ManagementService()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["pocketDDDCloudStorage"].ConnectionString);
            this.tableClient = storageAccount.CreateCloudTableClient();
            this.userCommentsTable = tableClient.GetTableReference("Comments");
            this.userEventDataTable = tableClient.GetTableReference("UserEventData");
            this.eventScoreTable = tableClient.GetTableReference("EventScore");
        }

        public IList<PocketDDD.Models.Azure.UserEventData> GetEventUserData()
        {
            TableQuery<PocketDDD.Models.Azure.UserEventData> query = new TableQuery<PocketDDD.Models.Azure.UserEventData>()
                .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "1"));

            var data = userEventDataTable.ExecuteQuery(query).ToList();
                
            return data;
        }

        public IList<PocketDDD.Models.ManagementViewUserComment> GetEventComments()
        {
            TableQuery<PocketDDD.Models.Azure.Comment> rangeQuery = new TableQuery<PocketDDD.Models.Azure.Comment>().Where(
                TableQuery.CombineFilters(
                    TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "1"),
                    TableOperators.And,
                    TableQuery.GenerateFilterCondition("Type", QueryComparisons.NotEqual, "session")));

            var data = userCommentsTable.ExecuteQuery(rangeQuery).Select(x => new ManagementViewUserComment
            {
                type = x.Type,
                date = x.Date,
                userName = x.UserName,
                comment = x.UserComment
            }).ToList();

            return data;
        }

        public IList<PocketDDD.Models.Azure.EventScoreItem> GetEventScores()
        {
            TableQuery<PocketDDD.Models.Azure.EventScoreItem> query = new TableQuery<PocketDDD.Models.Azure.EventScoreItem>()
                   .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "1"));

            var data = eventScoreTable.ExecuteQuery(query).ToList();

            return data;
        }


    }
}