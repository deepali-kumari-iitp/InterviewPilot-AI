import axios from "axios";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

import { Sparkles, Menu, X, Brain, Wand2, CircleDot } from "lucide-react";

import { useEffect, useState } from "react";

function App() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [particles, setParticles] = useState([]);

  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  // CURSOR EFFECT
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 120,
    damping: 20,
  });

  const springY = useSpring(mouseY, {
    stiffness: 120,
    damping: 20,
  });

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX - 10);
      mouseY.set(e.clientY - 10);

      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 18 + 8,
      };

      setParticles((prev) => [...prev.slice(-25), newParticle]);
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  // GENERATE QUESTIONS
  const generateQuestions = async () => {
    if (!topic) return;

    try {
      setLoading(true);

      const res = await axios.post(webhookUrl, {
        topic,
      });

      console.log(res.data);

      const cleaned = res.data.output
        .replace(/```json/g, "")
        .replace(/```/g, "");

      const parsedData = JSON.parse(cleaned);

      setQuestions(parsedData.questions || []);
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // DIFFICULTY COLOR
  const difficultyColor = (difficulty) => {
    if (difficulty?.toLowerCase() === "easy") {
      return "from-emerald-500/20 to-green-500/20 text-green-300 border-green-500/30";
    }

    if (difficulty?.toLowerCase() === "hard") {
      return "from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30";
    }

    return "from-violet-500/20 to-fuchsia-500/20 text-violet-300 border-violet-500/30";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-0 h-[500px] w-[500px] rounded-full bg-fuchsia-700/20 blur-[140px] animate-pulse" />

        <div className="absolute top-[20%] right-0 h-[500px] w-[500px] rounded-full bg-cyan-600/20 blur-[140px] animate-pulse" />

        <div className="absolute bottom-0 left-[30%] h-[400px] w-[400px] rounded-full bg-purple-700/20 blur-[120px] animate-pulse" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
      </div>

      {/* CURSOR */}

      <motion.div
        className="pointer-events-none fixed z-50 h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 blur-sm"
        style={{
          x: springX,
          y: springY,
        }}
      />

      {/* BUBBLES */}

      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 0.9,
              scale: 1,
            }}
            animate={{
              opacity: 0,
              scale: 0,
              y: particle.y - 50,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2,
            }}
            className="pointer-events-none fixed z-40 rounded-full bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 blur-md"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </AnimatePresence>

      {/* NAVBAR */}

      <nav className="fixed top-0 z-30 w-full border-b border-white/10 bg-black/30 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 shadow-[0_0_35px_rgba(217,70,239,0.5)]">
              <Brain size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold">InterviewPilot AI</h1>

              <p className="text-xs text-gray-400">
                Premium AI interview platform
              </p>
            </div>
          </motion.div>

          <div className="hidden items-center gap-10 text-sm text-gray-300 md:flex">
            <a href="#" className="transition hover:text-white">
              Features
            </a>

            <a href="#" className="transition hover:text-white">
              Questions
            </a>

            <a href="#" className="transition hover:text-white">
              Contact
            </a>
          </div>

          <div className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-7 py-4 font-semibold shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            >
              Get Started
            </motion.button>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* HERO */}

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-36 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-6 py-3 text-sm text-fuchsia-200 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            Premium AI Interview Generation
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-10 max-w-5xl text-5xl font-black leading-tight md:text-7xl"
        >
          Modern interview prep
          <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
            {" "}
            designed like a real SaaS product
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 max-w-3xl text-lg leading-9 text-gray-400 md:text-xl"
        >
          Generate AI-powered interview questions and answers with cinematic
          motion design, futuristic UI, premium hover effects, and immersive
          interactions.
        </motion.p>

        {/* INPUT BOX */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 w-full max-w-4xl rounded-[35px] border border-white/10 bg-white/5 p-5 shadow-[0_0_80px_rgba(168,85,247,0.15)] backdrop-blur-3xl"
        >
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/50">
              <input
                type="text"
                placeholder="Enter topic like React, DBMS, OS..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-transparent px-6 py-5 text-lg outline-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateQuestions}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 px-10 py-5 font-bold shadow-[0_0_50px_rgba(168,85,247,0.5)]"
            >
              <div className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover:translate-x-[100%]" />

              <span className="relative z-10 flex items-center gap-3 text-lg">
                <Wand2 size={18} />

                {loading ? "Generating..." : "Generate"}
              </span>
            </motion.button>
          </div>

          {/* QUICK BUTTONS */}

          <div className="mt-5 flex flex-wrap gap-3">
            {["React", "DBMS", "System Design", "OS", "DSA"].map((item) => (
              <motion.button
                whileHover={{ scale: 1.08 }}
                key={item}
                onClick={() => setTopic(item)}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 backdrop-blur-xl transition hover:border-fuchsia-500/40 hover:text-white"
              >
                {item}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* QUESTION + ANSWER CARDS */}

        <div className="mt-24 grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {questions.map((q, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -12,
                  scale: 1.02,
                }}
                className="
          group
          relative
          flex
          min-h-[430px]
max-w-[380px]
mx-auto
          flex-col
          justify-between
          overflow-hidden
          rounded-[34px]
          border
          border-white/10
          bg-white/[0.04]
          p-8
          backdrop-blur-3xl
          transition-all
          duration-500
          hover:border-fuchsia-500/30
          hover:shadow-[0_0_70px_rgba(217,70,239,0.18)]
        "
              >
                {/* Glow Effect */}

                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-500/10" />
                </div>

                {/* Top */}

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300">
                      <CircleDot size={13} />
                      Generated Question
                    </div>

                    <div
                      className={`rounded-full border bg-gradient-to-r px-4 py-2 text-xs font-bold uppercase tracking-wider ${difficultyColor(
                        q.difficulty,
                      )}`}
                    >
                      {q.difficulty}
                    </div>
                  </div>

                  {/* Question */}

                  <h2
                    className="
            mt-10
            text-3xl
            font-bold
            leading-[1.4]
            text-white
          "
                  >
                    {q.question}
                  </h2>
                </div>

                {/* Bottom */}

                <div className="relative z-10 mt-12">
                  <p
                    className="
            mb-5
            text-xs
            uppercase
            tracking-[0.4em]
            text-gray-500
          "
                  >
                    Answer
                  </p>

                  <p
                    className="
            text-lg
            leading-9
            text-gray-300
          "
                  >
                    {q.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

export default App;
