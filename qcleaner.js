// ==UserScript==
// @name        Quasarz0ne Cleaner
// @name:ko     퀘이사존 클리너
// @encoding    utf-8
// @homepageURL https://github.com/craftingmod/quasarblock
// @supportURL  https://github.com/craftingmod/quasarblock/issues
// @updateURL   https://cdn.jsdelivr.net/gh/craftingmod/quasarblock/qcleaner.js
// @downloadURL https://cdn.jsdelivr.net/gh/craftingmod/quasarblock/qcleaner.js
// @license     The Unlicense

// @version     2023.03.26.01

// @match       *://quasarzone.com/

// @description Quasarz0ne reorder & clear script
// @description:ko 퀘이사존 홈페이지에서 하드웨어가 아닌 내용을 치워주는 스크립트 입니다.

// @grant       none
// @run-at      document-end
// ==/UserScript==

// minify 귀찮아요
/**
 * 오늘의 베스트 자게/유게 없애는 수정 (PC/Mobile)
 */
function fixOrderTodayBest(selector, isMobile) {
	const todayBestList = document.querySelector(selector)
  // DOM 제거
  for (const el of todayBestList.querySelectorAll("li")) {
    const href = el.querySelector("a").attributes["href"].value
    if (href == null) {
      continue
    }
    if (el.style.display != null && el.style.display.startsWith("none")) {
      todayBestList.removeChild(el)
      continue
    }
    // 차단된 회원, 유머 게시판, 자유 게시판
    const blockList = ["javascript:", "/bbs/qb_humor", "/bbs/qb_free"]
    for (const block of blockList) {
      if (href.startsWith(block)) {
        todayBestList.removeChild(el)
        break
      }
    }
  }
  // 순서 재정렬
  const childs = todayBestList.children
  for (let i = 0; i < childs.length; i++) {
    const child = childs[i].querySelector(isMobile ? "span" : "i")
    child.className = `rank-${i + 1} ${isMobile ? "num" : "default"}`
    child.innerHTML = `${i + 1}`
  }
}

/**
 * 질문/토론 베스트와 오늘의 베스트 스왑 (PC)
 */
function swapBest() {
	const todayBest = document.querySelector("#content > .main-content-wrap > .mid-content-area > .right-util-wrap > .bot-util-area")
  const forumBest = document.querySelector("#content > .main-content-wrap > .bot-content-area > .top-util-wrap > .right-util-area")
  const todayHTML = todayBest.innerHTML
  todayBest.innerHTML = forumBest.innerHTML
  forumBest.innerHTML = todayHTML

  // 유저사용기
  const fieldTestBest = document.querySelector("#content > .main-content-wrap > .bot-content-area > .bot-util-wrap > .right-util-area")
  // 자유게시판
  const freeBest = document.querySelector("#content > .main-content-wrap > .bot-content-area > .mid-util-wrap > .left-util-area")

  // 유저사용기랑 자유게시판 스왑
  freeBest.innerHTML = fieldTestBest.innerHTML
}
function swapBest_Mobile() {
  const parent = document.querySelector(".content > .main-content-wrap")
  const todayBest = parent.querySelector(".best-wrap")
  const bestList = parent.querySelectorAll(".keyword-tab-wrap")
  let forumBest = null
  let freeBest = null
  let partnerBest = null
  // 포럼 베스트 찾기
  for (const best of bestList) {
    const title = best.querySelector(".tab-bt-area a").innerHTML
    if (title.startsWith("질문/토론")) {
      forumBest = best
      continue
    }
    if (title.startsWith("자유게시판")) {
      freeBest = best
      continue
    }
    if (title.startsWith("파트너 뉴스")) {
      partnerBest = best
      continue
    }
    if (freeBest != null && forumBest != null && partnerBest != null) {
      break
    }
  }
  if (forumBest == null || freeBest == null || partnerBest == null) {
    console.error("질문/토론 베스트 혹은 자유게시판 혹은 파트너 뉴스 게시판을 찾을 수 없어요.")
    return
  }
  // 포럼 베스트를 가장 위로
  parent.removeChild(forumBest)
  parent.insertBefore(forumBest, todayBest)
  // 오늘의 베스트는 파트너 뉴스 위로
  parent.removeChild(todayBest)
  parent.insertBefore(todayBest, partnerBest)
  // 파트너 뉴스를 가장 아래로
  parent.removeChild(partnerBest)
  parent.insertBefore(partnerBest, freeBest)
  // 유머/자유게시판 베스트 삭제
  parent.removeChild(freeBest)
}
/**
 * 데스크 셋업 / 하드웨어 위로 올리기 (PC)
 */
function upSetup() {
  const parent = document.querySelector("#content > .main-content-wrap > .bot-content-area")
  const setup = parent.querySelector(".tail-util-wrap")
  parent.firstElementChild.style.marginTop = "10px"
  parent.removeChild(setup)
  parent.insertBefore(setup, parent.firstChild)
}
/**
 * 유머/나눔/자유게시판 부분 없애기 (PC)
 */
function removeBoardPart() {
  const bottomArea = document.querySelector("#content > .main-content-wrap > .bot-content-area")
  // bottomArea.removeChild(bottomArea.querySelector(".mid-util-wrap"))
  bottomArea.removeChild(bottomArea.querySelector(".bot-util-wrap"))
}

if (location.href === "https://quasarzone.com/") {
  if (document.querySelector("#allMenuWrap") != null) {
    // 모바일
    fixOrderTodayBest(".content > .main-content-wrap > .best-wrap > .list-area > ul", true)
    swapBest_Mobile()
  } else {
    // PC
    fixOrderTodayBest("#content > .main-content-wrap > .mid-content-area > .right-util-wrap > .bot-util-area > dl > dd > ul", false)
    swapBest()
    upSetup()
    removeBoardPart()
  }
}

