// db constants

const DB = 'emissionsDB';
const STORE = 'emissions';
const compressionRates = {
  brotli: [
    {
      level: 0,
      rate: 1.2,
    },
    {
      level: 1,
      rate: 2.1,
    },
    {
      level: 2,
      rate: 2.5,
    },
    {
      level: 3,
      rate: 3.0,
    },
    {
      level: 4,
      rate: 3.5,
    },
    {
      level: 5,
      rate: 4.0,
    },
    {
      level: 6,
      rate: 4.3,
    },
    {
      level: 7,
      rate: 4.6,
    },
    {
      level: 8,
      rate: 4.9,
    },
    {
      level: 9,
      rate: 5.0,
    },
    {
      level: 10,
      rate: 5.1,
    },
    {
      level: 11,
      rate: 5.2,
    },
  ],
  gzip: [
    {
      level: 0,
      rate: 1,
    },
    {
      level: 1,
      rate: 1.5,
    },
    {
      level: 2,
      rate: 2.0,
    },
    {
      level: 3,
      rate: 2.3,
    },
    {
      level: 4,
      rate: 2.5,
    },
    {
      level: 5,
      rate: 2.8,
    },
    {
      level: 6,
      rate: 3.0,
    },
    {
      level: 7,
      rate: 3.2,
    },
    {
      level: 8,
      rate: 3.3,
    },
    {
      level: 9,
      rate: 3.4,
    },
  ],
};

const getBytes = ({
  compressedBytes,
  uncompressedBytes,
  encoding,
  compressionOptions,
}) => {
  if (compressedBytes !== 0) return compressedBytes

  return (
    compressUncompressedBytes({
      encoding,
      bytes: uncompressedBytes,
      compressionOptions,
    }) || 0
  )
};

const compressUncompressedBytes = ({
  encoding,
  bytes,
  compressionOptions,
}) => {
  // default compression rates
  let BR = compressionRates.brotli.find((b) => b.level === 3).rate;
  let GZIP = compressionRates.gzip.find((g) => g.level === 5).rate;
  let DEFLATE = 1; // tbd
  let ZSTD = 1; // tbd

  if (compressionOptions) {
    BR =
      compressionRates.brotli.find((b) => b.level === compressionOptions.br)
        ?.rate || BR;
    GZIP =
      compressionRates.gzip.find((g) => g.level === compressionOptions.gzip)
        ?.rate || GZIP;
  }

  let ratio;
  switch (encoding) {
    case 'br':
      ratio = BR;
      break
    case 'gzip':
      ratio = GZIP;
      break
    case 'deflate':
      ratio = DEFLATE;
      break
    case 'zstd':
      ratio = ZSTD;
      break
    default:
      ratio = 1;
  }

  return Math.round(bytes / ratio)
};

const getResponseDetails = async (response, env, compressionOptions) => {
  const acceptedStatuses = [200, 304];
  const status = response.status ;

  if (!response || !acceptedStatuses.includes(status)) {
    return null
  }

  const isBrowser = env === 'browser';

  const getHeader = (header) =>
    response.headers.get(header)
      ;
  const getBuffer = async () =>
    response.arrayBuffer() ;

  const url = isBrowser ? response.url : response.url();
  const contentLength = getHeader('Content-Length');
  const contentType = getHeader('Content-Type');
  const contentEncoding = getHeader('Content-Encoding') || 'n/a';
  const buffer = await getBuffer();

  const uncompressedBytes = buffer.length;
  const compressedBytes = contentLength ? parseInt(contentLength, 10) : 0;
  const bytes = getBytes({
    compressedBytes,
    uncompressedBytes,
    encoding: contentEncoding,
    compressionOptions,
  });

  let resourceType;

  {
    if (contentType.includes('text/html')) {
      resourceType = 'document';
    } else if (contentType.includes('application/javascript')) {
      resourceType = 'script';
    } else if (contentType.includes('image/')) {
      resourceType = 'image';
    } else {
      resourceType = 'other';
    }
  }

  return {
    url,
    contentType,
    compressedBytes,
    uncompressedBytes,
    bytes,
    encoding: contentEncoding,
    resourceType,
  }
};

const openDatabase = async () => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const request = indexedDB.open(DB, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        // Use auto generated id` as the record key
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
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

const saveNetworkTraffic = async (responseDetails) => {
  const db = await openDatabase();
  const tx = db.transaction(STORE, 'readwrite');
  const emissions = tx.objectStore(STORE);

  const record = {
    url: responseDetails.url,
    bytes: responseDetails.bytes,
    contentType: responseDetails.contentType,
    resourceType: responseDetails.resourceType,
  };

  await emissions.add(record);

  db.close();
};

const fetchHandler = (event) => {
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);
        const clonedResponse = response.clone();
        const responseDetails = await getResponseDetails(
          clonedResponse,
          'browser'
        );

        if (responseDetails) {
          await saveNetworkTraffic(responseDetails);
        }

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
