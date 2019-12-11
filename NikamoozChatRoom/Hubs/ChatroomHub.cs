using Microsoft.AspNetCore.SignalR;
using NikamoozChatRoom.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NikamoozChatRoom.Hubs
{
    public class ChatroomHub : Hub
    {
        private readonly IPersonRepository personRepository;

        public ChatroomHub(IPersonRepository personRepository)
        {
            this.personRepository = personRepository;
        }
        public override Task OnConnectedAsync()
        {
            Groups.AddToGroupAsync(Context.ConnectionId, "Test");
            return base.OnConnectedAsync();
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            Person person = personRepository.GetByClientId(Context.ConnectionId);
            if (person != null)
            {
               await SendMessage(person.FullName, "از گروه خارج شد.");
                personRepository.RemovePerson(Context.ConnectionId);
            }
            await SendClientList(personRepository.GetAll());
            await base.OnDisconnectedAsync(exception);
        }

        public async Task StartMessage(string user)
        {
            personRepository.Add(new Person(Context.ConnectionId, user));
            await SendClientList(personRepository.GetAll());
            DateTime dateTime = DateTime.Now;
            await Clients.All.SendAsync("JoinedRoom", user);
        }

        public async Task SendMessage(string user, string message)
        {
            DateTime dateTime = DateTime.Now;
            await Clients.Caller.SendAsync("ReceiveMessage", user, Context.ConnectionId, "من", message);
            await Clients.Others.SendAsync("ReceiveMessage", user, Context.ConnectionId, user, message);
        }

        public async Task SendPrivateMessage(string userName, string sendToUserId, string sendToUserName, string message)
        {
            DateTime dateTime = DateTime.Now;
            await Clients.Caller.SendAsync("ReceiveMessage", userName, Context.ConnectionId, "من" + " " + "[پیام خصوصی]" + " به " + sendToUserName, message);
            await Clients.Client(sendToUserId).SendAsync("ReceiveMessage", userName, Context.ConnectionId, userName + " " + "[پیام خصوصی]", message);
        }


        public async Task SendClientList(List<Person> people)
        {
            DateTime dateTime = DateTime.Now;
            await Clients.All.SendAsync("ReceiveClientList", people);
        }

    }
}
