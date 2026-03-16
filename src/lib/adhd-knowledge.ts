/**
 * ADHD Knowledge Base for AI Coach
 * Research-backed strategies, medication awareness, and practical techniques
 * to help the AI coach provide informed, evidence-based guidance
 */

interface KnowledgeSection {
  title: string
  keywords: string[]
  content: string
}

const knowledgeBase: KnowledgeSection[] = [
  {
    title: 'Executive Function Support',
    keywords: ['executive function', 'planning', 'organization', 'task initiation', 'prioritization', 'overwhelm'],
    content: `Executive function challenges are core to ADHD. Key techniques:
- Body doubling: Working alongside someone (physical or virtual) increases focus and accountability
- External scaffolding: Use systems outside your brain (lists, calendars, reminders) to handle what working memory can't
- Time blocking: Schedule specific tasks in specific time slots to reduce decision fatigue
- Task decomposition: Break big projects into tiny, concrete steps (instead of "write report", try "open document", "write introduction", etc.)
- Two-minute rule: If something takes less than 2 minutes, do it now rather than adding it to a list
- Removal of choices: Reduce decisions by automating routines (same breakfast, same start time)`,
  },
  {
    title: 'Dopamine Management',
    keywords: ['dopamine', 'motivation', 'reward', 'interest-based', 'novelty', 'stimulation'],
    content: `ADHD brains are interest-based and novelty-driven, not importance-based:
- Reward stacking: Pair boring tasks with something you enjoy (favorite music, movement, snack) to create dopamine pairing
- Novelty injection: Change your environment, tools, or methods to keep tasks engaging
- Gamification: Use points, streaks, or challenges to make routine tasks feel rewarding
- Hyperfocus leverage: Schedule deep work on topics you're interested in when possible
- Dopamine activities: Regular exercise (especially cardio) is one of the most effective dopamine boosters
- Avoid dopamine crashes: Intense stimulation followed by boredom makes ADHD harder; balance is key
- Medication timing: If on stimulant meds, understand when your dopamine is highest for task scheduling`,
  },
  {
    title: 'Working Memory Aids',
    keywords: ['memory', 'forget', 'remembering', 'capture', 'brain dump', 'notes', 'external brain'],
    content: `ADHD working memory is often weak, but with the right systems it's manageable:
- Capture systems: Write things down IMMEDIATELY (phone note, voice memo, sticky note) before they evaporate
- Brain dumps: Weekly download of everything in your head onto paper/digital system to reduce cognitive load
- Visual reminders: Physical notes, phone wallpapers, post-its in high-traffic areas beat digital-only reminders
- External checklists: For repeated tasks, create a template checklist you reuse (packing, meeting prep, etc.)
- Time anchors: Link reminders to existing habits (brush teeth → take meds, lunch → check calendar)
- Constraint-based systems: Make things hard to forget by removing friction (meds by your coffee, keys in your bag)`,
  },
  {
    title: 'Emotional Regulation & RSD',
    keywords: ['emotional', 'dysphoria', 'RSD', 'rejection sensitive', 'anxiety', 'mood', 'anger', 'overwhelm', 'emotional flooding'],
    content: `ADHD emotional regulation is harder and more intense than neurotypical peers:
- Rejection Sensitive Dysphoria (RSD): Real, intense emotional pain from perceived criticism/failure. Not just sensitivity—it's neurological.
- Emotional flooding: Emotions hit harder and faster; allow time to process before responding
- Physical regulation first: When emotional, physical activity (walking, stretching, cold water) helps regulate before talking
- Validation > solutions: ADHD folks often need to feel understood before you jump to problem-solving
- The ADHD-anxiety connection: Anxiety and ADHD often co-occur; time blindness and poor working memory fuel anxiety
- Emotional management strategies: Deep breathing, movement, grounding techniques, talking it out with someone who gets it
- Self-compassion: ADHD brains are their own worst critics; gentle inner dialogue is crucial`,
  },
  {
    title: 'Time Blindness Solutions',
    keywords: ['time', 'clock', 'late', 'deadline', 'schedule', 'when', 'how long', 'transition', 'wait'],
    content: `Time blindness is a core ADHD trait—not laziness or inconsideration:
- Time timers: Visual timers (Time Timer, phone apps) show time passing, not just numbers
- Transition warnings: Give yourself 15, 10, 5-minute warnings before switching tasks (set alarms)
- Buffer time: Add 20-30% extra time to estimates; ADHD brains rarely estimate accurately
- External accountability: Deadlines with someone watching are stronger than self-imposed ones
- Anchor to events: Instead of "work for 2 hours", anchor to "until the timer alarm" or "until 3pm"
- Task duration awareness: Actively notice how long tasks actually take, then build that data into future planning
- Waiting strategies: Have a specific task for waiting periods rather than losing time to phone scrolling`,
  },
  {
    title: 'Sleep & ADHD',
    keywords: ['sleep', 'tired', 'bedtime', 'insomnia', 'rest', 'tired', 'wind down', 'delay', 'night owl'],
    content: `ADHD and sleep difficulties go hand-in-hand:
- Delayed sleep phase: ADHD brains naturally shift later; fighting this causes burnout (if possible, work with your rhythm)
- Screen cutoff: Blue light from phones/screens hits harder for ADHD; aim for 30-60 min device-free before bed
- Wind-down routine: Create a consistent routine (same time, same steps) to signal bed-time to your brain
- Physical wind-down: Gentle stretching, warm bath, or progressive muscle relaxation (not exercise) before bed
- Sleep environment: Dark, cool (65-68°F), quiet; white noise machines help with racing thoughts
- Stimulation management: Avoid intense activities/conversations in the hour before bed
- Medication timing: If on stimulants, understand their duration to avoid evening doses interfering with sleep
- Melatonin & medication: Talk to your prescriber—some ADHD meds can suppress melatonin`,
  },
  {
    title: 'Exercise & Movement',
    keywords: ['exercise', 'movement', 'workout', 'activity', 'sports', 'walk', 'run', 'gym', 'physical'],
    content: `Exercise is one of the most evidence-backed ADHD interventions:
- Type matters: Sustained cardio (20-30 min) is most effective for ADHD symptom reduction
- Timing with meds: If on stimulants, timing exercise around medication peaks can maximize both effects
- Non-negotiable routine: Make it automatic (same time, same place) to overcome motivation barriers
- Enjoyment > intensity: You'll stick with something you like, even if it's "less effective"—consistency matters most
- Group/accountability: Classes, sports teams, or workout partners provide external structure and social motivation
- Quick dopamine hits: 5-10 min movement breaks reset focus better than sitting for that time
- Hyperfocus opportunity: Some ADHD folks hyperfocus on exercise; use this to build routine`,
  },
  {
    title: 'Nutrition for ADHD',
    keywords: ['food', 'eat', 'nutrition', 'protein', 'omega', 'diet', 'meal', 'breakfast', 'snack', 'hydration', 'water'],
    content: `Nutrition impacts ADHD symptoms more than most realize:
- Protein timing: Protein (especially at breakfast and before tasks) stabilizes dopamine and focus longer than carbs alone
- Omega-3s: Evidence supports omega-3 supplementation or fish intake for ADHD symptom reduction
- Blood sugar stability: Crashes in blood sugar worsen ADHD focus and emotional regulation; paired protein+carbs help
- Hydration: Even mild dehydration worsens focus, mood, and impulse control; keep water visible/accessible
- Regular eating: Skipping meals is common with ADHD (hyperfocus + time blindness); alarms for meal times help
- Medication interaction: If on stimulants, eat something before taking them; they can suppress appetite
- Caffeine caution: Some ADHD folks self-medicate with coffee; talk to prescriber about interactions`,
  },
  {
    title: 'Medication Awareness (General Info)',
    keywords: ['medication', 'meds', 'med', 'pill', 'stimulant', 'non-stimulant', 'adderall', 'ritalin', 'strattera', 'wellbutrin', 'prescribed'],
    content: `General ADHD medication information (not medical advice):
- Stimulant medications: Increase dopamine/norepinephrine (Adderall, Ritalin, Vyvanse, Concerta). Usually faster-acting, shorter duration.
- Non-stimulants: Work differently (Strattera/atomoxetine, Wellbutrin/bupropion, Guanfacine). Longer duration, different side effect profile.
- Onset & duration: Most stimulants kick in 30-60 min, peak at 2-4 hours. Extended-release formulations last 8-12 hours.
- Medication + structure: Meds are foundational but not magic; they work best combined with systems, therapy, and lifestyle.
- Finding the right fit: Different medications and doses work differently for different people; finding yours takes experimentation.
- Tolerance: Some tolerance can develop; tolerance breaks or medication switches may be needed (discuss with prescriber).
- Side effects: Monitor for appetite changes, sleep issues, mood shifts; always report to prescriber.
IMPORTANT: I'm not a doctor — talk to your prescriber about your specific medication questions, dosing, interactions, and side effects.`,
  },
  {
    title: 'Medication-Friendly Routines',
    keywords: ['routine', 'medication', 'meds', 'schedule', 'time', 'remember', 'habit', 'system'],
    content: `Making medication adherence automatic:
- Anchor to existing habit: Take meds with breakfast/coffee, right after alarm/shower, etc. (pick something you already do daily)
- Visual location: Keep meds in a visible spot you see every morning (not hidden in a cabinet)
- Phone reminder: Set a daily alarm with a label ("Take meds") if relying on memory
- Weekly pill organizer: Pre-sort the week so you don't have to count/decide daily (much easier for ADHD brains)
- Backup system: If you forget, have a clear rule (e.g., "If I haven't taken them by 2pm, I skip today to avoid evening effects")
- Accountability partner: Tell someone your plan; they can remind you
- Track it: Check a box, put a marble in a jar, or use an app to make adherence visible`,
  },
  {
    title: 'Current ADHD Understanding (2024-2025)',
    keywords: ['research', 'understanding', 'neurological', 'brain', 'difference', 'deficit', 'theory', 'burnout', 'masking'],
    content: `Modern ADHD understanding reflects current research:
- Neurodevelopmental difference, not deficit: ADHD is how some brains are wired, not a character flaw or broken neurology
- Interest-based attention: ADHD brains attend based on interest/novelty, not importance; this is neurological, not willpower failure
- The "wall of awful": Emotional barriers to starting tasks (overwhelm, perfectionism, time blindness) are real neurological symptoms
- ADHD and burnout: Masking ADHD in neurotypical environments for years can cause severe burnout; recognition and support help recovery
- Masking costs: Many ADHD folks (especially women, people of color, multiply marginalized folks) mask to fit in; this causes shame, anxiety, burnout
- Late diagnosis: Many adults discover ADHD only after burnout or crisis; getting diagnosed as an adult is still valid and helpful
- Neurodivergent-affirming approaches: Focus on working with how your brain works rather than "fixing" it to fit neurotypical standards
- Co-occurring conditions: ADHD frequently overlaps with anxiety, depression, autism, dyslexia, and other neurodevelopmental differences`,
  },
  {
    title: 'Task Initiation & The Wall of Awful',
    keywords: ['start', 'begin', 'stuck', 'blocked', 'procrastinate', 'can\'t start', 'initiation', 'barrier', 'awful'],
    content: `Task initiation is one of ADHD's biggest challenges:
- The wall of awful: Emotional barriers (perfectionism, overwhelm, fear, shame) block task start, not laziness or lack of motivation
- Reduce friction: Remove barriers between you and starting (have materials ready, open the document, sit in the right spot)
- Micro-start: Start with the tiniest possible first step (just open the document, just write one sentence, just gather supplies)
- Accountability & body doubling: Working alongside someone (parallel working, video chat, accountability partner) lowers emotional barriers significantly
- Novelty injection: Changing the context (new location, different time, new music) can unlock initiation by engaging interest
- "Eat the frog" vs "easy wins first": ADHD works better with easy wins first (builds momentum and dopamine), then harder tasks
- Hyperfocus leverage: When hyperfocused, ride it—protect that time, don't interrupt, use it for your hardest/most important work
- Break the pattern: If stuck, sometimes just moving your body (walk, dance, stretch) resets your ability to initiate`,
  },
  {
    title: 'Practical Daily Strategies',
    keywords: ['strategy', 'tip', 'trick', 'method', 'system', 'daily', 'routine', 'tool', 'hack'],
    content: `Everyday strategies that work:
- Pomodoro variations: Standard 25/5 doesn't work for ADHD; try 10/2, 20/10, or just "until timer" without fixed time
- Environment design: Reduce friction (put healthy snacks in view, remove distractions from workspace, use visual cues)
- Transition scripts: Hard to switch tasks? Use a consistent ritual (stand up, drink water, state what you're doing next)
- Accountability systems: Public commitment, accountability buddy, or visible progress tracker makes tasks more real
- Hyperfocus exit points: Set an alarm BEFORE you enter hyperfocus so you don't lose track of time entirely
- The 2-minute rule: If under 2 minutes, do it now instead of adding to a list (lists swell, tasks don't get done)
- Brain dump before bed: Download your thoughts to clear mental space for sleep
- Weekly review: Sunday evening rundown of week, upcoming week, and adjustments needed for next week
- Movement resets: When stuck, 5 minutes of movement often unlocks focus better than pushing through`,
  },
  {
    title: 'ADHD in Adults & Late Diagnosis',
    keywords: ['adult', 'late diagnosis', 'discovered', 'woman', 'masking', 'burnout', 'career', 'relationships', 'late'],
    content: `Adult ADHD diagnosis and management:
- Late discovery: Many adults (especially women, POC, multiply marginalized folks) discover ADHD after years of masking
- Validation: Getting a diagnosis as an adult is still completely valid and clarifies years of struggles
- Masking costs: Years of masking to fit neurotypical expectations leads to burnout, shame, anxiety, and depression
- Diagnosis grief: Some people grieve the (imagined) effort they "wasted" before diagnosis; that grief is valid
- Strengths rediscovery: Diagnosis also reveals actual strengths—hyperfocus, creativity, pattern-finding—that were attributed to luck before
- Treatment starts now: Whether diagnosed at 8 or 80, treatment can still help. It's not too late to build better systems
- Life restructuring: Adult diagnosis often means restructuring work/life to play to ADHD strengths rather than fight the brain
- Community: Finding other ADHD adults for community, validation, and strategy-sharing is powerful and affirming`,
  },
]

