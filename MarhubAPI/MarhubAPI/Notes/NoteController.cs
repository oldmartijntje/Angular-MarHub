using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MarhubAPI.Models;
using MarhubAPI.Data;
using Microsoft.EntityFrameworkCore;
using MediatR;
using MarhubAPI.Notes.AddNote;

namespace MarhubAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly IMediator _mediator;

        public NoteController(IMediator mediator)
        {
            _mediator = mediator;
        } 

        [HttpGet]
        public async Task<ActionResult<List<Note>>> GetAllNotes()
        {
            var query = new GetNotesCommand(); 
            var result = await _mediator.Send(query);
            if (result.Success == true)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<Note>> AddNote(Note note)
        {
            var command = new AddNoteCommand { Note = note };
            var result = await _mediator.Send(command);
            if (result.Success == true)
            {
                return Ok(result.Data);
            }
            else
            {
                return BadRequest(result.Message);
            }
        }

        [HttpPut]
        public async Task<ActionResult<Note>> UpdateNote(Note note)
        {
            var query = new EditNoteCommand { Note = note };
            var result = await _mediator.Send(query);
            if (result.Success == true)
            {
                return Ok(result.Data);
            } else
            {
                return BadRequest(result.Message);
            }

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteNote(int id)
        {
            var query = new DeleteNoteCommand() { Id = id }; 
            var result = await _mediator.Send(query);
            if (result.Success == true)
            {
                return Ok(result.Message);
            }
            else
            {
                return BadRequest(result.Message);
            }
        }
    }
}
