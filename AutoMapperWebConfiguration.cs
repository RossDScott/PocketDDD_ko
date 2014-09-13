using AutoMapper;
using PocketDDD.Models;
using PocketDDD.Models.Azure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PocketDDD
{
    public static class AutoMapperWebConfiguration
    {
        public static void Configure()
        {
            ConfigureAzureMapping();
        }

        private static void ConfigureAzureMapping()
        {
            Mapper.CreateMap<DDDEventEntity, DDDEvent>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => int.Parse(src.RowKey)));

            Mapper.CreateMap<DDDEventEntity, ServerDDDEvent>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => int.Parse(src.RowKey)));
        }

        // ... etc
    }
}