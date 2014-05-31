using System.Web;
using System.Web.Optimization;

namespace PocketDDD
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                        "~/Scripts/bootstrap.js", "~/bower_components/bootstrap-star-rating/js/star-rating.js"));

            bundles.Add(new ScriptBundle("~/bundles/otherlibaries").Include(
                        "~/Scripts/lodash.js", "~/Scripts/moment.js", "~/Scripts/q.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                        "~/Scripts/knockout-{version}.js", "~/Scripts/knockout-es5.js", "~/Scripts/app/helper/kocustombinding.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/app/helper/guid_generator.js",

                "~/Scripts/app/services/local_data.js",
                "~/Scripts/app/services/server_data.js",
                "~/Scripts/app/services/app_state.js",
                "~/Scripts/app/services/event_management.js",
                "~/Scripts/app/services/sync_management.js",

                "~/Scripts/app/viewmodels/data.js",
                "~/Scripts/app/viewmodels/comments.js",
                
                "~/Scripts/app/viewmodels/pages/page_nav.js",
                 "~/Scripts/app/viewmodels/pages/page_transtion.js",
                 "~/Scripts/app/viewmodels/pages/page.js",
                 "~/Scripts/app/viewmodels/pages/expanding_section.js",
                 "~/Scripts/app/viewmodels/pages/eventbrite_registration.js",
                 "~/Scripts/app/viewmodels/pages/comments.js",
                 "~/Scripts/app/viewmodels/pages/session_home.js",
                 "~/Scripts/app/viewmodels/pages/intro.js",
                 "~/Scripts/app/viewmodels/pages/event_list.js",
                 "~/Scripts/app/viewmodels/pages/event_home.js",
                 "~/Scripts/app/viewmodels/pages/event_feedback.js",
                 "~/Scripts/app/viewmodels/pages/session_list.js",
                 "~/Scripts/app/viewmodels/main.js",

                 "~/Scripts/app/init.js"
            ));



            bundles.Add(new StyleBundle("~/Content/bootstrap").Include("~/Content/bootstrap.css",
                "~/bower_components/bootstrap-star-rating/css/star-rating.css"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));
        }
    }
}