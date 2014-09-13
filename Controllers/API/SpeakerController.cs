using PocketDDD.ActionResults;
using PocketDDD.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PocketDDD.Controllers.API
{
    public class SpeakerController : Controller
    {
        [HttpGet]
        public ActionResult GetMyRatings(string speakerId)
        {
            var speakerService = new SpeakerService(speakerId);

            if(speakerService.speakerMapping == null)
                return new JsonNetResult(null);

            var ratings = speakerService.GetMyRatings();
            var comments = speakerService.GetMyComments();

            var knowedgeRating = ratings
                .Where(x=>x.SpeakerKnowledgeRating != null)
                .Select(x=>x.SpeakerKnowledgeRating.Value)
                .ToList();

            var knowedgeRatingSpread = knowedgeRating.GroupBy(x => x)
                .Select(x=> new {score = x.Key, count = x.Count()});

            double avgKnowedge = (double)knowedgeRating.Sum() / (double) knowedgeRating.Count();

            var skillsRating = ratings
                .Where(x => x.SpeakerSkillsRating != null)
                .Select(x => x.SpeakerSkillsRating.Value)
                .ToList();


            var skillsRatingSpread = skillsRating.GroupBy(x => x)
                .Select(x=> new {score = x.Key, count = x.Count()});

            double avgSkill = (double) skillsRating.Sum() / (double) skillsRating.Count();

            var data = new { 
                calcRating = new {
                    avgKnowedge = Math.Round(avgKnowedge, 2),
                    avgSkill = Math.Round(avgSkill, 2),
                    knowedgeRatingSpread = knowedgeRatingSpread,
                    skillsRatingSpread = skillsRatingSpread
                },
                allRatings = ratings, 
                comments = comments };
            return new JsonNetResult(data);
        }

    }
}
