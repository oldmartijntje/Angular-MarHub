using MarhubAPI.Models;
using MediatR;

namespace MarhubAPI.Notes.AddNote
{
    public class DeleteNoteCommand : IRequest<NoteResult>
    {
        public int Id { get; set; }
    }

}
