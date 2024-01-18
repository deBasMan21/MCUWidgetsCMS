using System;
using MCUWidgetsRecommendationsApi.Models;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Interfaces
{
    public interface IDirectorRepository
    {
        public Task Create(Director director);
        public Task Update(Director director);
        public Task Delete(int directorId);
        public bool Exists(int directorId);
    }
}

