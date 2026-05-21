export interface School {
  id: string;
  name: string;
  period: string;
  description: string;
  longDescription: string;
}

export const SCHOOLS: School[] = [
  {
    id: "pre-socratic",
    name: "Pre-Socratic",
    period: "c. 600–400 BCE",
    description:
      "The first Greek philosophers — searching for the underlying stuff of the world before Socrates turned philosophy inward.",
    longDescription:
      "The Pre-Socratics inaugurated Western philosophy by asking what the cosmos is made of, and how genuine change is possible. Thales nominated water; Anaximenes air; Heraclitus said everything flows and the underlying logos is fire; Parmenides insisted that change is an illusion and Being is one and unchanging; the Atomists answered with indivisible particles moving through the void. We have them only in fragments quoted by later writers, but those fragments contain the seeds of physics, metaphysics, theology, and the very idea of a rational inquiry into nature.",
  },
  {
    id: "platonism",
    name: "Platonism",
    period: "c. 400–347 BCE",
    description:
      "The world we see is a shadow of a higher, more real world of unchanging Forms — and the philosopher's task is to climb toward it.",
    longDescription:
      "Plato wrote in dialogues, almost always with Socrates as the lead voice, and built a body of thought that all subsequent Western philosophy has been a footnote to (so said Whitehead, only half-joking). His theory of Forms posits that what makes a thing beautiful, just, or a horse is its participation in an unchanging archetype that exists outside space and time. His political philosophy — the ideal city ruled by philosopher-kings, articulated in 'The Republic' — has been the touchstone for every utopia and dystopia since. The soul, for Plato, is immortal; education is not the filling of an empty vessel but the awakening of innate knowledge.",
  },
  {
    id: "aristotelianism",
    name: "Aristotelianism",
    period: "c. 350–322 BCE",
    description:
      "Plato's most brilliant student inverted his master: the real is here, in particular things, and we know it through patient observation.",
    longDescription:
      "Aristotle was Plato's twenty-year pupil but moved sharply away from the Forms, locating reality in concrete individual substances and the principles immanent in them. His logic dominated for two millennia. His ethics replaces the question 'what should I do?' with 'what kind of person should I become?' — and answers with the doctrine of virtue as a mean between extremes, cultivated by habit. His four-cause analysis of explanation, his teleological biology, his political theory of the citizen and the polis, and his metaphysics of substance, form, and potentiality became the operating system of medieval Christian, Islamic, and Jewish thought.",
  },
  {
    id: "stoicism",
    name: "Stoicism",
    period: "c. 300 BCE–180 CE",
    description:
      "The world is governed by reason; freedom comes from aligning your will with it and minding only what is up to you.",
    longDescription:
      "Founded by Zeno of Citium in the Stoa Poikilē of Athens, Stoicism became the dominant philosophy of educated Romans for four centuries. Its core distinction: some things are up to us (our judgments, desires, aversions) and some things are not (health, wealth, reputation, the actions of others). Wisdom is the relentless practice of caring only about the first set. The Stoic universe is providentially ordered, the human soul a fragment of the divine logos, and virtue alone is necessary and sufficient for the good life. Its three great Roman exemplars — the slave Epictetus, the playwright-statesman Seneca, the emperor Marcus Aurelius — span the whole social ladder and have been quietly read by serious people ever since.",
  },
  {
    id: "epicureanism",
    name: "Epicureanism",
    period: "c. 307 BCE–100 CE",
    description:
      "The aim of life is pleasure, properly understood — which turns out to mean friendship, simple food, and freedom from fear.",
    longDescription:
      "Epicurus taught from a garden outside Athens, admitting women and slaves on equal terms with citizens. His physics, inherited from Democritus, is austerely materialist: only atoms and the void exist. His ethics is hedonist but radically deflationary: the highest pleasure is the absence of bodily pain (aponia) and mental disturbance (ataraxia). The gods exist but take no interest in human affairs; death is nothing to us, since 'where we are, death is not; where death is, we are not.' Most of Epicurus's own writings are lost; the great surviving Epicurean text is Lucretius's six-book Latin poem 'De Rerum Natura' (On the Nature of Things).",
  },
  {
    id: "skepticism",
    name: "Skepticism & Cynicism",
    period: "c. 360 BCE–200 CE",
    description:
      "Two contrarian schools: one suspends all judgment to gain peace, the other defaces convention to live according to nature.",
    longDescription:
      "Cynicism, founded by Diogenes of Sinope (who lived in a barrel and told Alexander the Great to step out of his sunlight), rejected social convention as a corruption of natural human virtue. Skepticism, in its Pyrrhonist form, argued that for any proposition there is an equally strong opposing argument — so the wise response is suspension of judgment (epoché), which yields tranquility. The Academic Skeptics, working from within Plato's school, developed sophisticated arguments against the Stoic claim to certain knowledge. Both schools survived through Cicero's reports and Sextus Empiricus's surviving texts, and re-entered modern philosophy through Montaigne and Hume.",
  },
  {
    id: "neoplatonism",
    name: "Neoplatonism",
    period: "c. 200–550 CE",
    description:
      "Plotinus's mystical reworking of Plato: reality emanates from the One through Intellect and Soul down to the material world.",
    longDescription:
      "Neoplatonism was Plato read by late-antique pagans hungry for a religion of philosophy. Plotinus (third century) taught that everything that exists pours forth from a single ineffable source he called 'the One' — first as Intellect, then as Soul, then as the material cosmos — and that the philosophical life is an ascent back toward union with that source. His student Porphyry edited the lectures into the 'Enneads,' and Proclus and Iamblichus elaborated the system into the official theology of the dying classical world. Through Augustine, Pseudo-Dionysius, and the Arabic translators, Neoplatonism became the secret blueprint of Christian, Islamic, and Jewish mysticism.",
  },
  {
    id: "patristic",
    name: "Patristic",
    period: "c. 100–800 CE",
    description:
      "Christianity's first thinkers, fusing the gospel with Greek philosophy — Augustine above all.",
    longDescription:
      "The Church Fathers (the 'patristic' period) faced the problem of articulating Christian faith in the vocabulary of Greek philosophy — and especially of Neoplatonism. Origen and the Cappadocians worked through Trinitarian metaphysics; Augustine of Hippo (354–430) wrote autobiography, philosophy of history, and a vast theology that defined Western Christianity for a thousand years. His 'Confessions' invented modern interiority; his 'City of God' provided the West with a theology of history after the sack of Rome. Boethius's 'Consolation of Philosophy,' written in prison awaiting execution, served as the schoolbook bridge between antiquity and the Middle Ages.",
  },
  {
    id: "scholasticism",
    name: "Scholasticism",
    period: "c. 1100–1500 CE",
    description:
      "The medieval universities' systematic synthesis of Aristotle, Christian theology, and the demands of rigorous logic.",
    longDescription:
      "Scholasticism is the philosophy of the medieval universities — Paris, Oxford, Bologna — and its characteristic method is the disputation: a question, the strongest objections, a determinative answer, and replies to each objection. Anselm of Canterbury produced the ontological argument; Peter Abelard refined dialectic; Thomas Aquinas's vast 'Summa Theologiae' integrated the newly recovered Aristotle with Christian doctrine so thoroughly that he became, for Catholic philosophy, the canonical figure. Duns Scotus and William of Ockham pushed back from within, sharpening the distinction between reason and faith and (in Ockham's case) razoring away unnecessary metaphysical entities. The Scholastic project's reputation collapsed in the Renaissance but its logical techniques never really went away.",
  },
  {
    id: "renaissance-humanism",
    name: "Renaissance Humanism",
    period: "c. 1400–1600",
    description:
      "A return to classical sources, an embrace of human dignity, and the birth of modern political and historical thought.",
    longDescription:
      "Renaissance Humanism was less a unified philosophy than a movement of letters: a turn back to the original Greek and Latin texts, an admiration for ancient eloquence and civic virtue, and a confident assertion that the dignity of the human being is the proper subject of inquiry. Erasmus mocked clerical pretension in 'In Praise of Folly'; Machiavelli, exiled from Florence, wrote 'The Prince' and reset political philosophy on the foundation of how rulers actually behave rather than how they ought to; Montaigne invented the personal essay as a tool for examining the self with an honesty no earlier writer had attempted. Humanism's lasting contribution: the conviction that classical learning is a resource for living well now.",
  },
  {
    id: "rationalism",
    name: "Rationalism",
    period: "c. 1630–1715",
    description:
      "Reason, not the senses, is the foundation of genuine knowledge — and the universe is a vast logical structure we can deduce.",
    longDescription:
      "Continental Rationalism is the seventeenth-century project of grounding knowledge on innate ideas and deductive certainty. Descartes began by doubting everything that could be doubted and rebuilt knowledge on the cogito — 'I think, therefore I am' — and a benevolent God who guarantees that clear and distinct ideas correspond to reality. Spinoza took the geometric method to its limit, deducing a single substance ('God or Nature') with infinite attributes from definitions and axioms. Leibniz proposed that reality is composed of monads, that this is the best of all possible worlds, and that everything happens for a sufficient reason. Pascal, a Rationalist by training but a critic of pure reason by conviction, used probability to wager on God.",
  },
  {
    id: "empiricism",
    name: "Empiricism",
    period: "c. 1620–1780",
    description:
      "The mind starts as a blank slate; all knowledge comes through the senses, and the limits of experience are the limits of what we can know.",
    longDescription:
      "British Empiricism took the opposite tack from Rationalism: no innate ideas, no certain knowledge of the unobserved, no metaphysics beyond what experience can verify. Francis Bacon designed the inductive method that would underwrite the scientific revolution. Locke argued that the mind is a tabula rasa written on by experience, and that political authority derives from the consent of the governed. Berkeley pushed the empiricist logic to its idealist conclusion: only minds and ideas exist; matter is a fiction. Hume completed the project by showing that even causation and the self are only habits of expectation produced by the constant conjunction of impressions. Empiricism's heirs include the entire English-speaking philosophical tradition.",
  },
  {
    id: "political-liberalism",
    name: "Political Liberalism",
    period: "c. 1650–1800",
    description:
      "Modern political philosophy — natural rights, the social contract, the sovereignty of the people, the limits of state power.",
    longDescription:
      "The seventeenth and eighteenth centuries produced the political vocabulary the modern world still uses. Hobbes, writing through the English Civil War, argued that the state of nature is 'solitary, poor, nasty, brutish, and short,' and that rational individuals will surrender their liberty to a sovereign in exchange for security. Locke softened this into a contract that preserves life, liberty, and property — and gives the people the right to revolt when government violates it. Rousseau radicalised the project: legitimate government expresses the 'general will' of a free people. Adam Smith mapped the moral and economic life of commercial society; Burke gave conservatism its first systematic statement; Wollstonecraft argued that the rights of man are empty until they are also the rights of woman.",
  },
  {
    id: "german-idealism",
    name: "German Idealism",
    period: "c. 1781–1831",
    description:
      "Post-Kantian philosophy in Germany: an audacious attempt to derive reality itself from the structure of self-conscious thought.",
    longDescription:
      "Kant's 'Critique of Pure Reason' (1781) detonated under European philosophy. He had argued that the mind imposes the categories of space, time, and causation on experience — and that we therefore cannot know things as they are in themselves. His successors — Fichte, Schelling, Hegel — tried to push past this limit by deriving the entire structure of reality from the activity of the self-positing 'I' or 'Spirit' (Geist). Hegel's vast system narrates history itself as the progressive self-realisation of Spirit through dialectical contradiction. Schopenhauer, a self-described loyal Kantian, took the opposite path: behind the world of appearance lies not Spirit but a blind, striving Will, and the wise response is renunciation. The whole period reshapes how the West thinks about history, freedom, and the self.",
  },
  {
    id: "utilitarianism",
    name: "Utilitarianism",
    period: "c. 1780–1900",
    description:
      "The right action is the one that produces the greatest happiness for the greatest number.",
    longDescription:
      "Jeremy Bentham, working in late-eighteenth-century England, proposed that morality could be made a science: count the units of pleasure and pain a proposed action would produce, sum them across everyone affected, and choose the option with the highest net. John Stuart Mill, raised by his father James as an experiment in producing a utilitarian prodigy, refined the doctrine — distinguishing higher (intellectual, aesthetic) from lower (bodily) pleasures, and arguing in 'On Liberty' that society may restrain individuals only to prevent harm to others. Utilitarianism reshaped law, prison reform, public health, and education in nineteenth-century Britain; in its modern guises it remains one of the two or three live options in contemporary ethical theory.",
  },
  {
    id: "marxism",
    name: "Marxism",
    period: "c. 1845–1900",
    description:
      "All history is the history of class struggle; capitalism creates the conditions of its own overthrow.",
    longDescription:
      "Karl Marx, with Friedrich Engels, took Hegel's dialectical history and inverted it: the engine of historical change is not Spirit but material conditions, and specifically the relations of production. Capitalism is a historically necessary but self-destabilising system that extracts surplus value from labour, concentrates capital, generates crises of overproduction, and produces in the proletariat the gravedigger of its own ruling class. Beyond economics, Marx provided a method — historical materialism — for reading culture, law, and consciousness as expressions of underlying class interests. After his death the movement split into democratic socialism, revolutionary Leninism, and the academic 'Western Marxism' of the Frankfurt School, but all of it still moves in the orbit of his original analysis.",
  },
  {
    id: "pragmatism",
    name: "Pragmatism",
    period: "c. 1870–1940",
    description:
      "America's first homegrown philosophy: the meaning of an idea is the practical difference it makes; truth is what works.",
    longDescription:
      "Pragmatism began in a Cambridge, Massachusetts discussion club in the 1870s. Charles Sanders Peirce formulated the founding maxim: to clarify an idea, work out what practical consequences would follow from its truth. William James turned the method to psychology, religion, and the question of belief: a belief is true if it pays its way in the conduct of life. John Dewey extended Pragmatism into education, democracy, and the philosophy of inquiry, treating thought as a tool for solving problems rather than a mirror of reality. Pragmatism dropped out of fashion mid-century under analytic dominance and was revived by Richard Rorty, Hilary Putnam, and others in the 1980s.",
  },
  {
    id: "existentialism",
    name: "Existentialism",
    period: "c. 1843–1960",
    description:
      "We are radically free, abandoned by God, and condemned to invent our own meaning through anguished choice.",
    longDescription:
      "Søren Kierkegaard, writing in 1840s Copenhagen, refused the Hegelian system in the name of the individual existing human being who must make decisions in fear and trembling. Nietzsche, half a century later, announced that God was dead and called for a transvaluation of all values. The mid-twentieth-century French existentialists — Sartre, Camus, de Beauvoir — took up these threads after the Second World War: existence precedes essence; we are condemned to be free; meaning is not discovered but made. Existentialism has been the West's most popular philosophy outside the academy because it speaks directly to people who have lost the metaphysical certainties their parents took for granted.",
  },
  {
    id: "phenomenology",
    name: "Phenomenology",
    period: "c. 1900–1960",
    description:
      "Describe the structures of consciousness as they are actually given, before any theory smooths them over.",
    longDescription:
      "Edmund Husserl, beginning around 1900, proposed that philosophy should bracket the question of whether the external world exists and instead describe with absolute fidelity the structures of conscious experience as we live it. His pupils — Heidegger above all — radicalised the project: Heidegger's 'Being and Time' (1927) replaced the spectator-consciousness with Dasein, the being whose own being is a question for it, thrown into a world and oriented by mood and care toward death. Merleau-Ponty restored the body to the centre of perception; Sartre and de Beauvoir carried phenomenological method into ethics and politics. The continental tradition that produced hermeneutics, deconstruction, and gender theory is all downstream of phenomenology.",
  },
  {
    id: "analytic",
    name: "Analytic Philosophy",
    period: "c. 1879–present",
    description:
      "Philosophy as the careful logical analysis of language and concepts — the dominant English-language tradition of the 20th century.",
    longDescription:
      "Analytic philosophy was born when Gottlob Frege invented modern predicate logic (1879) and Bertrand Russell and G. E. Moore turned in the early 1900s against the British Idealism then dominant at Cambridge. Russell and the early Wittgenstein's 'Tractatus' (1921) tried to show that the structure of language, properly analysed, reveals the structure of the world. The Vienna Circle radicalised the programme into logical positivism: any statement not verifiable by experience or true by definition is literally meaningless. The later Wittgenstein, Quine, Strawson, Davidson, Kripke, and others carried the conversation forward through philosophy of mind, language, and metaphysics. The tradition is defined less by doctrine than by style: clarity, argument, and a willingness to break problems into their smallest tractable pieces.",
  },
];

export function getSchoolById(id: string): School | undefined {
  return SCHOOLS.find((s) => s.id === id);
}
