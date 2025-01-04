using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Tikamp.Api.Services;
using Tikamp.Dto;
using Tikamp.Utilities;
using Tikamp.Utilities.Authentication;

namespace Tikamp.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ActivitiesController(ActivitiesServices services, ValidationService validator) : ControllerBase
{
    [HttpGet]
    [SwaggerResponse((int)HttpStatusCode.OK, "Ok", typeof(List<ActivityDto>))]
    public async Task<ActionResult<List<ActivityDto>>> GetActivity(CancellationToken cancellationToken)
    {
        var activities = await services.GetActivitiesAsync(cancellationToken);
        return Ok(activities);
    }

    [HttpPut("{month}")]
    [RolesAuthorize(AuthRoles.Admin)]
    [SwaggerResponse((int)HttpStatusCode.NoContent, "Ok")]
    [SwaggerResponse((int)HttpStatusCode.UnprocessableEntity, "Entity does not pass validation")]
    public async Task<IActionResult> UpdateActivity(
        [FromRoute] int month,
        [FromBody] PutActivityDto dto,
        CancellationToken cancellationToken)
    {
        await validator.Validate(dto, cancellationToken);
        await services.PutActivityAsync(month, dto, cancellationToken);
        return NoContent();
    }
}