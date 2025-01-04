using Microsoft.EntityFrameworkCore;
using Tikamp.Api.Mapping;
using Tikamp.Database.Models;
using Tikamp.Database.Repositories;
using Tikamp.Dto;

namespace Tikamp.Api.Services;

public class ActivitiesServices(TikampRepository repository)
{
    public async Task<List<ActivityDto>> GetActivitiesAsync(CancellationToken cancellationToken)
    {
        var activities = await repository.Activities.ToListAsync(cancellationToken);
        return activities.ToDto();
    }

    public async Task<ActivityDto?> GetActivityAsync(int month, CancellationToken cancellationToken)
    {
        var activity = await repository.Activities.FirstOrDefaultAsync(a => a.Month == month, cancellationToken);
        return activity?.ToDto();
    }

    public async Task PutActivityAsync(int month, PutActivityDto putActivityDto, CancellationToken cancellationToken)
    {
        var activity = await repository.Activities.Where(a => a.Month == month).FirstOrDefaultAsync(cancellationToken);
        if (activity is null)
        {
            var newActivity = putActivityDto.ToModel(month);
            await repository.Activities.AddAsync(newActivity, cancellationToken);
        }
        else
        {
            PatchActivity(activity, putActivityDto);
        }

        await repository.Save(cancellationToken);
    }

    private static void PatchActivity(Activity existingActivity, PutActivityDto updatedActivity)
    {
        existingActivity.Name = updatedActivity.Name;
        existingActivity.Level1 = updatedActivity.Level1;
        existingActivity.Level2 = updatedActivity.Level2;
        existingActivity.Level3 = updatedActivity.Level3;
        existingActivity.Description = updatedActivity.Description;
    }
}