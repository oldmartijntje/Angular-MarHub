using MarhubAPI.Models;

namespace MarhubAPI.Notes
{
    public class NoteResult
    {
        public bool Success { get; }
        public string Message { get; }
        public object Data { get; }

        public NoteResult(bool success, string message, object data = null)
        {
            Success = success;
            Message = message;
            Data = data;
        }
    }

}
