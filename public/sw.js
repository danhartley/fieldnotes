const getResponseDetails = async (response) => {
  const acceptedStatuses = [200, 304];
  const status = response.status();    

  if (!response || !acceptedStatuses.includes(status)) {
    return null
  }

  const url = response.url();

  const buffer = await response.buffer();
  const uncompressedBytes = buffer.length;
  const compressedContentLength = response.headers()['content-length'];
  const compressedBytes = compressedContentLength
    ? parseInt(compressedContentLength, 10)
    : 0;
  const contentType = response.headers()['content-type'];
  const encoding = response.headers()['content-encoding'] || 'n/a';
  const resourceType = response.request().resourceType();    

  return {
      url,
      contentType,
      compressedBytes,
      uncompressedBytes,
      encoding,
      resourceType,
  }
};

// db constants

const DB = 'emissionsDB';
const STORE = 'emissions';

const openDatabase = async () => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const request = indexedDB.open(DB, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        // Use auto generated id` as the record key
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement:true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  })
};

const saveNetworkTraffic = async (requestResponse) => {
  const db = await openDatabase();
  const tx = db.transaction(STORE, 'readwrite');
  const emissions = tx.objectStore(STORE);

  // Query the db for an entry with the key of the new record we want to add
  const request = emissions.get(requestResponse.url);

  request.onsuccess = (event) => {
    // There is no entry for this key, so we create a new record
    if (!event.target.result) {
      emissions.add(requestResponse);
    }
  };
  request.onerror = (e) => {
    // There was an error checking for an existing record
    console.log(e);
  };

  await new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = tx.onabort = reject;
  });
  db.close();
};

const fetchHandler = (event) => {
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);
        const responseDetails = getResponseDetails(response);

        saveNetworkTraffic(responseDetails);

        return response
      } catch (e) {
        console.log(e);
      }
    })()
  );
};

try {
  // eslint-disable-next-line no-undef
  self.addEventListener('fetch', fetchHandler);
} catch (e) {
  console.log(
    'The Node.js development environment does not support (browser) service workers.'
  );
  console.log(e);
}
//# sourceMappingURL=sw.js.map
