import { useMemo } from 'react';
import { CodeEntry } from '../../types';
import { CopyButton } from './CopyButton';
import { Sparkles, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

interface CodeTableProps {
  codes: CodeEntry[];
  title?: string;
  game?: string;
  className?: string;
}

export function CodeTable({ codes, title, game, className }: CodeTableProps) {
  // Automatically sort Active codes first, followed by Expired codes
  const sortedCodes = useMemo(() => {
    if (!codes) return [];
    return [...codes].sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') return -1;
      if (a.status !== 'Active' && b.status === 'Active') return 1;
      return 0;
    });
  }, [codes]);

  if (!sortedCodes || sortedCodes.length === 0) {
    return (
      <div className="rounded-2xl border border-indigo-950/10 bg-white p-8 text-center text-indigo-900/60 font-medium">
        No active codes found at this moment.
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border border-indigo-950/10 bg-white shadow-sm", className)}>
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-950/10 bg-azure-50/60 px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-sapphire-600" />
            <h3 className="font-black text-indigo-950 text-base md:text-lg">{title}</h3>
          </div>
          {game && (
            <span className="inline-flex items-center self-start sm:self-auto rounded-lg bg-sapphire-100/80 px-2.5 py-1 text-xs font-bold text-sapphire-800">
              {game}
            </span>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[540px] text-left border-collapse">
          <thead>
            <tr className="border-b border-indigo-950/10 bg-azure-100/50 text-[11px] font-black uppercase tracking-wider text-indigo-950/70">
              <th scope="col" className="py-3.5 pl-5 pr-4 w-[40%]">
                CODE
              </th>
              <th scope="col" className="py-3.5 px-4 w-[38%]">
                REWARD
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-5 text-right w-[22%]">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-950/5 text-sm">
            {sortedCodes.map((item) => {
              const isActive = item.status === 'Active';
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "transition-colors group",
                    isActive ? "hover:bg-azure-50/80" : "bg-slate-50/60 hover:bg-slate-100/70 opacity-75"
                  )}
                >
                  {/* Code Column */}
                  <td className="py-4 pl-5 pr-4 align-middle">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "font-mono text-base md:text-lg font-black tracking-tight select-all transition-colors",
                          isActive ? "text-indigo-950 group-hover:text-sapphire-600" : "text-slate-500 line-through decoration-slate-400"
                        )}>
                          {item.code}
                        </span>
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 border border-emerald-200 shadow-2xs">
                            <CheckCircle2 size={11} className="stroke-[3]" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 border border-slate-300">
                            <XCircle size={10} /> Expired
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-indigo-900/50">
                        <span>{item.game}</span>
                        {item.updated_at && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock size={11} />
                              {formatDistanceToNow(new Date(item.updated_at))} ago
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Reward Column */}
                  <td className="py-4 px-4 align-middle">
                    <div className={cn(
                      "inline-flex items-center rounded-xl px-3 py-1.5 border",
                      isActive 
                        ? "bg-azure-50 border-sapphire-600/15 text-sapphire-700 font-bold text-xs md:text-sm" 
                        : "bg-slate-100 border-slate-200 text-slate-500 font-medium text-xs md:text-sm"
                    )}>
                      <span>
                        {item.reward}
                      </span>
                    </div>
                  </td>

                  {/* Action / Copy Button Column */}
                  <td className="py-4 pl-4 pr-5 text-right align-middle">
                    <div className="flex justify-end">
                      <CopyButton
                        text={item.code}
                        className={cn(
                          !isActive && "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
                        )}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

