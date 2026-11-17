export default function Body({ text }) {
  return text.split(/\n\s*\n/).map((blk, i) => {
    const lines = blk.trim().split("\n");
    if (lines.length > 1 && lines.every((l) => l.includes("|"))) {
      const rows = lines.map((l) => l.split("|").map((c) => c.trim()).filter((c, j, a) => !(c === "" && (j === 0 || j === a.length - 1))));
      return (
        <div key={i} className="my-6 overflow-x-auto"><table className="w-full border-collapse text-left text-sm md:text-base">
          <thead><tr>{rows[0].map((c, j) => <th key={j} className="border border-slate-500 bg-[#4a2a9a] px-3 py-2 font-semibold">{c}</th>)}</tr></thead>
          <tbody>{rows.slice(1).map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j} className="border border-slate-600 px-3 py-2">{c}</td>)}</tr>)}</tbody></table></div>);
    }
    return <p key={i} className="my-4 whitespace-pre-line text-[17px] leading-8 text-slate-300">{blk}</p>;
  });
}
