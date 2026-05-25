import React from 'react';
import { Award, Shield, Zap, Globe, Heart, Activity, CheckCircle, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';

const About = () => {
  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <SEO title="About Us - UrbanKick" description="Learn about UrbanKick's story and mission to redefine sneaker culture." />
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden py-24 mb-16 rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 border border-white/5 bg-zinc-950/80 shadow-2xl backdrop-blur-md">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Nike Runner.jpg" 
            alt="Nike Runner" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Activity className="w-4 h-4" />
            <span>Our Story</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none text-glow">
            Forged in the <span className="text-accent">Streets.</span><br/> Crafted for the Future.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed">
            UrbanKick was born from a simple belief: sneakers are more than just footwear—they are the ultimate expression of identity, culture, and progress. We curate and deliver the world's most exclusive silhouettes directly to those who define the culture.
          </p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-20 bg-transparent border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 max-w-[500px] w-full bg-white/5 p-6 aspect-square flex items-center justify-center">
                <img 
                  src="/Nike-sports-shoes.jpg" 
                  className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-700 animate-float"
                  alt="Our Heritage"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-accent/20 rounded-full blur-3xl z-0"></div>
            </div>
            <div className="lg:w-1/2 animate-fade-in delay-200">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter text-glow">Redefining Sneaker Culture</h2>
              <div className="space-y-6 text-lg text-gray-300 font-medium leading-relaxed">
                <p>
                  Started in 2026 by a collective of designers and sneakerheads, UrbanKick emerged as a rebellion against the ordinary. We realized that finding authentic, high-quality, and rare sneakers was becoming a fragmented and frustrating experience.
                </p>
                <p>
                  So, we built our own sanctuary. A platform where technology meets streetwear. Every pair in our collection is rigorously authenticated, carefully curated, and presented with the respect that sneaker artistry deserves. 
                </p>
                <p>
                  We don't just sell shoes; we preserve history and pioneer the future of urban aesthetics. From classic retros that built the foundation to avant-garde designs that push boundaries, our catalog reflects the very heartbeat of the city.
                </p>
              </div>
              
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 backdrop-blur-md">
                  <Shield className="text-accent w-8 h-8 mb-4" />
                  <h4 className="text-white font-black text-xl mb-2">100% Authentic</h4>
                  <p className="text-sm text-gray-400 font-medium">Every pair is verified by our expert team.</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 backdrop-blur-md">
                  <TrendingUp className="text-accent w-8 h-8 mb-4" />
                  <h4 className="text-white font-black text-xl mb-2">Market Leaders</h4>
                  <p className="text-sm text-gray-400 font-medium">Setting the standard for premium retail.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-zinc-900/30 border-y border-white/5 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.05)_0,transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Sneakers Delivered', value: '150K+' },
              { label: 'Active Members', value: '75K+' },
              { label: 'Exclusive Brands', value: '120+' },
              { label: 'Countries Served', value: '45' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-5xl md:text-6xl font-black mb-3 tracking-tighter text-white group-hover:text-accent transition-colors duration-300 text-glow">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.25em] font-bold text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter text-glow mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto">The principles that guide our everyday hustle.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="w-8 h-8 text-accent" />,
                title: "Global Community",
                desc: "We bridge cultures and connect enthusiasts worldwide, fostering a space where passion knows no borders."
              },
              {
                icon: <Zap className="w-8 h-8 text-accent" />,
                title: "Relentless Innovation",
                desc: "From our seamless digital experience to our logistics, we constantly innovate to stay ahead of the game."
              },
              {
                icon: <Heart className="w-8 h-8 text-accent" />,
                title: "Cultural Respect",
                desc: "We honor the roots of streetwear, amplifying the voices of creators, athletes, and artists who shape the culture."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:border-accent/40 hover:-translate-y-2 transition-all duration-300 shadow-xl group">
                <div className="bg-zinc-900/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:bg-accent/10 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-zinc-900/60 border border-white/10 rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto animate-slide-up">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-glow">Ready to join the cult?</h2>
              <p className="text-xl text-gray-300 mb-12 font-medium leading-relaxed">
                Step into the future of footwear. Explore our latest drops, secure exclusive releases, and find your next favorite pair of kicks today.
              </p>
              <a 
                href="/products" 
                className="inline-flex items-center space-x-3 bg-accent text-white px-12 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl shadow-accent/20 transform hover:-translate-y-1 active:translate-y-0"
              >
                <span>Shop Collection</span>
                <CheckCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
