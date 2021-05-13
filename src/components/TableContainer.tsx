import { PropsWithChildren } from 'react';

export default function TableContainer({
  children, classes, tableClasses, borderCollapse = false,
}: PropsWithChildren<{ classes?: string, tableClasses?: string, borderCollapse?: boolean }>) {
  return (
    <div className={`w-full md:w-max max-w-full h-full overflow-x-auto rounded-xl mx-auto border-black border-8 bg-white ${classes}`}>
      <table className={`whitespace-nowrap rounded-xl w-full h-full ${borderCollapse ? 'border-collapse' : 'border-separate'} ${tableClasses}`} style={{ borderSpacing: 0 }}>
        {children}
      </table>
    </div>
  );
}
