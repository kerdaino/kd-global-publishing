export function AdminTable({
  children,
  empty,
}: {
  children: React.ReactNode;
  empty?: boolean;
}) {
  if (empty) {
    return (
      <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-8 text-neutral-650 shadow-sm">
        No records found.
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function AdminTh({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-neutral-500">
      {children}
    </th>
  );
}

export function AdminTd({ children }: { children: React.ReactNode }) {
  return <td className="align-top px-4 py-4 text-neutral-700">{children}</td>;
}