/**
 * Get relevant knowledge sections based on keywords in user input
 * Returns a concatenated string of the most relevant sections
 * @param userMessage The user's message to analyze
 * @param maxTokens Maximum tokens to return (default 500)
 * @returns String of relevant knowledge sections
 */
export function getRelevantKnowledge(userMessage: string, maxTokens: number = 500): string {
  const messageLower = userMessage.toLowerCase()

  // Score each section based on keyword matches
  const scoredSections: Array<{ section: KnowledgeSection; score: number }> = knowledgeBase.map((section) => {
    let score = 0
    section.keywords.forEach((keyword) => {
      if (messageLower.includes(keyword)) {
        score += 1
      }
    })
    return { section, score }
  })

  // Sort by score and take top sections
  const relevantSections = scoredSections
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Top 3 most relevant sections
    .map((item) => item.section)

  // If no keyword matches, return nothing (knowledge is optional)
  if (relevantSections.length === 0) {
    return ''
  }

  // Format the knowledge content
  let knowledgeText = 'ADHD Knowledge Reference:\n'
  let tokenCount = 0
  const targetTokens = maxTokens * 0.8 // Aim for 80% of max to leave room for other content

  for (const section of relevantSections) {
    const sectionText = `\n## ${section.title}\n${section.content}`
    const estimatedTokens = sectionText.split(' ').length // Rough estimate
    if (tokenCount + estimatedTokens > targetTokens) break
    knowledgeText += sectionText
    tokenCount += estimatedTokens
  }

  return knowledgeText
}
