import React, { useState } from 'react';
import { NEWS_DATA } from '../data/mockData';
import { NewsArticle } from '../types';
import { playUiClick } from '../utils/soundEffects';
import { ArrowUpRight, X, Clock, Calendar, User } from 'lucide-react';

interface NewsSectionProps {
  news?: NewsArticle[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news: propNews }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const newsList = propNews || NEWS_DATA;

  return (
    <section id="noticias" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-2">
            <span>Actualidad & Comunicados</span>
            <span aria-hidden="true">·</span>
            <span>Prensa Oficial MC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            ÚLTIMAS NOTICIAS
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Novedades del Primer Plantel, crónicas de partidos, informes formativos y anuncios institucionales.
          </p>
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsList.map((art) => (
          <article
            key={art.id}
            onClick={() => {
              playUiClick();
              setSelectedArticle(art);
            }}
            className="bg-[#0C0C0E] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-700 transition-all cursor-pointer group"
          >
            <div>
              {/* Unboxed Metadata Header */}
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                <span className="text-[#E6002B] font-semibold">{art.category}</span>
                <span aria-hidden="true">·</span>
                <span>{art.date}</span>
                <span aria-hidden="true">·</span>
                <span>{art.readTime}</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white group-hover:text-[#FF1A40] transition-colors leading-snug">
                {art.title}
              </h3>

              <p className="text-xs text-neutral-400 mt-3 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="pt-6 border-t border-neutral-800/80 mt-6 flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-medium">Por {art.author}</span>
              <span className="text-[#E6002B] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Leer artículo completo
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0E0E12] border border-neutral-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Unboxed metadata */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
              <span className="text-[#E6002B] font-semibold uppercase">{selectedArticle.category}</span>
              <span>·</span>
              <span>{selectedArticle.date}</span>
              <span>·</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4">
              {selectedArticle.title}
            </h3>

            <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 text-xs text-neutral-300 italic mb-6">
              {selectedArticle.summary}
            </div>

            <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-500">
              <span>Publicado por: {selectedArticle.author}</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer"
              >
                Cerrar Noticia
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
