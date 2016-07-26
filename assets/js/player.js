/**
 * 
 */

var songs = [];
var isDataLoaded = false;
var audio = null;
var mediaPath = 'assets/media';

var player = {
	song: null,
	duration: 0,
	timePassed: 0,
	playInterval: null,
	reset: function() {
		this.timePassed = 0;
		if (this.playInterval != null) {
			clearInterval(this.playInterval);
		}
		
		this.playInterval = null;
	}
}

function createSongTitle(song) {
	return song.artist + ' - ' + song.album + ' - ' + song.song;
}

function changeTitle(song){
	var el = document.querySelector('#title-container h3');
	el.innerHTML = createSongTitle(song);
}

function changeImage(song) {
	var img = document.querySelector('#image-container img')
	img.src = mediaPath + '/' + song.image;
}

function handleProgress() {
	player.playInterval = setInterval(function() {
		onProgress();
		onTimeProgress();
	}, 1000)
}

function onProgress() {
	var indicator = document.querySelector('#seekbar-inner');
	player.timePassed++;
	var percent = Math.round(player.timePassed / (player.duration / 100));
	indicator.style.width = percent + '%'; 
}

function onTimeProgress() {
	var html = formatSeconds(player.timePassed);
	document.getElementById('time-passed').innerHTML = html;
}

function handleTime(duration) {
	var startTimeEl = document.querySelector('#time-passed'); 
	var endTimeEl = document.querySelector('#total-time');
	
	startTimeEl.innerHTML = '00:00';
	endTimeEl.innerHTML = formatSeconds(duration);
}

function formatSeconds(seconds) {
	var minutes = Math.floor(seconds / 60);
	var seconds = Math.round(seconds % 60);
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	return (minutes + ':' + seconds);
}


function playSong(song) {
	audio.src = mediaPath + '/' + song.path;
}
function loadData() {
	Ajax.request('GET', 'ajax.php', true, function(response) {
		songs = JSON.parse(response);
		isDataLoaded = true;
		createPlaylist();
	});
}

function createPlaylist() {
	var container = document.querySelector('#playlist ul');
	for (var i = 0; i < songs.length; i++) {
		var li = document.createElement('li')
		var titleSpan = document.createElement('span');
		var buttonSpan = document.createElement('span');
		buttonSpan.className = 'fa fa-play play-pause';
		var song = songs[i];
		titleSpan.innerHTML = (i + 1) + '. ' + createSongTitle(song)
		
		li.appendChild(titleSpan);
		li.appendChild(buttonSpan);
		
		li.setAttribute('data-index', i);
		
		container.appendChild(li)
	}
}

document.addEventListener('DOMContentLoaded', function(){
	audio = document.getElementById('audio');
	audio.oncanplay  = function() {
		audio.play();
		handleTime(audio.duration);
		player.duration = audio.duration;
		player.reset();
		handleProgress();
		
	}
	
	audio.onended = function() {
		player.reset();
	}
	loadData();
	var container = document.querySelector('#playlist ul');
	container.addEventListener('click', function(e) {
		var target = e.target;
		
		if (target.tagName.toLowerCase() != 'span' || 
			target.className.indexOf('play-pause') == -1) {
			return;
		}
		
		/**
		 * 
		 * 2) reset seek bar if playig new song
		 * 3) fix the time
		 * 4) fix buttons
		 * done:
		 * 1) change the title
		 * 5) play the track
		 * 6) change the image
		 */
		var songIndex = parseInt(target.parentElement.getAttribute('data-index'));
		var song = songs[songIndex];
		
		changeTitle(song);
		changeImage(song);
		playSong(song);
		player.song = song;
		
	}, false);
	
	var seekbar = document.getElementById('seekbar-outer');
	seekbar.addEventListener('click', function(e) {
		var length = seekbar.offsetWidth;
		var clickX = e.offsetX;
		
		var percent = clickX / (length / 100);
		var seconds = (player.duration / 100) * percent;
		
		player.timePassed = seconds;
		audio.currentTime = seconds;
		
		console.log(seconds);
	}, false)
	
}, false);