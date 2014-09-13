using Newtonsoft.Json;
using PocketDDD.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

namespace PocketDDD.Services
{
    public class EventbriteService
    {
        private readonly string eventbriteToken;
        public EventbriteService(string eventbriteToken)
        {
            this.eventbriteToken = eventbriteToken;
        }

        public async Task<EventbriteUserInfo> GetUserRegistrationInfo(int eventbriteOrderNo, string eventbriteEventId)
        {
            var req = new HttpRequestMessage(HttpMethod.Get, "https://www.eventbriteapi.com/v3/orders/" + eventbriteOrderNo.ToString() + "?token=" + eventbriteToken);
            req.Headers.Add("Cache-Control", "no-cache");

            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await client.SendAsync(req);
            if (response.StatusCode != HttpStatusCode.OK)
                return null;

            var json = await response.Content.ReadAsStringAsync();
            var data = JsonConvert.DeserializeObject<dynamic>(json);

            string firstName; 
            string lastName;

            try 
	        {
                if (((string)data.event_id) != eventbriteEventId)
                    throw new ApplicationException("Incorrect event_id");

		        var firstAttendee = data.attendees[0];
                var profile = firstAttendee.profile;
                firstName = profile.first_name;
                lastName = profile.last_name;
	        }
	        catch (Exception)
	        {
                firstName = data.first_name;
                lastName = data.last_name;
	        }

            var registeredUser = new EventbriteUserInfo
            {
                firstName = firstName,
                lastName = lastName
            };

            return registeredUser;
        }
    }
}