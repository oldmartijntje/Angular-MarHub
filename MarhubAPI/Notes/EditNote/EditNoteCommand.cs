using MarhubAPI.Models;
using MediatR;

namespace MarhubAPI.Notes.AddNote
{
    public class EditNoteCommand : IRequest<NoteResult>
    {
        public Note Note { get; set; }
    }

}
