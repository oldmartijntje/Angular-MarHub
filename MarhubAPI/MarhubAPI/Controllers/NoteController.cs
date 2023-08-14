using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MarhubAPI.Models;
using MarhubAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace MarhubAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly DataContext _context;

        public NoteController(DataContext context)
        {
            _context = context;
        } 

        [HttpGet]
        public async Task<ActionResult<List<Note>>> GetAllNotes()
        {
            return Ok(await _context.Notes.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<Note>> AddNote(Note note)
        {
            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return Ok(note);
        }

        [HttpPut]
        public async Task<ActionResult<Note>> UpdateNote(Note note)
        {
            var dbNote =await _context.Notes.FindAsync(note.Id);
            if (dbNote == null)
                return BadRequest("Note not found.");

            dbNote.UserId = note.UserId;
            dbNote.NoteText = note.NoteText;
            dbNote.ElementId = note.ElementId;
            dbNote.ElementType = note.ElementType;

            await _context.SaveChangesAsync();

            return Ok(note);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteNote(int id)
        {
            var dbNote = await _context.Notes.FindAsync(id);
            if (dbNote == null)
                return BadRequest("Note not found.");

            _context.Notes.Remove(dbNote);
            await _context.SaveChangesAsync();
            return Ok("Deleted");
        }
    }
}
