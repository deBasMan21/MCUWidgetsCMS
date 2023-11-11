using System;
using MCUWidgetsRecommendationsApi.Models.Enums;

namespace MCUWidgetsRecommendationsApi.Models
{
	public class Project
	{
		public int id { get; set; }
		public string title { get; set; }
		public DateTime releaseDate { get; set; }
		public string overview { get; set; }
		public string imdb_id { get; set; }
		public string categories { get; set; }
		public string posterUrl { get; set; }
		public ProjectType type { get; set; }
		public ProjectSource source { get; set; }
		public ClickPageType pageTypee { get; set; }

		public List<Actor> actors { get; set; }
		public List<Director> directors { get; set; }
		public List<Project> relatedProjects { get; set; }

        public Project()
		{
		}
	}
}

