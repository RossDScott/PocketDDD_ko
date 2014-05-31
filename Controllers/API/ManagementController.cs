using PocketDDD.ActionResults;
using PocketDDD.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PocketDDD.Controllers.API
{
    public class ManagementController : Controller
    {
        [HttpGet]
        public ActionResult GetAllEventData(string id)
        {
            try
            {
                if (id != "GUID GOES HERE") //Clearly this should be data driven as well
                    return null;

                var managementService = new ManagementService();

                var ratings = managementService.GetEventUserData();
                var comments = managementService.GetEventComments();

                var overallRating = ratings
                    .Where(x => x.Overall != null)
                    .Select(x => x.Overall.Value)
                    .ToList();

                var overallRatingSpread = overallRating.GroupBy(x => x)
                    .Select(x => new { score = x.Key, count = x.Count() });

                double avgoverallRating = (double)overallRating.Sum() / (double)overallRating.Count();

                var refreshmentsRating = ratings
                    .Where(x => x.Refreshments != null)
                    .Select(x => x.Refreshments.Value)
                    .ToList();

                var refreshmentsRatingSpread = refreshmentsRating.GroupBy(x => x)
                    .Select(x => new { score = x.Key, count = x.Count() });

                double avgrefreshmentsRating = (double)refreshmentsRating.Sum() / (double)refreshmentsRating.Count();

                var venueRating = ratings
                    .Where(x => x.Venue != null)
                    .Select(x => x.Venue.Value)
                    .ToList();

                var venueRatingSpread = venueRating.GroupBy(x => x)
                    .Select(x => new { score = x.Key, count = x.Count() });

                double avgvenueRating = (double)venueRating.Sum() / (double)venueRating.Count();

                var hackPerseveranceCount = ratings.Where(x => x.EasterEggP).Count();
                var hackRussianRoulette = ratings.Where(x => x.EasterEggRR).Count();

                var data = new
                {
                    calcRating = new
                    {
                        avgOverallRating = Math.Round(avgoverallRating, 2),
                        avgRefreshmentsRating = Math.Round(avgrefreshmentsRating, 2),
                        avgvenueRating = Math.Round(avgvenueRating, 2),
                        overallRatingSpread = overallRatingSpread,
                        refreshmentsRatingSpread = refreshmentsRatingSpread,
                        venueRatingSpread = venueRatingSpread,
                        hackPerseveranceCount = hackPerseveranceCount,
                        hackRussianRoulette = hackRussianRoulette
                    },
                    comments = comments
                };
                return new JsonNetResult(data);

            }
            catch (Exception)
            {

                throw new Exception("Error");
            }
        }

        [HttpGet]
        public ActionResult GetEventRatings(string id)
        {
            try
            {
                if (id != "GUID GOES HERE") //Clearly this should be data driven as well
                    return null;

                var managementService = new ManagementService();

                var ratings = managementService.GetEventUserData();

                var overallRating = ratings
                    .Where(x => x.Overall != null)
                    .Select(x => x.Overall.Value)
                    .ToList();

                var overallRatingSpread = overallRating.GroupBy(x => x)
                    .Select(x => new { score = x.Key, count = x.Count() });

                double avgoverallRating = (double)overallRating.Sum() / (double)overallRating.Count();

                var refreshmentsRating = ratings
                    .Where(x => x.Refreshments != null)
                    .Select(x => x.Refreshments.Value)
                    .ToList();

                var refreshmentsRatingSpread = refreshmentsRating.GroupBy(x => x)
                    .Select(x => new { score = x.Key, count = x.Count() });

                double avgrefreshmentsRating = (double)refreshmentsRating.Sum() / (double)refreshmentsRating.Count();

                var venueRating = ratings
                    .Where(x => x.Venue != null)
                    .Select(x => x.Venue.Value)
                    .ToList();

                var venueRatingSpread = venueRating.GroupBy(x => x)
                    .Select(x => new { score = x.Key, count = x.Count() });

                double avgvenueRating = (double)venueRating.Sum() / (double)venueRating.Count();

                var hackPerseveranceCount = ratings.Where(x => x.EasterEggP).Count();
                var hackRussianRoulette = ratings.Where(x => x.EasterEggRR).Count();

                var data = new
                {
                    calcRating = new
                    {
                        avgOverallRating = Math.Round(avgoverallRating, 2),
                        avgRefreshmentsRating = Math.Round(avgrefreshmentsRating, 2),
                        avgvenueRating = Math.Round(avgvenueRating, 2),
                        overallRatingSpread = overallRatingSpread,
                        refreshmentsRatingSpread = refreshmentsRatingSpread,
                        venueRatingSpread = venueRatingSpread,
                        hackPerseveranceCount = hackPerseveranceCount,
                        hackRussianRoulette = hackRussianRoulette
                    }
                };
                return new JsonNetResult(data);
            }
            catch (Exception)
            {

                throw new Exception("Error");
            }
        }

        [HttpGet]
        public ActionResult GetEasterEggPeople(string id)
        {
            try
            {
                if (id != "GUID GOES HERE") //Clearly this should be data driven as well
                    return null;

                var managementService = new ManagementService();

                var ratings = managementService.GetEventUserData();

                var hackPerseverance = ratings.Where(x => x.EasterEggP)
                    .Select(x=>new {
                      name = x.UserName,
                      token = x.ClientToken
                    }).ToList();
                var hackRussian= ratings.Where(x => x.EasterEggRR)
                   .Select(x => new
                   {
                       name = x.UserName,
                       token = x.ClientToken
                   }).ToList();

                var data = new
                {
                    calcRating = new
                    {
                        hackPerseverance = hackPerseverance,
                        hackRussian = hackRussian
                    }
                };
                return new JsonNetResult(data);
            }
            catch (Exception)
            {

                throw new Exception("Error");
            }
        }

        [HttpGet]
        public ActionResult GetEventScores(string id)
        {
            try
            {
                if (id != "GUID GOES HERE") //Clearly this should be data driven as well
                    return null;

                var managementService = new ManagementService();

                var scores = managementService.GetEventScores();

                var returnScores = scores.OrderByDescending(x => x.Score).Select(x => new
                {
                    score = x.Score,
                    name = x.UserName,
                    token = x.RowKey
                });

                return new JsonNetResult(returnScores);
            }
            catch (Exception)
            {

                throw new Exception("Error");
            }
        }

        [HttpGet]
        public ActionResult GetWinners(string id)
        {
            try
            {
                if (id != "GUID GOES HERE") //Clearly this should be data driven as well
                    return null;

                var managementService = new ManagementService();

                var scores = managementService.GetEventScores();

                var completeList = new List<Models.Azure.EventScoreItem>();
                foreach (var personScore in scores)
                {
                    for (int i = 0; i < personScore.Score; i++)
                    {
                        completeList.Add(personScore);
                    }
                }

                var winningNumbers = new List<int>();
                var totalEntries = completeList.Count();
                Random rnd = new Random();

                for (int i = 0; i < 30; i++)
                {
                    var number = rnd.Next(0, totalEntries - 1);
                    if (!winningNumbers.Contains(number))
                        winningNumbers.Add(rnd.Next(0, totalEntries -1));
                }

                var winningPeople = new List<Models.Azure.EventScoreItem>();
                foreach (var winningNumber in winningNumbers)
                {
                    if (!winningPeople.Contains(completeList[winningNumber]))
                        winningPeople.Add(completeList[winningNumber]);
                }

                var data = new
                {
                    totalEntries = totalEntries,
                    winningNumbers = winningNumbers,
                    winners = winningPeople
                };
                return new JsonNetResult(data);
            }
            catch (Exception)
            {

                throw new Exception("Error");
            }
        }
	}
}