using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tikamp.Database.Repositories;

namespace Tikamp.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class PingController(TikampRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Ping(CancellationToken cancellationToken)
    {
        var users = await repo.Users.ToListAsync(cancellationToken: cancellationToken);
        return Ok(users);
    }

    [HttpGet]
    [Route("auth")]
    [Authorize]
    public IActionResult PingAuth()
    {
        return Ok("pong");
    }
}