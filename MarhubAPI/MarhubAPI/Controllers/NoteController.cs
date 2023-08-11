using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MarhubAPI.Models;

namespace MarhubAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Note>>> GetAllNotes()
        {
            var notes = new List<Note> { 
                new Note { 
                    Id = 0, 
                    ElementType = "TrackElement", 
                    ElementId = "7kaux342y0B446JgJgojAi", 
                    NoteText = "OwO, waz diz?",
                    UserId = "7uatf47gcofdupwdxammpxliw"
                } 
            };
            return Ok(notes);
        }
    }
}
