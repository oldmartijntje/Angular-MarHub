namespace MarhubAPI.Models
{
    public class Note
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string NoteText { get; set; } = string.Empty;
        public string ElementType { get; set; } = string.Empty;
        public string ElementId { get; set; } = string.Empty;
    }
}
