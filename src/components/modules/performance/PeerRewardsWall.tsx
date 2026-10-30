import React, { useState } from 'react';
import {
  Gift,
  Heart,
  Send,
  Sparkles,
  Trophy,
  Award,
  Plus,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useHR } from '../../../context/HRContext';
import { PeerKudo } from '../../../types';

export const PeerRewardsWall: React.FC = () => {
  const { peerKudos, sendPeerKudo, likePeerKudo, employees, currentUser } = useHR();
  const [isSendOpen, setIsSendOpen] = useState(false);

  const [toEmployeeId, setToEmployeeId] = useState(employees[1].id);
  const [badge, setBadge] = useState<PeerKudo['badge']>('Innovator');
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(150);

  const badges: PeerKudo['badge'][] = [
    'Innovator',
    'Team Player',
    'Problem Solver',
    'Empathetic Leader',
    'Rockstar',
  ];

  const handleSendKudo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendPeerKudo(toEmployeeId, badge, message, points);

    // Fire confetti celebration!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B4A', '#38BDF8', '#F59E0B', '#10B981'],
    });

    setIsSendOpen(false);
    setMessage('');
  };

  const myFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : '';
  const myEarnedPoints = peerKudos
    .filter((k) => myFirstName && k.toName.includes(myFirstName))
    .reduce((sum, k) => sum + k.points, 250);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Peer Rewards & Recognition Wall</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Celebrate colleagues, award kudos badges, and redeem company perk rewards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 shadow-2xs">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>My Points: {myEarnedPoints} pts</span>
          </div>

          <button
            onClick={() => setIsSendOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Give Kudos</span>
          </button>
        </div>
      </div>

      {/* Kudos Stream Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {peerKudos.map((kudo) => (
          <div
            key={kudo.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                  {kudo.badge}
                </span>
                <span className="text-[11px] font-mono text-amber-600 font-bold">
                  +{kudo.points} pts
                </span>
              </div>

              {/* People Interaction */}
              <div className="flex items-center gap-2 text-xs">
                <img
                  src={kudo.fromAvatar}
                  alt={kudo.fromName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <span className="font-semibold text-slate-700">{kudo.fromName}</span>
                <span className="text-slate-400">recognized</span>
                <img
                  src={kudo.toAvatar}
                  alt={kudo.toName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <span className="font-bold text-slate-900">{kudo.toName}</span>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                "{kudo.message}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-mono">{kudo.timestamp}</span>

              <button
                onClick={() => {
                  likePeerKudo(kudo.id);
                  confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors font-medium text-xs"
              >
                <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                <span>{kudo.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Give Kudos Modal */}
      {isSendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Award Peer Kudos Badge</h3>
              <button onClick={() => setIsSendOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendKudo} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recognize Colleague</label>
                <select
                  value={toEmployeeId}
                  onChange={(e) => setToEmployeeId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Badge Award</label>
                <div className="grid grid-cols-2 gap-2">
                  {badges.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBadge(b)}
                      className={`p-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                        badge === b
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Points Allocation</label>
                <div className="flex gap-2">
                  {[100, 150, 250, 500].map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setPoints(pt)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border font-mono transition-all ${
                        points === pt
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      +{pt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recognition Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share what this coworker accomplished and why their impact matters..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSendOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs"
                >
                  Send & Celebrate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
