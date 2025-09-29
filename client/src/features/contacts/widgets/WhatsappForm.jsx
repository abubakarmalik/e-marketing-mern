import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

const FileIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-700">
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
      fill="currentColor"
      opacity=".7"
    />
    <path d="M14 2v6h6" fill="currentColor" opacity=".7" />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-700">
    <path
      d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
      fill="currentColor"
      opacity=".7"
    />
  </svg>
);

export default function WhatsappForm({ groups = [], initialValues, onSubmit }) {
  // message types (NO video)
  const messageTypes = [
    { value: 'text', label: 'Text Message', icon: '💬' },
    { value: 'image', label: 'Image', icon: '🖼️' },
    { value: 'pdf', label: 'PDF Document', icon: '📄' },
    { value: 'image-caption', label: 'Image with Caption', icon: '🖼️💬' },
    { value: 'pdf-caption', label: 'PDF with Caption', icon: '📄💬' },
  ];

  // ensure current category exists in dropdown
  const normalizedGroups = useMemo(() => {
    const base = groups ?? [];
    if (
      initialValues?.category &&
      !base.some((g) => g.value === initialValues.category)
    ) {
      return [
        {
          value: initialValues.category,
          label: initialValues?.categoryName || 'Current Category',
        },
        ...base,
      ];
    }
    return base;
  }, [groups, initialValues]);

  // form state
  const [selectedGroup, setSelectedGroup] = useState(
    initialValues?.category ?? normalizedGroups[0]?.value ?? '',
  );
  const [messageType, setMessageType] = useState(
    initialValues?.messageType ?? 'text',
  );
  const [textMessage, setTextMessage] = useState(
    initialValues?.textMessage ?? '',
  );
  const [caption, setCaption] = useState(initialValues?.caption ?? '');
  const [filePath, setFilePath] = useState(initialValues?.filePath ?? '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedGroup && normalizedGroups[0]?.value) {
      setSelectedGroup(normalizedGroups[0].value);
    }
  }, [normalizedGroups, selectedGroup]);

  const getIconForType = (type) => {
    if (type.includes('image')) return <ImageIcon />;
    if (type.includes('pdf')) return <FileIcon />;
    return <span className="text-2xl">💬</span>;
  };

  const resetForm = () => {
    setSelectedGroup(normalizedGroups[0]?.value ?? '');
    setMessageType('text');
    setTextMessage('');
    setCaption('');
    setFilePath('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!selectedGroup) return toast.error('Please select a group');
    if (messageType === 'text' && !textMessage.trim())
      return toast.error('Please enter a text message');
    if (messageType.includes('caption') && !caption.trim())
      return toast.error('Please enter a caption');
    if (/image|pdf/.test(messageType) && !filePath.trim())
      return toast.error('Please provide a server file path');

    const payload = {
      category: selectedGroup,
      messageType,
      ...(messageType === 'text' ? { textMessage: textMessage.trim() } : {}),
      ...(messageType.includes('caption') ? { caption: caption.trim() } : {}),
      ...(messageType !== 'text' ? { filePath: filePath.trim() } : {}),
    };

    try {
      setSubmitting(true);
      if (onSubmit) await onSubmit(payload);
      console.log('Broadcast payload:', payload);
      toast.success('Message prepared!');
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Failed to prepare message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gray-50 ring-1 ring-gray-100">
              {getIconForType(messageType)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                Broadcast Message
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Send different types of messages to all contacts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <span className="mr-1.5 block h-2 w-2 rounded-full bg-green-500" />
              Ready to Broadcast
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-6">
            {/* Group + Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Group */}
              <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-5 ring-1 ring-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Group
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  {normalizedGroups.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* WhatsApp Option */}
              <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-5 ring-1 ring-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Whatsapp Option
                </label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  {messageTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message / Caption */}
            {(messageType === 'text' || messageType.includes('caption')) && (
              <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-5 ring-1 ring-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {messageType === 'text' ? 'Message' : 'Caption'}
                </label>
                <textarea
                  value={messageType === 'text' ? textMessage : caption}
                  onChange={(e) =>
                    messageType === 'text'
                      ? setTextMessage(e.target.value)
                      : setCaption(e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder={
                    messageType === 'text'
                      ? 'Enter your message here...'
                      : 'Write a caption for the media...'
                  }
                />
              </div>
            )}

            {/* File Path (Image/PDF only) */}
            {/image|pdf/.test(messageType) && (
              <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-5 ring-1 ring-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {messageType.includes('image') ? 'Image Path' : 'PDF Path'}
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                  <div className="space-y-3 text-center">
                    <div className="text-4xl">📁</div>
                    <p className="text-sm text-gray-600">
                      Provide the <strong>server-side file path</strong> the
                      backend can access.
                    </p>
                    <p className="text-xs text-gray-500">
                      Example:
                      <code className="font-mono">C:\uploads\promo.jpg</code> or
                      <code className="font-mono">
                        /var/data/docs/brochure.pdf
                      </code>
                    </p>
                  </div>

                  <div className="mt-5">
                    <input
                      type="text"
                      value={filePath}
                      onChange={(e) => setFilePath(e.target.value)}
                      placeholder={
                        messageType.includes('image')
                          ? 'e.g., C:\\uploads\\banner.jpg'
                          : 'e.g., /var/data/brochure.pdf'
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    This will send JSON like
                    <code className="font-mono">{`{ type, caption?, filePath }`}</code>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-2 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none disabled:opacity-50 transition"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                    Broadcast Message
                  </>
                )}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition"
                onClick={resetForm}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                </svg>
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
