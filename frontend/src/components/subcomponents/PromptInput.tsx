import { useState } from "react";

interface promptProps {
  onSubmit: (type: string, data: string) => void;
}

const PromptInput: React.FC<promptProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmit = ():void => {
    if(prompt.trim()) {
      onSubmit("prompt", prompt.trim())
    }
  }
  return (
    <>
      <div className="flex-col mx-auto pt-4 max-w-4xl">
        <textarea
          rows={4}
          placeholder="Enter product description..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
        />
        <div className="flex gap-4 w-full justify-end">
          {prompt == "" || (
            <button
              className="flex items-center gap-2 mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md hover:shadow-md cursor-pointer transition-all duration-300"
              onClick={() => setPrompt("")}
            >
              Cancel
            </button>
          )}
          <button
            disabled={prompt === ""}
            className="flex disabled:bg-gray-500 dark:disabled:bg-gray-700 items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 hover:shadow-md not-disabled:cursor-pointer transition-all duration-300"
            onClick={() => handleSubmit()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-2 stroke-current"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PromptInput;
