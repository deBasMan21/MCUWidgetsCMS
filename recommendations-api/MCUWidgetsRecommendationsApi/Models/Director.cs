using System;
using MCUWidgetsRecommendationsApi.Models.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MCUWidgetsRecommendationsApi.Models
{
	public class Director
	{
		public string uniqueId { get; set; }
		public int id { get; set; }
		public string firstName { get; set; }
		public string lastName { get; set; }
		public DateTime dateOfBirth { get; set; }
		public string imageUrl { get; set; }
		public ClickPageType pageType { get; set; }
		public List<Project> projects { get; set; }

		public Director()
		{
		}
	}
}

