/**
 * 1. Render songs => OK
 * 2. Scroll top => OK
 * 3. Play / pause / seek (tua) => OK
 * 4. CD rotate => OK
 * 5. Next / prev => OK
 * 6. Random => OK
 * 7. Next / Repeat when ended => OK
 * 8. Active song => OK
 * 9. Scroll active song into view => OK
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';
		
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

// Đối tượng app
const app = {
	// property lưu mảng chứa những bài hát
	currentIndex: 0,
	isPlaying: false,
	isRandom: false,
	isRepeat: false,
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
	songs: [
		{
			name: "Click Pow Get Down",
			singer: "Raftaar x Fortnite",
			path: "/assets/music/song1.mp3",
			image: "assets/img/song1.jpg"
		},
		{
			name: "Tu Phir Se Aana",
			singer: "Raftaar x Salim Merchant x Karma",
			path: "/assets/music/song2.mp3",
			image: "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
		},
		{
			name: "Naachne Ka Shaunq",
			singer: "Raftaar x Brobha V",
			path: "/assets/music/song3.mp3",
			image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
		},
		{
			name: "Mantoiyat",
			singer: "Raftaar x Nawazuddin Siddiqui",
			path: "/assets/music/song4.mp3",
			image: "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
		},
		{
			name: "Click Pow Get Down",
			singer: "Raftaar x Fortnite",
			path: "/assets/music/song1.mp3",
			image: "assets/img/song1.jpg"
		},
		{
			name: "Tu Phir Se Aana",
			singer: "Raftaar x Salim Merchant x Karma",
			path: "/assets/music/song2.mp3",
			image: "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
		},
		{
			name: "Naachne Ka Shaunq",
			singer: "Raftaar x Brobha V",
			path: "/assets/music/song3.mp3",
			image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
		},
		{
			name: "Mantoiyat",
			singer: "Raftaar x Nawazuddin Siddiqui",
			path: "/assets/music/song4.mp3",
			image: "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
		},
  	],
	setConfig: function(key, value) {
		this.config[key] = value;
		localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
	},
	// render ra view
	render: function() {
		const htmls = this.songs.map((song, index) => {
			return `
				<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
					<div class="thumb" style="background-image: url('${song.image}')"></div>
					<div class="body">
						<h3 class="title">${song.name}</h3>
						<p class="author">${song.singer}</p>
					</div>
					<div class="option">
						<i class="fas fa-ellipsis-h"></i>
					</div>
				</div>
			`
		});

		playlist.innerHTML = htmls.join('');
	},
	// định nghĩa thuộc tính cho object
	defineProperties: function() {
		// định nghĩa 1 getter
		Object.defineProperty(this, 'currentSong', {
			get: function() {
				return this.songs[this.currentIndex];
			}
		});	
	},
	// xử lý sự kiện
	handleEvents: function() {
		const _this = this;
		const cdWidth = cd.offsetWidth;

		// Xử lý CD quay / dừng
		const cdThumbAnimate = cdThumb.animate([
			{transform: 'rotate(360deg)'}
		], {
			duration: 10000, // 10 seconds
			iterations: Infinity 
		});
		cdThumbAnimate.pause();

		// Xử lý phóng to / thu nhỏ CD
		document.onscroll = function() {
			const ScrollTop = window.scrollY || document.documentElement.scrollTop;
			const newCdWidth = cdWidth - ScrollTop;
			cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
			cd.style.opacity = newCdWidth / cdWidth;
		};

		// Xử lý khi click play
		playBtn.onclick = function() {
			if (_this.isPlaying) {
				audio.pause();
			} else {
				audio.play();
			}
		};

		// Khi song được play
		audio.onplay = function() {
			_this.isPlaying = true;
			player.classList.add('playing');
			cdThumbAnimate.play();
		}

		// Khi song bị pause
		audio.onpause = function() {
			_this.isPlaying = false;
			player.classList.remove('playing');
			cdThumbAnimate.pause();
		};

		// Khi tiến độ bài hát thay đổi
		audio.ontimeupdate = function() {
			if (audio.duration) {
				const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
				progress.value = progressPercent;
			}
		};

		// Xử lý khi tua song
		progress.onchange = function(event) {
			const seekTime = audio.duration / 100 * event.target.value;
			audio.currentTime = seekTime;
		};

		// Khi next bài hát
		nextBtn.onclick = function() {
			if (_this.isRandom) {
				_this.playRandomSong();
			} else {
				_this.nextSong();
			}
			audio.play();
			_this.render();
			_this.scrollToActiveSong();
		};

		// Khi prev bài hát
		prevBtn.onclick = function() {
			if (_this.isRandom) {
				_this.playRandomSong();
			} else {
				_this.prevSong();
			}
			audio.play();	
			_this.render();		
			_this.scrollToActiveSong();	
		};

		// Xử lý bật / tắt random song
		randomBtn.onclick = function(event) {
			_this.isRandom = !_this.isRandom;
			_this.setConfig('isRandom', _this.isRandom);
			randomBtn.classList.toggle('active', _this.isRandom);
		};

		// Xử lý next song khi audio ended
		audio.onended = function() {
			if (_this.isRepeat) {
				audio.play();
			} else {
				nextBtn.click();
			}
		};

		// Xử lý lặp lại một song
		repeatBtn.onclick = function(event) {
			_this.isRepeat = !_this.isRepeat;
			_this.setConfig('isRepeat', _this.isRepeat);
			repeatBtn.classList.toggle('active', _this.isRepeat);
		};

		// Lắng nghe hành vi click vào playlist
		playlist.onclick = function(event) {
			const songNode = event.target.closest('.song:not(.active)');
			// event là sự kiện nhận được, target là đích đến khi click vào
			if (songNode || event.target.closest('.option') ) {
				// Xử lý khi click vào song
				if (songNode) {
					_this.currentIndex = Number(songNode.dataset.index);
					_this.loadCurrentSong();
					audio.play();
					_this.render();
				}

				// Xử lý khi click vào song option
				if (event.target.closest('.option')) {

				}
			}
		};
	},
	loadCurrentSong: function() {
		heading.textContent = this.currentSong.name; // Sửa tên bài hát hiện tại		
		cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`; // Sửa ảnh		
		audio.src = this.currentSong.path; // Sửa url để update bài hát
	},
	nextSong: function() {
		this.currentIndex++;
		if (this.currentIndex >= this.songs.length) {
			this.currentIndex = 0;
		}
		this.loadCurrentSong();
	},
	prevSong: function() {
		this.currentIndex--;
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length - 1;
		}
		this.loadCurrentSong();
	},
	playRandomSong: function() {
		let newIndex;
		do {
			newIndex = Math.floor(Math.random() * this.songs.length);
		} while(newIndex === this.currentIndex);
		this.currentIndex = newIndex;
		this.loadCurrentSong();
	},
	scrollToActiveSong: function() {
		setTimeout(() => {
			$('.song.active').scrollIntoView({
				behavior: 'smooth',
				block: "center",
				inline: "center"
			});
		}, 300);
	},
	loadConfig: function() {
		this.isRandom = this.config.isRandom;
		this.isRepeat = this.config.isRepeat;

		//Object.assign(this, this.config);
	},
	start: function() {
		// Gán cấu hình từ config vào ứng dụng
		this.loadConfig();
		// Định nghĩa các thuộc tính cho object
		this.defineProperties();

		// Lắng nghe / Xử lý các sự kiện (DOM event)
		this.handleEvents();

		// Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
		this.loadCurrentSong();

		// Render playlist
		this.render();

		// Hiển thị trạng thái ban đầu của btn repeat và random
		randomBtn.classList.toggle('active', this.isRandom);
		repeatBtn.classList.toggle('active', this.isRepeat);
	}
}

app.start();
