import AiOutlineWarning from '@/components/icons/AiOutlineWarning';

export function ErrorInfo({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <AiOutlineWarning size={52} className="text-slate-500" />
      <span className="font-bold text-slate-500">
        {title || "Something broke. We're on it."}
      </span>
      <span className="text-sm text-slate-500">
        {message ||
          "Couldn't load this right now. Refresh and try again."}
      </span>
    </div>
  );
}
