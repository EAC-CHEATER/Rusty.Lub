import { useState } from 'react';
import { bindsDatabase } from '../data';
import { BindItem } from '../types';
import { Search, Copy, Terminal, Shield, Plus, Zap, Heart, RotateCw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { bindsTranslationMap, bindsCategoryMap } from '../translations';

interface BindsTabProps {
  onCopy: (text: string) => void;
  lang: 'ru' | 'en';
}

export default function BindsTab({ onCopy, lang }: BindsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredBinds = bindsDatabase.filter((bind) => {
    const matchesCategory = activeCategory === 'all' || bind.category === activeCategory;
    const trans = lang === 'en' && bindsTranslationMap[bind.cmd] ? {
      ...bind,
      desc: bindsTranslationMap[bind.cmd].desc,
      explanation: bindsTranslationMap[bind.cmd].explanation
    } : bind;

    const matchesSearch =
      bind.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trans.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trans.explanation && trans.explanation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      bind.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: BindItem['category']) => {
    switch (category) {
      case 'PVP':
        return <Shield size={12} className="text-rose-400" />;
      case 'МЕДИЦИНА':
        return <Heart size={12} className="text-emerald-400" />;
      case 'ФАРМ':
        return <Zap size={12} className="text-amber-400" />;
      case 'СТРОЙКА':
        return <Plus size={12} className="text-sky-400" />;
      case 'УПРАВЛЕНИЕ':
        return <RotateCw size={12} className="text-indigo-400" />;
      case 'QOL':
        return <Terminal size={12} className="text-teal-400" />;
    }
  };

  const getCategoryClass = (category: BindItem['category']) => {
    switch (category) {
      case 'PVP':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'МЕДИЦИНА':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ФАРМ':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'СТРОЙКА':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'УПРАВЛЕНИЕ':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'QOL':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] shadow-md relative overflow-hidden">
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
        
        {/* Smart Search */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            id="binds-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? "Search binds (e.g. syringe, loot, fov)..." : "Поиск по биндам (например: шприц, лут, fov)..."}
            className="w-full bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/70 focus:ring-1 focus:ring-[#cd412b]/30 text-[#e1e1e6] placeholder-gray-500 pl-11 pr-4 py-3 rounded-none outline-none transition-all text-sm font-sans font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-[10px] font-bold px-2 py-1 rounded-none bg-gray-800"
            >
              {lang === 'en' ? 'Reset' : 'Сброс'}
            </button>
          )}
        </div>

        {/* Categories Tab Pill */}
        <div className="flex flex-wrap gap-1 bg-[#0c0d10] p-1.5 rounded-none border border-[#2a2f3b]">
          {[
            { id: 'all', label: lang === 'en' ? 'All Binds' : 'Все бинды' },
            { id: 'PVP', label: 'PVP' },
            { id: 'МЕДИЦИНА', label: lang === 'en' ? 'Medical' : 'Медицина' },
            { id: 'ФАРМ', label: lang === 'en' ? 'Farming' : 'Фарм' },
            { id: 'СТРОЙКА', label: lang === 'en' ? 'Building' : 'Стройка' },
            { id: 'УПРАВЛЕНИЕ', label: lang === 'en' ? 'Controls' : 'Управление' },
            { id: 'QOL', label: lang === 'en' ? 'QoL / Comfort' : 'QoL / Комфорт' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-none text-xs font-bold transition-all cursor-pointer font-mono uppercase ${
                activeCategory === cat.id
                  ? 'bg-[#cd412b] text-white font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-[#14171e]/90 border-l-4 border-l-[#cd412b] border-y border-r border-[#2a2f3b] text-white rounded-none p-4 flex items-start gap-3 relative overflow-hidden">
        {/* Tactical Corner Brackets */}
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-br" />
        
        <Info size={18} className="text-[#cd412b] mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1 font-sans z-10">
          <p className="font-bold text-[#cd412b] uppercase tracking-wider font-mono text-[11px]">{lang === 'en' ? 'How to install a bind?' : 'Как установить бинд?'}</p>
          <p className="text-gray-300 font-medium">
            {lang === 'en' ? (
              <>Click on any card to copy the command. Launch Rust, open the developer console by pressing <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">F1</strong>, paste the copied bind via <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Ctrl + V</strong> and press <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Enter</strong>.</>
            ) : (
              <>Кликните по любой карточке, чтобы скопировать команду. Зайдите в игру Rust, откройте консоль разработчика на клавишу <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">F1</strong>, вставьте скопированный бинд через <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Ctrl + V</strong> и нажмите <strong className="font-mono text-white bg-[#0c0d10] border border-[#2a2f3b] px-1 py-0.5 rounded-none">Enter</strong>.</>
            )}
          </p>
        </div>
      </div>

      {/* Binds Grid */}
      <AnimatePresence mode="popLayout">
        {filteredBinds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBinds.map((bind) => {
              const trans = lang === 'en' && bindsTranslationMap[bind.cmd] ? {
                ...bind,
                desc: bindsTranslationMap[bind.cmd].desc,
                explanation: bindsTranslationMap[bind.cmd].explanation
              } : bind;

              return (
                <motion.div
                  key={bind.cmd}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={() => onCopy(bind.cmd)}
                  className="group relative bg-[#14171e]/90 hover:bg-[#1b1e26] border border-[#2a2f3b] hover:border-[#cd412b]/50 rounded-none p-5 cursor-pointer flex flex-col justify-between shadow-lg overflow-hidden"
                >
                  {/* Tactical Corner Brackets */}
                  <div className="rust-bracket-tl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="rust-bracket-tr opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="rust-bracket-bl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="rust-bracket-br opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Subtle hover hazard or line indicator */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-[#cd412b] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[9px] font-bold border uppercase font-mono ${getCategoryClass(bind.category)}`}>
                        {getCategoryIcon(bind.category)}
                        {bindsCategoryMap[bind.category]?.[lang] || bind.category}
                      </span>
                      <Copy size={12} className="text-gray-500 group-hover:text-[#cd412b] opacity-60 group-hover:opacity-100 transition-all" />
                    </div>

                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-[#cd412b] font-sans tracking-tight mb-2 uppercase">
                      {trans.desc}
                    </h4>

                    {trans.explanation && (
                      <p className="text-xs text-gray-400 leading-relaxed font-sans mb-4 font-medium">
                        {trans.explanation}
                      </p>
                    )}
                  </div>

                  {/* Command Block */}
                  <div className="mt-auto bg-[#0c0d10] border border-[#2a2f3b] group-hover:border-[#cd412b]/30 p-3 rounded-none text-xs font-mono text-[#cd412b] break-all select-all flex items-center justify-between">
                    <span>{bind.cmd}</span>
                    <span className="text-[9px] text-gray-500 group-hover:text-[#cd412b]/90 uppercase font-bold font-mono flex-shrink-0 ml-2">
                      {lang === 'en' ? 'click to copy' : 'клик для копирования'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center bg-[#14171e]/90 border border-[#2a2f3b] rounded-sm"
          >
            <div className="text-gray-600 text-4xl mb-3">⌨️</div>
            <h3 className="text-gray-400 font-bold mb-1 font-mono uppercase tracking-wider">{lang === 'en' ? 'Bind not found' : 'Такой бинд не найден'}</h3>
            <p className="text-xs text-gray-600 font-mono">{lang === 'en' ? 'Try entering another keyword' : 'Попробуйте ввести другое ключевое слово'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
