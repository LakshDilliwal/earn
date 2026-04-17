import AiOutlineWarning from '@/components/icons/AiOutlineWarning';

export function ErrorSection({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex min-h-[92vh] w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <AiOutlineWarning size={96} className="text-slate-500" />
        <span className="mt-2 text-lg font-bold text-slate-500">
          {title || "Something broke. We're on it."}
        </span>
        <span className="mt-2 text-slate-500">
          {message ||
            "Couldn't load this right now. Refresh and try again."}
        </span>
      </div>
    </div>
  );
}
