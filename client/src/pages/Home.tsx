import type { EventCategory, EventRecord } from "@shared/types";
import { ArrowRight, CalendarDays, ChevronDown, Clock3, Compass, MapPin, Search, Sparkles, UsersRound, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import EventCard from "@/components/EventCard";
import RegistrationForm from "@/components/RegistrationForm";
import { formatEventDate, formatPrice, getRemainingSpots } from "@/lib/event-utils";
import { trpc } from "@/lib/trpc";

const categoryMeta: { name: EventCategory; note: string; icon: typeof Compass }[] = [
  { name: "Music", note: "Live, loud, late", icon: Sparkles },
  { name: "Design", note: "Ideas in progress", icon: Compass },
  { name: "Wellness", note: "Make space", icon: Clock3 },
  { name: "Food & drink", note: "Pull up a chair", icon: CalendarDays },
  { name: "Community", note: "Find your people", icon: UsersRound },
  { name: "Business", note: "Good conversations", icon: ArrowRight },
];

function LoadingState() {
  return <div className="grid gap-5 md:grid-cols-2"><div className="h-[470px] animate-pulse rounded-[1.5rem] bg-[#e8e2d9]" /><div className="h-[470px] animate-pulse rounded-[1.5rem] bg-[#e8e2d9]" /></div>;
}

const previewFeatured = {
  id: "afterglow-sessions",
  title: "Afterglow Sessions",
  category: "Music",
  imageTone: "#E88C6A",
  shortDescription: "An intimate night of live electronic sets, soft lights, and new city sounds.",
  date: "2026-11-14",
  venue: "The Glasshouse",
};

export default function Home() {
  const { data: events = [], isLoading, error } = trpc.events.list.useQuery();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<EventCategory | "All">("All");
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const featured = events.find(event => event.featured) ?? events[0];
  const heroEvent = featured ?? previewFeatured;
  const filteredEvents = useMemo(() => events.filter(event => {
    const matchesCategory = category === "All" || event.category === category;
    const haystack = `${event.title} ${event.venue} ${event.location} ${event.city}`.toLowerCase();
    return matchesCategory && haystack.includes(query.trim().toLowerCase());
  }), [category, events, query]);
  const upcoming = featured ? filteredEvents.filter(event => event.id !== featured.id) : filteredEvents;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f0ea] text-[#16152a]">
      <header className="absolute inset-x-0 top-0 z-20"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12"><Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-[-0.04em] text-[#f4f0ea]"><span className="brand-mark">E</span><span>eventora</span></Link><nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 md:flex"><a href="#explore" className="transition-colors hover:text-white">Explore</a><a href="#categories" className="transition-colors hover:text-white">Categories</a><Link href="/registrations" className="transition-colors hover:text-white">Registration desk</Link></nav><Link href="/registrations" className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/10">My registrations</Link></div></header>

      <section className="hero-surface relative overflow-hidden bg-[#16152a] text-[#f4f0ea]">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-36 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:items-end lg:px-12 lg:pb-28 lg:pt-44">
          <div className="max-w-2xl"><p className="eyebrow text-[#ff9a8e]">A better way to make plans</p><h1 className="mt-5 max-w-[10ch] font-display text-6xl font-semibold leading-[0.92] tracking-[-0.085em] sm:text-8xl">Find the room where your people are.</h1><p className="mt-7 max-w-lg text-base leading-7 text-white/65 sm:text-lg">From tiny listening rooms to big city gatherings, Eventora helps you find something worth showing up for.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><label className="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3.5 text-[#16152a] shadow-2xl shadow-black/10"><Search className="h-5 w-5 text-[#ff6b5b]" /><input value={query} onChange={eventObject => setQuery(eventObject.target.value)} placeholder="Search events, places, cities" className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa39a]" /></label><a href="#explore" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6b5b] px-6 py-3.5 text-sm font-bold text-[#16152a] transition-transform hover:-translate-y-0.5">See what’s on <ArrowRight className="h-4 w-4" /></a></div></div>
          <div className="relative mx-auto w-full max-w-md lg:mb-2"><div className="hero-ticket hero-ticket-back rotate-6" /><div className="hero-ticket hero-ticket-mid -rotate-3" /><div className="hero-ticket relative overflow-hidden rounded-[1.6rem] border border-white/15 p-6 shadow-2xl shadow-black/30" style={{ background: `linear-gradient(140deg, ${heroEvent.imageTone} 0%, #33294c 70%, #16152a 100%)` }}><div className="flex items-start justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-white/75"><span>Tonight / next up</span><span className="rounded-full border border-white/30 px-2 py-1">{heroEvent.category}</span></div><div className="mt-28"><p className="font-display text-5xl font-semibold leading-none tracking-[-0.07em]">{heroEvent.title}</p><p className="mt-4 max-w-[24ch] text-sm leading-5 text-white/70">{heroEvent.shortDescription}</p></div><div className="mt-8 flex items-end justify-between border-t border-white/20 pt-4 text-xs text-white/75"><span>{formatEventDate(heroEvent.date)}<br />{heroEvent.venue}</span><Link href={`/events/${heroEvent.id}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#16152a] transition-transform hover:scale-105"><ArrowRight className="h-5 w-5" /></Link></div></div></div>
        </div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-3 gap-5 border-t border-white/10 px-5 py-6 text-white/65 sm:px-8 lg:px-12"><div><p className="font-display text-3xl font-semibold tracking-[-0.06em] text-white">{events.length || "—"}</p><p className="mt-1 text-xs uppercase tracking-[0.14em]">Curated events</p></div><div><p className="font-display text-3xl font-semibold tracking-[-0.06em] text-white">{new Set(events.map(event => event.city)).size || "—"}</p><p className="mt-1 text-xs uppercase tracking-[0.14em]">Cities in orbit</p></div><div><p className="font-display text-3xl font-semibold tracking-[-0.06em] text-white">{events.reduce((sum, event) => sum + getRemainingSpots(event), 0) || "—"}</p><p className="mt-1 text-xs uppercase tracking-[0.14em]">Open spots</p></div></div>
      </section>

      <main id="explore" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <section id="categories" className="mb-20"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow text-[#ff6b5b]">Choose your energy</p><h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">Start with a feeling.</h2></div><button type="button" onClick={() => setCategory("All")} className="inline-flex items-center gap-2 text-sm font-bold text-[#69645e] transition-colors hover:text-[#ff6b5b]">All events <ChevronDown className="h-4 w-4" /></button></div><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categoryMeta.map(item => { const Icon = item.icon; const active = category === item.name; return <button key={item.name} type="button" onClick={() => setCategory(active ? "All" : item.name)} className={`category-tile text-left ${active ? "category-tile-active" : ""}`}><Icon className="h-5 w-5" /><span className="mt-9 block text-sm font-bold">{item.name}</span><span className="mt-1 block text-xs text-current/60">{item.note}</span></button>; })}</div></section>

        <section className="scroll-mt-8" aria-labelledby="events-heading"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="eyebrow text-[#ff6b5b]">The good stuff</p><h2 id="events-heading" className="mt-3 font-display text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">Make a date of it.</h2></div><span className="hidden text-sm text-[#8d887f] sm:block">{filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} in the mix</span></div>{error ? <div className="rounded-3xl bg-[#fff0ed] p-6 text-sm text-[#b4493d]">We couldn’t load the live event list yet. The Atlas connection may still be waking up.</div> : isLoading ? <LoadingState /> : filteredEvents.length === 0 ? <div className="rounded-[1.5rem] border border-dashed border-[#c9c1b7] bg-white/50 p-12 text-center"><p className="font-display text-3xl font-semibold tracking-[-0.06em]">Nothing in that corner yet.</p><p className="mt-2 text-sm text-[#69645e]">Try a different search or clear the category filter.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="mt-5 rounded-full bg-[#16152a] px-5 py-3 text-sm font-bold text-white">Clear filters</button></div> : <><div className="grid gap-5 lg:grid-cols-2">{featured && category === "All" && !query && <EventCard event={featured} featured onRegister={setSelectedEvent} />}{upcoming.slice(0, category === "All" && !query && featured ? 4 : 5).map(event => <EventCard key={event.id} event={event} onRegister={setSelectedEvent} />)}</div><div className="mt-8 flex justify-center"><Link href="/registrations" className="inline-flex items-center gap-2 rounded-full border border-[#c9c1b7] px-5 py-3 text-sm font-bold text-[#16152a] transition-colors hover:border-[#16152a]">Already registered? Manage your details <ArrowRight className="h-4 w-4" /></Link></div></>}</section>
      </main>

      <footer className="border-t border-[#ddd6cd] bg-[#ebe5dc]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12"><div className="flex items-center gap-2 text-sm font-bold"><span className="brand-mark brand-mark-dark">E</span>eventora</div><p className="text-sm text-[#69645e]">Good plans, thoughtfully gathered.</p><Link href="/registrations" className="text-sm font-bold text-[#16152a] hover:text-[#ff6b5b]">Open registration desk →</Link></div></footer>

      {selectedEvent && <div className="modal-backdrop" role="presentation" onMouseDown={eventObject => { if (eventObject.target === eventObject.currentTarget) setSelectedEvent(null); }}><div className="modal-panel" role="dialog" aria-modal="true" aria-label={`Register for ${selectedEvent.title}`}><RegistrationForm event={selectedEvent} onCancel={() => setSelectedEvent(null)} onSuccess={() => setSelectedEvent(null)} /></div></div>}
    </div>
  );
}
