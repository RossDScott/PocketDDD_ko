using PocketDDD.ActionResults;
using PocketDDD.Models;
using PocketDDD.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace PocketDDD.Controllers.API
{
    public class DDDEventsController : Controller
    {
        [HttpPost]
        public ActionResult Sync(ClientSyncData syncData)
        {
            try
            {
                if(syncData == null)
                    return null;

                var dddEventUserData = "";
                var eventsService = new EventsService();
                var dddEventVersion = eventsService.GetDDDEventListVersion();
                var userService = new UserService();
                IList<DDDEvent> dddEvents = null;

                if(syncData.dddEventListVersion < dddEventVersion)
                    dddEvents = eventsService.GetEvents(syncData.dddEventListVersion);

                var dddEventDetail = eventsService.GetEventDetail(syncData.dddEventDataVersion);
 
                var userName = "";
                if (syncData.userToken != null)
                    userName = userService.GetUserName(syncData.eventId, syncData.userToken);

                var eventScoreService = new EventScoreService(syncData.userToken, syncData.eventId, userName);
                var userGeneratedDataService = new UserGeneratedDataService(eventScoreService);

                //This is commented out as a quick hack to disable any more synching
                //This should be data driven like everything else
                //Uncomment all of this, to allow full syncing
                //var acceptedSessionComments = userGeneratedDataService.AddComments("session", syncData.eventId, userName, syncData.userToken, syncData.clientToken, syncData.sessionComments);
                //var acceptedEventMostLikeComments = userGeneratedDataService.AddComments("eventMostLike", syncData.eventId, userName, syncData.userToken, syncData.clientToken, syncData.eventMostLikeComments);
                //var acceptedEventLeastLikeComments = userGeneratedDataService.AddComments("eventLeastLike", syncData.eventId, userName, syncData.userToken, syncData.clientToken, syncData.eventLeastLikeComments);
                //var acceptedEventComments = userGeneratedDataService.AddComments("eventOverall", syncData.eventId, userName, syncData.userToken, syncData.clientToken, syncData.eventComments);
                //var acceptedPocketDDDComments = userGeneratedDataService.AddComments("pocketDDD", syncData.eventId, userName, syncData.userToken, syncData.clientToken, syncData.pocketDDDComments);

                //var eventScore = 0;
                //if (syncData.eventId != -1)
                //{
                //    userGeneratedDataService.AddOrUpdateSessionData(syncData.eventId, userName, syncData.userToken, syncData.clientToken, syncData.userSessionData);
                //    userGeneratedDataService.AddOrUpdateEventData(syncData.eventId, userName, syncData.userToken, syncData.clientToken, syncData.userEventData);
                //    eventScore = eventScoreService.CommitChanges();
                //}

                var data = new { dddEventListVersion = dddEventVersion, 
                    dddEvents = dddEvents,
                    dddEventId = syncData.eventId,
                    dddEventDetail = dddEventDetail, 
                    dddEventUserData = dddEventUserData,
                    acceptedSessionComments = new List<object>(), // acceptedSessionComments,
                                 acceptedEventMostLikeComments = new List<object>(), // acceptedEventMostLikeComments,
                                 acceptedEventLeastLikeComments = new List<object>(), // acceptedEventLeastLikeComments,
                                 acceptedEventComments = new List<object>(), // acceptedEventComments,
                                 acceptedPocketDDDComments = new List<object>(), // acceptedPocketDDDComments,
                    dddEventScore = 0 // eventScore
                };
                return new JsonNetResult(data);
            }
            catch (Exception)
            {
                throw; // new InvalidDataException("Unable to sync");
            }
        }
    }
}
