// ==========================================
// 1. 요소 선언부
// ==========================================
const menuButtons = document.querySelectorAll(".menu-btn");
const contentViews = document.querySelectorAll(".content-view");

// 편지 관련 요소
const pixelEnvelope = document.getElementById("pixel-envelope");
const pixelLetterContent = document.getElementById("pixel-letter-content");

// 카메라 관련 요소
const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("capture-canvas");
const btnShoot = document.getElementById("btn-shoot");
const photoPrinter = document.getElementById("photo-printer");
let localStream = null;

// 생일 축하 BGM 관련 요소
const hbdBgm = document.getElementById("hbd-bgm");
const btnMusic = document.getElementById("btn-music");


// ==========================================
// 2. 상단 메뉴 버튼 탭 전환 기능
// ==========================================
menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // 모든 버튼 비활성화 및 클릭된 버튼 활성화
        menuButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // 모든 콘텐츠 화면 숨기기
        contentViews.forEach((view) => view.classList.remove("active"));

        // 클릭한 버튼의 target 화면 표시
        const targetId = button.getAttribute("data-target");
        const targetView = document.getElementById(`content-${targetId}`);
        
        if (targetView) {
            targetView.classList.add("active");
            
            // LETTER 탭으로 돌아왔을 때 편지 봉투 초기 상태(봉투 보이기, 편지 숨기기)로 셋팅
            if (targetId === "letter") {
                if (pixelEnvelope) pixelEnvelope.style.display = "flex";
                if (pixelLetterContent) pixelLetterContent.classList.remove("open");
            }
        }

        // CAMERA 탭 전환에 따른 카메라 On/Off 제어
        if (targetId === "camera") {
            startCamera();
        } else {
            stopCamera();
        }

        // HBD 탭에 들어오거나, 다른 탭으로 나갈 때 음악 강제 정지 및 초기화 (수동 재생 대기)
        if (hbdBgm && btnMusic) {
            hbdBgm.pause();
            hbdBgm.currentTime = 0;
            btnMusic.textContent = "🎵 PLAY MUSIC";
            btnMusic.classList.remove("playing");
        }
    });
});


// ==========================================
// 3. 편지 봉투 클릭 시 열리는 기능
// ==========================================
if (pixelEnvelope && pixelLetterContent) {
    pixelEnvelope.addEventListener("click", () => {
        // 편지 봉투 숨기기
        pixelEnvelope.style.display = "none";
        // 편지 내용 서서히 등장
        pixelLetterContent.classList.add("open");
    });
}


// ==========================================
// 4. 카메라 및 촬영 기능 제어
// ==========================================
async function startCamera() {
    if (!webcamElement) return;
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: "user" },
            audio: false
        });
        webcamElement.srcObject = localStream;
    } catch (error) {
        console.error("카메라를 실행할 수 없습니다:", error);
        if (photoPrinter) {
            photoPrinter.innerHTML = `<p style="color:red; font-weight:bold;">⚠️ 카메라 권한 승인이 필요합니다!</p>`;
        }
    }
}

function stopCamera() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
}

// 사진 촬영 이벤트
if (btnShoot && webcamElement && canvasElement && photoPrinter) {
    btnShoot.addEventListener("click", () => {
        if (!localStream) return;

        // 찰칵 플래시 시각 효과
        webcamElement.style.opacity = "0.3";
        setTimeout(() => { webcamElement.style.opacity = "1"; }, 100);

        const context = canvasElement.getContext("2d");
        canvasElement.width = webcamElement.videoWidth;
        canvasElement.height = webcamElement.videoHeight;
        
        // 캔버스에 비디오 프레임 복사
        context.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);
        
        // 이미지 데이터 추출
        const imageDataUrl = canvasElement.toDataURL("image/png");

        // 즉석 폴라로이드 사진 인화 영역에 추가
        photoPrinter.innerHTML = `
            <div class="printed-polaroid">
                <img src="${imageDataUrl}" alt="촬영된 즉석 사진">
                <div class="caption">MEMORY IN 2026 💙</div>
            </div>
        `;
    });
}


// ==========================================
// 5. 음악 수동 재생/정지 토글 버튼 기능
// ==========================================
if (btnMusic && hbdBgm) {
    btnMusic.addEventListener("click", () => {
        if (hbdBgm.paused) {
            hbdBgm.play();
            btnMusic.textContent = "⏸️ STOP MUSIC";
            btnMusic.classList.add("playing");
        } else {
            hbdBgm.pause();
            btnMusic.textContent = "🎵 PLAY MUSIC";
            btnMusic.classList.remove("playing");
        }
    });
}