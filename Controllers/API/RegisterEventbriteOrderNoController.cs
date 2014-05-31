using EventbriteNET;
using Newtonsoft.Json;
using PocketDDD.ActionResults;
using PocketDDD.Models;
using PocketDDD.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PocketDDD.Controllers.API
{
    public class RegisterEventbriteOrderNoController : Controller
    {
        public async Task<ActionResult> Index(int eventbriteOrderNo, int dddEventId, string clientToken)
        {
            try
            {
                UserInfo registeredUser = null;
                var userService = new UserService();

                var user = userService.GetUserByEventbriteOrder(dddEventId, eventbriteOrderNo);

                if (user == null)
                {
                    var eventbriteService = new EventbriteService();
                    var eventbriteUserInfo = await eventbriteService.GetUserRegistrationInfo(eventbriteOrderNo);
                    var newToken = Guid.NewGuid().ToString();
                    userService.AddUser(dddEventId, eventbriteOrderNo, eventbriteUserInfo.firstName, eventbriteUserInfo.lastName, newToken, clientToken);
                    registeredUser = new UserInfo
                    {
                        firstName = eventbriteUserInfo.firstName,
                        lastName = eventbriteUserInfo.lastName,
                        token = newToken
                    };
                }
                else
                {
                    registeredUser = new UserInfo
                    {
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        token = user.RowKey
                    };
                }

                var eventScoreService = new EventScoreService(registeredUser.token, dddEventId, user.FirstName + "_" + user.LastName);
                registeredUser.eventScore = eventScoreService.GetCurrentEventScore();

                return new JsonNetResult(registeredUser);
            }
            catch (Exception)
            {
                throw new InvalidDataException("Failed to get user");
            }
        }
    }
}
