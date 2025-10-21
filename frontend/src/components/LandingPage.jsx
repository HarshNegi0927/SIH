"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import LoginModal from "./login-modal"

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const href = e.target.getAttribute("href")
      if (href && href.startsWith("#")) {
        e.preventDefault()
        const targetElement = document.querySelector(href)
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }
    }

    const navLinks = document.querySelectorAll('nav a[href^="#"]')
    navLinks.forEach((link) => {
      link.addEventListener("click", handleSmoothScroll)
    })

    const statsEl = document.getElementById("stats")
    if (!statsEl) return

    const counters = statsEl.querySelectorAll(".js-counter")
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return
        counters.forEach((el) => {
          const target = Number.parseInt(el.dataset.target, 10) || 0
          let current = 0
          const step = Math.max(1, Math.floor(target / 120))
          const tick = () => {
            current += step
            if (current < target) {
              el.textContent = current
              requestAnimationFrame(tick)
            } else {
              el.textContent = target
            }
          }
          tick()
        })
        obs.disconnect()
      },
      { threshold: 0.3 },
    )
    observer.observe(statsEl)

    return () => {
      observer.disconnect()
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleSmoothScroll)
      })
    }
  }, [])

  const features = [
    {
      icon: "📊",
      title: "Dynamic Dashboard",
      desc: "Real-time tracking of academic & activity metrics with comprehensive analytics.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "🎯",
      title: "Activity Tracker",
      desc: "Seamlessly upload conferences, MOOCs, internships & volunteering experiences.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "✅",
      title: "Faculty Approvals",
      desc: "Streamlined verification workflow with complete audit trails and transparency.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: "📄",
      title: "Digital Portfolio",
      desc: "Auto-generated, shareable, and professionally verified student profiles.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: "📈",
      title: "Analytics & Reporting",
      desc: "Comprehensive reports aligned with NAAC, AICTE & NIRF requirements.",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: "🔗",
      title: "System Integration",
      desc: "Seamless connectivity with existing LMS, ERP, and institutional systems.",
      gradient: "from-teal-500 to-cyan-500",
    },
  ]

  const benefits = [
    {
      icon: "🎓",
      title: "Student Empowerment",
      desc: "Create verified, professional profiles that enhance placement opportunities and academic advancement.",
      stat: "90% better placement rates",
    },
    {
      icon: "⚡",
      title: "Administrative Excellence",
      desc: "Eliminate paperwork bottlenecks and automate complex reporting for accreditation bodies.",
      stat: "75% reduction in admin time",
    },
    {
      icon: "📊",
      title: "Data-Driven Decisions",
      desc: "Access actionable insights and comprehensive analytics to optimize student outcomes.",
      stat: "3x faster decision making",
    },
  ]

  return (
    <div className="antialiased text-gray-900 bg-white scroll-smooth">
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 shadow-sm bg-white/95 backdrop-blur-lg">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                S
              </div>
              <div className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                SIHnchronize
              </div>
            </div>

            <nav className="items-center hidden space-x-8 font-medium text-gray-600 lg:flex">
              <a
                href="#features"
                className="text-gray-600 transition-colors duration-300 hover:text-purple-700 focus:text-blue-600 focus:outline-none"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-gray-600 transition-colors duration-300 hover:text-purple-700 focus:text-blue-600 focus:outline-none"
              >
                Benefits
              </a>
              <a
                href="#stats"
                className="text-gray-600 transition-colors duration-300 hover:text-purple-700 focus:text-blue-600 focus:outline-none"
              >
                Impact
              </a>
              <a
                href="#contact"
                className="text-gray-600 transition-colors duration-300 hover:text-purple-700 focus:text-blue-600 focus:outline-none"
              >
                Contact
              </a>
            </nav>

            <div className="items-center hidden space-x-3 md:flex">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-5 py-2.5 font-medium border-2 border-purple-600 rounded-xl text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-colors duration-300 focus:outline-none"
              >
                Login
              </button>

              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl focus:from-blue-700 focus:to-purple-700 focus:outline-none transition-all duration-300 shadow-lg">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-6 mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                  🚀 Trusted by 500+ Educational Institutions
                </div>
                <h1 className="text-5xl font-bold leading-tight lg:text-6xl text-balance">
                  Transform Your{" "}
                  <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    Student Management
                  </span>{" "}
                  Experience
                </h1>
                <p className="max-w-2xl text-xl leading-relaxed text-gray-600 text-pretty">
                  Centralize, validate, and showcase every student's academic journey with our comprehensive platform.
                  Reduce administrative overhead while empowering students to excel.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="px-8 py-4 font-semibold text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl focus:from-blue-700 focus:to-purple-700 focus:outline-none">
                  Schedule Free Demo
                </button>
                <button className="px-8 py-4 font-semibold text-gray-700 transition-all duration-300 border-2 border-gray-200 rounded-xl focus:border-blue-300 focus:text-blue-600 focus:outline-none">
                  Explore Features
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 p-8 transition-shadow duration-300 bg-white shadow-2xl rounded-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Student Dashboard</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                      <span className="text-sm text-gray-600">Activities Completed</span>
                      <span className="text-sm font-semibold text-blue-600">12/15</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                      <span className="text-sm text-gray-600">Certificates Earned</span>
                      <span className="text-sm font-semibold text-green-600">8</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                      <span className="text-sm text-gray-600">Portfolio Score</span>
                      <span className="text-sm font-semibold text-purple-600">95%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute rounded-full -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-3xl"></div>
              <div className="absolute rounded-full -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 bg-grey-400">
        <div className="mb-4 text-center">
          <p className="text-sm font-medium text-gray-700">Compliance & Recognition</p>
        </div>
        <div className="flex justify-center gap-6">
          {["NAAC Approved", "AICTE Compliant", "NIRF Ready", "UGC Recognized"].map((item, idx) => (
            <motion.span
              key={idx}
              className="text-sm font-semibold"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>

      <section id="features" className="py-24 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl text-balance">
              Powerful Features for Modern Education
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 text-pretty">
              Comprehensive tools designed to streamline student management and enhance educational outcomes
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon, title, desc, gradient }, idx) => (
              <div
                key={idx}
                className="relative p-8 transition-transform duration-300 bg-white border border-gray-100 shadow-lg group rounded-2xl focus-within:border-gray-200 hover:scale-105"
              >
                <div className="relative space-y-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="leading-relaxed text-gray-600 text-pretty">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl">Why Leading Institutions Choose Us</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Join hundreds of educational institutions that have transformed their student management approach
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {benefits.map(({ icon, title, desc, stat }, idx) => (
              <div key={idx} className="space-y-6 text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto text-3xl shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                  {" "}
                  {icon}{" "}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                  <p className="max-w-sm mx-auto leading-relaxed text-gray-600"> {desc} </p>
                  <div className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 bg-white rounded-full shadow-md">
                    {" "}
                    {stat}{" "}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="max-w-6xl px-6 mx-auto text-center">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl"> Measurable Impact Across Institutions </h2>
            <p className="text-xl text-blue-100"> Real results from real institutions using Smart Student Hub </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="space-y-3">
              <div className="text-5xl font-bold text-white lg:text-6xl js-counter" data-target="95">
                0
              </div>
              <div className="text-xl font-medium text-blue-100"> Time Saved </div>
              <div className="text-sm text-blue-200"> Average reduction in administrative workload </div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-bold text-white lg:text-6xl js-counter" data-target="85">
                0
              </div>
              <div className="text-xl font-medium text-blue-100">Participation Increase</div>
              <div className="text-sm text-blue-200"> More students engaging in activities</div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-bold text-white lg:text-6xl js-counter" data-target="70">
                0
              </div>
              <div className="text-xl font-medium text-blue-100">Faster Accreditation</div>
              <div className="text-sm text-blue-200">Accelerated compliance reporting</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl px-6 mx-auto space-y-8 text-center">
          <div className="space-y-4">
            <h3 className="text-4xl font-bold text-gray-900 lg:text-5xl text-balance">
              Ready to Transform Your Institution?
            </h3>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 text-pretty">
              Join the education revolution. Schedule a personalized demo and see how Smart Student Hub can elevate your
              institution.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="px-10 py-4 font-semibold text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl focus:from-blue-700 focus:to-purple-700 focus:outline-none">
              Schedule Free Demo
            </button>
            <button className="px-10 py-4 font-semibold text-gray-700 transition-all duration-300 border-2 border-gray-200 rounded-xl focus:border-blue-300 focus:text-blue-600 focus:outline-none">
              Start Free Trial
            </button>
          </div>
          <div className="pt-8 text-sm text-gray-500">
            ✨ No credit card required • 30-day free trial • Setup in under 10 minutes
          </div>
        </div>
      </section>

      <footer id="contact" className="py-16 text-white bg-gray-800">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 font-bold text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  {" "}
                  S{" "}
                </div>
                <div className="text-lg font-bold">Smart Student Hub</div>
              </div>
              <p className="leading-relaxed text-gray-400 text-pretty">
                {" "}
                Empowering educational institutions with intelligent student management solutions.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div>📧 contact@smartstudenthub.edu</div>
                <div>📞 +91 88400 47057</div>
                <div>☎ +91 11223 44556</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Office Address</h4>
              <div className="text-gray-400">
                🏢 4th Floor, Main Building ,Smart Tech LTD. <br /> Lucknow, UP, India
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 transition-colors duration-300 bg-gray-800 rounded-lg focus:bg-blue-600 focus:outline-none"
                >
                  {" "}
                  🌐{" "}
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 transition-colors duration-300 bg-gray-800 rounded-lg focus:bg-blue-600 focus:outline-none"
                >
                  {" "}
                  💼{" "}
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 transition-colors duration-300 bg-gray-800 rounded-lg focus:bg-blue-600 focus:outline-none"
                >
                  {" "}
                  🐦{" "}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-12 text-center text-gray-400 border-t border-gray-800">
            <div>© 2025 Smart Student Hub. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
