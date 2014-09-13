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

                var eventsService = new EventsService();
                var userService = new UserService();

                var dddEvents = eventsService.GetEvents(syncData.dddEventListVersion);
                var dddEventDetails = eventsService.GetEventDetails(syncData.dddEventDataInfo);
                var userGeneratedDataService = new UserGeneratedDataService(eventsService, userService, syncData.dddEventDataInfo);

                var acceptedSessionComments = userGeneratedDataService.AddComments("session", syncData.clientToken, syncData.sessionComments);
                var acceptedEventMostLikeComments = userGeneratedDataService.AddComments("eventMostLike", syncData.clientToken, syncData.eventMostLikeComments);
                var acceptedEventLeastLikeComments = userGeneratedDataService.AddComments("eventLeastLike", syncData.clientToken, syncData.eventLeastLikeComments);
                var acceptedEventComments = userGeneratedDataService.AddComments("eventOverall", syncData.clientToken, syncData.eventComments);
                var acceptedPocketDDDComments = userGeneratedDataService.AddComments("pocketDDD", syncData.clientToken, syncData.pocketDDDComments);
                userGeneratedDataService.AddOrUpdateSessionData(syncData.clientToken, syncData.userSessionData);
                userGeneratedDataService.AddOrUpdateEventData(syncData.clientToken, syncData.userEventData);
                var eventScores = userGeneratedDataService.CommitEventScores();
                
                var data = new SyncResult
                {
                    dddEventListVersion = eventsService.GetEventListVersion(), 
                    dddEvents = dddEvents,
                    dddEventDetails = dddEventDetails,
                    acceptedSessionComments = acceptedSessionComments,
                    acceptedEventMostLikeComments = acceptedEventMostLikeComments,
                    acceptedEventLeastLikeComments = acceptedEventLeastLikeComments,
                    acceptedEventComments = acceptedEventComments,
                    acceptedPocketDDDComments = acceptedPocketDDDComments,
                    dddEventScores = eventScores
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
