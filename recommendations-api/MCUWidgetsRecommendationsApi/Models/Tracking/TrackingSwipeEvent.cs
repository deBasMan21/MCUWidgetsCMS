using System;
using System.ComponentModel.DataAnnotations;
using MCUWidgetsRecommendationsApi.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MCUWidgetsRecommendationsApi.Models.Tracking
{
    public class TrackingSwipeEvent : TrackingEvent
    {
        public int pageId { get; set; }

        public ClickPageType pageType { get; set; }

        public SwipeDirection swipeDirection { get; set; }

        public TrackingSwipeEvent()
        {
        }
    }

    public enum SwipeDirection
    {
        UP,
        DOWN,
        CLICK
    }
}

