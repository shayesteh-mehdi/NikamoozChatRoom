namespace NikamoozChatRoom.Models
{
    public class Person
    {
        public Person(string clinetId, string fullName)
        {
            ClientId = clinetId;
            FullName = fullName;
        }

        public string ClientId { get; set; }
        public string FullName { get; set; }
    }
}
