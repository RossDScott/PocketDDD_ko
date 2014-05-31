using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using PocketDDD.Models.Azure;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace PocketDDD.Services
{
    public class EventScoreService
    {
        CloudTableClient tableClient;
        CloudTable eventScoreTable;

        string token;
        int dddEventId;
        string userName;

        public EventScoreService(string token, int dddEventId, string userName)
        {
            this.token = token;
            this.dddEventId = dddEventId;
            this.userName = userName;

            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["pocketDDDCloudStorage"].ConnectionString);
            this.tableClient = storageAccount.CreateCloudTableClient();
            this.eventScoreTable = tableClient.GetTableReference("EventScore");
        }

        //public void AddAttendingItem(int timeSlotId)
        //{
        //    this.AddItem(timeSlotId, "attending");
        //}

        public void AddCommentItem(string type, int? timeSlotId)
        {
            this.AddItem(timeSlotId, type, timeSlotId == null ? 2: 1);
        }

        public void AddKnowledgeRatingItem(int timeSlotId)
        {
            this.AddItem(timeSlotId, "kRating");
        }

        public void AddSkillRatingItem(int timeSlotId)
        {
            this.AddItem(timeSlotId, "sRating");
        }

        public void AddBookmarkOrAttendingItem(int timeSlotId)
        {
            this.AddItem(timeSlotId, "bookmarkOrAttending");
        }

        public void AddRefreshmentsItem()
        {
            this.AddItem(null, "refreshments", 2);
        }

        public void AddVenueItem()
        {
            this.AddItem(null, "venue", 2);
        }

        public void AddOverallItem()
        {
            this.AddItem(null, "overall", 3);
        }

        public void AddEasterEgg(string name, int score = 1)
        {
            this.AddItem(null, "easterEgg_" + name, score);
        }

        private Dictionary<string, EventScoreItem> ScoreItems = new Dictionary<string, EventScoreItem>();
        private void AddItem(int? timeSlotId, string key, int score = 1)
        {
            var fullKey = timeSlotId != null ? timeSlotId.ToString() + "_" + key : key;

            if (!ScoreItems.ContainsKey(fullKey))
            {
                var scoreItem = new EventScoreItem
                {
                    PartitionKey = token,
                    RowKey = fullKey,
                    DDDEventId = dddEventId,
                    UserName = userName,
                    Score = score
                };
                ScoreItems.Add(fullKey, scoreItem);
            }
        }

        public int CommitChanges()
        {
            if (string.IsNullOrEmpty(this.token))
                return 0;

            if(ScoreItems.Count > 0)
            {
                TableBatchOperation batch = new TableBatchOperation();
                ScoreItems.ToList().ForEach(x =>
                {
                    batch.InsertOrReplace(x.Value);                
                });
                eventScoreTable.ExecuteBatch(batch);
            }

            TableQuery<EventScoreItem> query = new TableQuery<EventScoreItem>()
                .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, this.token));

            var eventScore = eventScoreTable.ExecuteQuery(query).Sum(x=>x.Score);

            var totalItem = new EventScoreItem
            {
                PartitionKey = dddEventId.ToString(),
                RowKey = this.token,
                DDDEventId = dddEventId,
                UserName = userName,
                Score = eventScore
            };

            TableOperation insert = TableOperation.InsertOrReplace(totalItem);
            eventScoreTable.Execute(insert);

            return eventScore;
        }

        public int GetCurrentEventScore()
        {
            TableQuery<EventScoreItem> query = new TableQuery<EventScoreItem>()
                .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, this.token));

            var eventScore = eventScoreTable.ExecuteQuery(query).Sum(x => x.Score);

            return eventScore;
        }
    }
}