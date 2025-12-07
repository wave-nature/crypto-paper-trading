export default function Modal({
  className,
  children,
  width = 'max-w-md'
}: Readonly<{
  className?: string;
  children: React.ReactNode;
  width?: string;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 ${width} border border-violet-200 ${className}`}>
        {children}
      </div>
    </div>
  );
}
