import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClickEntity } from './tracking/click.entity/click.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { ProjectEntity } from './project/project.entity/project.entity';
import { ActorEntity } from './actor/actor.entity/actor.entity';
import { DirectorEntity, Identifiable } from './director/director.entity/director.entity';

@Injectable()
export class RecommendationsService {
    constructor(
        @InjectRepository(ClickEntity) 
        private clickRepository: Repository<ClickEntity>,
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>
    ) { }

    async getRecommendations(userId: string): Promise<(ProjectEntity | ActorEntity | DirectorEntity)[]> {
        // Get last 50 clicks of user, include relations
        let result = await this.clickRepository.find({
            relations: {
                project: {
                    relatedProjects: true,
                    actors: true,
                    directors: true
                },
                actor: {
                    projects: true
                },
                director: {
                    projects: true
                }
            },
            where: {
                userId: userId,
            },
            take: 50
        })

        if (result.length < 10) { return this.getRandomProjects() } 

        // Group by, count and sort clicks
        let sortedResult = this.groupBy(result)

        // Map to the item wrappedValues
        let response: (ProjectEntity | ActorEntity | DirectorEntity)[] = sortedResult.flatMap((item: { product: ClickEntity, amount: number }) => {
            if (item.product.actor != null) {
                return item.product.actor
            } else if (item.product.director != null) {
                return item.product.director
            } else if (item.product.project != null) {
                return item.product.project
            } else {
                return null
            }
        })

        // Add recommended items to lists
        let recommendedProjects: ProjectEntity[] = []
        let recommendedActors: ActorEntity[] = []
        let recommendedDirectors: DirectorEntity[] = []
        response.forEach((item) => {
            if (item as ProjectEntity) {
                recommendedActors = recommendedActors.concat((item as ProjectEntity).actors)
                recommendedDirectors = recommendedDirectors.concat((item as ProjectEntity).directors)
                recommendedProjects = recommendedProjects.concat((item as ProjectEntity).relatedProjects)
            } else if (item as ActorEntity) {
                recommendedProjects = recommendedProjects.concat((item as ActorEntity).projects)
            } else if (item as DirectorEntity) {
                recommendedProjects = recommendedProjects.concat((item as DirectorEntity).projects)
            }
        })

        // Deduplicate items
        recommendedProjects = this.deDuplicateArray(recommendedProjects)
        recommendedActors = this.deDuplicateArray(recommendedActors)
        recommendedDirectors = this.deDuplicateArray(recommendedDirectors)

        // Concat all lists with recommendations and get the first 10
        return [].concat(recommendedDirectors, recommendedActors, recommendedProjects).slice(0, 10)
    }

    private deDuplicateArray<T extends Identifiable>(array: T[]) {
        return Array.from(new Set(array.map(a => a.id)))
            .map(id => {
                return array.find(a => a.id === id)
            })
    }

    private groupBy(clicks: ClickEntity[]) {
        // Group by the pageType and pageId
        // Also keep track of the amount in here
        let groupedClicks = clicks.reduce((group, product: ClickEntity) => {
            let groupName = `${product.pageType}-${product.pageId}`
            group[groupName] = group[groupName] ?? { product, count: 0 };
            group[groupName].count += 1
            return group;
        }, {});

        // Map properties to array
        let clicksArray = Object.entries(groupedClicks).map(( [k, v] ) => v)

        // Sort by amount of clicks from high to low
        clicksArray.sort((a: { product: ClickEntity, count: number }, b: { product: ClickEntity, count: number }) => a.count < b.count ? 1 : -1)

        return clicksArray
    }

    private getRandomProjects(): (ProjectEntity | ActorEntity | DirectorEntity)[]  {
        return []
    }
}
