const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result
  db.createObjectStore('pending', { autoIncrement: true })
}

request.onsuccess = (event) => {
  db = event.target.result
  if (navigator.onLine) {
    checkDatabase();
  }
}

request.onerror = event => console.log('Error' + event.target.errorCode)
