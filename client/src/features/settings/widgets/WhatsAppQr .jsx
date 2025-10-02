// src/features/settings/widgets/WhatsAppQr.jsx
const normalizeQr = (q) => {
  if (!q) return null;
  return q.startsWith('data:image') ? q : `data:image/png;base64,${q}`;
};

export default function WhatsAppQr({ qr }) {
  const src = normalizeQr(qr);
  if (!src) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={src}
        alt="WhatsApp QR"
        className="w-[220px] h-[220px] rounded-xl border border-gray-200 shadow-lg object-contain bg-white p-2"
      />
      <p className="text-gray-500 text-sm text-center">
        Open WhatsApp → Linked Devices → Scan this QR to connect.
      </p>
    </div>
  );
}
