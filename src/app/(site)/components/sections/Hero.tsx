import ScrollCue from "../ui/ScrollCue";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-34px)] flex-col justify-start pt-[14vh] pb-16 px-6 md:justify-end md:pt-[26vh]">
      {/* Mobile stacks to two lines; 19vw sizes "MORGAN" to fill the row. */}
      <h1 className="text-center font-semibold uppercase tracking-[-0.03em] leading-[0.9] md:mix-blend-multiply text-[19vw] md:text-[clamp(56px,10vw,140px)]">
        Kyle Morgan
      </h1>
      <div className="mt-5 text-center text-[clamp(13px,1.4vw,20px)] uppercase tracking-[0.25em] md:mt-4 md:tracking-[0.3em]">
        <span>Software · Engineer</span>
        <span className="hidden md:inline"> · </span>
        <br className="md:hidden" />
        <span>San Luis Obispo · CA</span>
      </div>
      <ScrollCue />
    </section>
  );
}
