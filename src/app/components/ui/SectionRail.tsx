type Props = {
  label: string;
  invert?: boolean;
};

/**
 * Vertical label in the first grid column of each page section.
 * Gives the layout its spine and signals what section you're in.
 */
export default function SectionRail({ label, invert = false }: Props) {
  const border = invert ? "border-[#f2efe8]/30" : "border-[#0f0e0c]";
  const text = invert ? "text-[#f2efe8]/80" : "text-[#0f0e0c]";
  return (
    <div className={`col-span-1 flex items-end border-r p-4 ${border}`}>
      <span
        className={`text-[11px] uppercase tracking-[0.15em] ${text}`}
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {label}
      </span>
    </div>
  );
}
