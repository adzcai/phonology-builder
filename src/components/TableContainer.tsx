import { PropsWithChildren } from 'react';

export default function TableContainer({
  children, classes, borderCollapse = false,
}: PropsWithChildren<{ classes?: string, borderCollapse?: boolean }>) {
  return (
    <div className={`w-full h-full overflow-x-auto rounded-xl mx-auto max-w-2xl border-black border-8 bg-white ${classes}`}>
      <table className={`whitespace-nowrap w-full h-full ${borderCollapse ? 'border-collapse' : 'border-separate'}`} style={{ borderSpacing: 0 }}>
        {children}
      </table>
    </div>
  );
}
