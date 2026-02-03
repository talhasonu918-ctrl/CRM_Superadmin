
import React from 'react';
import { Truck, Navigation, UserCheck, Timer, Plus, MoreHorizontal, Battery, MapPin } from 'lucide-react';

const activeRiders = [
  { name: 'Rider Alex', status: 'ON_DELIVERY', orders: 2, battery: '85%' },
  { name: 'Rider Sam', status: 'IDLE', orders: 0, battery: '45%' },
  { name: 'Rider Chris', status: 'ON_DELIVERY', orders: 1, battery: '92%' },
];

export const DeliveryView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const cardStyle = `rounded-xl border shadow-sm ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100'}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Delivery Operations</h2>
          <p className="text-slate-400 text-xs font-medium">Live logistics and rider fulfillment tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className={`${cardStyle} h-[450px] relative overflow-hidden group`}>
            {/* Cleaner Map Placeholder */}
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 dark:opacity-10 grayscale" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#16191F] to-transparent"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 text-center">
              <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-4 ring-8 ring-orange-500/5">
                <Navigation size={32} />
              </div>
              <h3 className="text-lg font-extrabold tracking-tight">Delivery Radar</h3>
              <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto">Visualize active routes, courier positions and estimated arrivals.</p>
              <button className="mt-6 px-6 py-2.5 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-orange-500/10">Launch Map View</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Active Zones', val: '5 Localities', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/5' },
              { label: 'Avg Fulfillment', val: '22 Mins', icon: Timer, color: 'text-orange-500', bg: 'bg-orange-500/5' },
              { label: 'Fleet Online', val: '12 Riders', icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
            ].map((stat, i) => (
              <div key={i} className={`${cardStyle} p-5 flex items-center gap-4`}>
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <h3 className="text-lg font-extrabold">{stat.val}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Rider Directory</h4>
            <button className="text-orange-500"><Plus size={18} /></button>
          </div>
          {activeRiders.map((rider, i) => (
            <div key={i} className={`${cardStyle} p-5 hover:border-orange-200 transition-all cursor-pointer`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={`https://ui-avatars.com/api/?name=${rider.name}&background=random&color=fff`} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h5 className="text-xs font-bold leading-none mb-1">{rider.name}</h5>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${rider.status === 'IDLE' ? 'text-emerald-500' : 'text-orange-500'}`}>
                      {rider.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                   <Battery size={12} className={parseInt(rider.battery) < 50 ? 'text-rose-500' : 'text-emerald-500'} /> {rider.battery}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-50 dark:border-slate-800">
                <div className="text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Loads</p>
                  <p className="text-xs font-extrabold">{rider.orders} Active</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Est. ETA</p>
                  <p className="text-xs font-extrabold">12m</p>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-all">Assign Task</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
