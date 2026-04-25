// ===== NONIOAEY STUDIO - Main Script =====

// Admin state
let isAdmin = false;
const ADMIN_PASS = ‘ss11’;

// Storage key prefix
const STORE_KEY = ‘nonioaey_’;

// ===== ADMIN SYSTEM =====
function toggleAdmin() {
if (isAdmin) {
logoutAdmin();
} else {
document.getElementById(‘adminModal’).classList.add(‘show’);
setTimeout(() => document.getElementById(‘adminPass’).focus(), 100);
}
}

function closeAdminModal() {
document.getElementById(‘adminModal’).classList.remove(‘show’);
document.getElementById(‘adminPass’).value = ‘’;
}

function checkAdmin() {
const pass = document.getElementById(‘adminPass’).value;
if (pass === ADMIN_PASS) {
isAdmin = true;
document.body.classList.add(‘admin-mode’);
closeAdminModal();
showToast(‘✅ เข้าสู่โหมดแอดมินแล้ว!’);
localStorage.setItem(STORE_KEY + ‘admin_session’, ‘true’);
} else {
showToast(‘❌ รหัสผ่านไม่ถูกต้อง’);
document.getElementById(‘adminPass’).value = ‘’;
}
}

function logoutAdmin() {
isAdmin = false;
document.body.classList.remove(‘admin-mode’);
localStorage.removeItem(STORE_KEY + ‘admin_session’);
showToast(‘🔒 ออกจากโหมดแอดมินแล้ว’);
}

// Press Enter to confirm admin login
document.addEventListener(‘DOMContentLoaded’, () => {
const passInput = document.getElementById(‘adminPass’);
if (passInput) {
passInput.addEventListener(‘keydown’, (e) => {
if (e.key === ‘Enter’) checkAdmin();
if (e.key === ‘Escape’) closeAdminModal();
});
}

// Check saved session
if (localStorage.getItem(STORE_KEY + ‘admin_session’) === ‘true’) {
isAdmin = true;
document.body.classList.add(‘admin-mode’);
}

// Init floating decorations
initDecorations();

// Load saved images
loadSavedImages();
});

// ===== FLOATING DECORATIONS =====
function initDecorations() {
const container = document.getElementById(‘decos’);
if (!container) return;

const decoList = [‘🌸’, ‘🌷’, ‘✿’, ‘💗’, ‘⭐’, ‘🎀’, ‘🌺’, ‘💕’, ‘✨’, ‘🌼’];

for (let i = 0; i < 12; i++) {
const d = document.createElement(‘div’);
d.className = ‘deco’;
d.textContent = decoList[Math.floor(Math.random() * decoList.length)];
d.style.left = Math.random() * 100 + ‘%’;
d.style.animationDuration = (8 + Math.random() * 12) + ‘s’;
d.style.animationDelay = (Math.random() * 10) + ‘s’;
d.style.fontSize = (12 + Math.random() * 12) + ‘px’;
container.appendChild(d);
}
}

// ===== TOAST NOTIFICATION =====
function showToast(msg) {
const existing = document.querySelector(’.toast-notif’);
if (existing) existing.remove();

const toast = document.createElement(‘div’);
toast.className = ‘toast-notif’;
toast.textContent = msg;
toast.style.cssText = `position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: white; border: 1.5px solid #f48fb1; color: #c2185b; padding: 10px 20px; border-radius: 20px; font-size: 13px; font-family: 'Mitr',sans-serif; z-index: 9999; box-shadow: 0 4px 20px rgba(244,143,177,0.3); animation: toastIn 0.3s ease-out;`;

const style = document.createElement(‘style’);
style.textContent = `@keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`;
document.head.appendChild(style);

document.body.appendChild(toast);
setTimeout(() => toast.remove(), 2500);
}

