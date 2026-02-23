/**
 * ============================================
 * Application Module
 * ============================================
 * 역할: UI 동작 및 화면 렌더링 로직 (프론트엔드)
 * 책임: 사용자 인터페이스 제어, 이벤트 핸들링, DOM 조작
 *
 * 특징:
 * - DataService.fetchData()만 호출하여 데이터 취득
 * - 데이터 출처를 몰라도 동작 (분리된 구조)
 * - 나중에 서버 연동 시 이 파일은 수정 불필요
 */

// 전역 변수: 현재 로드된 모든 패턴 데이터
let patterns = [];
// 전역 변수: 팝업 모달에서 보여줄 선택된 패턴 데이터
let selectedPatterns = [];
// 전역 변수: 검수 완료된 패턴 ID 추적
let reviewedPatternIds = new Set();
// 전역 변수: 기준 패턴의 초기 값 저장 (수정 이력 추적용)
let originalMasterValues = {};

// 모든 DOM 조작이 완료된 후 시작
document.addEventListener("DOMContentLoaded", async () => {
  // ============================================
  // 1단계: DataService에서 데이터 로드
  // ============================================
  try {
    patterns = await DataService.fetchData("patterns");
    console.log("[App] Loaded patterns:", patterns);
  } catch (error) {
    console.error("[App] Failed to load data:", error);
    showToast("데이터 로드 실패");
    return;
  }

  // ============================================
  // 2단계: UI 초기화
  // ============================================
  initializeTableUI();
  populateDropdowns();
  initMismatchUI();
  setupEventListeners();

  // ============================================
  // 3단계: 테이블 기능 초기화
  // ============================================
  makeTableSortable();
  makeTableDraggable();
  setupRestoreColumns();
  makeTableResizable();
});

// ============================================
// 테이블 UI 초기화
// ============================================
function initializeTableUI() {
  const tbody = document.querySelector(".table-container tbody");

  // patterns 데이터가 있으면 테이블에 표시
  if (patterns.length > 0) {
    tbody.innerHTML = "";

    patterns.forEach((p, index) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-pattern-id", p.id);
      tr.setAttribute("data-pattern-index", index);

      // 체크박스 (첫 번째 컬럼)
      const tdCheckbox = document.createElement("td");
      tdCheckbox.style.textAlign = "center";
      tdCheckbox.innerHTML = '<input type="checkbox" class="row-checkbox">';
      tr.appendChild(tdCheckbox);

      // 데이터 컬럼들 (index.html 테이블 헤더 순서와 1:1 매핑)
      // 순서: 고객사, 주요저작권사, 패턴, OS, 접수일, 제어판명, 저작권사명, AI 제품명, AI 저작권사명, AI 분류유형, 정확도, 패턴점수, 사유, 파일명
      const rowData = [
        p.customer,         // 고객사
        p.majorCopyright,   // 주요저작권사
        p.pattern,          // 패턴
        p.os,               // OS
        p.inspectionDate,   // 접수일
        p.controlPanelName, // 제어판명
        p.copyrightName,    // 저작권사명
        p.aiProductName,    // AI 제품명
        p.aiCopyrightName,  // AI 저작권사명
        p.aiClassType,      // AI 분류유형
        p.accuracy,          // 정확도
        p.patternReview,    // 패턴점수
        p.reason,           // 사유
        p.fileName          // 파일명
      ];

      rowData.forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value || "";
        td.title = value || ""; // 마우스 호버 시 전체 텍스트 표시
        td.setAttribute("contenteditable", "true");
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }
}

// ============================================
// 이벤트 리스너 설정
// ============================================
function setupEventListeners() {
  // 단축키 통합 관리 (Ctrl+S, Ctrl+1, Escape)
  window.addEventListener("keydown", (e) => {
    // Esc: 모달 닫기
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay").forEach((modal) => {
        modal.style.display = "none";
      });
      return;
    }

    // Ctrl/Cmd 조합키
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      
      // Ctrl+S: 저장
      if (key === "s") {
        e.preventDefault();
        showToast("작업저장 (샘플): 편집한 내용은 시연용이므로 실제 저장되지 않습니다.");
      }
      // Ctrl+1: 등록/비교 모달 열기
      else if (key === "1" || key === "!") {
        e.preventDefault();
        handleCtrl1();
      }
    }
  });

  // Sidebar collapse/expand
  const hb = document.querySelector(".header-left .fa-bars");
  const asideEl = document.querySelector("aside");
  if (hb && asideEl) {
    hb.style.cursor = "pointer";
    hb.addEventListener("click", () => {
      asideEl.classList.toggle("collapsed");
      const expanded = asideEl.classList.contains("collapsed")
        ? "false"
        : "true";
      hb.setAttribute("aria-expanded", expanded);
    });
  }

  // Select All Checkbox Logic
  const headerCheckbox = document.querySelector(
    '.table-container thead input[type="checkbox"]',
  );
  const countDisplay = document.querySelector(
    ".grid-controls span:first-child",
  );

  window.updateSelectionCount = function() {
    const checkedCount = document.querySelectorAll(
      '.table-container tbody input[type="checkbox"]:checked',
    ).length;
    if (countDisplay) {
      countDisplay.textContent = `${checkedCount}개 선택됨`;
    }
  };

  if (headerCheckbox) {
    headerCheckbox.addEventListener("change", function () {
      const isChecked = this.checked;
      const rowCheckboxes = document.querySelectorAll(
        '.table-container tbody input[type="checkbox"]',
      );
      rowCheckboxes.forEach((cb) => {
        cb.checked = isChecked;
      });
      window.updateSelectionCount();
    });
  }

  // Row Checkbox Event Delegation
  const tbody = document.querySelector(".table-container tbody");
  tbody.addEventListener("change", (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      window.updateSelectionCount();
      if (!e.target.checked && headerCheckbox) {
        headerCheckbox.checked = false;
      }
    }
  });

  // Menu Navigation
  setupMenuNavigation();
}

