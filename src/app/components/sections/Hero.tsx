export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-34px)] flex-col justify-end px-6 pb-16 pt-[26vh]">
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "130%",
            height: "240%",
            background:
              "radial-gradient(ellipse at center, rgba(242,239,232,0.95) 0%, rgba(242,239,232,0.7) 35%, rgba(242,239,232,0.3) 60%, transparent 85%)",
          }}
        />
        <h1 className="relative text-center font-semibold uppercase tracking-[-0.03em] leading-[0.9] mix-blend-multiply text-[clamp(56px,10vw,140px)]">
          Kyle Morgan
        </h1>
        <div className="relative mt-4 text-center text-[clamp(12px,1.4vw,20px)] uppercase tracking-[0.3em]">
          Software · Engineer · San Luis Obispo · CA
        </div>
      </div>
    </section>
  );
}
