using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using PocketDDD.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using PocketDDD.Models.Azure;

namespace PocketDDD.Services
{
    public class UserService
    {
        CloudTableClient tableClient;
        CloudTable usersTable;

        public UserService()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["pocketDDDCloudStorage"].ConnectionString);
            this.tableClient = storageAccount.CreateCloudTableClient();
            this.usersTable = tableClient.GetTableReference("users");
        }

        public User GetUserByToken(int dddEventId, string userToken)
        {
            TableOperation getSingle = TableOperation.Retrieve<User>(dddEventId.ToString(), userToken);
            TableResult result = usersTable.Execute(getSingle);

            if (result.Result != null)
                return ((User)result.Result);
            else
                return null;
        }

        public string GetUserName(int dddEventId, string userToken)
        {
            var user = GetUserByToken(dddEventId, userToken);
            if (user == null)
                return "";

            return user.FirstName + " " + user.LastName;
        }

        public User GetUserByEventbriteOrder(int dddEventId, int eventbriteOrderNo)
        {
            TableOperation getSingle = TableOperation.Retrieve<EventBriteUserTokenMapping>(dddEventId.ToString(), eventbriteOrderNo.ToString());
            TableResult result = usersTable.Execute(getSingle);

            if (result.Result != null){
                var userToken = ((EventBriteUserTokenMapping)result.Result).UserToken;

                return GetUserByToken(dddEventId, userToken);
            } else
                return null;
        }

        public void AddUser(int dddEventId, int eventbriteOrderNo, string firstName, string lastName, string userToken, string clientToken)
        {
            var mapping = new EventBriteUserTokenMapping
            {
                PartitionKey = dddEventId.ToString(),
                RowKey = eventbriteOrderNo.ToString(),
                UserToken = userToken,
                ClientToken = clientToken
            };
            var user = new User
            {
                PartitionKey = dddEventId.ToString(),
                RowKey = userToken,
                FirstName = firstName,
                LastName = lastName
            };

            TableBatchOperation batch = new TableBatchOperation();
            batch.Insert(mapping);
            batch.Insert(user);

            usersTable.ExecuteBatch(batch);
        }
    }
}