// ============================================
// 메뉴 네비게이션
// ============================================
function setupMenuNavigation() {
  const asideElement = document.querySelector("aside");
  const mainContent = document.querySelector("main");

  if (asideElement && mainContent) {
    asideElement.addEventListener("click", (e) => {
      const item = e.target.closest(".menu-item, .submenu-item");
      if (!item) return;

      const textSpan = item.querySelector(".label-text");
      const text = textSpan
        ? textSpan.textContent.replace(/\s+/g, " ").trim()
        : "";

      const notImplementedItems = [
        "AI모델 관리",
        "수집 DB 분류",
        "AI분류 평가",
        "검토",
        "수집패턴 관리",
        "릴리즈 관리",
        "SWDB 릴리즈뷰 관리",
        "피드백 관리",
      ];

      if (notImplementedItems.includes(text)) {
        e.preventDefault();
        e.stopPropagation();

        mainContent.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #94a3b8;">
                        <i class="fas fa-tools" style="font-size: 48px; margin-bottom: 20px;"></i>
                        <h2 style="font-size: 24px; color: #e2e8f0; margin-bottom: 10px;">${text}</h2>
                        <p>현재 준비 중인 기능입니다.</p>
                        <button onclick="location.reload()" style="
                            margin-top: 20px;
                            padding: 10px 20px;
                            background-color: #2563eb;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        ">
                            <i class="fas fa-undo"></i> 돌아가기 (Dashboard)
                        </button>
                    </div>
                `;
      }
    });
  }
}

// ============================================
// Helper Functions (전역)
// ============================================
window.showToast = function (message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease-in forwards";
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 300);
  }, 3000);
};

window.closeModal = function (id) {
  document.getElementById(id).style.display = "none";
};

window.onclick = function (event) {
  if (event.target.classList.contains("modal-overlay")) {
    event.target.style.display = "none";
  }
};

// ============================================
// Ctrl+1 Shortcut (Modal Open)
// ============================================
// Ctrl+1 처리를 위한 별도 함수
function handleCtrl1() {
  const pageTitle = document.querySelector(".content-header h2")?.textContent.trim();
  if (pageTitle !== "SWDB 작업실") return;

  const checkedCount = document.querySelectorAll('.table-container tbody input[type="checkbox"]:checked').length;

  if (checkedCount === 0) {
    showToast("선택한 객체가 없습니다");
  } else if (checkedCount === 1) {
    document.getElementById("modal-single").style.display = "flex";
    fillSingleModal();
  } else {
    const checkedRows = document.querySelectorAll('.table-container tbody input[type="checkbox"]:checked');
    const checkedIds = Array.from(checkedRows).map(row => {
        const tr = row.closest('tr');
        return parseInt(tr.getAttribute('data-pattern-id'));
    });
    
    selectedPatterns = patterns.filter(p => checkedIds.includes(p.id));
    
    selectedPatterns = patterns.filter(p => checkedIds.includes(p.id));
    
    if (selectedPatterns.length > 0) {
        document.getElementById("modal-multi").style.display = "flex";
        
        // 검수 상태 초기화
        reviewedPatternIds.clear();

        // 초기화: 첫 번째 항목을 기준으로, 두 번째 항목을 비교 대상으로 설정
        checkedPatternId = selectedPatterns[0].id;
        fillPanel("left", selectedPatterns[0]);
        // 기준 패턴은 자동으로 검수 완료 처리
        reviewedPatternIds.add(checkedPatternId);
        
        if (selectedPatterns.length > 1) {
            selectPatternForRight(selectedPatterns[1].id);
        } else {
            selectedPatternId = null;
            const rightPanel = document.querySelector('.form-panel[data-panel="right"]');
            if (rightPanel) {
                const fields = rightPanel.querySelectorAll('[data-key]');
                fields.forEach(f => f.value = "");
            }
        }
        
        renderPatternList();
        updateDiff();
    }
  }
}

// ============================================
// 테이블 기능들 (Column Resizing, Sorting, Dragging)
// ============================================
function makeTableResizable() {
  const table = document.querySelector(".table-container table");
  const cols = table.querySelectorAll("th");

  cols.forEach((col) => {
    const resizer = document.createElement("div");
    resizer.classList.add("resizer");
    resizer.style.height = `${table.offsetHeight}px`;
    col.appendChild(resizer);

    createResizableColumn(col, resizer);
  });
}

function createResizableColumn(col, resizer) {
  let x = 0;
  let w = 0;

  const mouseDownHandler = function (e) {
    x = e.clientX;
    const styles = window.getComputedStyle(col);
    w = parseInt(styles.width, 10);

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);

    resizer.classList.add("resizing");
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - x;
    const newWidth = Math.max(50, w + dx);
    col.style.width = `${newWidth}px`;
  };

  const mouseUpHandler = function () {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);

    resizer.classList.remove("resizing");
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  resizer.addEventListener("mousedown", mouseDownHandler);
}

function makeTableSortable() {
  const table = document.querySelector(".table-container table");
  const headers = table.querySelectorAll("th");
  const tbody = table.querySelector("tbody");

  headers.forEach((th, index) => {
    if (index === 0) return;

    th.addEventListener("click", (e) => {
      if (e.target.classList.contains("resizer")) return;

      const currentOrder = th.dataset.order === "asc" ? "desc" : "asc";
      th.dataset.order = currentOrder;

      headers.forEach((h) => {
        const icon = h.querySelector(".fa-sort, .fa-sort-up, .fa-sort-down");
        if (icon) icon.className = "fas fa-sort sort-icon";
      });

      let icon = th.querySelector(".sort-icon");
      if (!icon) {
        icon = document.createElement("i");
        icon.className = "fas fa-sort sort-icon";
        th.appendChild(icon);
      }
      icon.className = `fas fa-sort-${currentOrder === "asc" ? "up" : "down"} sort-icon active`;

      const rows = Array.from(tbody.querySelectorAll("tr"));
      const multiplier = currentOrder === "asc" ? 1 : -1;

      rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[index].innerText.trim();
        const cellB = rowB.cells[index].innerText.trim();
        return cellA.localeCompare(cellB) * multiplier;
      });

      rows.forEach((row) => tbody.appendChild(row));
    });
  });
}

let dragSrcEl = null;
let isDroppedOnHeader = false;

function makeTableDraggable() {
  const headers = document.querySelectorAll(".table-container th");

  headers.forEach((th) => {
    th.setAttribute("draggable", true);

    th.addEventListener("dragstart", (e) => {
      dragSrcEl = th;
      isDroppedOnHeader = false;
      th.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", th.innerHTML);
    });

    th.addEventListener("dragover", (e) => {
      if (e.preventDefault) e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      th.classList.add("drag-over");
      return false;
    });

    th.addEventListener("dragleave", () => {
      th.classList.remove("drag-over");
    });

    th.addEventListener("drop", (e) => {
      if (e.stopPropagation) e.stopPropagation();
      th.classList.remove("drag-over");

      isDroppedOnHeader = true;

      if (dragSrcEl !== th) {
        const srcIndex = dragSrcEl.cellIndex;
        const targetIndex = th.cellIndex;

        if (srcIndex < targetIndex) {
          th.parentNode.insertBefore(dragSrcEl, th.nextSibling);
        } else {
          th.parentNode.insertBefore(dragSrcEl, th);
        }

        const rows = document.querySelectorAll(".table-container tbody tr");
        rows.forEach((row) => {
          const srcCell = row.cells[srcIndex];
          const targetCell = row.cells[targetIndex];

          if (srcCell && targetCell) {
            if (srcIndex < targetIndex) {
              row.insertBefore(srcCell, targetCell.nextSibling);
            } else {
              row.insertBefore(srcCell, targetCell);
            }
          }
        });
      }
      return false;
    });

    th.addEventListener("dragend", () => {
      dragSrcEl.classList.remove("dragging");
      headers.forEach((h) => h.classList.remove("drag-over"));

      if (!isDroppedOnHeader) {
        dragSrcEl.style.display = "none";
        const rows = document.querySelectorAll(".table-container tbody tr");
        const currentHeaders = Array.from(dragSrcEl.parentNode.children);
        const currentIndex = currentHeaders.indexOf(dragSrcEl);

        rows.forEach((row) => {
          if (row.children[currentIndex]) {
            row.children[currentIndex].style.display = "none";
          }
        });
      }
    });
  });
}

function setupRestoreColumns() {
  const menuItems = document.querySelectorAll(".submenu-item");
  menuItems.forEach((item) => {
    if (item.querySelector(".label-text").innerText.trim() === "분류") {
      item.addEventListener("click", () => {
        const headers = document.querySelectorAll(".table-container th");
        headers.forEach((th) => (th.style.display = ""));

        const rows = document.querySelectorAll(".table-container tbody tr");
        rows.forEach((row) => {
          Array.from(row.children).forEach((cell) => (cell.style.display = ""));
        });
      });
    }
  });
}

// ============================================
// Mismatch UI Logic (패턴 비교 기능)
// ============================================
// 기준 필드 목록 (제품 기본 정보)
const productBaseFields = ["productName", "copyrightName", "licenseType", "swType", "iScanSwType", "swGroup"];
// 확장 필드 목록 (메모, 요약, URL 등)
const productExtraFields = ["summary", "licenseMemo", "productUrl", "licenseEvidenceUrl"];
// 모든 등록 필드 통합
const registrationFields = [...productBaseFields, ...productExtraFields];

const fieldLabelMap = {
  productName: "제품명",
  copyrightName: "저작권사명",
  licenseType: "라이선스 유형",
  swType: "SW 제품유형",
  iScanSwType: "iScan 제품 유형",
  swGroup: "SW 그룹",
};

let checkedPatternId = 1;
let selectedPatternId = 2;

function initMismatchUI() {
  // Initialize Tabs
  document.querySelectorAll(".form-panel").forEach((panel) => {
    const tabs = panel.querySelectorAll(".tab");
    const panes = panel.querySelectorAll(".tabPane");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        panes.forEach((p) => (p.style.display = "none"));

        tab.classList.add("active");
        const key = tab.getAttribute("data-tab");

        const pane = panel.querySelector(`.tabPane[data-pane="${key}"]`);
        if (pane) pane.style.display = "block";

        updateDiff();
      });
    });
  });

  // Initial Data Load (Ctrl+1에서 처리하므로 여기서는 제거)
  // handleCheckboxChange(1);
  // renderPatternList();

  // Attach Input Listeners
  const allInputs = document.querySelectorAll(
    "#modal-multi input, #modal-multi select, #modal-multi textarea",
  );
  allInputs.forEach((el) => {
    el.addEventListener("input", () => {
      updateDiff();
      if (el.closest('[data-panel="left"]')) {
        renderPatternList();
      }
    });
  });
}

function getBaseValues() {
  const leftPanel = document.querySelector('.form-panel[data-panel="left"]');
  const values = {};
  productBaseFields.forEach((key) => {
    const el = leftPanel.querySelector(`[data-key="${key}"]`);
    values[key] = el ? el.value.trim() : "";
  });
  return values;
}

function getPatternValues(pattern) {
  return {
    productName: pattern.farthingProductName,
    copyrightName: pattern.farthingCopyrightName,
    licenseType: pattern.licenseType,
    swType: pattern.swType,
    iScanSwType: pattern.iScanSwType,
    swGroup: pattern.swGroup,
    summary: pattern.summary,
    licenseMemo: pattern.licenseMemo,
    productUrl: pattern.productUrl,
    licenseEvidenceUrl: pattern.licenseEvidenceUrl
  };
}

function renderPatternList() {
  const masterContainer = document.getElementById("masterCardContainer");
  const listContainer = document.getElementById("sidebarBody");
  const countEl = document.getElementById("patternCount");
  
  if (!masterContainer || !listContainer) return;
  
  masterContainer.innerHTML = "";
  // Clear list container, but keep the header if any (though we redefined sidebarBody to be the list section)
  listContainer.innerHTML = '<div class="reference-title" style="color: #94a3b8; padding: 5px 5px 10px 5px;">포함 대상 목록</div>';
  
  countEl.innerText = selectedPatterns.length;

  const baseValues = getBaseValues();

  selectedPatterns.forEach((p) => {
    const pValues = getPatternValues(p);
    const isMaster = p.id === checkedPatternId;
    const isComparing = p.id === selectedPatternId;
    const isReviewed = reviewedPatternIds.has(p.id);

    const diffs = [];
    productBaseFields.forEach((key) => {
      if (baseValues[key] !== pValues[key]) {
        diffs.push(fieldLabelMap[key]);
      }
    });
    const diffText = diffs.join(", ");

    const div = document.createElement("div");
    div.className = isMaster ? "master-card" : `item-card ${isComparing ? "comparing" : ""} ${isReviewed ? "reviewed" : ""}`;

    const displayDiffText = isMaster ? "" : diffText;

    div.innerHTML = `
        <div class="item-card-content" style="cursor: pointer;">
            <div class="item-card-header">
                <div style="min-width: 0; flex: 1;">
                    <h4>${p.controlPanelName}</h4>
                    <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.aiCopyrightName}</p>
                </div>
                ${!isMaster 
                    ? `
                    <div class="item-card-actions">
                        <button class="swap-btn" data-swap-id="${p.id}" style="margin-top:0;"><i class="fas fa-sync-alt"></i> 기준변경</button>
                        <button class="exclude-btn" data-exclude-id="${p.id}"><i class="fas fa-minus-circle"></i> 대상 제외</button>
                    </div>
                    ` 
                    : ""}
            </div>
            ${displayDiffText ? `<div class="patternItem-diff">${displayDiffText} 불일치</div>` : ""}
        </div>
    `;

    const cardContent = div.querySelector(".item-card-content");
    cardContent.addEventListener("click", () => {
      if (isMaster) {
        showToast("현재 비교 기준인 항목입니다");
        return;
      }
      selectPatternForRight(p.id);
    });

    if (isMaster) {
      masterContainer.appendChild(div);
    } else {
      const swapBtn = div.querySelector(".swap-btn");
      swapBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        swapMasterPattern(p.id);
      });
      const excludeBtn = div.querySelector(".exclude-btn");
      excludeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        excludePattern(p.id);
      });
      listContainer.appendChild(div);
    }
  });
}

/**
 * 포함 대상 목록에서 특정 항목을 제외하고 메인 테이블 체크박스 동기화
 */
function excludePattern(id) {
  // 1. 선택 목록에서 제거
  selectedPatterns = selectedPatterns.filter(p => p.id !== id);

  // 2. 메인 테이블 체크박스 해제
  const row = document.querySelector(`.table-container tbody tr[data-pattern-id="${id}"]`);
  if (row) {
    const cb = row.querySelector('.row-checkbox');
    if (cb) {
      cb.checked = false;
      // 상단 헤더 체크박스 해제 처리 (이미 setupEventListeners에서 change 핸들러로 동작하지만 명시적 호출 대신 이벤트 발생 유도 가능)
      const headerCheckbox = document.querySelector('.table-container thead input[type="checkbox"]');
      if (headerCheckbox) headerCheckbox.checked = false;
    }
  }

  // 3. 전체 선택 개수 갱신
  if (window.updateSelectionCount) window.updateSelectionCount();

  // 4. 우측 패널이 제외된 항목인 경우 처리
  if (selectedPatternId === id) {
    // 남은 패턴 중 첫 번째 패턴(기준 제외)을 선택하거나 없으면 비움
    const remainings = selectedPatterns.filter(p => p.id !== checkedPatternId);
    if (remainings.length > 0) {
      selectPatternForRight(remainings[0].id);
    } else {
      selectedPatternId = null;
      const rightPanel = document.querySelector('.form-panel[data-panel="right"]');
      if (rightPanel) {
        const fields = rightPanel.querySelectorAll('[data-key]');
        fields.forEach(f => {
          f.value = "";
          f.classList.remove('diff-highlight');
        });
        const headerSpan = rightPanel.querySelector(".panel-header > span:first-child");
        if (headerSpan) headerSpan.innerHTML = `<span>포함 대상 없음</span>`;
      }
    }
  }

  // 5. UI 리로드
  renderPatternList();
  updateDiff();
  showToast("항목이 목록에서 제외되었습니다.");
}

function swapMasterPattern(newMasterId) {
  const oldMasterId = checkedPatternId;
  const isTargetConflict = (selectedPatternId === newMasterId);

  // 기준이 바뀌면 모든 검수 상태를 초기화
  reviewedPatternIds.clear();

  checkedPatternId = newMasterId;
  reviewedPatternIds.add(checkedPatternId);

  // 기준 패널 갱신
  const newMaster = patterns.find(p => p.id === checkedPatternId);
  if (newMaster) fillPanel("left", newMaster);

  // 만약 현재 비교 대상(우측)이 새로운 기준이 되었다면, 기존 기준을 비교 대상으로 보냄 (상호 교체)
  if (isTargetConflict) {
    selectedPatternId = oldMasterId;
    const newTarget = patterns.find(p => p.id === selectedPatternId);
    if (newTarget) fillPanel("right", newTarget);
    // 내보내진 이전 기준도 검수된 것으로 처리할지 여부: 
    // 사용자 요청에 따라 "기준이 변하면 초기화"이므로, 새로 선택된 타겟(이전 기준)도 검수 필요 상태가 됨.
  }

  renderPatternList();
  updateDiff();
  showToast("대표 제품이 교체되었습니다.");
}

function registerMultiItems() {
  const unreviewedCount = selectedPatterns.filter(p => !reviewedPatternIds.has(p.id)).length;
  
  if (unreviewedCount > 0) {
    if (!confirm(`아직 검수하지 않은 항목이 ${unreviewedCount}건 있습니다. 계속하시겠습니까?`)) {
      return;
    }
  }
  
  closeModal('modal-multi');
  showToast(`${selectedPatterns.length}건의 아이템이 성공적으로 등록되었습니다.`);
}

function handleCheckboxChange(id) {
  document.querySelectorAll(".item-card-checkbox").forEach((cb) => {
    cb.checked = false;
  });

  checkedPatternId = id;
  const pattern = selectedPatterns.find((x) => x.id === id);
  if (!pattern) return;

  // 왼쪽 패널에 데이터 채우기
  // TODO: 실제 다중 선택 등록 로직 연동 시 사용
  console.log("Pattern selected for registration:", id);
}

function selectPatternForRight(id) {
  selectedPatternId = id;
  // 클릭하여 내용을 띄우는 순간 검수 완료 처리
  reviewedPatternIds.add(id);

  const p = patterns.find((item) => item.id === id);
  if (p) {
    fillPanel("right", p);
    renderPatternList(); // Highlight the selected target card and show reviewed status
    updateDiff();
  }
}
function fillPanel(panelName, p) {
  const panel = document.querySelector(
    `.form-panel[data-panel="${panelName}"]`,
  );
  if (!panel) return;

  const headerSpan = panel.querySelector(".panel-header > span:first-child");
  if (headerSpan) {
    // 헤더 전체를 flex 컨테이너로 활용 (CSS 설정 연동)
    headerSpan.style.display = "flex";
    headerSpan.style.justifyContent = "space-between";
    headerSpan.style.width = "100%";
    headerSpan.style.alignItems = "center";

    if (panelName === "left") {
      const checkedPattern = selectedPatterns.find((x) => x.id === checkedPatternId);
      headerSpan.innerHTML = `<span>${checkedPattern?.controlPanelName || "대표 제품 정보"}</span> <span class="role-label">대표 제품</span>`;
    } else if (panelName === "right") {
      const selectedPattern = selectedPatterns.find((x) => x.id === selectedPatternId);
      headerSpan.innerHTML = `<span>${selectedPattern?.controlPanelName || "비교대상"}</span> <span class="role-label">포함 대상</span>`;
    }
  }

  const map = {
    productName: p.farthingProductName,
    copyrightName: p.farthingCopyrightName,
    licenseType: p.licenseType,
    swType: p.swType,
    iScanSwType: p.iScanSwType,
    swGroup: p.swGroup,
    summary: p.summary,
    licenseMemo: p.licenseMemo,
    productUrl: p.productUrl || "",
    licenseEvidenceUrl: p.licenseEvidenceUrl || "",
  };

  Object.keys(map).forEach((key) => {
    const el = panel.querySelector(`[data-key="${key}"]`);
    if (el) {
      el.value = map[key] || "";
      
      // 양쪽 패널 모두 초기값 저장(왼쪽만) 및 수정 감지 이벤트 바인딩
      if (panelName === "left") {
        originalMasterValues[key] = el.value;
      }
      
      // 기존 리스너 제거 후 신규 등록 (중복 방지)
      el.removeEventListener("input", syncUIPanels);
      el.addEventListener("input", syncUIPanels);
    }
  });

  syncUIPanels(); // 초기 상태 업데이트
}

/**
 * 전역 UI 동기화: 수정 이력(파란색), 불일치(노란색) 하이라이트 및 사이드바 목록 갱신
 */
function syncUIPanels() {
  checkFieldEdits();
  updateDiff();
  renderPatternList(); // 사이드바 목록의 불일치 텍스트 실시간 갱신
}

/**
 * 기준 패턴 패널의 값이 원래와 달라졌는지 체크하여 하이라이트
 */
function checkFieldEdits() {
  const leftPanel = document.querySelector('.form-panel[data-panel="left"]');
  if (!leftPanel) return;

  const fields = leftPanel.querySelectorAll('[data-key]');
  fields.forEach(el => {
    const key = el.getAttribute('data-key');
    const originalValue = (originalMasterValues[key] || "").trim();
    const currentValue = (el.value || "").trim();

    if (currentValue !== originalValue) {
      el.classList.add('is-edited');
      // 롤백 버튼 표시
      const rollbackBtn = leftPanel.querySelector(`[data-rollback="${key}"]`);
      if (rollbackBtn) rollbackBtn.style.visibility = 'visible';
    } else {
      el.classList.remove('is-edited');
      // 롤백 버튼 숨김
      const rollbackBtn = leftPanel.querySelector(`[data-rollback="${key}"]`);
      if (rollbackBtn) rollbackBtn.style.visibility = 'hidden';
    }
  });
}

/**
 * 특정 필드를 초기 값으로 복구
 * @param {string} key 데이터 키
 */
function rollbackField(key) {
  const leftPanel = document.querySelector('.form-panel[data-panel="left"]');
  if (!leftPanel) return;

  const el = leftPanel.querySelector(`[data-key="${key}"]`);
  if (el) {
    el.value = originalMasterValues[key] || "";
    syncUIPanels();
    showToast(`${fieldLabelMap[key] || key} 항목이 원본 데이터로 복원되었습니다.`);
  }
}

/**
 * 우측 비교 패널의 데이터를 좌측 기준 패널로 복사
 * @param {string} key 데이터 키
 */
function applyToLeft(key) {
  const rightPanel = document.querySelector('.form-panel[data-panel="right"]');
  const leftPanel = document.querySelector('.form-panel[data-panel="left"]');
  if (!rightPanel || !leftPanel) return;

  const rightEl = rightPanel.querySelector(`[data-key="${key}"]`);
  const leftEl = leftPanel.querySelector(`[data-key="${key}"]`);

  if (rightEl && leftEl) {
    leftEl.value = rightEl.value;
    // 값이 변경되었으므로 동기화 실행
    syncUIPanels();
    showToast(`${fieldLabelMap[key] || key} 항목이 기준에 적용되었습니다.`);
  }
}

// ============================================
// Single Modal 채우기 함수
// ============================================
function fillSingleModal() {
  const checkedRow = document.querySelector(
    '.table-container tbody input[type="checkbox"]:checked',
  );
  if (!checkedRow) return;

  const row = checkedRow.closest("tr");
  const patternId = parseInt(row.getAttribute("data-pattern-id"));
  const pattern = patterns.find(p => p.id === patternId);
  if (!pattern) return;

  const form = document.getElementById("modal-single");

  // 데이터 기반 매핑 (테이블 인덱스에 의존하지 않고 객체에서 직접 매핑)
  const mapping = {
      productName: pattern.farthingProductName,
      copyrightName: pattern.farthingCopyrightName,
      licenseType: pattern.licenseType,
      swType: pattern.swType,
      iScanSwType: pattern.iScanSwType,
      swGroup: pattern.swGroup,
      summary: pattern.summary,
      licenseMemo: pattern.licenseMemo,
      productUrl: pattern.productUrl,
      licenseEvidenceUrl: pattern.licenseEvidenceUrl
  };

  Object.entries(mapping).forEach(([key, value]) => {
      const el = form.querySelector(`[data-key="${key}"]`);
      if (el) el.value = value || "";
  });
}

function updateDiff() {
  const leftPanel = document.querySelector('.form-panel[data-panel="left"]');
  const rightPanel = document.querySelector('.form-panel[data-panel="right"]');
  if (!leftPanel || !rightPanel) return;

  const diffIgnoreKeys = new Set(productExtraFields);

  const keys = [
    ...registrationFields,
    "groupName",
    "groupDesc",
    "evidenceFile"
  ];

  keys.forEach((key) => {
    const leftEl = leftPanel.querySelector(`[data-key="${key}"]`);
    const rightEl = rightPanel.querySelector(`[data-key="${key}"]`);

    if (leftEl && rightEl) {
      const isDiff = leftEl.value.trim() !== rightEl.value.trim();

      if (isDiff && !diffIgnoreKeys.has(key)) {
        leftEl.classList.add("diff-highlight");
        rightEl.classList.add("diff-highlight");
      } else {
        leftEl.classList.remove("diff-highlight");
        rightEl.classList.remove("diff-highlight");
      }
    }
  });

  // 오른쪽 패널 상단에는 불일치 텍스트를 표시하지 않음 (목록에서만 확인)
  const rightBadge = rightPanel.querySelector(".colBadge");
  if (rightBadge) {
    rightBadge.innerText = ""; 
  }
}

// ============================================
// 드롭다운 옵션 동적 생성
// ============================================
function populateDropdowns() {
    const swTypes = DataService.getSwTypes();
    const iScanSwTypes = DataService.getIScanSwTypes();
    const swGroups = DataService.getSwGroups();

    // 모든 swType 드롭다운 선택
    const swTypeSelects = document.querySelectorAll('select[data-key="swType"]');
    swTypeSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="미지정">미지정</option>';
        swTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            select.appendChild(option);
        });
        select.value = currentValue;
    });

    // 모든 iScanSwType 드롭다운 선택
    const iScanSwTypeSelects = document.querySelectorAll('select[data-key="iScanSwType"]');
    iScanSwTypeSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="미지정">미정</option>';
        iScanSwTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            select.appendChild(option);
        });
        select.value = currentValue;
    });

    // 모든 swGroup 드롭다운 선택
    const swGroupSelects = document.querySelectorAll('select[data-key="swGroup"]');
    swGroupSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="미지정">미지정</option>';
        swGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            select.appendChild(option);
        });
        select.value = currentValue;
    });
}
