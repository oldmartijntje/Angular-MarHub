using MarhubAPI.Data;
using MarhubAPI.Models;
using MarhubAPI.Notes.AddNote;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace MarhubAPI.Notes.GetNotes
{
    public class GetNotesCommandHandler : IRequestHandler<GetNotesCommand, NoteResult>
    {
        private readonly DataContext _context;

        public GetNotesCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<NoteResult> Handle(GetNotesCommand request, CancellationToken cancellationToken)
        {

            return new NoteResult(true, "Ok", await _context.Notes.ToListAsync());
        }
    }

}
