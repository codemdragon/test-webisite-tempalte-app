// IndexedDB Setup
let db;
const request = indexedDB.open("WebViewDB", 1);

request.onupgradeneeded = e => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("state")) {
        db.createObjectStore("state", { keyPath: "id" });
    }
};

request.onsuccess = e => {
    db = e.target.result;
    loadState();
};

request.onerror = e => {
    console.error("DB error", e);
};

// Elements
const counterSpan = document.getElementById("counter");
const increaseBtn = document.getElementById("increase");
const resetBtn = document.getElementById("reset");
const notesArea = document.getElementById("notes");

// Load stored state
function loadState() {
    if (!db) return;

    const tx = db.transaction("state", "readonly");
    const store = tx.objectStore("state");

    // Counter
    store.get("counter").onsuccess = e => {
        counterSpan.textContent = e.target.result ? e.target.result.value : 0;
    };

    // Notes
    if (notesArea) {
        store.get("notes").onsuccess = e => {
            notesArea.value = e.target.result ? e.target.result.value : "";
        };
        notesArea.addEventListener("input", () => {
            saveState("notes", notesArea.value);
        });
    }
}

// Save state
function saveState(key, value) {
    if (!db) return;
    const tx = db.transaction("state", "readwrite");
    tx.objectStore("state").put({ id: key, value });
}

// Counter logic
if (increaseBtn) increaseBtn.addEventListener("click", () => {
    let value = parseInt(counterSpan.textContent) + 1;
    counterSpan.textContent = value;
    saveState("counter", value);
});

if (resetBtn) resetBtn.addEventListener("click", () => {
    counterSpan.textContent = 0;
    saveState("counter", 0);
});
