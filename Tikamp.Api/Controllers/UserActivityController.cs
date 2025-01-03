using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Tikamp.Api.Services;
using Tikamp.Dto;
using Tikamp.Utilities;

namespace Tikamp.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UserActivityController(UserActivityService service, ValidationService validator) : ControllerBase
{
    [HttpGet("{month}")]
    [SwaggerResponse((int)HttpStatusCode.OK, "Ok", typeof(MonthlyUserActivityDto))]
    [SwaggerResponse((int)HttpStatusCode.NoContent, "noContent")]
    public async Task<ActionResult<MonthlyUserActivityDto?>> GetActivityForMonth(
        [FromRoute] int month,
        CancellationToken cancellationToken)
    {
        var result = await service.GetActivityByMonth(month, User, null, cancellationToken);
        return result is not null ? Ok(result) : NoContent();
    }

    [HttpPut]
    [SwaggerResponse((int)HttpStatusCode.NoContent, "Ok")]
    [SwaggerResponse((int)HttpStatusCode.UnprocessableEntity, "Entity does not pass validation")]
    public async Task<IActionResult> RegisterActivity(
        [FromBody] PutUserActivityDto dto,
        CancellationToken cancellationToken)
    {
        await validator.Validate(dto, cancellationToken);
        await service.RegisterActivity(dto, User, cancellationToken);
        return NoContent();
    }
}