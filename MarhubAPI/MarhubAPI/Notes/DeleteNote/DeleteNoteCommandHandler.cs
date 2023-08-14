using MarhubAPI.Data;
using MarhubAPI.Models;
using MediatR;

namespace MarhubAPI.Notes.AddNote
{
    public class DeleteNoteCommandHandler : IRequestHandler<DeleteNoteCommand, NoteResult>
    {
        private readonly DataContext _context;

        public DeleteNoteCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<NoteResult> Handle(DeleteNoteCommand request, CancellationToken cancellationToken)
        {
            var noteId = request.Id;

            var dbNote = await _context.Notes.FindAsync(noteId);
            if (dbNote == null)
                return new NoteResult(false, "Not Found");

            _context.Notes.Remove(dbNote);
            await _context.SaveChangesAsync();
            return new NoteResult(true, "Ok");
        }
    }

}
