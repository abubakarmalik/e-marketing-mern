const ContactsTableSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Sr No.', 'Number', 'Group', 'Status', 'Edit', 'Delete'].map(
              (header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(10)].map((_, idx) => (
            <tr key={idx} className="animate-pulse">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-6 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsTableSkeleton;
