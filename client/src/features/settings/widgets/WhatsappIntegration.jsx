import { useState, useEffect } from 'react';
import Modal from '../../../components/shared/DynamicModel';
import WhatsAppQr from './WhatsAppQr ';

export default function WhatsappIntegration({
  isLinked = false,
  linkedNumber = null,
  status = 'UNLINKED', // 'UNLINKED' | 'PAIRING' | 'READY'
  qr = null, // data URL from store while pairing
  loading = false,
  onLink,
  onUnlink,
}) {
  const [qrOpen, setQrOpen] = useState(false);

  // close modal when we become READY (linked)
  useEffect(() => {
    if (status === 'READY' && qrOpen) setQrOpen(false);
  }, [status, qrOpen]);

  const handleLink = async () => {
    setQrOpen(true); // open immediately; QR will arrive via polling
    try {
      await onLink?.();
    } catch {}
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        WhatsApp Integration
      </h2>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm ${
              isLinked
                ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
            }`}
          >
            {isLinked ? '✅ Connected' : '❌ Not Connected'}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            {isLinked
              ? `Linked with: ${linkedNumber || 'N/A'}`
              : status === 'PAIRING'
              ? 'Waiting for QR… open WhatsApp → Linked Devices.'
              : 'Click Link WhatsApp to start.'}
          </div>
        </div>

        {!isLinked ? (
          <button
            onClick={handleLink}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading || status === 'PAIRING'
              ? 'Generating QR…'
              : 'Link WhatsApp'}
          </button>
        ) : (
          <button
            onClick={onUnlink}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
          >
            {loading ? 'Unlinking…' : 'Unlink WhatsApp'}
          </button>
        )}
      </div>

      {/* QR Modal */}
      <Modal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title="Link WhatsApp"
      >
        {qr ? (
          <WhatsAppQr qr={qr} />
        ) : (
          <div className="text-sm text-gray-600 text-center">
            Waiting for QR…
          </div>
        )}
      </Modal>
    </div>
  );
}
