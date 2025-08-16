// istanbul ignore file: experimental
import { has } from "lodash";
import { getRuntime } from "@next-core/runtime";
import antdIcons from "../antd-icon/generated/icons.json";
import easyopsIcons from "../easyops-icon/generated/icons.json";
import faIcons from "../fa-icon/generated/icons.json";
import lucideIcons from "../lucide-icon/generated/icons.json";
import antdRanges from "../antd-icon/generated/ranges.json";
import faRanges from "../fa-icon/generated/ranges.json";
import easyopsRanges from "../easyops-icon/generated/ranges.json";
import lucideRanges from "../lucide-icon/generated/ranges.json";

const publicPath =
  process.env.NODE_ENV === "test" ? "" : __webpack_public_path__;

const SETTINGS_MAP = {
  antd: {
    url: `${publicPath}chunks/antd-icons/all.${antdRanges._hash}.svg`,
    icons: antdIcons,
    ranges: antdRanges,
  },
  fa: {
    url: `${publicPath}chunks/fa-icons/all.${faRanges._hash}.json`,
    icons: faIcons,
    ranges: faRanges,
  },
  easyops: {
    url: `${publicPath}chunks/easyops-icons/all.${easyopsRanges._hash}.svg`,
    icons: easyopsIcons,
    ranges: easyopsRanges,
  },
  lucide: {
    url: `${publicPath}chunks/lucide-icons/all.${lucideRanges._hash}.svg`,
    icons: lucideIcons,
    ranges: lucideRanges,
  },
} as unknown as Record<string, Settings>;

const TEST_URL = `${publicPath}manifest.json`;

let supports =
  process.env.NODE_ENV !== "test" &&
  getRuntime?.()?.getFeatureFlags()["icons-multipart-range-request"];

const supportsPromise = new Promise<boolean>((resolve) => {
  if (!supports) {
    resolve(false);
    return;
  }

  const waitSeconds = 3;
  const timeout = setTimeout(() => {
    // eslint-disable-next-line no-console
    console.warn(
      `Multipart range request test timed out after ${waitSeconds} seconds`
    );
    resolve(false);
  }, waitSeconds * 1000);

  (async () => {
    const res = await fetch(TEST_URL, {
      headers: {
        Range: `bytes=0-1, 3-4`,
      },
    });

    if (!res.ok || res.status !== 206) {
      // eslint-disable-next-line no-console
      console.warn(
        `Multipart range request test failed with status: ${res.status} ${res.statusText}`
      );
      resolve(false);
      clearTimeout(timeout);
      return;
    }

    const contentType = res.headers.get("Content-Type");
    if (
      !contentType?.match(/\bmultipart\/byteranges;\s*\S*?boundary=([^\s;]+)/)
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        `Multipart range request test failed with unexpected Content-Type: "${contentType}"`
      );
      resolve(false);
      clearTimeout(timeout);
      return;
    }

    resolve(true);
    clearTimeout(timeout);
  })();
});

export async function supportsMultipartRangeRequest() {
  if (!supports) {
    return false;
  }
  return await supportsPromise;
}

type Lib = "antd" | "fa" | "easyops" | "lucide";

interface Settings {
  url: string;
  icons: Record<string, string[]>;
  ranges: Record<string, number[]>;
}