// ===== IMAGE UPLOAD SYSTEM =====
function createFileInput(callback) {
const input = document.createElement(‘input’);
input.type = ‘file’;
input.accept = ‘image/*’;
input.onchange = (e) => {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = (r) => callback(r.result);
reader.readAsDataURL(file);
};
input.click();
}

// Upload for header avatar
function triggerUpload(targetId) {
if (!isAdmin) return;
createFileInput((dataUrl) => {
const el = document.getElementById(targetId);
if (!el) return;
el.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
localStorage.setItem(STORE_KEY + targetId, dataUrl);
showToast(‘✅ อัปโหลดรูปสำเร็จ!’);
});
}

// Upload for recent works
function triggerRecentUpload(index) {
if (!isAdmin) return;
createFileInput((dataUrl) => {
const el = document.getElementById(‘recentImg’ + index);
if (!el) return;
el.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:10px 10px 0 0;" onclick="openImgModal('${dataUrl}')">`;
localStorage.setItem(STORE_KEY + ‘recentImg’ + index, dataUrl);
showToast(‘✅ อัปโหลดรูปสำเร็จ!’);
});
}

// ===== WORK CARD SYSTEM =====
let workCounter = 0;

function createWorkCard(pageKey, options = {}) {
const id = pageKey + ‘*work*’ + workCounter++;
const card = document.createElement(‘div’);
card.className = ‘work-card’;
card.id = id;
card.dataset.link = options.link || ‘’;

const imgId = id + ‘_img’;
const nameId = id + ‘_name’;
const linkId = id + ‘_link’;
const savedImg = options.img || null;
const savedName = options.name || ‘’;
const savedLink = options.link || ‘’;

card.innerHTML = `<div class="work-img-placeholder" id="${imgId}" onclick="handleImgClick('${id}','${pageKey}')"> ${savedImg  ?`<img src="${savedImg}" class="work-img" onclick="handleImgClick('${id}','${pageKey}')">` :`<span>🖼️</span><div class="add-label">คลิกเพื่อเพิ่มรูป</div>`} </div> <div class="work-info"> <input class="work-name-input" id="${nameId}" placeholder="ชื่องาน..." value="${savedName}"  onchange="saveWorkData('${id}','${pageKey}')" ${!isAdmin ? 'readonly' : ''}> <input class="btn-link-input" id="${linkId}" placeholder="ลิงค์ตัวอย่าง..." value="${savedLink}" onchange="saveWorkData('${id}','${pageKey}')"> <button class="btn-upload" onclick="uploadWorkImg('${id}','${pageKey}')">📤 อัปโหลดรูป</button> ${options.hasPreview !== false ? `<button class="btn-preview" onclick="showPreview('${id}')">ดูตัวอย่าง</button>`: ''} </div>`;

return card;
}

function handleImgClick(cardId, pageKey) {
if (isAdmin) {
uploadWorkImg(cardId, pageKey);
} else {
const card = document.getElementById(cardId);
const img = card.querySelector(’.work-img’);
if (img) openImgModal(img.src);
}
}

function uploadWorkImg(cardId, pageKey) {
if (!isAdmin) return;
createFileInput((dataUrl) => {
const imgArea = document.getElementById(cardId + ‘_img’);
if (!imgArea) return;
imgArea.innerHTML = `<img src="${dataUrl}" class="work-img" onclick="handleImgClick('${cardId}','${pageKey}')">`;
imgArea.className = ‘’;
saveWorkData(cardId, pageKey, dataUrl);
showToast(‘✅ อัปโหลดรูปสำเร็จ!’);
});
}

function saveWorkData(cardId, pageKey, imgOverride) {
const nameEl = document.getElementById(cardId + ‘_name’);
const linkEl = document.getElementById(cardId + ‘_link’);
const imgEl = document.getElementById(cardId + ‘_img’);
const imgTag = imgEl ? imgEl.querySelector(‘img’) : null;

const data = {
name: nameEl ? nameEl.value : ‘’,
link: linkEl ? linkEl.value : ‘’,
img: imgOverride || (imgTag ? imgTag.src : null)
};

// Save all works for page
const allWorks = JSON.parse(localStorage.getItem(STORE_KEY + pageKey + ‘_works’) || ‘{}’);
allWorks[cardId] = data;
localStorage.setItem(STORE_KEY + pageKey + ‘_works’, JSON.stringify(allWorks));
}

function showPreview(cardId) {
const linkEl = document.getElementById(cardId + ‘_link’);
const link = linkEl ? linkEl.value : ‘’;
const nameEl = document.getElementById(cardId + ‘_name’);
const name = nameEl ? nameEl.value : ‘ผลงาน’;

if (!link) {
showToast(‘❌ ยังไม่มีลิงค์ตัวอย่าง’);
return;
}

const modal = document.getElementById(‘previewModal’);
if (!modal) return;

document.getElementById(‘previewTitle’).textContent = name || ‘ดูตัวอย่าง’;
document.getElementById(‘previewLinkDisplay’).textContent = link;
document.getElementById(‘previewGoBtn’).href = link;
modal.classList.add(‘show’);
}

function closePreviewModal() {
const modal = document.getElementById(‘previewModal’);
if (modal) modal.classList.remove(‘show’);
}

// ===== IMAGE EXPAND MODAL =====
function openImgModal(src) {
const modal = document.getElementById(‘imgModal’);
if (!modal) return;
document.getElementById(‘imgModalSrc’).src = src;
modal.classList.add(‘show’);
}

function closeImgModal() {
const modal = document.getElementById(‘imgModal’);
if (modal) modal.classList.remove(‘show’);
}

// ===== LOAD SAVED IMAGES =====
function loadSavedImages() {
// Load header avatar
const avatarData = localStorage.getItem(STORE_KEY + ‘headerAvatar’);
if (avatarData) {
const el = document.getElementById(‘headerAvatar’);
if (el) el.innerHTML = `<img src="${avatarData}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"><div class="admin-overlay">✏️</div>`;
}

// Load recent imgs
for (let i = 0; i < 4; i++) {
const data = localStorage.getItem(STORE_KEY + ‘recentImg’ + i);
if (data) {
const el = document.getElementById(‘recentImg’ + i);
if (el) el.innerHTML = `<img src="${data}" style="width:100%;height:100%;object-fit:cover;" onclick="openImgModal('${data}')">`;
}
}
}

// ===== WORK PAGE INIT =====
function initWorkPage(pageKey, container, hasPreview = true) {
const saved = JSON.parse(localStorage.getItem(STORE_KEY + pageKey + ‘_works’) || ‘{}’);
const grid = document.getElementById(container);
if (!grid) return;

// Load saved works
Object.keys(saved).forEach(cardId => {
const opts = saved[cardId];
opts.hasPreview = hasPreview;
const card = createWorkCard(pageKey, opts);
// Override ID to match saved
grid.appendChild(card);
});

// Add initial empty card if none
if (Object.keys(saved).length === 0) {
const card = createWorkCard(pageKey, { hasPreview });
grid.appendChild(card);
const card2 = createWorkCard(pageKey, { hasPreview });
grid.appendChild(card2);
}

// Add work button
const addBtn = document.getElementById(‘addWorkBtn_’ + pageKey);
if (addBtn) {
addBtn.onclick = () => {
const card = createWorkCard(pageKey, { hasPreview });
grid.appendChild(card);
if (isAdmin) {
// Make name input editable
const nameInput = card.querySelector(’.work-name-input’);
if (nameInput) nameInput.removeAttribute(‘readonly’);
}
};
}
}

// ===== FAQ ACCORDION =====
function initFAQ() {
const items = document.querySelectorAll(’.faq-q’);
items.forEach(q => {
q.addEventListener(‘click’, () => {
const answer = q.nextElementSibling;
const isOpen = q.classList.contains(‘open’);

```
  // Close all
  document.querySelectorAll('.faq-q').forEach(i => i.classList.remove('open'));
  document.querySelectorAll('.faq-a').forEach(i => i.classList.remove('open'));
  
  if (!isOpen) {
    q.classList.add('open');
    answer.classList.add('open');
  }
});
```

});
}

// ===== CLOSE MODAL ON OVERLAY CLICK =====
document.addEventListener(‘click’, (e) => {
if (e.target.classList.contains(‘modal-overlay’)) closeAdminModal();
if (e.target.classList.contains(‘preview-modal’)) closePreviewModal();
if (e.target.classList.contains(‘img-modal’)) closeImgModal();
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener(‘keydown’, (e) => {
if (e.key === ‘Escape’) {
closeAdminModal();
closePreviewModal();
closeImgModal();
}
});

// Export for use in sub-pages
window.NONIOAEY = {
isAdmin: () => isAdmin,
showToast,
createWorkCard,
initWorkPage,
initFAQ,
openImgModal,
closeImgModal,
showPreview,
closePreviewModal,
uploadWorkImg,
createFileInput,
STORE_KEY
};
