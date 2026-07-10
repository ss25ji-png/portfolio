    window.addEventListener('scroll', function() {
            const videoWrap = document.getElementById('video_wrap');
            const scrollPosition = window.scrollY; // 현재 스크롤된 높이
            const windowHeight = window.innerHeight; // 현재 브라우저 화면의 높이

            // 스크롤 위치에 따라 투명도 계산 (화면 높이만큼 내리면 완전히 사라짐)
            let newOpacity = 1 - (scrollPosition / windowHeight);

            // 투명도 범위가 0과 1 사이를 벗어나지 않도록 안전장치
            if (newOpacity < 0) newOpacity = 0;
            if (newOpacity > 1) newOpacity = 1;

            // 비디오 상자에 투명도 적용
            videoWrap.style.opacity = newOpacity;
        });
  
  
   const videoWrap = document.getElementById('video_wrap');
    const video = document.getElementById('main_video') || videoWrap.querySelector('video');
    const header = document.querySelector('header'); // 헤더 요소 가져오기

    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY; // 현재 스크롤된 높이
        const windowHeight = window.innerHeight; // 현재 브라우저 화면의 높이

        // 1. 비디오 투명도 조절 (기존 코드)
        let newOpacity = 1 - (scrollPosition / windowHeight);
        if (newOpacity < 0) newOpacity = 0;
        if (newOpacity > 1) newOpacity = 1;
        videoWrap.style.opacity = newOpacity;

        // 2. 비디오 구역을 벗어나면 소리 끄기 (기존 코드)
        if (scrollPosition >= windowHeight) {
            video.muted = true;
        }

        // 3. [추가] 스크롤 위치에 따라 헤더 스르륵 나타나게 하기
        // 첫 화면에서 절반 이상(0.5) 내려왔을 때부터 메뉴가 서서히 보이게 설정
        if (scrollPosition > windowHeight * 0.5) {
            header.classList.add('visible'); // CSS의 opacity: 1 활성화
        } else {
            header.classList.remove('visible'); // 다시 opacity: 0으로 숨김
        }
       
    });


    ///
    





/////////////브랜드
const track = document.getElementById('card-track');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// 
function getScrollAmount() {
    const card = track.querySelector('.card');
    if (!card) return 0;
    const cardWidth = card.getBoundingClientRect().width;
    return cardWidth + 20; //
}

// 
nextBtn.addEventListener('click', () => {
    track.scrollBy({
        left: getScrollAmount(),
        behavior: 'smooth'
    });
});

// 
prevBtn.addEventListener('click', () => {
    track.scrollBy({
        left: -getScrollAmount(),
        behavior: 'smooth'
    });
});


// ==========================================
// 
// ==========================================
let isBrandDown = false;    
let brandStartX;            
let brandScrollLeft;         

// 
track.addEventListener('mousedown', (e) => {
    isBrandDown = true;
    track.style.cursor = 'grabbing'; // 꽉 쥔 손모양 커서
    
    //
    track.style.scrollSnapType = 'none';
    
    brandStartX = e.pageX - track.offsetLeft;
    brandScrollLeft = track.scrollLeft;
});

// 
function stopBrandDragging() {
    if (!isBrandDown) return;
    isBrandDown = false;
    track.style.cursor = 'grab'; // 펼친 손모양 커서
    
    //
    track.style.scrollSnapType = 'x mandatory';
}


track.addEventListener('mouseup', stopBrandDragging);
track.addEventListener('mouseleave', stopBrandDragging);


track.addEventListener('mousemove', (e) => {
    if (!isBrandDown) return; 
    e.preventDefault();       
    
  
    const x = e.pageX - track.offsetLeft;
    const walk = (x - brandStartX) * 1.5; 
    
    track.style.scrollBehavior = 'auto'; 
    track.scrollLeft = brandScrollLeft - walk;
});

