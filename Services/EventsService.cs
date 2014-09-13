using AutoMapper;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using PocketDDD.Models;
using PocketDDD.Models.Azure;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

//CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
//CloudTable table = tableClient.GetTableReference("people");
//table.CreateIfNotExists();

//var dddsw5 = new DDDEventEntity();
//dddsw5.PartitionKey

namespace PocketDDD.Services
{
    public class EventsService
    {
        CloudBlobClient blobClient;
        CloudBlobContainer eventsContainer;
        CloudTableClient tableClient;
        CloudTable eventsTable;

        public EventsService()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["pocketDDDCloudStorage"].ConnectionString);

            blobClient = storageAccount.CreateCloudBlobClient();
            eventsContainer = blobClient.GetContainerReference("events");
            tableClient = storageAccount.CreateCloudTableClient();
            eventsTable = tableClient.GetTableReference("events");
        }

        public IList<DDDEvent> GetEvents(int currentVersion)
        {
            var events = GetAllEvents();
            var serverVersion = GetEventListVersion();

            if (serverVersion > currentVersion)
                return events;
            else
                return null;
        }

        public int GetEventListVersion()
        {
            return GetAllEvents().Sum(x => x.Version);
        }

        private IList<DDDEvent> eventsCache = null;
        private IList<DDDEvent> GetAllEvents(bool ignoreCache = false)
        {
            if (eventsCache != null)
                return eventsCache;

            TableQuery<DDDEventEntity> query = new TableQuery<DDDEventEntity>()
                .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, ""));

            var entities = eventsTable.ExecuteQuery(query);
            var events = entities.Select(x => Mapper.Map<DDDEvent>(x)).ToList();
            this.eventsCache = events;

            return events;
        }

        public IList<DDDEventDetail> GetEventDetails(IList<DDDEventDataInfo> currentDataVersions)
        {
            if (currentDataVersions == null)
                currentDataVersions = new List<DDDEventDataInfo>();

            var events = GetAllEvents().Where(x=>x.IsActive);
            var eventDetails = new List<DDDEventDetail>();

            foreach (var dddEvent in events)
            {
                var currentVersionInfo = currentDataVersions.Where(x => x.eventId == dddEvent.Id).SingleOrDefault();
                if (currentVersionInfo != null && currentVersionInfo.dataVersion < dddEvent.Version)
                    eventDetails.Add(GetEventDetail(dddEvent));
                else if(currentVersionInfo == null)
                    eventDetails.Add(GetEventDetail(dddEvent));
            }

            return eventDetails;
        }

        private Dictionary<string, DDDEventDetail> eventDetailCache = new Dictionary<string, DDDEventDetail>();
        public DDDEventDetail GetEventDetail(DDDEvent dddEvent)
        {
            var key = dddEvent.Id + "_" + dddEvent.Version;
            if (eventDetailCache.ContainsKey(key))
                return eventDetailCache[key];

            var blockBlob = eventsContainer.GetBlockBlobReference(dddEvent.Id + "_" + dddEvent.Version);
            var json = blockBlob.DownloadText();
            var eventDetail = JsonConvert.DeserializeObject<DDDEventDetail>(json);
            eventDetail.Version = dddEvent.Version;
            eventDetailCache.Add(key, eventDetail);

            return eventDetail;
        }

        private Dictionary<int, ServerDDDEvent> serverEventDataCache = new Dictionary<int, ServerDDDEvent>();
        public ServerDDDEvent GetServerEventData(int eventId)
        {
            if (serverEventDataCache.ContainsKey(eventId))
                return serverEventDataCache[eventId];

            TableOperation retrieveOperation = TableOperation.Retrieve<DDDEventEntity>("", eventId.ToString());
            TableResult retrievedResult = eventsTable.Execute(retrieveOperation);

            var entity = (DDDEventEntity)retrievedResult.Result;
            var serverData = Mapper.Map<ServerDDDEvent>(entity);
            serverEventDataCache.Add(eventId, serverData);

            return serverData;
        }
    }
}