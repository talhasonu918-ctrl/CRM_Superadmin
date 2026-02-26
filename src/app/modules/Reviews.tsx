
import React from 'react';
import { Star, MessageCircle, ThumbsUp, User, CornerDownRight } from 'lucide-react';

const reviews = [
  { id: '1', user: 'Emma Stone', rating: 5, comment: 'The Smokey BBQ Pizza was absolutely divine! Best service ever.', date: '2 hours ago', reply: 'Thanks Emma! Glad you loved it.' },
  { id: '2', user: 'Mark Ruffalo', rating: 4, comment: 'Great burgers, but the delivery took a bit longer than expected.', date: '5 hours ago', reply: null },
  { id: '3', user: 'Jennifer L.', rating: 5, comment: 'Fast delivery and piping hot food! 10/10.', date: 'Yesterday', reply: null },
];

export const ReviewsView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const cardBg = isDarkMode ? 'bg-[#141414]' : 'bg-white';
  const borderCol = isDarkMode ? 'border-white/5' : 'border-gray-50';

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className={`${cardBg} p-10 rounded-[3.5rem] border ${borderCol} text-center shadow-sm`}>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Average Rating</p>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Star className="w-12 h-12 text-[#FECB00] fill-current" />
            <h3 className="text-6xl font-black">4.8</h3>
          </div>
          <p className="text-sm font-medium text-gray-400">Based on 12,480 reviews</p>
        </div>
        
        <div className={`${cardBg} p-10 rounded-[3.5rem] border ${borderCol} flex flex-col justify-center gap-4`}>
          {[5, 4, 3, 2, 1].map(s => (
            <div key={s} className="flex items-center gap-4">
               <span className="text-[11px] font-black text-gray-400 w-4">{s}</span>
               <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FECB00] rounded-full" style={{ width: s === 5 ? '85%' : s === 4 ? '10%' : '5%' }}></div>
               </div>
               <span className="text-[11px] font-black text-gray-400 w-8">{s === 5 ? '85%' : s === 4 ? '10%' : '5%'}</span>
            </div>
          ))}
        </div>

        <div className={`${cardBg} p-10 rounded-[3.5rem] border ${borderCol} flex items-center justify-center text-center`}>
           <div>
              <ThumbsUp size={48} className="text-[#FF6B35] mx-auto mb-4" />
              <h4 className="text-3xl font-black">98% Recommendation</h4>
              <p className="text-sm font-medium text-gray-400">Customers love your food!</p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black mb-8">Recent Feedbacks</h3>
        {reviews.map((rev) => (
          <div key={rev.id} className={`${cardBg} p-10 rounded-[3rem] border ${borderCol} flex flex-col md:flex-row gap-8 relative overflow-hidden group`}>
            <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center font-black text-[#FF6B35] text-xl">
               {rev.user.charAt(0)}
            </div>
            <div className="flex-1">
               <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="text-lg font-black">{rev.user}</h5>
                    <div className="flex gap-1 text-[#FECB00] mt-1">
                       {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} className={i < rev.rating ? '' : 'text-gray-200'} />)}
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{rev.date}</span>
               </div>
               <p className="text-[15px] font-medium text-gray-500 leading-relaxed ">"{rev.comment}"</p>
               
               {rev.reply && (
                 <div className="mt-6 p-6 bg-gray-50/50 rounded-2xl flex gap-4 items-start">
                    <CornerDownRight size={18} className="text-gray-300 mt-1" />
                    <div>
                       <p className="text-[10px] font-black text-[#FF6B35] uppercase tracking-widest mb-1">Admin Reply</p>
                       <p className="text-sm font-medium text-gray-600">{rev.reply}</p>
                    </div>
                 </div>
               )}

               {!rev.reply && (
                 <button className="mt-6 flex items-center gap-2 text-[11px] font-black text-[#FF6B35] uppercase tracking-widest hover:underline">
                    <MessageCircle size={16} /> Write a Reply
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