//카드 팝업-------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------
    // 1. [기존 기능 유지] 슬라이더 스크롤 이동 기능
    // ------------------------------------------
    const contentsTrack = document.getElementById('contents-card-track');
    const contentsPrevBtn = document.getElementById('contents-prev-btn');
    const contentsNextBtn = document.getElementById('contents-next-btn');

    function getContentsScrollAmount() {
        const contentsCard = contentsTrack.querySelector('.contents-card');
        const contentsCardWidth = contentsCard.getBoundingClientRect().width;
        return contentsCardWidth + 20; 
    }

    contentsNextBtn.addEventListener('click', () => {
        contentsTrack.scrollBy({ left: getContentsScrollAmount(), behavior: 'smooth' });
    });

    contentsPrevBtn.addEventListener('click', () => {
        contentsTrack.scrollBy({ left: -getContentsScrollAmount(), behavior: 'smooth' });
    });


    // ------------------------------------------
    // 2. [완전 업그레이드] 카드뉴스 상세 내용 + 다중 이미지 내장형 팝업 기능
    // ------------------------------------------
    const contentsCards = document.querySelectorAll('.contents-card');
    const contentsPopup = document.getElementById('contents-popup');
    const popupImg = document.getElementById('popup-img');
    const popupCategory = document.getElementById('popup-category');
    const popupTitle = document.getElementById('popup-title');
    const popupDesc = document.getElementById('popup-desc');
    const popupTools = document.getElementById('popup-tools');
    const popupKeywords = document.getElementById('popup-keywords');
    const popupClose = document.querySelector('.popup-close');

    // 팝업 내부 미니 이미지 슬라이더 조절용 단추들
    const slidePrevBtn = document.getElementById('popup-slide-prev');
    const slideNextBtn = document.getElementById('popup-slide-next');
    const currentPageSpan = document.getElementById('current-page');

    let currentImgList = []; // 현재 클릭해서 열린 팝업창의 이미지 5개 보관소
    let currentImgIndex = 0; // 현재 보고 있는 이미지의 번호 (0번부터 시작)

    // 화면에 이미지를 새로고침해 그려주는 공통 함수
    function updatePopupImage() {
        popupImg.style.opacity = 0; // 바뀔 때 툭 끊기지 않게 투명하게 만듦
        setTimeout(() => {
            popupImg.setAttribute('src', currentImgList[currentImgIndex]);
            currentPageSpan.innerText = currentImgIndex + 1; // 1장, 2장 눈에 보이기 쉽게 보정
            popupImg.style.opacity = 1;
        }, 150); // 0.15초 동안 부드럽게 교체
    }

    // 팝업 안에서 오른쪽 화살표(▶) 누를 때
    slideNextBtn.addEventListener('click', () => {
        if (currentImgIndex < currentImgList.length - 1) {
            currentImgIndex++;
        } else {
            currentImgIndex = 0; // 마지막 장에서 누르면 다시 1번째 장으로 회전
        }
        updatePopupImage();
    });

    // 팝업 안에서 왼쪽 화살표(◀) 누를 때
    slidePrevBtn.addEventListener('click', () => {
        if (currentImgIndex > 0) {
            currentImgIndex--;
        } else {
            currentImgIndex = currentImgList.length - 1; // 1번째 장에서 누르면 마지막 장으로 회전
        }
        updatePopupImage();
    });

    // 6개의 카드를 순회하며 각각 클릭 이벤트를 달아줍니다.
    contentsCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // 1) 클릭한 이 카드에 심어져 있는 이미지 5장의 경로를 수집하여 배열로 묶기
            currentImgList = [
                card.getAttribute('data-img1'),
                card.getAttribute('data-img2'),
                card.getAttribute('data-img3'),
                card.getAttribute('data-img4'),
                card.getAttribute('data-img5')
            ].filter(src => src !== null && src !== ''); // 값이 비어있는 칸은 깨끗하게 제외함
            
            currentImgIndex = 0; // 팝업창을 새로 열 때마다 무조건 첫 번째 이미지부터 보여줌
            
            // 2) HTML에 적어둔 data- 상세 텍스트 정보들 가져오기
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const tools = card.getAttribute('data-tools');
            const keywordsRaw = card.getAttribute('data-keywords');
            
            // 3) 팝업창 데이터 영역에 쏙쏙 집어넣기
            popupCategory.innerText = category;
            popupTitle.innerText = title;
            popupDesc.innerText = desc;
            popupTools.innerText = tools;
            
            // 이미지와 페이지 숫자도 첫 세팅 가동
            popupImg.setAttribute('src', currentImgList[currentImgIndex]);
            popupImg.setAttribute('alt', title);
            currentPageSpan.innerText = currentImgIndex + 1;
            
            // 4) 키워드 글자들을 콤마 기준으로 쪼개서 이쁜 동적 태그들로 새로 그리기
            popupKeywords.innerHTML = '';
            if (keywordsRaw) {
                const keywordsArray = keywordsRaw.split(',');
                keywordsArray.forEach(keyword => {
                    const span = document.createElement('span');
                    span.classList.add('keyword-tag');
                    span.innerText = keyword.trim(); // 글자 앞뒤 빈 공백 제거
                    popupKeywords.appendChild(span);
                });
            }
            
            // 5) 최종적으로 숨겨져 있던 대형 2단 상세 팝업창 노출
            contentsPopup.classList.add('active');
        });
    });

    // X 버튼 누르면 팝업창 닫기
    popupClose.addEventListener('click', () => {
        contentsPopup.classList.remove('active');
    });

    // 팝업 배경(여백) 누르면 자동으로 닫히게 하기
    contentsPopup.addEventListener('click', (e) => {
        if (e.target === contentsPopup) {
            contentsPopup.classList.remove('active');
        }
    });
});


