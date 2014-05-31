using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace PocketDDD.ActionResults
{
    public class JsonNetResult : ActionResult
    {
        public Encoding ContentEncoding { get; set; }
        public string ContentType { get; set; }
        public object Data { get; set; }

        public JsonSerializerSettings SerializerSettings { get; set; }
        public Formatting Formatting { get; set; }

        public JsonNetResult()
        {
            SerializerSettings = new JsonSerializerSettings();
            SerializerSettings.Converters.Add(new IsoDateTimeConverter());
            SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }

        public JsonNetResult(object data)
            : this()
        {
            this.Data = data;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            HttpResponseBase response = context.HttpContext.Response;

            response.ContentType = !string.IsNullOrEmpty(ContentType)
              ? ContentType
              : "application/json";

            if (ContentEncoding != null)
                response.ContentEncoding = ContentEncoding;

            if (Data != null)
            {
                Serialise(response.Output);
            }
        }

        private void Serialise(System.IO.TextWriter textWriter)
        {
            JsonTextWriter writer = new JsonTextWriter(textWriter) { Formatting = Formatting };

            JsonSerializer serializer = JsonSerializer.Create(SerializerSettings);
            serializer.Serialize(writer, Data);

            writer.Flush();
        }
    }
}