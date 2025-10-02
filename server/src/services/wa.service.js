const { create, ev } = require('@open-wa/wa-automate');
const path = require('path');
const fs = require('fs-extra');
const QR = require('qrcode');

const SESSION_ID = process.env.WA_SESSION_ID || 'openwa-session ';
const SESSION_PATH = path.join(process.cwd(), 'wa-openwa-session');

let client = null;
let clientPromise = null;
let status = 'UNLINKED';
let qrDataUrl = null;
let linkedNumber = null;

function resetState() {
  client = null;
  clientPromise = null;
  status = 'UNLINKED';
  qrDataUrl = null;
  linkedNumber = null;
}

// --- normalize ANY QR payload to a data URL ---
function toDataUrl(q) {
  if (!q) return null;
  if (typeof q === 'string') {
    // already a data URL?
    if (q.startsWith('data:image')) return q;
    return `data:image/png;base64,${q}`;
  }
  // sometimes the event gives an object
  const raw = q.base64 || q.qr || q.data || q.image || q.img || q.payload || '';
  if (!raw) return null;
  return raw.startsWith('data:image') ? raw : `data:image/png;base64,${raw}`;
}

let qrListenerAttached = false;
function attachQrListenerOnce() {
  if (qrListenerAttached) return;
  qrListenerAttached = true;

  // open-wa emits multiple qr events; wildcard to catch them all
  ev.on('qr.**', (payload /*, sessionId */) => {
    const dataUrl = toDataUrl(payload);
    if (dataUrl) {
      qrDataUrl = dataUrl;
      status = 'PAIRING';
      // console.log('QR len:', dataUrl.length); // optional debug
    }
  });
}

async function initClient() {
  if (client) return client;
  if (clientPromise) return clientPromise;

  status = 'PAIRING';
  attachQrListenerOnce();

  clientPromise = create({
    sessionId: SESSION_ID,
    sessionDataPath: SESSION_PATH,
    multiDevice: true,
    restartOnCrash: false,
    headless: true, // no window ever
    useChrome: false,
    // launchTimeout: 180000,
    qrTimeout: 0,
    authTimeout: 0,
    chromiumArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
    ],

    // keep this too; some builds still fire it:
    qrCallback: (qrBase64) => {
      const dataUrl = toDataUrl(qrBase64);
      if (dataUrl) {
        qrDataUrl = dataUrl;
        status = 'PAIRING';
      }
    },

    killProcessOnBrowserClose: false,
    cacheEnabled: false,
    disableSpins: true,
    logConsole: false,
  })
    .then(async (c) => {
      client = c;

      try {
        client.onStateChanged(async (st) => {
          if (st === 'CONFLICT' || st === 'UNLAUNCHED')
            return client.forceRefocus();
          if (st === 'CONNECTED') {
            try {
              const num = await client.getHostNumber();
              if (num) {
                linkedNumber = num;
                status = 'READY';
                qrDataUrl = null; // stop sending QR once linked
              }
            } catch {}
          }
        });
      } catch {}

      // fallback polling to set READY
      let tries = 0;
      const h = setInterval(async () => {
        tries += 1;
        if (status === 'READY' || tries > 15) return clearInterval(h);
        try {
          const num = await client.getHostNumber();
          if (num) {
            linkedNumber = num;
            status = 'READY';
            qrDataUrl = null;
            clearInterval(h);
          }
        } catch {}
      }, 1000);

      try {
        client.onLogout(() => resetState());
      } catch {}
      return client;
    })
    .catch((err) => {
      resetState();
      throw err;
    });

  return clientPromise;
}

async function requestLink() {
  await initClient();
  return getStatus();
}

async function getStatus() {
  return {
    linked: status === 'READY',
    status,
    number: linkedNumber,
    qr: status === 'PAIRING' ? qrDataUrl : null, // React reads this
  };
}

async function unlink() {
  try {
    if (client) {
      try {
        await client.logout();
      } catch {}
      // optional: try to close the page/browser without killing Node
      try {
        if (client?.pupPage && !client.pupPage.isClosed()) {
          await client.pupPage.close(); // close the tab
        }
        // If you really want to shut the browser instance:
        // await client._page?.browser()?.close();
      } catch {}
    }
  } finally {
    try {
      const dir = path.resolve(process.cwd(), SESSION_PATH);
      await fs.remove(path.join(dir, SESSION_ID));
      await fs.remove(path.join(dir, `_IGNORE_${SESSION_ID}`));
      await fs.remove(path.join(dir, 'data.json'));
    } catch {}
    resetState();
  }
  return { linked: false, status: 'UNLINKED', number: null, qr: null };
}

module.exports = { requestLink, getStatus, unlink };
