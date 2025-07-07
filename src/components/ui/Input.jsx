export default function Input({ label, error, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-900">
        {label}
      </span>
      <input
        className="w-full rounded border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-white 
                   placeholder-gray-400 dark:placeholder-gray-500 
                   p-2 focus:outline-none focus:ring focus:ring-blue-500"
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </label>
  );
}