///


////-------------------------------------------비디오
// ==========================================
// 3. [완성형] Reels & Videos 
// ==========================================
const videoTrack = document.getElementById('video-card-track');
const videoPrevBtn = document.getElementById('video-prev-btn');
const videoNextBtn = document.getElementById('video-next-btn');

function getVideoScrollAmount() {
    const videoCard = videoTrack.querySelector('.video-card');
    const videoCardWidth = videoCard.getBoundingClientRect().width;
    return videoCardWidth + 20; 
}

videoNextBtn.addEventListener('click', () => {
    videoTrack.scrollBy({ left: getVideoScrollAmount(), behavior: 'smooth' });
});

videoPrevBtn.addEventListener('click', () => {
    videoTrack.scrollBy({ left: -getVideoScrollAmount(), behavior: 'smooth' });
});

// --- 마우스 호버 시 영상 플레이 제어 ---
const videoCards = document.querySelectorAll('.video-card');

videoCards.forEach(card => {
    const hoverVid = card.querySelector('.hover-video');
    card.addEventListener('mouseenter', () => {
        hoverVid.play().catch(error => console.log("자동재생 대기:", error));
    });
    card.addEventListener('mouseleave', () => {
        hoverVid.pause();
        hoverVid.currentTime = 0; 
    });
});

// --- 비디오 2단 팝업창 매칭 기능 ---
const videoPopup = document.getElementById('video-popup');
const popupVideo = document.getElementById('popup-video');
const videoPopupCategory = document.getElementById('video-popup-category');
const videoPopupTitle = document.getElementById('video-popup-title');
const videoPopupDesc = document.getElementById('video-popup-desc');
const videoPopupTools = document.getElementById('video-popup-tools');
const videoPopupKeywords = document.getElementById('video-popup-keywords');
const videoPopupClose = document.querySelector('.video-popup-close');

videoCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        // 1) 클릭한 비디오 카드의 멀티미디어 및 텍스트 데이터 축적
        const videoSrc = card.getAttribute('data-video');
        const category = card.getAttribute('data-category');
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const tools = card.getAttribute('data-tools');
        const keywordsRaw = card.getAttribute('data-keywords');
        
        // 2) 팝업창 컴포넌트에 데이터 주입
        popupVideo.setAttribute('src', videoSrc);
        videoPopupCategory.innerText = category;
        videoPopupTitle.innerText = title;
        videoPopupDesc.innerText = desc;
        videoPopupTools.innerText = tools;
        
        // 3) 키워드 태그 동적 코딩
        videoPopupKeywords.innerHTML = '';
        if (keywordsRaw) {
            const keywordsArray = keywordsRaw.split(',');
            keywordsArray.forEach(keyword => {
                const span = document.createElement('span');
                span.classList.add('keyword-tag');
                span.innerText = keyword.trim();
                videoPopupKeywords.appendChild(span);
            });
        }
        
        // 4) 영상 재생 및 활성화
        videoPopup.classList.add('active');
        popupVideo.play(); 
    });
});

