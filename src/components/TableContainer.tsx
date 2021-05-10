import { PropsWithChildren } from 'react';

export default function TableContainer({
  children, classes,
}: PropsWithChildren<{ classes: string }>) {
  return (
    <div className={`overflow-x-auto max-w-2xl mx-auto rounded-xl border-black border-dashed border-4 ${classes}`}>
      <table className="w-full whitespace-nowrap border-separate" style={{ borderSpacing: 0 }}>
        {children}
      </table>
    </div>
  );
}
