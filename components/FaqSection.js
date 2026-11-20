"use client";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export default function FaqSection({ refresh = 0 }) {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => (r.ok ? r.json() : []))
      .then(setFaqs)
      .catch(() => {});
  }, [refresh]);

  return (
    <section id="faqs" className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex items-center gap-4">
        <h2 className="shrink-0 font-display text-2xl font-bold uppercase tracking-wide text-hexa md:text-3xl">
          FAQ&apos;s on EV
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-hexa/60 to-transparent" />
      </div>

      {!faqs.length ? (
        <p className="mt-5 text-sm text-slate-500">No FAQs added yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {faqs.map((item) => {
            const isOpen = openId === item._id;
            return (
              <div key={item._id} className="overflow-hidden rounded-xl border border-[#36275f] bg-panel transition hover:border-volt">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item._id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium"
                >
                  <span className="text-[15px] sm:text-base">{item.question}</span>
                  <ChevronRight size={18} className={`shrink-0 text-hexa transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-[#251a45] px-5 py-4 text-sm leading-relaxed text-slate-400 whitespace-pre-line">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}