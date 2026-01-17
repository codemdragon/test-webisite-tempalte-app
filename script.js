// Open or create DB
let db;
const request = indexedDB.open("TestWebViewDB", 1);

request.onupgradeneeded = function(e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains("state")) {
        db.createObjectStore("state", { keyPath: "id" });
    }
};

request.onsuccess = function(e) {
    db = e.target.result;
    loadCounter();
};

request.onerror = function(e) {
    console.error("DB error", e);
};

// Counter logic
const counterSpan = document.getElementById("counter");
const increaseBtn = document.getElementById("increase");
const resetBtn = document.getElementById("reset");

function loadCounter() {
    const tx = db.transaction("state", "readonly");
    const store = tx.objectStore("state");
    const getRequest = store.get("counter");
    getRequest.onsuccess = function() {
        let value = getRequest.result ? getRequest.result.value : 0;
        counterSpan.textContent = value;
    };
}

function saveCounter(value) {
    const tx = db.transaction("state", "readwrite");
    const store = tx.objectStore("state");
    store.put({ id: "counter", value });
}

if (increaseBtn) {
    increaseBtn.addEventListener("click", () => {
        let value = parseInt(counterSpan.textContent) + 1;
        counterSpan.textContent = value;
        saveCounter(value);
    });
}

if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        counterSpan.textContent = 0;
        saveCounter(0);
    });
}
