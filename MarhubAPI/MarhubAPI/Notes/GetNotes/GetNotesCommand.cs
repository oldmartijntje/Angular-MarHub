using MarhubAPI.Models;
using MediatR;

namespace MarhubAPI.Notes.AddNote
{
    public class GetNotesCommand : IRequest<NoteResult>
    {
    }

}
