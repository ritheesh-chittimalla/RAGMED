import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const articles = [
  {
    title: "AI Health Insights",
    subtitle: "Understanding how deep learning predicts health signals before conditions worsen.",
    image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=400&h=300",
    icon: "solar:health-bold-duotone",
    tag: "Intelligence",
    category: "Performance",
    readTime: "5 min read"
  },
  {
    title: "The Expert Path",
    subtitle: "How identifying specialized medical excellence improves surgical outcomes.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=400&h=300",
    icon: "solar:user-speak-bold-duotone",
    tag: "Guide",
    category: "Cognition",
    readTime: "8 min read"
  },
  {
    title: "Regenerative Sleep",
    subtitle: "The science of biological recovery through optimized circadian synchronization.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=400&h=300",
    icon: "solar:running-round-bold-duotone",
    tag: "Recovery",
    category: "Longevity",
    readTime: "6 min read"
  },
  {
    title: "Bio-Data Literacy",
    subtitle: "Deciphering complex lab reports to stay ahead of metabolic challenges.",
    image: "https://images.unsplash.com/photo-1579154235602-3c2ae2462bc1?auto=format&fit=crop&q=80&w=400&h=300",
    icon: "solar:document-medicine-bold-duotone",
    tag: "Science",
    category: "Preventative",
    readTime: "12 min read"
  },
];

export default function Articles({ className = "", searchQuery = "", category = "All", onSelectArticle }) {
  const filteredArticles = articles.filter(item => {
    const matchCategory = category === "All" || item.category === category || item.tag === category;
    const matchQuery = (item.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
                       (item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchQuery;
  });

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Research & Insight</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-none">
              Scientific <span className="text-muted-foreground/60">Protocols.</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm font-medium leading-relaxed max-w-lg">
              Expert-backed medical analysis curated to accelerate your health literacy and recovery journey.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArticles.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              onClick={() => onSelectArticle && onSelectArticle(item)}
              className="group cursor-pointer bg-card border border-border p-4 rounded-[20px] shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-border">
                   <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                   
                   <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-wider text-white">
                      <Icon icon="solar:clock-bold" className="h-3 w-3 text-primary" />
                      {item.readTime}
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                         {item.tag}
                      </span>
                   </div>
                   
                   <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                     {item.title}
                   </h3>

                   <p className="text-muted-foreground text-xs font-medium leading-relaxed line-clamp-2">
                     {item.subtitle}
                   </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-primary text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-all">
                 <span>Read Protocol</span>
                 <Icon icon="solar:arrow-right-bold" className="w-4 h-4" />
              </div>
            </motion.div>
          ))}

          {filteredArticles.length === 0 && (
            <div className="col-span-full py-16 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider bg-card border border-border rounded-2xl">
              No clinical protocols found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}