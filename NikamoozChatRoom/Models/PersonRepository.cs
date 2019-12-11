using System.Collections.Generic;
using System.Linq;

namespace NikamoozChatRoom.Models
{
    public class PersonRepository : IPersonRepository
    {
        List<Person> people = new List<Person>();
        public void Add(Person person)
        {
            people.Add(person);
        }

        public List<Person> GetAll()
        {
            // return people;
            var tempPeople = new List<Person>();
            tempPeople.Add(new Person("group", "گروه عمومی"));
            tempPeople.AddRange(people);
            return tempPeople;
        }

        public Person GetByClientId(string clientId)
        {
            return people.FirstOrDefault(x => x.ClientId == clientId);
        }

        public void RemovePerson(string clientId)
        {
            var personForRemove = GetByClientId(clientId);
            if (personForRemove != null)
            {
                people.Remove(personForRemove);
            }
        }
    }
}
