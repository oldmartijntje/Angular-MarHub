using MarhubAPI.Data;
using MarhubAPI.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MarhubAPI.Notes.AddNote
{
    public class EditNoteCommandHandler : IRequestHandler<EditNoteCommand, NoteResult>
    {
        private readonly DataContext _context;

        public EditNoteCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<NoteResult> Handle(EditNoteCommand request, CancellationToken cancellationToken)
        {

            var note = request.Note;
            var dbNote = await _context.Notes.FindAsync(note.Id);
            if (dbNote == null)
                // Handle the scenario where the note is not found
                // You might want to throw an exception or return some other response here
                // For example:
                return new NoteResult(false, "Note Not Found.");

            dbNote.UserId = note.UserId;
            dbNote.NoteText = note.NoteText;
            dbNote.ElementId = note.ElementId;
            dbNote.ElementType = note.ElementType;

            await _context.SaveChangesAsync();

            return new NoteResult(false, "Ok", dbNote);
        }
    }

}
