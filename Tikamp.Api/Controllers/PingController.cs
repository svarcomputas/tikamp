using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Tikamp.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class PingController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Ping()
    {
        return Ok("pong");
    }

    [HttpGet]
    [Route("auth")]
    [Authorize]
    public IActionResult PingAuth()
    {
        return Ok("pong");
    }
}