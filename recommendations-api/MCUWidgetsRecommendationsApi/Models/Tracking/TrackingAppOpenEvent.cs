using System;
using System.ComponentModel.DataAnnotations;
using MCUWidgetsRecommendationsApi.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MCUWidgetsRecommendationsApi.Models.Tracking
{
    public class TrackingAppOpenEvent : TrackingEvent
    {
        public TrackingAppOpenEvent()
        {
        }
    }
}

