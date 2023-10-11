using MarhubAPI.Data;
using MarhubAPI.Models;
using MediatR;

namespace MarhubAPI.Notes.AddNote
{
    public class AddNoteCommandHandler : IRequestHandler<AddNoteCommand, NoteResult>
    {
        private readonly DataContext _context;

        public AddNoteCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<NoteResult> Handle(AddNoteCommand request, CancellationToken cancellationToken)
        {
            var note = request.Note;
            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            return new NoteResult(true, "Ok", note);
        }
    }

}
