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
    public class SpeakerLookupService
    {
        CloudTableClient tableClient;
        CloudTable speakerMappingTable;

        Dictionary<string, int> speakerIdMapping = new Dictionary<string, int>();
        public SpeakerLookupService()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["pocketDDDCloudStorage"].ConnectionString);
            this.tableClient = storageAccount.CreateCloudTableClient();
            this.speakerMappingTable = tableClient.GetTableReference("SpeakerMapping");
        }

        public SpeakerMapping GetSpeakerMapping(string id)
        {
            TableOperation retrieveOperation = TableOperation.Retrieve<SpeakerMapping>("", id);
            TableResult retrievedResult = speakerMappingTable.Execute(retrieveOperation);

            var entity = (SpeakerMapping)retrievedResult.Result;

            return entity;
        }

        public List<SpeakerMapping> GenerateMappings(int eventId, string eventAdminToken)
        {
            var eventService = new EventsService();
            var dddEvent = eventService.GetServerEventData(eventId);

            if (dddEvent.AdminToken != eventAdminToken)
                return null;

            var eventDetails = eventService.GetEventDetail(dddEvent);

            var newMappings = eventDetails.Sessions.Select(x => new SpeakerMapping
            {
                PartitionKey = "",
                RowKey = Guid.NewGuid().ToString(),
                EventId = eventId,
                SessionId = x.Id
            }).ToList();



            foreach (var newMapping in newMappings)
            {
                TableOperation insertOperation = TableOperation.Insert(newMapping);
                speakerMappingTable.Execute(insertOperation);
            }

            return newMappings;
        }
    }
}