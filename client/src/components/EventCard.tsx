import type { EventRecord } from "@shared/types";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import { formatEventDate, formatEventDay, formatEventMonth, formatPrice, getRemainingSpots } from "@/lib/event-utils";

export default function EventCard({ event, featured = false, onRegister }: { event: EventRecord; featured?: boolean; onRegister?: (event: EventRecord) => void }) {
  const remaining = getRemainingSpots(event);

  return (
    <article className={`event-card group overflow-hidden rounded-[1.5rem] border border-[#ded8cf] bg-white ${featured ? "lg:grid lg:grid-cols-[1.05fr_.95fr]" : ""}`}>
      <div className={`relative min-h-[236px] overflow-hidden p-5 ${featured ? "lg:min-h-[360px]" : ""}`} style={{ background: `linear-gradient(135deg, ${event.imageTone} 0%, #17162a 115%)` }}>
        <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[28px] border-white/15" />
        <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-black/10" />
        <div className="relative flex items-start justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
          <span>{event.category}</span>
          <span className="rounded-full border border-white/30 px-2.5 py-1">{event.city}</span>
        </div>
        <div className="relative mt-16 flex items-end justify-between gap-3 text-white">
          <div>
            <span className="block text-[4.5rem] font-display font-semibold leading-[0.8] tracking-[-0.08em]">{formatEventDay(event.date)}</span>
            <span className="mt-2 block text-sm font-bold uppercase tracking-[0.24em]">{formatEventMonth(event.date)}</span>
          </div>
          <span className="mb-1 rounded-full bg-[#16152a]/70 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">{remaining} spots left</span>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-7 p-5 sm:p-6">
        <div>
          <div className="mb-3 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#8d887f]">
            <span>{formatEventDate(event.date)}</span>
            <span>{formatPrice(event)}</span>
          </div>
          <h3 className="max-w-[18ch] font-display text-2xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#16152a] sm:text-[2rem]">{event.title}</h3>
          <p className="mt-3 max-w-[42ch] text-sm leading-6 text-[#69645e]">{event.shortDescription}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-[#69645e]"><MapPin className="h-4 w-4 text-[#ff6b5b]" />{event.venue} · {event.location}</div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[#eee9e2] pt-4">
          <Link href={`/events/${event.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#16152a] transition-colors hover:text-[#ff6b5b]">Open event <ArrowUpRight className="h-4 w-4" /></Link>
          <button type="button" onClick={() => onRegister?.(event)} className="rounded-full bg-[#ff6b5b] px-4 py-2.5 text-sm font-bold text-[#16152a] transition-transform hover:-translate-y-0.5">Save my spot</button>
        </div>
      </div>
    </article>
  );
}
