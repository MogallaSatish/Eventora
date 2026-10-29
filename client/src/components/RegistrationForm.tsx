import type { EventRecord, RegistrationRecord, RegistrationStatus } from "@shared/types";
import { Loader2, Ticket, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatEventDate, formatPrice } from "@/lib/event-utils";
import { trpc } from "@/lib/trpc";

type FormState = { name: string; email: string; phone: string; tickets: number; notes: string; status: RegistrationStatus };
const initialForm: FormState = { name: "", email: "", phone: "", tickets: 1, notes: "", status: "confirmed" };

export default function RegistrationForm({ event, registration, onSuccess, onCancel }: { event: EventRecord; registration?: RegistrationRecord; onSuccess?: () => void; onCancel?: () => void }) {
  const [form, setForm] = useState<FormState>(registration ? { name: registration.name, email: registration.email, phone: registration.phone, tickets: registration.tickets, notes: registration.notes, status: registration.status } : initialForm);
  const utils = trpc.useUtils();
  const createMutation = trpc.registrations.create.useMutation({
    onSuccess: () => {
      void utils.events.list.invalidate();
      void utils.registrations.list.invalidate();
      toast.success("You’re on the list", { description: `${event.title} is saved to your registration desk.` });
      onSuccess?.();
    },
  });
  const updateMutation = trpc.registrations.update.useMutation({
    onSuccess: () => {
      void utils.events.list.invalidate();
      void utils.registrations.list.invalidate();
      toast.success("Registration updated", { description: "Your details are up to date." });
      onSuccess?.();
    },
  });
  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error?.message || updateMutation.error?.message;

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => setForm(current => ({ ...current, [field]: value }));
  const handleSubmit = (eventObject: React.FormEvent<HTMLFormElement>) => {
    eventObject.preventDefault();
    const payload = { eventId: event.id, eventTitle: event.title, ...form, tickets: Number(form.tickets) };
    if (registration) updateMutation.mutate({ id: registration.id, data: payload });
    else createMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-start justify-between gap-4 border-b border-[#eee9e2] pb-4">
        <div>
          <p className="eyebrow text-[#ff6b5b]">{registration ? "Edit registration" : "Reserve a place"}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.06em] text-[#16152a]">{event.title}</h2>
          <p className="mt-2 text-sm text-[#69645e]">{formatEventDate(event.date)} · {formatPrice(event)} per ticket</p>
        </div>
        {onCancel && <button type="button" aria-label="Close registration form" onClick={onCancel} className="rounded-full p-2 text-[#69645e] transition-colors hover:bg-[#f4f0ea] hover:text-[#16152a]"><X className="h-5 w-5" /></button>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">Full name<input className="field-control" value={form.name} onChange={eventObject => setField("name", eventObject.target.value)} placeholder="Your name" required /></label>
        <label className="field-label">Email<input className="field-control" value={form.email} onChange={eventObject => setField("email", eventObject.target.value)} placeholder="you@example.com" type="email" required /></label>
        <label className="field-label">Phone<input className="field-control" value={form.phone} onChange={eventObject => setField("phone", eventObject.target.value)} placeholder="+91 98765 43210" required /></label>
        <label className="field-label">Tickets<select className="field-control" value={form.tickets} onChange={eventObject => setField("tickets", Number(eventObject.target.value))}>{[1, 2, 3, 4, 5, 6, 7, 8].map(count => <option key={count} value={count}>{count} {count === 1 ? "ticket" : "tickets"}</option>)}</select></label>
      </div>
      <label className="field-label">Anything we should know?<textarea className="field-control min-h-24 resize-y" value={form.notes} onChange={eventObject => setField("notes", eventObject.target.value)} placeholder="Dietary notes, access needs, or a message for the host (optional)" /></label>
      {error && <p className="rounded-2xl bg-[#fff0ed] px-4 py-3 text-sm font-medium text-[#b4493d]">{error}</p>}
      <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b5b] px-5 py-3.5 text-sm font-bold text-[#16152a] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"><Ticket className="h-4 w-4" />{isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : registration ? "Update registration" : "Confirm my spot"}</button>
      <p className="text-center text-xs leading-5 text-[#8d887f]">Your details stay with the event team and are used only to manage this registration.</p>
    </form>
  );
}