const dbPromise = new Promise<IDBDatabase | null>((resolve) => {
  if (!window.indexedDB) {
    if (process.env.NODE_ENV !== "test") {
      // eslint-disable-next-line no-console
      console.error("IndexedDB is not supported in this browser.");
    }
    resolve(null);
    return;
  }
  new Promise<IDBDatabase | null>((initResolve) => {
    const req = window.indexedDB.open("icons");
    let upgraded = false;
    req.onsuccess = (event) => {
      if (upgraded) {
        return;
      }
      const db = (event.target as IDBOpenDBRequest).result;
      initResolve(db);
    };

    req.onerror = (event) => {
      // eslint-disable-next-line no-console
      console.error(
        "Database failed to open:",
        (event.target as IDBOpenDBRequest).error
      );
      initResolve(null);
    };

    req.onupgradeneeded = (event) => {
      upgraded = true;
      const db = (event.target as IDBOpenDBRequest).result;
      // These transactions maybe the same.
      const transactions = new Set<IDBTransaction>();
      for (const lib of ["antd", "fa", "easyops", "lucide"]) {
        if (!db.objectStoreNames.contains(lib)) {
          transactions.add(db.createObjectStore(lib).transaction);
        }
      }

      Promise.all(
        [...transactions].map(
          async (transaction) =>
            new Promise<void>((libResolve, libReject) => {
              transaction.oncomplete = async () => {
                libResolve();
              };
              transaction.onabort = async () => {
                libReject();
              };
              transaction.onerror = async () => {
                libReject();
              };
            })
        )
      ).then(
        () => {
          initResolve(db);
        },
        () => {
          initResolve(null);
        }
      );
    };
  }).then((db) => {
    if (!db) {
      resolve(null);
      return;
    }
    Promise.all(
      ["antd", "fa", "easyops", "lucide"].map(
        async (lib) =>
          new Promise<void>((libResolve, libReject) => {
            new Promise<string | null>((hashResolve) => {
              const trans = db.transaction(lib, "readwrite");
              const store = trans.objectStore(lib);
              const req = store.get("_hash");
              req.onsuccess = (e) => {
                hashResolve((e.target as IDBRequest).result);
              };
              req.onerror = (e) => {
                // eslint-disable-next-line no-console
                console.error("DB get error:", (e.target as IDBRequest).error);
                hashResolve(null);
              };
            }).then((previousHash) => {
              const currentHash = SETTINGS_MAP[lib].ranges
                ._hash as unknown as string;
              if (previousHash === currentHash) {
                libResolve();
                return;
              }
              const trans = db.transaction(lib, "readwrite");
              const store = trans.objectStore(lib);
              if (previousHash) {
                store.clear();
              }
              store.put(currentHash, "_hash");
              trans.oncomplete = () => {
                libResolve();
              };
              trans.onabort = (e) => {
                // eslint-disable-next-line no-console
                console.error(
                  "Transaction aborted:",
                  (e.target as IDBTransaction).error
                );
                libReject();
              };
              trans.onerror = (e) => {
                // eslint-disable-next-line no-console
                console.error(
                  "Transaction failed:",
                  (e.target as IDBTransaction).error
                );
                libReject();
              };
            });
          })
      )
    ).then(
      () => {
        resolve(db);
      },
      () => {
        resolve(null);
      }
    );
  });
});

export class RangeRequest {
  queue = new Set<string>();
  cache = new Map<string, Promise<string>>();
  batchTime = 200;
  timer: null | ReturnType<typeof setTimeout> = null;
  pendingRequests = new Map<
    string,
    { resolve: (result: string) => void; reject: (reason: unknown) => void }
  >();
  lib: Lib;
  settings: Settings;

  constructor(lib: Lib) {
    this.lib = lib;
    this.settings = SETTINGS_MAP[lib];
  }

  async fetch(id: string): Promise<string> {
    let promise = this.cache.get(id);
    if (promise) {
      return promise;
    }

    const db = await dbPromise;
    if (db) {
      const promiseFromDb = new Promise<string | null>((resolve, reject) => {
        try {
          const transaction = db.transaction(this.lib, "readwrite");
          transaction.onerror = (event) => {
            // eslint-disable-next-line no-console
            console.error(
              "Transaction get failed:",
              (event.target as IDBTransaction).error
            );
          };
          transaction.onabort = (event) => {
            // eslint-disable-next-line no-console
            console.error(
              "Transaction get aborted:",
              (event.target as IDBTransaction).error
            );
          };

          const store = transaction.objectStore(this.lib);
          const req = store.get(id);
          req.onsuccess = (event) => {
            const result = (event.target as IDBRequest).result;
            if (result) {
              resolve(result);
            } else {
              resolve(null);
            }
          };
          req.onerror = (event) => {
            // eslint-disable-next-line no-console
            console.error("DB get error:", (event.target as IDBRequest).error);
            resolve(null);
          };
        } catch (e) {
          reject(e);
        }
      });
      const result = await promiseFromDb;
      if (result) {
        this.cache.set(id, promiseFromDb as Promise<string>);
        return result;
      }
    }

    promise = new Promise((resolve, reject) => {
      this.queue.add(id);
      this.pendingRequests.set(id, { resolve, reject });
      if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.batchTime);
      }
    });
    this.cache.set(id, promise);

    promise
      .then((result) => {
        if (db && result) {
          const transaction = db.transaction(this.lib, "readwrite");
          transaction.onerror = (event) => {
            // eslint-disable-next-line no-console
            console.error(
              "Transaction put failed:",
              (event.target as IDBTransaction).error
            );
          };
          transaction.onabort = (event) => {
            // eslint-disable-next-line no-console
            console.error(
              "Transaction put aborted:",
              (event.target as IDBTransaction).error
            );
          };
          const store = transaction.objectStore(this.lib);
          const req = store.put(result, id);
          req.onerror = (event) => {
            // eslint-disable-next-line no-console
            console.error("DB put error:", (event.target as IDBRequest).error);
          };
        }
      })
      .catch(() => {
        // Icon not found
      });

    return promise;
  }

  async flush() {
    const ids = Array.from(this.queue);
    this.queue.clear();
    this.timer = null;

    if (ids.length < 2) {
      const id = ids[0];
      const pendingRequest = this.pendingRequests.get(id);
      if (pendingRequest) {
        pendingRequest.reject("Icon not found");
        this.pendingRequests.delete(id);
      }
      return;
    }

    const results = await request(ids, this.settings);

    const handledIds = new Set<string>();

    if (results) {
      for (const [id, result] of results) {
        const pendingRequest = this.pendingRequests.get(id);
        if (pendingRequest) {
          handledIds.add(id);
          if (result) {
            pendingRequest.resolve(result);
          } else {
            pendingRequest.reject("Icon not found");
          }
          this.pendingRequests.delete(id);
        }
      }
    }

    for (const id of ids) {
      if (!handledIds.has(id)) {
        const pendingRequest = this.pendingRequests.get(id);
        if (pendingRequest) {
          pendingRequest.reject("Icon not found");
          this.pendingRequests.delete(id);
        }
      }
    }
  }
}

