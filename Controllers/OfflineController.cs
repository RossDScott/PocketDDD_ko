using PocketDDD.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;

namespace PocketDDD.Controllers
{
    public class OfflineController : Controller
    {
        //private readonly IAuditLog auditLog;

        public OfflineController()
        {
            // this.auditLog = auditLog;
        }

        public ActionResult Index()
        {
            var version = ConfigurationManager.AppSettings["version"];

            return new AppCacheResult(new[]
            {
                //Url.Content("~/fonts/glyphicons-halflings-regular.eot"),
                //Url.Content("~/fonts/glyphicons-halflings-regular.svg"),
                //Url.Content("~/fonts/glyphicons-halflings-regular.ttf"),
                Url.Content("~/fonts/glyphicons-halflings-regular.woff"),

                BundleTable.Bundles.ResolveBundleUrl("~/bundles/jquery", true),
                BundleTable.Bundles.ResolveBundleUrl("~/bundles/bootstrap", true),
                BundleTable.Bundles.ResolveBundleUrl("~/bundles/otherlibaries", true),
                BundleTable.Bundles.ResolveBundleUrl("~/bundles/knockout", true),
                BundleTable.Bundles.ResolveBundleUrl("~/bundles/app", true),

                BundleTable.Bundles.ResolveBundleUrl("~/Content/bootstrap", true),
                BundleTable.Bundles.ResolveBundleUrl("~/Content/css", true)
            },
            networkAssets: new string[]
            {
                "*"
                //Url.Content("~/api"),
                //Url.Content("~/offline/pingonlinestatus"),
                
            },
            fingerprint: BundleTable.Bundles.FingerprintsOf(
                "~/Content/css",
                "~/Content/bootstrap",
                "~/bundles/bootstrap",
                "~/bundles/jquery",
                "~/bundles/bootstrap",
                "~/bundles/otherlibaries",
                "~/bundles/knockout",
                "~/bundles/app"
                )) { Version = version };
        }

        [HttpGet]
        public JsonResult PingOnlineStatus()
        {
            HttpContext.Response.Cache.SetMaxAge(new TimeSpan(0));
            return Json("online", JsonRequestBehavior.AllowGet);
        }

    }
}
