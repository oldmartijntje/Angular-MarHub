using MarhubAPI.Models;
using MediatR;

namespace MarhubAPI.Notes.AddNote
{
    public class AddNoteCommand : IRequest<NoteResult>
    {
        public Note Note { get; set; }
    }

}
