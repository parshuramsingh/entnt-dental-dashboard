import { useEffect } from 'react';
import { Paperclip } from 'lucide-react';

export default function FileUpload({ files, setFiles }) {
  function handleChange(e) {
    const newFiles = Array.from(e.target.files);

    const withPreviews = newFiles.map((file) => ({
      name: file.name,
      type: file.type,
      raw: file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFiles([...files, ...withPreviews]);
  }

  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, [files]);

  return (
    <div className="border border-dashed border-gray-400 dark:border-gray-600 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30">
      <label className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition">
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <div className="flex flex-col items-center justify-center gap-1">
          <Paperclip className="w-5 h-5 text-blue-500" />
          <span>Click or drag to upload files</span>
        </div>
      </label>

      {files.length > 0 && (
        <ul className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              {f.type?.startsWith('image/') ? (
                <img
                  src={f.previewUrl}
                  alt={f.name}
                  className="h-10 w-10 object-cover rounded border border-gray-300"
                />
              ) : (
                <img src="/pdf-icon.png" alt="file" className="h-8 w-8" />
              )}
              <span className="truncate">{f.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
