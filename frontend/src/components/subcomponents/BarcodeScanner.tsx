import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import "../../css/scanner.css";

interface BarcodeScannerProps {
  onScan: (type: string, data: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan }) => {
  const [code, setCode] = useState<string>("");
  const [text, setText] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.permissions
      .query({ name: "camera" as PermissionName })
      .then((result) => {
        if (result.state === "denied") {
          // Show your message here
          console.warn("Camera access denied");
        }
      });

    if (!code) {
      const codeReader = new BrowserMultiFormatReader();

      /* const promise = */ codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result, _, controls) => {
          if (result) {
            setCode(result.getText());
            controls.stop();
            // const video = videoRef.current;
            // const stream = video?.srcObject as MediaStream;
            // stream.getTracks().forEach((track) => track.stop());
            // if (video) {
            //   video.srcObject = null;
            //   video.removeAttribute("src");
            //   video.load();
            // }
            // promise.then((controlPromise) => {controlPromise.stop()})
          }
          if(code)
          {
            controls.stop();
          }
        },
      );
    }
  }, [code]);

  const handleSubmit = (): void => {
    if (code.trim()) {
      onScan("barcode", code.trim());
    }
  };

  return (
    <>
      <div className="flex py-8 justify-center">
        {code === "" ? (
          <div className="flex-col justify-center text-center">
            <div className="text-gray-600 dark:text-gray-400 mb-4">
              Hold your device steady and align the barcode within the scanning area
            </div>
            <div className="relative rounded-2xl">
              <video
                ref={videoRef}
                className="w-full max-w-2xl max-h-[20svh] rounded-2xl object-cover opacity-100"
              />
              <div className="absolute inset-0 border-4 dark:border-2 border-green-600 dark:border-green-600 pointer-events-none rounded-2xl" />
              <div className="absolute inset-4 h-1 bg-red-600 opacity-80 pointer-events-none scanline-animation rounded-full" />
            </div>
            <div className="text-gray-600 dark:text-gray-400 my-8">
              OR
            </div>
            <div className="flex gap-2 justify-center max-w-2xl text-gray-900 dark:text-gray-100">
              <input
                type="text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                }}
                placeholder="Barcode text here"
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                onClick = {() => setCode(() => text)}
                className="px-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" className="fill-none stroke-3 stroke-gray-400 dark:stroke-gray-500">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-col">
            <div className="flex-col text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Scan Successful
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Code: {code}</p>
            </div>
            <div className="flex mt-4 gap-4 w-full justify-center">
              <button
                className="flex items-center gap-2 mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md hover:shadow-md cursor-pointer transition-all duration-300"
                onClick={() => setCode("")}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit()}
                className="flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 hover:shadow-md cursor-pointer transition-all duration-300"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="stroke-2 stroke-current"
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BarcodeScanner;
