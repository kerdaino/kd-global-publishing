import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";

export type InquiryBaseRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string | null;
};

export function InquiryManagementTable<T extends InquiryBaseRow>({
  title,
  description,
  rows,
  action,
  extraHeaders,
  extraCells,
}: {
  title: string;
  description: string;
  rows: T[];
  action: (formData: FormData) => Promise<void>;
  extraHeaders: string[];
  extraCells: (row: T) => Array<string | null>;
}) {
  return (
    <div>
      <h1 className="text-4xl font-black text-neutral-950">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-650">
        {description}
      </p>
      <AdminTable empty={!rows.length}>
        <thead>
          <tr>
            <AdminTh>Contact</AdminTh>
            {extraHeaders.map((header) => (
              <AdminTh key={header}>{header}</AdminTh>
            ))}
            <AdminTh>Message</AdminTh>
            <AdminTh>Status</AdminTh>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((row) => (
            <tr key={row.id}>
              <AdminTd>
                <p className="font-bold text-neutral-950">{row.full_name}</p>
                <p>{row.email}</p>
                <p>{row.phone}</p>
              </AdminTd>
              {extraCells(row).map((cell, index) => (
                <AdminTd key={`${row.id}-${index}`}>{cell || "—"}</AdminTd>
              ))}
              <AdminTd>{row.message || "—"}</AdminTd>
              <AdminTd>
                <form action={action} className="flex gap-2">
                  <input type="hidden" name="id" value={row.id} />
                  <StatusSelect id={`inquiry-status-${row.id}`} defaultValue={row.status || "new"} />
                  <button className="min-h-11 rounded-md bg-red-700 px-3 py-2 text-xs font-bold text-white">
                    Save
                  </button>
                </form>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}

function StatusSelect({ id, defaultValue }: { id: string; defaultValue: string }) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        Inquiry status
      </label>
      <select
        id={id}
        name="status"
        defaultValue={defaultValue}
        className="min-h-11 rounded-md border border-neutral-300 px-3 py-2"
      >
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="in_progress">In progress</option>
        <option value="completed">Completed</option>
        <option value="closed">Closed</option>
      </select>
    </>
  );
}
