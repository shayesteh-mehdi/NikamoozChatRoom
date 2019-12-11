using System.Collections.Generic;

namespace NikamoozChatRoom.Models
{
    public interface IPersonRepository
    {
        Person GetByClientId(string clientId);
        void Add(Person person);
        List<Person> GetAll();
        void RemovePerson(string clientId);
    }
}
