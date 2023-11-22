using System;
using System.ComponentModel.DataAnnotations;
using MCUWidgetsRecommendationsApi.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MCUWidgetsRecommendationsApi.Models.Tracking
{
    public abstract class TrackingEvent
    {
        public int id { get; set; }

        public DateTime eventDateTime { get; set; } = DateTime.Now;

        public string userId { get; set; }

        public TrackingEvent()
        {
        }
    }
}

