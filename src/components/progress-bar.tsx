export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="bg-gray-100 rounded-md h-3 w-full border border-gray-200 overflow-hidden shadow-sm">
      <div
        className="h-full rounded-md transition-all duration-300"
        style={{
          width: `${progress}%`,
          background: "#0f6cbd",
        }}
      />
    </div>
  );
}
