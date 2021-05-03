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

function saveRecord(record) {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  store.add(record)
}

function checkDatabase() {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  const getAll = store.getAll()

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = db.transaction(['pending'], 'readwrite')
          const store = transaction.objectStore('pending')

          store.clear();
          alert('All saved transactions have been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}

window.addEventListener('online', checkDatabase) 