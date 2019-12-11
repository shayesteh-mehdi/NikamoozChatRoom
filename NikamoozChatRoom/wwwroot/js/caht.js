"use strict";
let currentUser = "";
let SendToClientId = "group"
let SendToClientName = ""
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveClientList", function (people) {

	document.getElementById("ClientsList").innerHTML = "";
	for (var key in people) {

		if (people.hasOwnProperty(key)) {
			var full_name = people[key].fullName;
			var client_id = people[key].clientId;

			var link = document.createElement("a");
			link.classList.add("text-dark");
			link.textContent = full_name;

			link.setAttribute('id', 'aaa_' + client_id);
			link.setAttribute('data-client_id', client_id);
			link.setAttribute('data-full_name', full_name);
			link.setAttribute('href', '#');

			var spanBadge = document.createElement('span');
			spanBadge.classList.add('badge');
			if (client_id === 'group') {
				spanBadge.classList.add('badge-primary');
				spanBadge.classList.add('badge-pill');
				spanBadge.textContent = 'o';
			} else {
				spanBadge.classList.add('badge-success');
				spanBadge.classList.add('badge-pill');
				spanBadge.textContent = '*';
			}




			var li = document.createElement("li");
			li.appendChild(link);
			li.classList.add("list-group-item");
			li.classList.add("list-group-item-action");

			li.appendChild(spanBadge);
			li.addEventListener('click', clientClicked);
			document.getElementById("ClientsList").appendChild(li);
		}


	}



}
);

function clientClicked(e) {
	e = e || window.event;
	e = e.target || e.srcElement;
	var tag_id = e.id;

	var elmt = document.getElementById(tag_id);
	SendToClientId = elmt.getAttribute('data-client_id');
	var full_name = elmt.getAttribute('data-full_name');
	SendToClientName = full_name;

	var brandElmnt = document.getElementById('SendTo');
	brandElmnt.innerHTML = 'پیام به ' + '<strong>' + full_name + '</strong>' + ' : ';
	document.getElementById("messageInput").focus();
}

connection.on("ReceiveMessage", function (user, userId, Title, message) {
	var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	var msgSpan = document.createElement("span");
	msgSpan.classList.add("text-dark");
	msgSpan.textContent = msg;


	var userLink = document.createElement("a");
	userLink.textContent = Title;
	userLink.classList.add("font-weight-bold");
	userLink.setAttribute('id', 'sss_' + userId);
	userLink.setAttribute('data-client_id', userId);
	userLink.setAttribute('data-full_name', user);
	userLink.addEventListener('click', clientClicked);
	userLink.setAttribute('href', '#');


	var colonSpan = document.createElement("span");
	colonSpan.textContent = " : ";
	userLink.classList.add("font-weight-bold");

	if (user === currentUser) {
		userLink.classList.add("text-primary");
		colonSpan.classList.add("text-primary");
	}
	else {
		userLink.classList.add("text-success");
		colonSpan.classList.add("text-success");
	}
	var li = document.createElement("li");


	li.appendChild(userLink);
	li.appendChild(colonSpan);
	li.appendChild(msgSpan);
	li.classList.add("list-group-item");
	li.setAttribute("tabindex", "1");

	var element = document.getElementById("messagesList")
	element.appendChild(li);
	element.focus();
	li.focus();
	document.getElementById("messageInput").focus();
});

connection.start().then(function () {
	document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
	return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", sendMessage );

document.getElementById("messageInput").addEventListener('keyup', function (event) {
	if (event.keyCode === 13) {
		sendMessage(event);
	}
})

	function sendMessage (event) {
		var message = document.getElementById("messageInput").value;
		document.getElementById("messageInput").value = "";

		if (SendToClientId === "group") {
			connection.invoke("SendMessage", currentUser, message).catch(function (err) {
				return console.error(err.toString());
			});
		} else {
			connection.invoke("SendPrivateMessage", currentUser, SendToClientId, SendToClientName, message).catch(function (err) {
				return console.error(err.toString());
			});

		}
		document.getElementById("messageInput").focus();

		event.preventDefault();
	}

document.getElementById("nameInput").addEventListener('keyup', function (event) {
	if (event.keyCode === 13) {
		StartButton(event);
	}
})

document.getElementById("startButton").addEventListener("click",StartButton );

function StartButton(event) {
	currentUser = document.getElementById("nameInput").value;
	document.getElementById("nameInput").value = "";
	document.getElementById("EnterchatRoom").style.display = "none";
	document.getElementById("chatRoom").style.display = "block";

	connection.invoke("StartMessage", currentUser).catch(function (err) {
		return console.error(err.toString());
	});
	document.getElementById("messageInput").focus();
	event.preventDefault();
}

connection.on("JoinedRoom", function (user) {
	var msg = "کاربر '" + user + "' به گروه پیوست";
	var msgSpan = document.createElement("span");
	msgSpan.classList.add("text-muted");
	msgSpan.textContent = msg;

	var li = document.createElement("li");
	li.appendChild(msgSpan);
	li.classList.add("list-group-item");
	document.getElementById("messagesList").appendChild(li);

	var brandElmnt = document.getElementById('brand');
	brandElmnt.textContent = currentUser;
});




connection.on("PrivacyViewed", function () {
	alert("یه نفر اومد تو قسمت Privacy");
});

document.getElementById("nameInput").focus();