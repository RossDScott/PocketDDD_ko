using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Table;
using PocketDDD.Models;
using System;
using System.Collections.Generic;
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
        CloudBlobContainer container;

        public EventsService()
        {
            //CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("pocketDDDCloudStorage"));

            //this.blobClient = storageAccount.CreateCloudBlobClient();
            //this.container = blobClient.GetContainerReference("mycontainer");

        }

        //public string GetEventsJSON()
        //{
        //    //CloudBlockBlob blockBlob = container.GetBlockBlobReference("dddevents");
        //    //var json = blockBlob.DownloadText();

        //    //return json;
        //}

        public int GetDDDEventListVersion()
        {
            return 5;
        }

        public IList<DDDEvent> GetEvents(int currentVersion)
        {
            if (currentVersion >= 5)
                return new List<DDDEvent>();
            
            var hardCodedService = new HardCodedDataService();
            return hardCodedService.GetEvents(currentVersion);
        }

        public DDDEventDetail GetEventDetail(int currentVersion)
        {
            if (currentVersion >= 5)
               return null;

            var hardCodedService = new HardCodedDataService();
            return hardCodedService.GetEventDetail(currentVersion);
        }
    }
}