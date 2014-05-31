using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Mvc.Html;

namespace PocketDDD
{
    public static class OfflineHTMLHelper
    {
        public static MvcHtmlString OfflineScriptRender(this System.Web.Mvc.HtmlHelper htmlHelper, HttpRequestBase request, string bundlePath)
        {
            if (request.Url.AbsolutePath.EndsWith("online"))
            {
                return new MvcHtmlString(Scripts.Render(bundlePath).ToString());
            }
            else
            {
                return new MvcHtmlString(string.Format("<script src='{0}'></script>", BundleTable.Bundles.ResolveBundleUrl(bundlePath, true)));
            }
        }

        public static MvcHtmlString OfflineStyleRender(this System.Web.Mvc.HtmlHelper htmlHelper, HttpRequestBase request, string bundlePath)
        {
            if (request.Url.AbsolutePath.EndsWith("online"))
            {
                return new MvcHtmlString(Styles.Render(bundlePath).ToString());
            }
            else
            {
                return new MvcHtmlString(string.Format("<link href='{0}'rel='stylesheet'>", BundleTable.Bundles.ResolveBundleUrl(bundlePath, true)));
            }
        }

    }
}