async function request(
  ids: string[],
  { url, icons, ranges }: Settings
): Promise<Map<string, string | undefined> | null | undefined> {
  const bytes: string[] = [];
  const bytesToId = new Map<string, string>();

  for (const id of ids) {
    const [group, name] = id.split("/");
    const index =
      has(icons, group) && has(ranges, group) ? icons[group].indexOf(name) : -1;
    if (index > -1) {
      const end = ranges[group][index];
      let start = 0;
      if (
        index > 0 ||
        Object.values(ranges).some(
          (list) => Array.isArray(list) && list[0] < end
        )
      ) {
        let temp = index > 0 ? ranges[group][index - 1] : 0;
        for (const [g, list] of Object.entries(ranges)) {
          if (Array.isArray(list) && g !== group) {
            for (const n of list) {
              if (n < end && n > temp) {
                temp = n;
              }
            }
          }
        }
        start = temp + 2;
      }
      const byte = `${start}-${end}`;
      bytes.push(byte);
      bytesToId.set(byte, id);
    } else {
      // eslint-disable-next-line no-console
      console.error("Icon not found in ranges.json:", id);
    }
  }

  if (bytes.length < 2) {
    return;
  }

  const response = await fetch(url, {
    headers: {
      Range: `bytes=${bytes.join(", ")}`,
    },
  });

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(
      `Response failed with status: ${response.status} ${response.statusText}`
    );
    return;
  }

  if (response.status !== 206) {
    // eslint-disable-next-line no-console
    console.error(
      `Unexpected response status: ${response.status} ${response.statusText}`
    );
    supports = false;
    return;
  }

  const contentType = response.headers.get("Content-Type");

  const matches = contentType?.match(
    /\bmultipart\/byteranges;\s*\S*?boundary=([^\s;]+)/
  );
  if (!matches) {
    // eslint-disable-next-line no-console
    console.error(`Unexpected Content-Type: "${contentType}"`);
    supports = false;
    return;
  }

  const boundary = matches[1];
  const text = await response.text();
  const parts = parseMultipartResponse(text, boundary);

  return new Map(bytes.map((byte) => [bytesToId.get(byte)!, parts.get(byte)]));
}

function parseMultipartResponse(text: string, boundary: string) {
  const boundaryDelimiter = `--${boundary}`;
  const parts = text
    .split(boundaryDelimiter)
    .filter((part) => part.trim() !== "" && !part.startsWith("--"));

  return new Map(
    parts
      .map((part) => {
        const [headers, body] = part.split("\r\n\r\n");
        let range: string | undefined;
        for (const line of headers.split("\r\n")) {
          const [key, value] = line.toLowerCase().split(": ");
          if (key === "content-range") {
            const matches = value.match(/\bbytes (\d+-\d+)\//);
            if (matches) {
              range = matches[1];
            }
            break;
          }
        }
        if (range) {
          return [range, body];
        }
      })
      .filter(Boolean) as [string, string][]
  );
}
