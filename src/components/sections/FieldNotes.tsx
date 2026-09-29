import { Reveal } from "@/components/animation/Reveal";

const notes = [
  {
    id: "021",
    title: "Best Sunset",
    body: "The light over Nubra Valley didn't ask for attention — it simply arrived.",
  },
  {
    id: "022",
    title: "Hidden Spot",
    body: "A tea stall beside a mountain pass. No sign. Just steam and silence.",
  },
  {
    id: "023",
    title: "Travel Tip",
    body: "Leave one day unplanned. That's usually when the road surprises you.",
  },
  {
    id: "024",
    title: "Unexpected Moment",
    body: "Getting lost in Gion mattered more than finding the temple.",
  },
];

export function FieldNotes() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
      <Reveal>
        <p className="travel-meta travel-meta-accent mb-3">Explorer&apos;s Notebook</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.25] mb-10">
          Field Notes
        </h2>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {notes.map((note, i) => (
          <Reveal key={note.id} delay={i * 0.08}>
            <article className="border border-border bg-card/50 p-6 md:p-8 relative">
              <span className="travel-meta text-sunset absolute top-6 right-6">Note {note.id}</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-[1.25] mb-3 pr-20">
                {note.title}
              </h3>
              <p className="font-script text-lg md:text-xl text-muted leading-relaxed">
                &ldquo;{note.body}&rdquo;
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
