using System;
using System.ComponentModel.DataAnnotations;
using MCUWidgetsRecommendationsApi.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MCUWidgetsRecommendationsApi.Models.Tracking
{
    public class TrackingPageOpenEvent : TrackingEvent
    {
        public int pageId { get; set; }
        public ClickPageType pageType { get; set; }

        public int? projectId { get; set; }
        public Project? project { get; set; }
        public int? actorId { get; set; }
        public Actor? actor { get; set; }
        public int? directorId { get; set; }
        public Director? director { get; set; }

        public TrackingPageOpenEvent()
        {
        }
    }
}

