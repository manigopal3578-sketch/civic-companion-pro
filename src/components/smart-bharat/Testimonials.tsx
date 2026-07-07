import { Quote } from "lucide-react";

const items = [
  {
    quote: "I found out about a scholarship for my daughter within minutes. It even filled the checklist in Telugu.",
    name: "Lakshmi",
    place: "Warangal, Telangana",
    avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg",
  },
  {
    quote: "Reported a broken streetlight with one photo. Got a resolution update in three days. Unreal.",
    name: "Arjun",
    place: "Pune, Maharashtra",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  },
  {
    quote: "For the first time, government paperwork felt like a friend, not a wall.",
    name: "Meera",
    place: "Jaipur, Rajasthan",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
  },
];

export function Testimonials() {
  const doubled = [...items, ...items];
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-xs uppercase tracking-widest text-saffron mb-3">Voices from Bharat</div>
        <h2 className="font-display font-black text-4xl md:text-6xl max-w-2xl">Real citizens. Real relief.</h2>
      </div>
      <div className="group relative">
        <div className="flex gap-6 w-max animate-marquee group-hover:[animation-play-state:paused]">
          {doubled.map((t, i) => (
            <div key={i} className="glass rounded-3xl p-8 w-[380px] shrink-0">
              <Quote className="w-8 h-8 text-saffron/60 mb-4" />
              <p className="text-lg leading-relaxed">{t.quote}</p>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.place}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
