/**
 * 1. Render songs => OK
 * 2. Scroll top => OK
 * 3. Play / pause / seek (tua) => OK
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
		
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');

// Đối tượng app
const app = {
	// property lưu mảng chứa những bài hát
	currentIndex: 0,
	isPlaying: false,
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
			path: "https://mp3.vlcmusic.com/download.php?track_id=34213&format=320",
			image: "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
		},
		{
			name: "Naachne Ka Shaunq",
			singer: "Raftaar x Brobha V",
			path: "https://mp3.filmysongs.in/download.php?id=Naachne Ka Shaunq Raftaar Ft Brodha V Mp3 Hindi Song Filmysongs.co.mp3",
			image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
		},
		{
			name: "Mantoiyat",
			singer: "Raftaar x Nawazuddin Siddiqui",
			path: "https://mp3.vlcmusic.com/download.php?track_id=14448&format=320",
			image: "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
		},
		{
			name: "Aage Chal",
			singer: "Raftaar",
			path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
			image: "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
		},
		{
			name: "Damn",
			singer: "Raftaar x kr$na",
			path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
			image: "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
		},
		{
			name: "Feeling You",
			singer: "Raftaar x Harjas",
			path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
			image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
		}
  	],
	// render ra view
	render: function() {
		const htmls = this.songs.map(song => {
			return `
				<div class="song">
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

		$('.playlist').innerHTML = htmls.join('');
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
		}

		// Khi song bị pause
		audio.onpause = function() {
			_this.isPlaying = false;
			player.classList.remove('playing');
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
	},
	loadCurrentSong: function() {
		heading.textContent = this.currentSong.name; // Sửa tên bài hát hiện tại		
		cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`; // Sửa ảnh		
		audio.src = this.currentSong.path; // Sửa url để update bài hát
	},
	start: function() {
		// Định nghĩa các thuộc tính cho object
		this.defineProperties();

		// Lắng nghe / Xử lý các sự kiện (DOM event)
		this.handleEvents();

		// Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
		this.loadCurrentSong();

		// Render playlist
		this.render();
	}
}

app.start();
