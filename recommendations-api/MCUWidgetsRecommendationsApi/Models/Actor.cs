using System;
using MCUWidgetsRecommendationsApi.Models.Enums;

namespace MCUWidgetsRecommendationsApi.Models
{
	public class Actor
	{
		public int id { get; set; }
		public string firstName { get; set; }
		public string lastName { get; set; }
		public DateTime dateOfBirth { get; set; }
		public string imageUrl { get; set; }
		public string character { get; set; }
		public ClickPageType pageTypee { get; set; }

		public List<Project> projects { get; set; }

		public Actor()
		{
		}
	}
}

