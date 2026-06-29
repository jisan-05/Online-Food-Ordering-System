import { motion } from 'framer-motion'
import { Award, ShieldCheck, Sparkles, Users, Utensils, Zap } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

function AboutPage() {
  const stats = [
    { value: '150,000+', label: 'Happy Customers', text: 'Serving local food lovers monthly' },
    { value: '500+', label: 'Partner Restaurants', text: 'Vetted kitchens and local favorites' },
    { value: '99.8%', label: 'On-Time Delivery', text: 'Ensuring your meals arrive fresh and warm' },
  ]

  const values = [
    {
      title: 'Integrity First',
      description: 'We adhere to the highest standard of hygiene and service quality. Every partner is personally vetted.',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Powered by Tech',
      description: 'Using smart routing algorithms to match your order with the closest rider for hot, fresh delivery.',
      icon: Zap,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    },
    {
      title: 'Empowering Communities',
      description: 'We donate a percentage of our monthly revenue to support local soup kitchens and food banks.',
      icon: Users,
      color: 'bg-orange-50 text-orange-600 border-orange-100',
    },
    {
      title: 'Culinary Passion',
      description: 'We believe eating is an experience. We curate dishes that bring delight to your dining table.',
      icon: Utensils,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  ]

  const timeline = [
    {
      year: '2024',
      title: 'The Spark of Innovation',
      desc: 'Founded in a modest studio kitchen, CraveHub was born from a desire to connect home chefs and local restaurants directly to food lovers.',
    },
    {
      year: '2025',
      title: 'Expanding Our Reach',
      desc: 'Partnered with over 150 local dining brands, launched our smart-matching logistics hub, and reduced average delivery time to 30 minutes.',
    },
    {
      year: '2026',
      title: 'The Future of Dining',
      desc: 'Now serving multiple regions, offering contactless secure payments, and launching zero-emission electric delivery fleets.',
    },
  ]

  const team = [
    {
      name: 'Marcus Vance',
      role: 'CEO & Co-Founder',
      bio: 'A veteran restaurateur with 15 years of industry experience, Marcus drives our community-first vision.',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
    },
    {
      name: 'Dr. Evelyn Chen',
      role: 'CTO & Co-Founder',
      bio: 'An AI researcher and software architect, Evelyn created the smart dispatch algorithms powering our rapid delivery.',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
    },
    {
      name: 'Liam Sterling',
      role: 'Head of Culinary Relations',
      bio: 'Liam bridges our technology with kitchens, ensuring food safety standards and helping chefs design optimized delivery menus.',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80',
    },
  ]

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white md:py-32">
        <div className="absolute inset-0 z-0">
          <img
            className="h-full w-full object-cover opacity-80"
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80"
            alt="Chef plating food in a premium kitchen"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/25 border border-orange-500/30 px-4 py-2 text-sm font-black tracking-wide text-orange-400">
              <Sparkles size={16} /> Empowering Gastronomy
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-7xl text-white">
              The Story of CraveHub
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              We build bridges between passionate local culinary creators and hungry neighborhood foodies. Enjoy gourmet dishes prepared with care and delivered with speed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platform Overview Stats */}
      <section className="relative -mt-12 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <p className="text-4xl font-black text-orange-600">{stat.value}</p>
              <h3 className="mt-2 text-lg font-black text-slate-950">{stat.label}</h3>
              <p className="mt-1 text-sm font-bold text-slate-500">{stat.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-orange-600">Our Journey</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                Bridging Tech & Appetite
              </h2>
            </div>
            <p className="text-base leading-8 text-slate-600 font-medium">
              At CraveHub, we understand that busy lifestyles shouldn't compromise culinary enjoyment. That's why we built a responsive platform that hosts the best food options from your favorite local brands. Whether it is hot wood-fired pizzas, healthy sushi rolls, or fresh salads, our curated list ensures top quality.
            </p>
            <p className="text-base leading-8 text-slate-600 font-medium">
              We empower small independent restaurants by equipping them with order tracking systems, menu analytics, and digital tools so they can thrive in modern times.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative aspect-video overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900 shadow-lg lg:aspect-square"
          >
            <img
              className="h-full w-full object-cover opacity-90"
              src="https://t3.ftcdn.net/jpg/01/28/52/18/360_F_128521888_fmzQgeBbrnCpAS7A4wKPKbu0VDikCeBh.jpg"
              alt="Food delivery dispatch scene"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
              <p className="text-sm font-black text-slate-950">"Our mission is to support local communities by providing fast access to fresh meals."</p>
              <p className="mt-2 text-xs font-black uppercase tracking-wider text-orange-600">- The CraveHub Founders</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-orange-600">Core Values</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              What we stand for
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500 font-bold">
              Our culture revolves around building trust, ensuring quality, and creating delicious everyday moments.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((val, index) => {
              const Icon = val.icon
              return (
                <motion.div
                  key={val.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-xs hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className={`grid size-12 place-items-center rounded-2xl ${val.color} border mb-5`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{val.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500 font-bold">{val.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="text-sm font-black uppercase tracking-[0.2em] text-orange-600">Our Timeline</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            How we grew
          </h2>
        </div>

        <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-12 max-w-3xl mx-auto">
          {timeline.map((step, index) => (
            <motion.div
              key={step.year}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute -left-[35px] top-1.5 grid size-6 place-items-center rounded-full bg-orange-500 text-white shadow">
                <Award size={12} />
              </div>
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                {step.year}
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 font-bold">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-orange-600">Leadership Team</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Meet the minds behind CraveHub
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500 font-bold">
              Our founders and industry experts combine food passion with deep technology backgrounds.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-center hover:shadow-lg transition duration-300"
              >
                <img
                  className="mx-auto h-36 w-36 rounded-full object-cover border-4 border-orange-500/10 shadow-md"
                  src={member.img}
                  alt={member.name}
                />
                <h3 className="mt-5 text-xl font-black text-slate-950">{member.name}</h3>
                <p className="text-sm font-black uppercase tracking-wider text-orange-600 mt-1">{member.role}</p>
                <p className="mt-4 text-sm leading-6 text-slate-500 font-bold">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
