import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { selectCurrentUser } from '../../auth/authSlice';

export default function ProfileSettings({ onSubmit }) {
  const user = useSelector(selectCurrentUser); // expect { id, name, username }

  const [form, setForm] = useState({
    name: user?.name ?? '',
    username: user?.username ?? '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  useEffect(() => {
    setForm((f) => ({
      ...f,
      name: user?.name ?? '',
      username: user?.username ?? '',
    }));
  }, [user?.name, user?.username]);

  const isChangingPassword = useMemo(
    () => form.newPassword.length > 0 || form.confirmPassword.length > 0,
    [form.newPassword, form.confirmPassword],
  );

  const handleChange = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Display name is required';
    if (!form.username.trim()) e.username = 'Username is required';

    if (isChangingPassword) {
      if (!form.currentPassword)
        e.currentPassword = 'Current password is required';
      if (!form.newPassword) e.newPassword = 'New password is required';
      else if (form.newPassword.length < 8)
        e.newPassword = 'Use at least 8 characters';
      if (form.confirmPassword !== form.newPassword)
        e.confirmPassword = 'Passwords do not match';
      if (form.currentPassword && form.currentPassword === form.newPassword)
        e.newPassword = 'New password must differ from current';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => {
    const payload = { id: user?.id }; // always send id

    if (form.name.trim() !== (user?.name ?? ''))
      payload.name = form.name.trim();
    if (form.username.trim() !== (user?.username ?? ''))
      payload.username = form.username.trim();
    if (isChangingPassword) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = buildPayload();
    if (Object.keys(payload).length <= 1) {
      // only id is present
      toast('No changes to save', { icon: 'ℹ️' });
      return;
    }

    try {
      setSaving(true);
      if (onSubmit) {
        await toast.promise(onSubmit(payload), {
          loading: 'Saving changes…',
          success: 'Profile updated',
          error: (err) => err || 'Failed to update profile',
        });
      } else {
        await toast.promise(
          Promise.reject('Wire onSubmit to your API/thunk (update profile)'),
          { loading: 'Saving…', success: 'Saved', error: (m) => m },
        );
      }
      setForm((f) => ({
        ...f,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    'w-full px-3 py-2 rounded-lg border outline-none ring-2 ring-transparent transition';
  const ok = (k) =>
    errors[k]
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-300'
      : 'border-gray-300 focus:border-gray-500 focus:ring-gray-300';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Profile Settings
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            className={`${inputBase} ${ok('name')}`}
            placeholder="Enter your name"
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={form.username}
            onChange={handleChange('username')}
            className={`${inputBase} ${ok('username')}`}
            placeholder="your_username"
            autoComplete="username"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-rose-600">{errors.username}</p>
          )}
        </div>

        {/* Password section */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium text-gray-800">
              Change Password
            </h3>
            <span className="text-xs text-gray-500">
              Optional — leave blank to keep current password
            </span>
          </div>

          {/* Current */}
          <div className="mt-3">
            <div className="relative">
              <input
                type={show.current ? 'text' : 'password'}
                value={form.currentPassword}
                onChange={handleChange('currentPassword')}
                className={`${inputBase} ${ok('currentPassword')}`}
                placeholder="Current password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                className="absolute inset-y-0 right-2 px-1 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
              >
                {show.current ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New */}
          <div className="mt-3">
            <div className="relative">
              <input
                type={show.next ? 'text' : 'password'}
                value={form.newPassword}
                onChange={handleChange('newPassword')}
                className={`${inputBase} ${ok('newPassword')}`}
                placeholder="New password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                className="absolute inset-y-0 right-2 px-1 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
              >
                {show.next ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs text-rose-600">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm */}
          <div className="mt-3">
            <div className="relative">
              <input
                type={show.confirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                className={`${inputBase} ${ok('confirmPassword')}`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                className="absolute inset-y-0 right-2 px-1 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
              >
                {show.confirm ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
