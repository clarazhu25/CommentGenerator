'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Check, Clipboard, GraduationCap, RotateCcw, Sparkles, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';

type Length = 'sentence' | '100';
const sample = {
  name: 'Maya Chen',
  course: 'Scratch Game Design',
  topics: 'variables, loops, broadcasts, debugging',
  project: 'Maya designed a space-collection game where the player gathers stars while avoiding asteroids. She added a score counter, three levels, and a win screen.',
  traits: ['Creative', 'Persistent', 'Curious'],
};

const studentTraits = [
  'Adaptable', 'Analytical', 'Attentive', 'Collaborative', 'Communicative',
  'Confident', 'Consistent', 'Creative', 'Curious', 'Determined',
  'Detail-oriented', 'Enthusiastic', 'Focused', 'Hardworking', 'Imaginative',
  'Independent', 'Kind', 'Motivated', 'Organized', 'Patient',
  'Positive', 'Proactive', 'Reflective', 'Resilient', 'Resourceful',
  'Responsible', 'Supportive', 'Thoughtful', 'Brave', 'Persistent',
];

export default function Home() {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [topics, setTopics] = useState('');
  const [project, setProject] = useState('');
  const [traits, setTraits] = useState<string[]>([]);
  const [length, setLength] = useState<Length>('100');
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const wordCount = useMemo(() => feedback ? feedback.trim().split(/\s+/).length : 0, [feedback]);

  async function generate(event?: React.FormEvent) {
    event?.preventDefault();
    const missingCore = !name.trim() || !course.trim() || !topics.trim();
    const missingModeDetails = length === 'sentence' ? traits.length !== 3 : !project.trim();
    if (missingCore || missingModeDetails) {
      setError(length === 'sentence'
        ? 'Please complete the fields and select exactly three student strengths.'
        : 'Please complete each field, including the final project.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          course: course.trim(),
          topics: topics.trim(),
          project: length === '100' ? project.trim() : '',
          traits: length === 'sentence' ? traits : [],
          length,
          previousFeedback: feedback,
        }),
      });
      const data = await response.json() as { feedback?: string; error?: string };
      if (!response.ok || !data.feedback) throw new Error(data.error || 'Feedback could not be generated.');
      setFeedback(data.feedback);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Feedback could not be generated.');
    } finally {
      setLoading(false);
    }
  }

  function useExample() {
    setName(sample.name); setCourse(sample.course); setTopics(sample.topics); setProject(sample.project); setTraits(sample.traits); setError('');
  }
  async function copyFeedback() {
    await navigator.clipboard.writeText(feedback); setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  }
  function clearAll() {
    setName(''); setCourse(''); setTopics(''); setProject(''); setTraits([]); setFeedback(''); setError('');
  }

  function changeLength(nextLength: Length) {
    setLength(nextLength); setFeedback(''); setError('');
  }

  function toggleTrait(trait: string, pressed: boolean) {
    if (pressed && traits.length < 3) setTraits((current) => [...current, trait]);
    if (!pressed) setTraits((current) => current.filter((item) => item !== trait));
    setError('');
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <a className="flex items-center gap-3" href="#top" aria-label="ClassNote home">
            <span className="grid size-10 place-items-center rounded-[14px] bg-primary text-primary-foreground shadow-[0_7px_18px_rgba(77,47,138,.22)]"><GraduationCap className="size-5" /></span>
            <span><span className="block text-[17px] font-bold leading-5 tracking-[-.03em]">ClassNote</span><span className="block text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Parent feedback</span></span>
          </a>
          <div className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground sm:flex"><span className="size-2 rounded-full bg-[#6fc4a4] shadow-[0_0_0_4px_rgba(111,196,164,.16)]" />Ready to help</div>
        </div>
      </header>

      <section id="top" className="relative mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="pointer-events-none absolute -right-28 -top-32 size-[440px] rounded-full bg-[#e9dcff]/60 blur-3xl" />
        <div className="relative mb-9 grid gap-5 lg:grid-cols-[1fr_470px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ddcff9] bg-[#f5efff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-[#6643a6]"><Sparkles className="size-3.5" /> Last class made easy</div>
            <h1 className="max-w-[760px] font-heading text-[clamp(2.35rem,5.1vw,4.7rem)] font-semibold leading-[.98] tracking-[-.055em] text-[#25202e]">Thoughtful feedback,<span className="font-serif italic font-normal text-primary"> ready in moments.</span></h1>
          </div>
          <p className="max-w-[460px] text-[15px] leading-7 text-muted-foreground lg:pb-1">Turn the highlights from a student’s final class into warm, specific feedback their parents will value.</p>
        </div>

        <div className="relative grid overflow-hidden rounded-[26px] border border-border bg-card shadow-[0_24px_70px_rgba(47,35,70,.11)] lg:grid-cols-[1.04fr_.96fr]">
          <form onSubmit={generate} className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div><p className="mb-1 text-[11px] font-extrabold uppercase tracking-[.16em] text-primary">Student details</p><h2 className="text-2xl font-bold tracking-[-.035em]">Tell us about the class</h2></div>
              <Button type="button" variant="ghost" size="sm" onClick={useExample} className="text-primary hover:bg-[#f4effc]">Use example</Button>
            </div>
            <div className="grid gap-5">
              <div className="grid gap-2"><Label htmlFor="student-name">Student name</Label><Input id="student-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Maya Chen" className="h-11 rounded-xl border-[#ddd7e4] bg-white px-4" /></div>
              <fieldset><legend className="mb-2 text-sm font-medium">Feedback length</legend><div className="grid grid-cols-2 rounded-xl bg-[#f3eff7] p-1" aria-label="Feedback length">
                <button type="button" aria-pressed={length === 'sentence'} onClick={() => changeLength('sentence')} className={`rounded-[9px] px-3 py-2.5 text-sm font-semibold transition ${length === 'sentence' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>One sentence</button>
                <button type="button" aria-pressed={length === '100'} onClick={() => changeLength('100')} className={`rounded-[9px] px-3 py-2.5 text-sm font-semibold transition ${length === '100' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>About 100 words</button>
              </div></fieldset>
              <div className="grid gap-2"><Label htmlFor="course">Course name</Label><Input id="course" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. Creative Coding with Python" className="h-11 rounded-xl border-[#ddd7e4] bg-white px-4" /></div>
              <div className="grid gap-2"><Label htmlFor="topics">Topics learned</Label><Input id="topics" value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="e.g. loops, variables, event handling" className="h-11 rounded-xl border-[#ddd7e4] bg-white px-4" /><p className="text-xs text-muted-foreground">Separate topics with commas.</p></div>
              {length === 'sentence' ? (
                <fieldset className="grid gap-3">
                  <div className="flex items-baseline justify-between gap-3"><legend className="text-sm font-medium">Choose three strengths</legend><span className={`text-xs font-bold ${traits.length === 3 ? 'text-[#27805f]' : 'text-muted-foreground'}`}>{traits.length} / 3 selected</span></div>
                  <div className="flex max-h-[216px] flex-wrap gap-2 overflow-y-auto rounded-xl border border-[#ddd7e4] bg-[#fbf9fd] p-3" aria-label="Student strengths">
                    {studentTraits.map((trait) => {
                      const selected = traits.includes(trait);
                      return <Toggle key={trait} pressed={selected} onPressedChange={(pressed) => toggleTrait(trait, pressed)} disabled={!selected && traits.length === 3} variant="outline" size="sm" className="h-8 rounded-full border-[#d8cfe3] bg-white px-3 text-xs text-[#61596a] shadow-none aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-white disabled:opacity-40">{selected && <Check className="size-3" />}{trait}</Toggle>;
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">These words will shape the tone of the sentence.</p>
                </fieldset>
              ) : (
                <div className="grid gap-2"><Label htmlFor="project">Final project notes</Label><Textarea id="project" value={project} onChange={(e) => setProject(e.target.value)} placeholder="What did the student make? Add rough notes—we’ll summarize the ideas in fresh language." className="min-h-[112px] resize-none rounded-xl border-[#ddd7e4] bg-white px-4 py-3 leading-6" /><p className="text-xs text-muted-foreground">Your notes guide the feedback and won’t be copied word for word.</p></div>
              )}
            </div>
            {error && <p role="alert" className="mt-4 rounded-lg bg-[#fff0ed] px-3 py-2 text-sm font-medium text-[#a84538]">{error}</p>}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={loading} size="lg" className="h-12 flex-1 rounded-xl bg-primary px-5 text-sm font-bold shadow-[0_10px_24px_rgba(91,57,154,.24)] hover:bg-[#4c2d87] sm:flex-none sm:min-w-[210px]">
                {loading ? <><span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" /> Writing feedback…</> : <><WandSparkles className="size-4" /> Generate feedback <ArrowRight className="ml-1 size-4" /></>}
              </Button>
              <Button type="button" variant="ghost" size="lg" onClick={clearAll} className="h-12 rounded-xl text-muted-foreground"><RotateCcw className="size-4" /> Clear</Button>
            </div>
          </form>

          <section className="relative flex min-h-[560px] flex-col bg-[#2d2439] p-6 text-white sm:p-8 lg:min-h-0 lg:p-10" aria-labelledby="feedback-title">
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.16)_1px,transparent_0)] [background-size:22px_22px]" />
            <div className="relative flex items-start justify-between gap-4"><div><p className="mb-1 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#b9a0e9]">Parent-ready</p><h2 id="feedback-title" className="text-2xl font-bold tracking-[-.035em]">Your feedback</h2></div>{feedback && <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70">{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>}</div>
            <div className="relative my-8 flex flex-1 flex-col rounded-[20px] border border-white/10 bg-white/[.07] p-6 shadow-inner sm:p-8">
              {feedback ? <>
                <span className="mb-6 grid size-10 place-items-center rounded-full bg-[#d7c2ff] text-[#4d2f8a]"><Sparkles className="size-4" /></span>
                <p className="font-serif text-[clamp(1.35rem,2.4vw,1.7rem)] leading-[1.55] text-[#fbf8ff]">“{feedback}”</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-8"><Button type="button" onClick={copyFeedback} className="h-10 rounded-xl bg-white px-4 font-bold text-[#2d2439] hover:bg-[#f2ecfa]">{copied ? <><Check className="size-4 text-[#27805f]" /> Copied</> : <><Clipboard className="size-4" /> Copy feedback</>}</Button><Button type="button" onClick={() => generate()} variant="outline" className="h-10 rounded-xl border-white/15 bg-transparent px-4 text-white hover:bg-white/10 hover:text-white"><RotateCcw className="size-4" /> Try another</Button></div>
              </> : <div className="m-auto max-w-[310px] text-center"><span className="mx-auto mb-5 grid size-16 place-items-center rounded-[20px] bg-white/10 text-[#d7c2ff]"><WandSparkles className="size-7" /></span><h3 className="mb-2 text-lg font-bold">A warm note is one click away</h3><p className="text-sm leading-6 text-white/55">Complete the class details, then generate a polished message you can review and share.</p></div>}
            </div>
            <div className="relative flex items-center gap-3 rounded-xl border border-[#73c8a7]/20 bg-[#73c8a7]/10 px-4 py-3 text-xs leading-5 text-[#c9f0e1]"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#73c8a7]/20"><Check className="size-3.5" /></span>Your notes are interpreted and rewritten—not copied into the response.</div>
          </section>
        </div>
        <footer className="flex flex-col justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row"><span>Made for coding instructors who care.</span><span>Always review feedback before sending to a family.</span></footer>
      </section>
    </main>
  );
}
