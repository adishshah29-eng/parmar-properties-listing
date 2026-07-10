import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/common/PropertyCard";
import { motion } from "framer-motion";

export function Template1({ properties }: { properties: any[] }) {
  const featured = properties.slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <section className="bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">Template 1</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-medium">The Classic Grid</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 group/featured">
          <Link
            href={`/projects/${featured[0].slug}`}
            className="md:col-span-2 relative cursor-pointer overflow-hidden bg-muted h-[550px] block rounded-3xl group-hover/featured:opacity-40 hover:!opacity-100 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2"
          >
            {featured[0].images.length > 0 && (
              <Image 
                src={featured[0].images[0].url.startsWith('http') || featured[0].images[0].url.startsWith('/') ? featured[0].images[0].url : `/${featured[0].images[0].url}`} 
                alt={featured[0].name} 
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-[1500ms] ease-out hover:scale-110" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute top-6 left-6"><StatusBadge status={featured[0].derivedStatus} /></div>
            <div className="absolute bottom-0 left-0 right-0 p-10 transform transition-transform duration-700 hover:-translate-y-2">
              <p className="text-white/70 text-[11px] tracking-[0.3em] uppercase mb-2 font-sans font-medium">{featured[0].location}</p>
              <h3 className="font-serif text-4xl text-white font-medium mb-4 drop-shadow-md">{featured[0].name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-[#B59E7E] font-serif text-2xl drop-shadow-md">{featured[0].priceText}</span>
                <span className="text-white/80 text-xs font-sans bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg">{featured[0].minBhk ? `${featured[0].minBhk} BHK+` : ''}</span>
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-8">
            {featured.slice(1, 3).map((p, index) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="relative cursor-pointer overflow-hidden bg-muted flex-1 min-h-[258px] block rounded-3xl group-hover/featured:opacity-40 hover:!opacity-100 transition-all duration-700 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2"
              >
                {p.images.length > 0 && (
                  <Image 
                    src={p.images[0].url.startsWith('http') || p.images[0].url.startsWith('/') ? p.images[0].url : `/${p.images[0].url}`} 
                    alt={p.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1500ms] ease-out hover:scale-110" 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute top-5 left-5"><StatusBadge status={p.derivedStatus} /></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-700 hover:-translate-y-1">
                  <p className="text-white/70 text-[10px] tracking-[0.3em] uppercase mb-1.5 font-sans font-medium">{p.location}</p>
                  <h3 className="font-serif text-2xl text-white font-medium drop-shadow-md">{p.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[#B59E7E] font-serif text-lg drop-shadow-md">{p.priceText}</span>
                    <span className="text-white/80 text-[10px] font-sans bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-lg">{p.minBhk ? `${p.minBhk} BHK+` : ''}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Template2({ properties }: { properties: any[] }) {
  const featured = properties.slice(0, 6);
  
  return (
    <section className="bg-background pt-8 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">Template 2</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-medium">The Horizontal Scroll</h2>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-16 px-5 md:px-8 space-x-8" style={{ scrollPaddingLeft: 'max(1.25rem, calc((100vw - 80rem) / 2))' }}>
        {featured.map((p, idx) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className="snap-start shrink-0 relative w-[85vw] md:w-[700px] h-[500px] md:h-[650px] block rounded-3xl overflow-hidden group focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2"
          >
            {p.images.length > 0 && (
              <Image 
                src={p.images[0].url.startsWith('http') || p.images[0].url.startsWith('/') ? p.images[0].url : `/${p.images[0].url}`} 
                alt={p.name} 
                fill
                sizes="(max-width: 768px) 85vw, 700px"
                className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
            
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
              <StatusBadge status={p.derivedStatus} />
              <div className="bg-white/10 backdrop-blur-xl rounded-full w-12 h-12 flex items-center justify-center border border-white/20 transform opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100 shadow-xl">
                <ArrowRight className="text-white" size={20} />
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 shadow-2xl">
                <div className="overflow-hidden mb-3">
                  <p className="text-white/70 text-[11px] tracking-[0.3em] uppercase font-sans transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">{p.location}</p>
                </div>
                <h3 className="font-serif text-3xl md:text-5xl text-white font-medium mb-6 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{p.name}</h3>
                
                <div className="flex items-center gap-10 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 border-t border-white/10 pt-6 mt-6">
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1.5 font-sans">Starting from</p>
                    <p className="text-[#B59E7E] font-serif text-2xl">{p.priceText}</p>
                  </div>
                  {p.minBhk && (
                    <div>
                       <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1.5 font-sans">Typology</p>
                       <p className="text-white font-serif text-2xl">{p.minBhk} BHK+</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Template3({ properties }: { properties: any[] }) {
  const featured = properties.slice(0, 3);
  
  return (
    <section className="bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-20">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">Template 3</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light tracking-wide">The Minimalist Trio</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
          {featured.map((p, idx) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              className="group flex flex-col focus:outline-none"
            >
              <div className="relative h-[500px] w-full mb-8 overflow-hidden rounded-2xl shadow-lg shadow-black/5 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-shadow duration-700">
                {p.images.length > 0 && (
                  <Image 
                    src={p.images[0].url.startsWith('http') || p.images[0].url.startsWith('/') ? p.images[0].url : `/${p.images[0].url}`} 
                    alt={p.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.04]" 
                  />
                )}
                <div className="absolute top-5 left-5">
                  <StatusBadge status={p.derivedStatus} />
                </div>
              </div>
              
              <div className="px-2">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-serif text-3xl text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                    <p className="text-muted-foreground text-sm font-sans mt-2 tracking-wide uppercase text-[11px]">{p.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-foreground font-serif text-xl">{p.priceText}</span>
                    {p.minBhk && <span className="block text-muted-foreground text-xs mt-2 font-medium">{p.minBhk} BHK</span>}
                  </div>
                </div>
                <div className="h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700 ease-out mt-6"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Template4({ properties }: { properties: any[] }) {
  const featured = properties.slice(0, 4);
  
  return (
    <section className="bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-20">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">Template 4</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-medium">The Alternating Showcase</h2>
        </div>

        <div className="space-y-32 md:space-y-40">
          {featured.map((p, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={p.id} className={`flex flex-col md:flex-row gap-12 md:gap-20 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                
                <div className="w-full md:w-3/5 relative group">
                  <Link href={`/projects/${p.slug}`} className="block relative h-[450px] md:h-[600px] w-full rounded-3xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 z-10 shadow-2xl shadow-primary/20">
                    {p.images.length > 0 && (
                      <Image 
                        src={p.images[0].url.startsWith('http') || p.images[0].url.startsWith('/') ? p.images[0].url : `/${p.images[0].url}`} 
                        alt={p.name} 
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover transition-transform duration-[1500ms] group-hover:scale-105" 
                      />
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
                  </Link>
                  {/* Glassmorphic decorative offset */}
                  <div className={`absolute -z-0 w-[90%] h-[90%] bg-primary/5 rounded-3xl top-12 blur-3xl ${isEven ? '-left-8' : '-right-8'}`}></div>
                </div>

                <div className="w-full md:w-2/5 flex flex-col justify-center">
                  <div className="mb-6">
                    <StatusBadge status={p.derivedStatus} />
                  </div>
                  <p className="text-primary text-[11px] tracking-[0.3em] uppercase mb-4 font-sans font-semibold">{p.location}</p>
                  <h3 className="font-serif text-4xl md:text-6xl text-foreground mb-8 leading-tight tracking-tight">{p.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-8 mb-10 border-y border-border/60 py-8">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Starting Price</p>
                      <p className="text-foreground font-serif text-3xl">{p.priceText}</p>
                    </div>
                    {p.minBhk && (
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Configurations</p>
                        <p className="text-foreground font-serif text-3xl">{p.minBhk} BHK+</p>
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/projects/${p.slug}`}
                    className="inline-flex items-center gap-3 text-sm text-foreground font-sans font-medium hover:gap-5 transition-all w-fit"
                  >
                    Explore Residence <ArrowRight size={18} />
                  </Link>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Template5({ properties }: { properties: any[] }) {
  const featured = properties.slice(0, 5);
  if (featured.length < 5) return <Template1 properties={properties} />; 

  return (
    <section className="bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">Template 5</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-medium">The Masonry Gallery</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
          
          <Link href={`/projects/${featured[0].slug}`} className="md:col-span-7 md:row-span-2 relative rounded-3xl overflow-hidden group shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-700">
            {featured[0].images.length > 0 && <Image src={featured[0].images[0].url.startsWith('http') || featured[0].images[0].url.startsWith('/') ? featured[0].images[0].url : `/${featured[0].images[0].url}`} alt={featured[0].name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1500ms]" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-700">
              <StatusBadge status={featured[0].derivedStatus} />
              <h3 className="font-serif text-4xl text-white mt-4">{featured[0].name}</h3>
              <p className="text-white/80 text-sm mt-2 font-medium tracking-wide uppercase text-[10px]">{featured[0].location} • {featured[0].priceText}</p>
            </div>
          </Link>

          <Link href={`/projects/${featured[1].slug}`} className="md:col-span-5 md:row-span-1 relative rounded-3xl overflow-hidden group shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-700">
            {featured[1].images.length > 0 && <Image src={featured[1].images[0].url.startsWith('http') || featured[1].images[0].url.startsWith('/') ? featured[1].images[0].url : `/${featured[1].images[0].url}`} alt={featured[1].name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1500ms]" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-5 left-5 right-5 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-700">
              <h3 className="font-serif text-2xl text-white">{featured[1].name}</h3>
              <p className="text-white/80 text-xs mt-1.5">{featured[1].priceText}</p>
            </div>
          </Link>

          <Link href={`/projects/${featured[2].slug}`} className="md:col-span-5 md:row-span-1 relative rounded-3xl overflow-hidden group shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-700">
            {featured[2].images.length > 0 && <Image src={featured[2].images[0].url.startsWith('http') || featured[2].images[0].url.startsWith('/') ? featured[2].images[0].url : `/${featured[2].images[0].url}`} alt={featured[2].name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1500ms]" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-5 left-5 right-5 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-700">
              <h3 className="font-serif text-2xl text-white">{featured[2].name}</h3>
              <p className="text-white/80 text-xs mt-1.5">{featured[2].priceText}</p>
            </div>
          </Link>

          <Link href={`/projects/${featured[3].slug}`} className="md:col-span-6 md:row-span-1 relative rounded-3xl overflow-hidden group shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-700">
            {featured[3].images.length > 0 && <Image src={featured[3].images[0].url.startsWith('http') || featured[3].images[0].url.startsWith('/') ? featured[3].images[0].url : `/${featured[3].images[0].url}`} alt={featured[3].name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1500ms]" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-5 left-5 right-5 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-700">
              <h3 className="font-serif text-2xl text-white">{featured[3].name}</h3>
              <p className="text-white/80 text-xs mt-1.5 uppercase tracking-widest">{featured[3].location}</p>
            </div>
          </Link>

          <Link href={`/projects/${featured[4].slug}`} className="md:col-span-6 md:row-span-1 relative rounded-3xl overflow-hidden group bg-primary flex items-center justify-center p-10 text-center shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-700">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            <div className="transform group-hover:-translate-y-1 transition-transform duration-700">
              <p className="text-primary-foreground/70 text-[10px] uppercase tracking-[0.3em] mb-3">More Properties</p>
              <h3 className="font-serif text-3xl text-primary-foreground mb-6">Discover the full collection</h3>
              <span className="inline-flex items-center gap-3 text-sm text-primary-foreground font-medium bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 transition-colors shadow-lg">
                View All <ArrowRight size={16} />
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}

export function Template6({ properties }: { properties: any[] }) {
  const featured = properties.slice(0, 3);
  
  return (
    <section className="bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-16 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">Template 6</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-medium">The Hero Stack</h2>
        </div>
      </div>

      <div className="space-y-8 px-5 md:px-8 max-w-[1600px] mx-auto">
        {featured.map((p, idx) => (
          <div key={p.id} className="relative h-[70vh] md:h-[80vh] w-full group overflow-hidden rounded-3xl shadow-2xl shadow-black/10 hover:shadow-primary/20 transition-shadow duration-700">
            {p.images.length > 0 && (
              <Image 
                src={p.images[0].url.startsWith('http') || p.images[0].url.startsWith('/') ? p.images[0].url : `/${p.images[0].url}`} 
                alt={p.name} 
                fill
                className="object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110" 
              />
            )}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-700"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-[800ms] ease-out">
                <StatusBadge status={p.derivedStatus} />
              </div>
              
              <h3 className="font-serif text-5xl md:text-8xl text-white font-light mt-8 mb-6 drop-shadow-2xl transform scale-95 opacity-90 group-hover:scale-100 group-hover:opacity-100 transition-all duration-[900ms] ease-out delay-75">
                {p.name}
              </h3>
              
              <p className="text-white/90 font-sans tracking-[0.3em] uppercase text-xs md:text-sm mb-10 transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[900ms] ease-out delay-150 drop-shadow-md">
                {p.location} • {p.priceText}
              </p>

              <Link 
                href={`/projects/${p.slug}`}
                className="px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full font-medium transition-all duration-500 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-[250ms] shadow-2xl hover:shadow-white/20"
              >
                View Residence
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
