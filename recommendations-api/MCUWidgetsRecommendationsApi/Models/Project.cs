using System;
using MCUWidgetsRecommendationsApi.Models.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MCUWidgetsRecommendationsApi.Models
{
    public class Project
	{
		public string uniqueId { get; set; }
		public int id { get; set; }
		public string title { get; set; }
		public DateTime releaseDate { get; set; }
		public string overview { get; set; }
		public string imdb_id { get; set; }
		public string categories { get; set; }
		public string posterUrl { get; set; }
		public ProjectType type { get; set; }
		public ProjectSource source { get; set; }
		public ClickPageType pageType { get; set; }

		public List<Actor> actors { get; set; }
		public List<Director> directors { get; set; }

        public Project()
		{
		}
	}
}

