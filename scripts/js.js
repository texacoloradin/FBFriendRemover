/*
	Scripts behind the facebook friend analyzer and remover. 
	Created by Rick Sullivan and Parker Hegstrom.
*/

/* Information about the current user. */
var USER_ID;
var FIRST_NAME;
var LAST_NAME;

var friends;

function getFriends(id, accessToken) {
	/* GET request at me/friends endpoint. 

		SUCCESS: displayFriends(msg);
	*/
};

function addFriends(friendList) {
	var friend;

	for(var i = 0; i < friendList.length; i++) {
		friend = friendList[i];
		friends.addFriend(new Friend(friend.id, friend.name, friend.picture.data.url, 0));
	}

	displayFriends();
};

function displayFriends() {
	friends.list.sort(function(friend1, friend2) {return friend1.occurrences < friend2.occurrences;});

	var friendHtml = '';
	var friend;

	for(var i = 0; i < friends.list.length; i++) {
		friend = friends.list[i];
		friendHtml += '<p>' + friend.name + ' : ' + friend.id 
			+ ' <img src="' + friend.picture + '">' + '	occurences: ' + friend.occurences.toString() + '</p>';
	}

	var friendDiv = document.getElementById('friendListDiv');
	friendDiv.innerHTML = friendHtml;
};

/* Extracts the number of occurences of each friend id and populates friends array. */
function processFeedData(feed) {
	var post;

	function addIdsFromArray(array) {
		if (array != null && array.data != null) {
			for (var k = 0; k < array.data.length; k++) {
				if (array.data[k].id != USER_ID)
					friends.addOccurrence(array.data[k].id);
			}
		}
	};

	for(var j = 0; j < feed.length; j++) {
		post = feed[j];

		if (post.from != null && post.from.id != USER_ID) {
			friends.addOccurrence(post.from.id);
		}

		/* Handle data that are returned as arrays. */
		addIdsFromArray(post.to);
		addIdsFromArray(post.likes);
		addIdsFromArray(post.story_tags);
		addIdsFromArray(post.message_tags);

		/* We need the id from the 'from' object of comments, so do that manually. */
		if (post.comments != null) {
			for (var k = 0; k < post.comments.data.length; k++) {
				if (post.comments.data[k].from.id != USER_ID)
					friends.addOccurrence(post.comments.data[k].from.id);
			}
		}
	}

	return displayFriends();
};

function Friends() {
	this.list = [];

	this.addFriend = function(friend) {
		this.list.push(friend);
	};

	this.addOccurrence = function(friendId) {
		var index = this.indexOf(friendId);
		if (index != null) {
			this.list[index].occurrences += 1;
		}
	};

	/*
	this.containsId = function(friendId) {
    	return (this.list.indexOf(friendId) != null);
	};

	this.getFriendById = function(friendId) {
	    for (var i = 0; i < this.length; i++) {
	      if (this.list[i].id == friendId) 
	      	return this.list[i];
	    }
		return null;
	};
	*/

	this.indexOf = function(friendId) {
	    for (var i = 0; i < this.list.length; i++) {
	      if (this.list[i].id == friendId) 
	      	return i;
	    }
		return null;
	};
};

function Friend(id, name, picture, occurrences) {
	this.id = id;
	this.name = name;
	this.picture = picture;
	this.occurrences = occurrences;
};