// 팝업 오프 함수 (영상 자원 소리 차단 필수)
function closeVideoPopup() {
    videoPopup.classList.remove('active');
    popupVideo.pause();
    popupVideo.setAttribute('src', ''); 
}

videoPopupClose.addEventListener('click', closeVideoPopup);
videoPopup.addEventListener('click', (e) => {
    if (e.target === videoPopup) closeVideoPopup();
});

////----------스킬---------//////////////////
document.addEventListener('DOMContentLoaded', () => {

    function playCircleAnimation(circle) {
        const target = parseInt(circle.getAttribute('data-target'));
        const numberSpan = circle.querySelector('.skill-number');
        let current = 0;

        if (circle.dataset.timerId) clearInterval(circle.dataset.timerId);

        const counter = setInterval(() => {
            if (current >= target) {
                clearInterval(counter);
            } else {
                current++;
                numberSpan.innerText = current + '%';
                const degree = (current / 100) * 360;
                circle.style.background = `conic-gradient(#333 ${degree}deg, #e5e5e5 ${degree}deg)`;
            }
        }, 12);
        circle.dataset.timerId = counter;
    }

    function resetCircleAnimation(circle) {
        if (circle.dataset.timerId) clearInterval(circle.dataset.timerId);
        const numberSpan = circle.querySelector('.skill-number');
        numberSpan.innerText = '0%';
        circle.style.background = `conic-gradient(#333 0deg, #e5e5e5 0deg)`;
    }

    function playBarAnimation(fill) {
        const target = parseInt(fill.getAttribute('data-target'));
        const numberSpan = fill.closest('.bar-item').querySelector('.bar-number');
        let current = 0;

        if (fill.dataset.timerId) clearInterval(fill.dataset.timerId);

        const counter = setInterval(() => {
            if (current >= target) {
                clearInterval(counter);
            } else {
                current++;
                numberSpan.innerText = current + '%';
                fill.style.width = current + '%';
            }
        }, 12);

        fill.dataset.timerId = counter;
    }

    function resetBarAnimation(fill) {
        if (fill.dataset.timerId) clearInterval(fill.dataset.timerId);
        const numberSpan = fill.closest('.bar-item').querySelector('.bar-number');
        numberSpan.innerText = '0%';
        fill.style.width = '0%';
    }


    const circles = document.querySelectorAll('.circle-progress');
    const barFills = document.querySelectorAll('.bar-fill');

    const observerOptions = {
        root: null,
        threshold: 0.2
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('circle-progress')) {
                    playCircleAnimation(entry.target);
                } else if (entry.target.classList.contains('bar-fill')) {
                    playBarAnimation(entry.target);
                }
            } else {
                if (entry.target.classList.contains('circle-progress')) {
                    resetCircleAnimation(entry.target);
                } else if (entry.target.classList.contains('bar-fill')) {
                    resetBarAnimation(entry.target);
                }
            }
        });
    }, observerOptions);

    circles.forEach(circle => skillObserver.observe(circle));
    barFills.forEach(fill => skillObserver.observe(fill));
});


  // 1. 스크롤 업 버튼 요소를 독립적으로 가져옵니다
    const myScrollUpBtn = document.getElementById('scroll_up_btn');

    // 2. 버튼을 클릭했을 때 화면 맨 위로 부드럽게 올리는 기능
    if (myScrollUpBtn) {
        myScrollUpBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 3. 실시간 스크롤을 감지해서 첫 화면(비디오)에서만 버튼을 숨기는 기능
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;       // 현재 스크롤된 높이
        const firstScreenHeight = window.innerHeight; // 첫 화면 브라우저 창 높이

        if (myScrollUpBtn) {
            // 첫 화면 비디오 영역을 절반(0.5) 이상 내려가 본문이 보일 때만 노출
            if (currentScroll > firstScreenHeight * 0.5) {
                myScrollUpBtn.style.opacity = "1";
                myScrollUpBtn.style.pointerEvents = "auto"; /* 클릭 활성화 */
            } else {
                myScrollUpBtn.style.opacity = "0";
                myScrollUpBtn.style.pointerEvents = "none"; /* 클릭 차단 */
            }
        }
    });



   