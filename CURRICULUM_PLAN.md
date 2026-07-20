# ILP Lab — Curriculum Plan v5

> **Design thesis:** The platform teaches one continuous stack — from a voltage on a
> wire to a transformer predicting the next token. Every lesson ends by pointing
> forward *and* backward so the student always feels the connections between layers.
>
> **v5 refinement:** The curriculum works best as five learning arcs: make
> computation concrete, make one machine feel real, learn to reason formally,
> learn to build software, then learn to scale it responsibly. The old
> standalone math side-track is folded into Layer 7 so the plan matches the
> actual product structure.

---

## 1. Curriculum Flow (recommended teaching order)

The home page can still render these chapters bottom-to-top, but the content
should be designed and narrated as five arcs. That gives the learner a stronger
feeling of momentum than a flat 16-item list.

```
PART I    ┃  Make Computation Concrete
LAYER  0  ┃  Fundamentals: Bits         (binary, on/off, byte on wire)
LAYER  1  ┃  Foundations: Gates → CPU   (AND, adder, fetch-decode-execute)

PART II   ┃  Make One Machine Feel Real
LAYER  2  ┃  Memory & Storage           (cache, RAM, virtual memory, disk)
LAYER  3  ┃  Operating Systems          (processes, threads, deadlock, VM)
LAYER  4  ┃  Networks & Geography       (cables, packets, TCP, routing)
LAYER  5  ┃  The Web & Protocols        (DNS, HTTP, TLS, rendering)
LAYER  6  ┃  Compilers & Languages      (source → AST → machine code)

PART III  ┃  Learn To Reason About Computing
LAYER  7  ┃  Mathematics for CS         (logic, proof, counting, probability, linear algebra)
LAYER  8  ┃  Data Structures, Algorithms & Complexity (heaps, DP, graphs, P/NP)

PART IV   ┃  Learn To Build Software
LAYER  9  ┃  Programming Paradigms      (imperative, OOP, functional, types)
LAYER 10  ┃  Databases & Persistence    (B-trees, SQL, normalization, NoSQL)
LAYER 11  ┃  Security & Trust           (crypto, auth, PKI, OWASP)
LAYER 12  ┃  AI / LLM + ML Foundations  (learning, attention, backprop, generation)
LAYER 13  ┃  Software Engineering       (Git, testing, patterns, CI/CD)

PART V    ┃  Scale Systems And Face Their Consequences
LAYER 14  ┃  Distributed Systems        (consensus, replication, CAP, observability)
LAYER 15  ┃  Ethics & Society           (bias, privacy, accountability)
```

**Reading direction:** bottom → top still means physics → abstraction →
responsibility. The difference is that the learner now feels five clear phases
instead of one long staircase.

**Recommended branch order after Layer 8:** even if Layers 9-12 unlock in
parallel, the best teaching flow is `9 → 10 → 11 → 12`, because students first
learn how code is structured, then how data is stored, then how it is protected,
then how modern ML systems are built on top.

---

## 2. Unlock Logic

```
                    ┌──────────────────────────────────────┐
                    │         Ethics & Society             │  15
                    └──────────────────┬───────────────────┘
                                       │
                    ┌──────────────────┴───────────────────┐
                    │         Distributed Systems          │  14
                    └──────────────────┬───────────────────┘
                                       │
                    ┌──────────────────┴───────────────────┐
                    │         Software Engineering         │  13
                    └──┬───────────┬──────────┬────────┬───┘
                       │           │          │        │
              ┌────────┴──┐ ┌──────┴──┐ ┌────┴───┐ ┌──┴────────────┐
              │Programming│ │Security │ │  Data- │ │  AI / LLM +   │  9-12
              │Paradigms  │ │& Trust  │ │  bases │ │  ML Foundations│
              └────────┬──┘ └──────┬──┘ └────┬───┘ └──┬────────────┘
                       └─────────── ┼ ────────┘        │
                                    │◄─────────────────┘
                         ┌──────────┴──────────┐
                         │  Data Structures,   │  8
                         │  Algorithms &       │
                         │  Complexity         │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │  Mathematics for CS │  7
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │  Compilers &        │  6
                         │  Languages          │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │  The Web &          │  5
                         │  Protocols          │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │  Networks &         │  4
                         │  Geography          │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │  Operating Systems  │  3
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │  Memory & Storage   │  2
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │  Foundations:       │  1
                         │  Gates → CPU        │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │  Fundamentals:      │  0
                         │  Bits               │
                         └─────────────────────┘

```

**Rules:**
- The spine (0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8) is strictly sequential.
- After layer 8, four branches (9, 10, 11, 12) unlock together.
- Product unlock order and teaching order are different: the UI may allow any
  order, but the recommended pedagogical order is 9 → 10 → 11 → 12.
- Layer 13 (Software Engineering) requires all four branches (9–12).
- Layer 14 (Distributed) requires Layer 13.
- Layer 15 (Ethics) requires Layer 14.

### Heading system

Use headings to communicate progress, not taxonomy.

| Level | Purpose | Recommended pattern |
|---|---|---|
| Part heading | Mark a new learning arc | Verb-led outcome: "Make One Machine Feel Real" |
| Layer heading | Name the domain | Stable noun phrase: "Operating Systems" |
| Lesson heading | Frame the promise of the interaction | Short explanatory phrase: "The invisible manager" |
| Step title | Tell the learner what to do now | Action-first: "Watch fetch and decode", "Build a one-bit full adder" |
| Connection card | Reframe the meaning of what just happened | "You saw X. Next we need Y." |

---

## 3. Full chapter + lesson + step breakdown

---

### Part I — Make Computation Concrete

#### LAYER 0 — Fundamentals: Bits ✅ (exists, unchanged)

**Chapter ID:** `fundamentals`
**Lesson:** `fundamentals-start` — "Computers, binary, and a byte on a wire"
**Connection:** "Every layer above stands on this: electricity, on or off."

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `fund-io` | mixed | What is a computer? | Tap 3 hotspots on a diagram to reveal input → process → output |
| 1 | `fund-binary` | build | On, off, counting | Flip 4 bits, watch decimal value change live |
| 2 | `fund-wire` | observe | Bits on a wire | Toggle 8 bits, see pulse on wire + ASCII character |

**Connection card (end):**
> You just controlled bits on a wire. But a wire that only carries bits can't
> *decide* anything. Next: give electricity a choice.

**Easter egg:** Set bits to `01001000 01101001` → spell "Hi" → toast: "You just encoded your first message."

---

#### LAYER 1 — Foundations: Gates → CPU ✅ (exists, unchanged)

**Chapter ID:** `foundations`
**Lesson:** `foundations-golden-path` — "Logic, addition, then fetch"
**Connection:** "Logic gates turn simple signals into decisions — then a CPU."

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `step-gates` | build | Light the LED with AND | Toggle A and B switches, LED lights when both high |
| 1 | `step-adder` | build | Build a one-bit full adder | Toggle A, B, Carry-in, see Sum and Carry-out |
| 2 | `step-fetch` | observe | Watch fetch and decode | Animated CPU cycle: fetch → decode → execute, 4 instructions |

**Connection card (end):**
> Your CPU just fetched an instruction from memory. But where does that memory
> live? And what happens when it's too slow? Next: the memory hierarchy.

**Devices unlocked:** `pc-starter`, `vacuum-tube`

---

### Part II — Make One Machine Feel Real

#### LAYER 2 — Memory & Storage 🔄 (expanded)

**Chapter ID:** `memory`
**Lesson:** `memory-hierarchy` — "Fast, small, cheap — pick two"
**Connection:** "Your CPU is useless without somewhere to read and write."

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `mem-register` | build | Registers: the fastest memory | Drag values between 4 registers and an ALU. Register access is instant (0 cycles shown). |
| 1 | `mem-cache` | build | Cache: hit or miss | A sequence of memory addresses arrives. Student predicts hit/miss for a 4-line direct-mapped cache. Misses flash red, hits flash teal. |
| 2 | `mem-ram` | observe | RAM: the big picture | Animated bird's-eye view of the full hierarchy: registers → L1 → L2 → L3 → RAM → Disk. A data request falls through levels until it hits. |
| 3 | `mem-eviction` | build | Eviction: what gets kicked out? | Student controls a 4-slot LRU cache. Memory requests arrive. Student chooses which line to evict. Compare to optimal. |
| 4 | `mem-virtual` | observe | Virtual memory: the illusion | **NEW.** Each of 3 "programs" believes it owns address 0x0000. Watch the MMU translate virtual → physical addresses via a page table. One program faults — see the OS swap in a page from disk. "Every process thinks it owns all of RAM." |
| 5 | `mem-paging` | build | Page tables: the map | **NEW.** A 16-slot physical memory grid. 3 programs each have a 4-entry page table. Student routes virtual pages to physical frames. Evict a frame — trigger a page fault. See the TLB speed up repeated lookups. |

**Connection card (end):**
> Every process sees its own private address space — the OS manufactures that
> illusion. But who manages the processes themselves? Next: the operating system.

**Devices unlocked:** `ssd-board`

**Easter eggs:**
- Achieve 100% cache hit rate → "You just out-performed a branch predictor. Briefly."
- Fill all physical frames with 3 processes and recover without crashing → "You managed memory better than Windows 95."

---

#### LAYER 3 — Operating Systems 🔄 (expanded with threads & concurrency)

**Chapter ID:** `os`
**Lesson:** `os-core` — "The invisible manager"
**Connection:** "The OS is the layer that makes one CPU feel like many."

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `os-process` | build | What is a process? | Start 3 "programs" (colored blocks). Each gets a PID, state (ready/running/blocked), and a slice of memory. Tap to "run" one — the others wait. |
| 1 | `os-scheduler` | build | Round-robin scheduler | A timeline. 4 processes with different burst lengths. Student drags time slices onto the CPU bar. Compare to round-robin and SJF. See turnaround time. |
| 2 | `os-filesystem` | build | Files: names for bytes | A mock directory tree. Student creates files, moves them, sees inodes update. Delete a file — the inode frees but blocks remain. "This is why 'deleted' files can be recovered." |
| 3 | `os-syscall` | observe | The system call barrier | User program calls `read()` → trap into kernel → kernel reads disk → returns data → back to user mode. The boundary glows. |
| 4 | `os-threads` | build | Threads: sharing a process | **NEW.** One process, two threads. Both share the same heap block. Student sees both threads read and write a counter. No synchronization — the counter ends wrong. "This is a race condition. Now add a lock." |
| 5 | `os-mutex` | build | Mutexes: one at a time | **NEW.** Same two threads, same counter. Student drags a "lock" onto the critical section. The threads now take turns. Counter is correct. Introduce a second lock in reverse order across two threads — see deadlock. Heal it by fixing the lock order. |
| 6 | `os-deadlock` | observe | Deadlock: four conditions | **NEW.** Animated: four conditions for deadlock visualized as four switches (mutual exclusion, hold-and-wait, no preemption, circular wait). Toggle one off — deadlock breaks. "Every OS course requires you to know these four." |

**Connection card (end):**
> The OS manages one machine. But your browser is talking to a machine across the
> ocean. How does your request get there? Next: networks.

**Devices unlocked:** `terminal-retro`

**Easter egg:**
- Create a file called `hello.txt` in the filesystem sim → "Every journey starts with hello."
- Trigger deadlock intentionally → "You broke it on purpose. That's a step above most engineers."

---

#### LAYER 4 — Networks & Geography 🔄 (expanded, was 4)

**Chapter ID:** `networks`
**Lesson:** `world-cables` + `packet-journey`

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `map-main` | mixed | World map lab | (existing) Place cables between 6 regions, add data centers |
| 1 | `net-packet` | build | Wrap a packet | Fill in packet fields: source IP, dest IP, payload. Packet wraps in layers (app → transport → network → link). |
| 2 | `net-route` | observe | Watch a packet route | Animated packet hops across 5 routers. Each hop: read header → check routing table → forward. Latency counter ticks per hop. |
| 3 | `net-tcp` | build | TCP: reliable delivery | Two endpoints. Send 5 packets. Some drop. See ACK/retransmit dance. Drag to reorder — TCP reassembles. |
| 4 | `net-udp` | build | UDP: fast and risky | **NEW.** Same 5 packets, UDP mode. No retransmit. Some are lost forever. "DNS, video calls, and games prefer speed over perfection." |

**Connection card (end):**
> Your packet arrived. But the server needs to speak a language your browser
> understands. Next: the web and its protocols.

**Devices unlocked:** `server-home`, `server-commercial`

**Easter egg:** Draw a cable NA → EU → AS (real undersea route) → "That's the actual path of the FLAG cable."

---

#### LAYER 5 — The Web & Protocols 🔄 (was 5, unchanged steps + richer TLS)

**Chapter ID:** `web`
**Lesson:** `web-stack` — "From URL to pixels"

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `web-dns` | build | DNS: the internet's phone book | Type a domain. Watch recursive DNS: browser cache → OS cache → resolver → root → TLD → authoritative. IP revealed. |
| 1 | `web-http` | build | HTTP: the conversation | Build an HTTP request (method, path, headers, body). Send it. See response with status, headers, body. Modify and resend. |
| 2 | `web-tls` | observe | TLS: the secret handshake | Animated TLS 1.3: ClientHello → ServerHello → key exchange → encrypted tunnel. Plaintext vs encrypted side-by-side. Certificate chain shown. |
| 3 | `web-render` | observe | Render: HTML → pixels | A tiny HTML snippet arrives. Watch: parse → DOM tree → CSS → layout → paint → composite. Each phase lights up. |

**Connection card (end):**
> The web delivers data. But how that data is *organized* determines whether your
> app is fast or slow. Before we get to algorithms, there is a question: how does
> that JavaScript you wrote get turned into instructions the CPU understands?
> Next: compilers and languages.

**Devices unlocked:** `browser-engine`

**Easter egg:** Send a GET request to `/` → "You just asked a server for its home page."

---

#### LAYER 6 — Compilers & Languages 🆕 (NEW)

**Chapter ID:** `compilers`
**Lesson:** `source-to-silicon` — "How code becomes electricity"
**Connection:** "Everything you write in any language eventually becomes the same fetch-decode-execute you saw in Layer 1."

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `comp-source` | observe | The gap: code vs machine | Side-by-side: a Python `for` loop and the 12 assembly instructions it compiles to. Animate each Python line mapping to its instructions. "The compiler wrote all of that from three lines." |
| 1 | `comp-lex` | build | Lexing: words from characters | Student types a short expression (`x = 3 + y`). Watch a lexer scan left-to-right and emit tokens: `IDENT(x)`, `ASSIGN`, `INT(3)`, `PLUS`, `IDENT(y)`. Change a character — see the token stream update. Introduce an illegal character — see the lexer error. |
| 2 | `comp-parse` | build | Parsing: grammar gives structure | The token stream from step 1. A grammar rule panel on the side. Student drags tokens into an abstract syntax tree (AST). The AST lights up as each rule is satisfied. "The parser is why `3 + 4 * 5` doesn't equal 35." |
| 3 | `comp-ast` | observe | The AST is the program | The AST from step 2. Student hovers nodes — see what code each represents. Swap the `+` operator for `-` directly in the tree — the generated output changes. "Every linter, formatter, and AI code tool works on an AST." |
| 4 | `comp-codegen` | observe | Code generation: AST → instructions | The same AST, now generating x86-64 assembly step by step. Each AST node lights up as its instructions are emitted. Student sees `load`, `add`, `store` appear in order. "This is the moment code becomes electricity." |
| 5 | `comp-optimize` | build | Optimization: the free gift | Two identical programs: one naive (`x = a + 0`), one with dead-code. The compiler optimizes both — student watches redundant instructions disappear. "Your compiler is smarter than you think." |

**Connection card (end):**
> A compiler turns language into logic. But to *reason* about whether your
> program is correct, or whether your algorithm is fast, you need mathematics.
> Next: mathematics for computing.

**Devices unlocked:** `compiler-chip` (new device: chip with layers — source → tokens → AST → IR → assembly → binary, overlays showing each pass)

**Cross-layer callbacks:**
- `comp-lex` → L9 (AI tokenization): "The tokenizer in GPT is a lexer. Same idea, learned vocabulary instead of fixed grammar."
- `comp-parse` → L8 (DSA, trees): "An AST is a tree. Every tree operation you'll learn applies here."

**Easter egg:** Write an expression that the optimizer reduces to a single constant (`2 * 3 + 4 * 5`) → "Constant folding. Your compiler did that at compile time, not runtime."

---

### Part III — Learn To Reason About Computing

#### LAYER 7 — Mathematics for CS 🆕 (NEW)

**Chapter ID:** `mathcs`
**Lesson:** `math-foundations` — "The language computers are written in"
**Connection:** "Every algorithm has a proof. Every hash function has a theorem. Every neural network is a matrix."

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `math-logic` | build | Propositional logic: and, or, not | Student evaluates truth tables for AND, OR, NOT, XOR, implication. Build a compound expression (`P ∧ ¬Q → R`). See it reduce. "This is the same AND gate from Layer 1 — now with a proof." |
| 1 | `math-proof` | observe | Proof by induction | Claim: `1 + 2 + … + n = n(n+1)/2`. Student fills in the base case and inductive step from a template. Slide the `n` slider — watch both sides stay equal. "Induction is how we prove an algorithm works for all inputs." |
| 2 | `math-sets` | build | Sets, functions, and relations | A Venn diagram builder. Student defines two sets, performs union, intersection, difference, complement. Then define a function as a set of pairs — check if it's injective, surjective, bijective. |
| 3 | `math-counting` | build | Combinatorics: counting without listing | Two problems. (1) How many ways to arrange 4 books? (2) How many 5-card hands contain exactly 2 aces? Student drags factorial/combination formulas onto each problem. "This is how you analyze the number of possible inputs to an algorithm." |
| 4 | `math-modular` | build | Modular arithmetic: clock math | A circular number line (mod 7, mod 13, mod 26). Student performs addition, subtraction, multiplication. Find the inverse of 3 mod 7. "The RSA cryptosystem is a consequence of this." Callback to L11 security. |
| 5 | `math-prob` | build | Probability: quantifying uncertainty | Three urns with colored balls. Student calculates P(red), P(red \| urn 2), uses Bayes' theorem to update a belief. See how a hash table's expected collision rate is a probability calculation. |
| 6 | `math-linalg` | observe | Linear algebra: vectors and matrices | A 2D grid. Student adds vectors, scales them, multiplies a 2×2 matrix by a vector — sees the geometric transformation. Then: a 3-token sentence becomes three vectors. Matrix multiply blends them. "This is exactly what the transformer does to tokens — at a million dimensions." Callback to L12. |

**Connection card (end):**
> You now have the mathematical tools to analyze algorithms rigorously, understand
> cryptography, and see what a neural network is actually computing. Next:
> data structures and algorithms — with the math to prove they work.

**Devices unlocked:** `math-engine` (new device: symbolic computation unit with layers — expression → parse tree → evaluation → proof assistant, overlays for each math domain)

**Cross-layer callbacks:**
- `math-logic` → L1 (AND gate): "You built this gate in Layer 1. Now you can prove properties about it."
- `math-modular` → L11 (security): "Modular arithmetic is the foundation of RSA. You'll build on this in 4 layers."
- `math-linalg` → L12 (AI): "The attention mechanism is a matrix multiply. You just did one."
- `math-prob` → L8 (DSA, hash tables): "A hash table's O(1) average case is a probability claim."

**Easter egg:** Prove by induction that merge sort is O(n log n) using the template → "You just did what CLRS does in Chapter 2. You're ready for algorithms."

---

#### LAYER 8 — Data Structures, Algorithms & Complexity 🔄 (was 6, greatly expanded)

**Chapter ID:** `dsa`
**Lesson:** `dsa-core` + `dsa-advanced` — "The shapes of data, and the cost of thinking"
**Connection:** "Every program is a data structure being transformed by an algorithm — and every algorithm has a cost."

#### Part A — Foundations (was all of v4 Layer 6)

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `dsa-array-list` | build | Array vs linked list | Insert, delete, access in both. See operation cost. Array shifts; linked list re-points. |
| 1 | `dsa-tree` | build | Binary search tree | Insert 10 numbers. Tree grows. Search — see path. Insert sorted sequence — degenerate line. "This is why we need balancing." |
| 2 | `dsa-hash` | build | Hash table: O(1) magic | Insert key-value pairs. Hash function maps keys to buckets. Create collision — see chaining. Resize — everything rehashes. |
| 3 | `dsa-sorting` | observe | Sorting: seeing the work | Side-by-side: bubble vs merge sort on 30 bars. Step counter diverges. Pause, step through. |
| 4 | `dsa-graph` | build | Graphs: everything is connected | Place 6 nodes, draw edges. Run BFS — wavefront expands. Run DFS — dives and backtracks. |

#### Part B — Advanced Structures

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 5 | `dsa-heap` | build | Heap: the priority queue | **NEW.** Insert 8 numbers into a max-heap. See the tree rebalance via sift-up. Extract the max — sift-down. "Heaps power Dijkstra, job schedulers, and merge of sorted streams." |
| 6 | `dsa-avl` | observe | Balanced BST: staying in shape | **NEW.** Insert a sorted sequence into an AVL tree. Watch rotations fire automatically to prevent degeneration. Compare height of AVL vs naive BST for same input. |
| 7 | `dsa-trie` | build | Trie: search by prefix | **NEW.** Insert 6 words into a trie. Search by prefix — see the matching subtree light up. "Autocomplete, spell-checkers, and IP routing all use this." |
| 8 | `dsa-union-find` | build | Union-Find: grouping without thinking | **NEW.** 8 nodes. Union pairs one by one. Find if two nodes are connected — O(α) amortized. Watch path compression flatten the tree. "Used in Kruskal's algorithm and social-network friend-group detection." |

#### Part C — Algorithm Design Paradigms

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 9 | `dsa-greedy` | build | Greedy: local best, global best? | **NEW.** Activity selection problem: 8 tasks with start/end times on a timeline. Student manually selects non-overlapping tasks. Then see greedy strategy (pick earliest finish) — it achieves optimal. Try a case where greedy fails (knapsack fractions vs 0/1). |
| 10 | `dsa-dijkstra` | build | Dijkstra: shortest path | **NEW.** A weighted graph of 7 cities. Student drives Dijkstra step-by-step: extract min from priority queue → relax neighbors → update distances. Watch shortest-path tree grow. "This is how Google Maps works." |
| 11 | `dsa-dp-intro` | build | Dynamic programming: remember everything | **NEW.** Fibonacci two ways: recursive (exponential, watch the call tree explode) vs DP with memoization (linear, watch the cache fill). Student sees the crossover point where recursion becomes impossibly slow. |
| 12 | `dsa-dp-classic` | build | DP classics: knapsack and LCS | **NEW.** Two back-to-back DP problems. (1) 0/1 knapsack: 5 items, weight 10 capacity — student fills the DP table cell by cell. (2) Longest common subsequence of "ABCBDAB" and "BDCAB" — fill the 2D table, trace back the answer. |

#### Part D — Complexity Theory

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 13 | `dsa-bigo` | build | Big-O: measuring algorithms | **NEW.** Four algorithms on a chart. Student drags labels (O(1), O(log n), O(n), O(n²)) to curves. Run all four on inputs of size 10, 100, 1000 — watch the quadratic explode. |
| 14 | `dsa-complexity` | observe | P vs NP: the hardest open problem | **NEW.** A sorting problem vs a traveling salesman problem. For sorting: every trial runs fast. For TSP: try all permutations — the counter hits billions before n=20. "We believe these problems are fundamentally different. We cannot prove it. That's the P vs NP problem." Show the hierarchy: P ⊂ NP, NP-complete examples (Satisfiability, Vertex Cover, Subset Sum). |
| 15 | `dsa-halting` | observe | The halting problem: limits of computation | **NEW.** Animated diagonalization argument: a "HaltChecker" program that checks if any program halts — then is asked to check *itself*. Contradiction unfolds. "Some problems are not hard — they are *impossible*. No computer, no matter how fast, will ever solve them." |

**Connection card (end):**
> You now know how to organize data, design algorithms, analyze their cost, and
> recognize the limits of computation. The next four tracks apply all of this in
> different domains. Choose your path — or do all four.

**Devices unlocked:** `algorithm-visualizer`

**Easter egg:**
- Build a perfectly balanced BST → "Perfectly balanced, as all trees should be."
- Solve the knapsack DP table without any hints → "You think like a compiler optimizer."
- Reach n=25 on TSP brute-force and watch the counter overflow → "That's why we have heuristics."

---

### Part IV — Learn To Build Software

#### LAYER 9 — Programming Paradigms 🆕 (NEW branch)

**Chapter ID:** `paradigms`
**Prereq:** Layer 8 (DSA & Complexity)
**Lesson:** `how-we-think` — "Languages shape thought"
**Connection:** "Algorithms are abstract. A paradigm is the lens you use to implement them."

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `par-imperative` | build | Imperative: one step at a time | A simple task: sum a list of numbers. Student writes it as explicit steps in pseudocode (loop, accumulate, return). See the CPU executing it instruction by instruction in the simulator from L1. |
| 1 | `par-oop` | build | Object-Oriented: things with behavior | Model a bank account: define a class with `balance`, `deposit()`, `withdraw()`. Instantiate two accounts. One inherits from Account as a `SavingsAccount` with interest. "The data and the operations that act on it live together." |
| 2 | `par-encapsulation` | build | Encapsulation and invariants | The bank account's balance is `private`. Student tries to set it directly — rejected. Must use `withdraw()`. The method enforces "balance ≥ 0". "An invariant is a rule the object promises to maintain forever." |
| 3 | `par-functional` | build | Functional: functions all the way down | Same sum-a-list task. Now: no variables, no loop. Use `map`, `filter`, `reduce` on a list. Same answer, no mutation. "Pure functions have no side effects — they are easier to test, parallelize, and reason about." |
| 4 | `par-types` | observe | Type systems: the compiler as proofreader | Two code panels — same logic, one dynamically typed (Python), one statically typed (TypeScript). Introduce a bug (add a string to a number). Dynamic: fails at runtime. Static: fails at compile time, red underline. "A type system is a lightweight proof that certain errors cannot happen." |
| 5 | `par-memory` | observe | Memory models: who owns what? | Three panels: C (manual malloc/free, buffer overflow shown), Java (garbage collector, GC pause shown), Rust (ownership/borrow checker, compile-time safety). Same program in all three. "Every language makes a different tradeoff between control and safety." |

**Connection card (end):**
> You can now express programs in multiple paradigms. The next question is
> how to *store* the data those programs produce — durably, queryably, and safely.

**Devices unlocked:** `lang-tower` (new device: language tower showing machine code at base, assembly, C, C++/Java/Python, Haskell at top, overlays for type system and runtime model)

**Cross-layer callbacks:**
- `par-imperative` → L1 (fetch-decode): "Those explicit steps are exactly the instructions the CPU fetched in Layer 1."
- `par-functional` → L12 (AI, pure functions): "Transformer layers are pure functions — no hidden state, same output for same input."
- `par-encapsulation` → L8 (DSA, ADTs): "A BST is an abstract data type. Encapsulation is what makes it abstract."

**Easter egg:** Write a `reduce` that computes factorial with no loop → "You just replaced iteration with recursion. Welcome to functional programming."

---

#### LAYER 10 — Databases & Persistence 🔄 (was 7, expanded)

**Chapter ID:** `databases`
**Prereq:** Layer 8 (DSA)
**Lesson:** `db-core` — "Data that survives"

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `db-btree` | build | B-tree: the database's backbone | Insert keys into a B-tree (order 3). Watch nodes split. Search for a key — see the path. |
| 1 | `db-query` | build | SQL: asking questions | A small table (5 rows, 4 columns). Write SELECT, WHERE, JOIN queries. See query plan: full scan vs index lookup. |
| 2 | `db-transaction` | observe | Transactions: all or nothing | Two bank accounts. Transfer money. Simulate a crash mid-transfer — see rollback. |
| 3 | `db-acid` | build | ACID: four promises | **NEW.** Four animated scenarios, one per ACID property. Atomicity: half-written order disappears on crash. Consistency: foreign key violation rejected. Isolation: two concurrent transfers don't interfere (see serializable schedule). Durability: server power-cut, data survives via WAL replay. Student toggles each property off to see what breaks. |
| 4 | `db-index` | build | Indexes: the speed trick | A table of 1000 rows. Query without index — scan counter climbs. Add B-tree index — counter barely moves. |
| 5 | `db-normalize` | build | Normalization: no redundancy | **NEW.** A denormalized orders table (customer name repeated 50 times). Update the customer's name — 50 edits. Student normalizes into Customers + Orders (1NF → 2NF → 3NF). Make the same update — 1 edit. See foreign key join restore the original view. |
| 6 | `db-nosql` | build | NoSQL: when SQL isn't the answer | **NEW.** Three data models side by side: (1) A social graph — relational joins become painful, switch to a graph database. (2) A product catalog with variable fields — add a column to SQL for each variant vs schemaless document store. (3) A session store needing sub-millisecond reads — key-value. "SQL is not wrong. It's a tradeoff. All three of these are B-trees underneath." |

**Connection card (end):**
> Your data is stored, queryable, and normalized. But how do you stop someone
> from reading it who shouldn't? Next: security and trust.

**Devices unlocked:** `database-server`

**Easter egg:** Query returns 0 rows → "No results — but the query was valid. That's debugging."

---

#### LAYER 11 — Security & Trust 🔄 (was 8, expanded)

**Chapter ID:** `security`
**Prereq:** Layer 8 (DSA)
**Lesson:** `security-core` + `security-applied` — "Trust nobody, verify everything"

#### Part A — Cryptographic Primitives (was all of v4 Layer 8)

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `sec-xor` | build | XOR: the simplest cipher | Type a message. Choose a key. See each character XOR'd. Decrypt with same key. |
| 1 | `sec-hash` | build | Hashing: fingerprints for data | Type a message. See SHA-256. Change one character — hash avalanches. |
| 2 | `sec-keypair` | observe | Public key: math as a lock | Alice generates a key pair. Bob encrypts with public key. Only Alice's private key decrypts. |
| 3 | `sec-signature` | build | Digital signatures: proof of identity | Sign with private key. Verify with public key. Tamper — verification fails. |

#### Part B — Applied Security (new)

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 4 | `sec-pki` | observe | PKI: the chain of trust | **NEW.** Animated certificate chain: Let's Encrypt certificate → intermediate CA → root CA. Browser verifies chain step by step. Revoke the intermediate — browser rejects all its certs. "This is what the padlock in your browser actually represents." |
| 5 | `sec-auth` | build | Authentication vs authorization | **NEW.** A login flow: user sends credentials → server verifies → issues a JWT. Student decodes the JWT (header.payload.signature). Change the payload — signature invalid. "AuthN is 'who are you'. AuthZ is 'what can you do'." Second panel: OAuth 2.0 — student watches the authorization code flow animate: app → user → auth server → token → resource server. |
| 6 | `sec-owasp` | build | Attack vectors: OWASP Top 3 | **NEW.** Three interactive attack labs: (1) SQL injection — student types `'; DROP TABLE users; --` into an unparameterized query field. See the query break. Then see the parameterized version reject it. (2) XSS — student injects `<script>alert(1)</script>` into a comment field. See it execute. Then see CSP block it. (3) CSRF — animated: attacker's page makes a request on behalf of logged-in user. See same-site cookie attribute block it. |

**Connection card (end):**
> You can secure one machine. But modern systems are thousands of machines working
> together. How do they agree? First, let's understand the paradigms that make
> them programmable.

**Devices unlocked:** `hardware-key`

**Easter eggs:**
- XOR-encrypt "hello" with key "world" → "You and every spy movie villain."
- Successfully complete all three OWASP labs → "You are now more dangerous than 90% of developers — and safer."

---

#### LAYER 12 — AI / LLM + ML Foundations 🔄 (was 9, greatly expanded)

**Chapter ID:** `ai`
**Prereq:** Layer 8 (DSA) + Layer 7 (Mathematics — strongly recommended)
**Lesson:** `ml-to-llm` — "From learning to language"
**Connection:** "Intelligence is not magic — it is optimization applied to data."

#### Part A — Machine Learning Foundations (new)

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `ml-supervised` | build | Supervised learning: fitting a line | **NEW.** 10 data points on a scatter plot. Student drags a line to fit them. See the "loss" (mean squared error) update live. "Every ML model is trying to minimize a loss function." |
| 1 | `ml-gradient` | observe | Gradient descent: downhill always | **NEW.** A 3D loss landscape. A ball rolls downhill. Student controls learning rate — too high: bounces, overshoots; too low: crawls. Watch it find a minimum. "Backpropagation computes which direction is downhill. Gradient descent rolls the ball." |
| 2 | `ml-overfit` | build | Overfitting: memorization isn't learning | **NEW.** 10 training points. Student increases model complexity (polynomial degree). Degree 2: good fit. Degree 9: perfect fit on training, terrible on test. Bias-variance tradeoff visualized. "A model that memorizes the training data learns nothing." |
| 3 | `ml-classify` | build | Classification: is it a cat? | **NEW.** A 2D dataset of cats vs dogs (simplified features). Student tries a decision tree, then a neural network. See the decision boundary update as more data arrives. Precision and recall update live. |

#### Part B — Neural Networks & Transformers (was all of v4 Layer 9)

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 4 | `llm-embedding` | build | Tokens: words as numbers | Type a sentence. See it split into tokens. Each maps to a 2D point. Drag similar words — they cluster. |
| 5 | `llm-attention` | observe | Attention: who listens to whom? | (existing) Tap tokens, see attention lines. Thicker = stronger. |
| 6 | `llm-mathmul` | observe | Attention: the actual math | **NEW.** The same sentence, now showing Query, Key, Value matrices. Student watches Q × Kᵀ compute a score matrix → softmax → weighted sum of V. "This is what 'attention' is — a matrix multiply, a softmax, and another multiply." Callback to L7 linear algebra. |
| 7 | `llm-layer` | observe | The transformer block | (existing) Data flow through one transformer layer: embed → attention → add+norm → FFN → add+norm. |
| 8 | `llm-train-inf` | observe | Train and infer | (existing) Side-by-side training loop vs inference. Animated blobs. |
| 9 | `llm-backprop` | observe | Backpropagation: blame assignment | **NEW.** A tiny 2-layer network makes a wrong prediction. Watch the error signal flow backwards: output → hidden → input. Each weight gets a gradient — an arrow showing how to nudge it. "Backprop is the chain rule from calculus applied to a graph." |
| 10 | `llm-generate` | build | Generate: one token at a time | (existing) Type a prompt. See probability bars for top-5 candidates. Pick one. Repeat 5 times. |

**Connection card (end):**
> You've seen intelligence emerge from matrix multiplies — the same adders you
> built in Layer 1, at planetary scale. But all of this only works if you can
> *build and maintain* the software that runs it. Next: software engineering.

**Devices unlocked:** `phone-slim`, `gpu-card`

**Easter eggs:**
- Generate a token that completes a real word → "You just did what GPT does 100 billion times a day."
- Achieve a decision boundary that correctly separates all training points → "Perfect separation. Now watch it fail on the test set."

---

#### LAYER 13 — Software Engineering 🆕 (NEW)

**Chapter ID:** `swe`
**Prereq:** All four branches (Layers 9 + 10 + 11 + 12)
**Lesson:** `building-systems` — "The craft of building software that lasts"
**Connection:** "Knowing how computers work is not enough. You need to know how to build things with other people, over time, without breaking them."

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `swe-git` | build | Git: a time machine for code | A file with three versions. Student commits each change. See the commit graph build. Branch off — make a conflicting change — merge. Resolve the conflict manually. "Every line of code in every company's codebase lives in a graph like this." |
| 1 | `swe-test` | build | Testing: proof by example | A `add(a, b)` function with a bug (off-by-one on negative numbers). Student writes 4 unit tests. 3 pass, 1 fails — reveals the bug. Fix the bug — all 4 pass. "A test is a claim about what your code does. A failing test is a falsifiable claim." |
| 2 | `swe-tdd` | build | Test-driven development | A `FizzBuzz` function, not yet written. Student writes the tests first (test-driven). Then implements the function until all tests pass. "Write the test before the code. It forces you to think about the interface before the implementation." |
| 3 | `swe-solid` | observe | SOLID: five principles | Five animated scenarios, one per principle: (S) single responsibility — a class that does two things splits in two. (O) open/closed — add a new shape without changing existing code. (L) Liskov substitution — a Square that breaks Rectangle's postconditions. (I) interface segregation — a fat interface split. (D) dependency inversion — swap a database by depending on an interface. |
| 4 | `swe-patterns` | build | Design patterns: reusable solutions | Three common patterns as interactive puzzles. (1) Observer: connect an event source to three listeners — drag wires. (2) Strategy: swap a sort algorithm at runtime without changing the caller. (3) Factory: a factory method produces the right object based on input — student wires the conditions. |
| 5 | `swe-cicd` | observe | CI/CD: shipping without fear | A commit pushed. Watch: lint → unit tests → integration tests → build → deploy to staging → smoke test → deploy to production. One test fails — pipeline stops, no deploy. Fix and re-push — all green. "This is the pipeline that runs millions of times a day at every serious software company." |
| 6 | `swe-debug` | build | Debugging: systematic isolation | A broken program with 3 possible bug sites. Student uses binary search on the code — add a log at the midpoint, rule out half. Repeat until the bug is isolated. "Debugging is a search problem. Binary search is optimal." |

**Connection card (end):**
> You know how to build software. But software affects people — billions of them.
> The final layer asks what you owe them.

**Devices unlocked:** `workstation` (new device: developer workstation with layers — IDE → version control → CI/CD → monitoring, overlays for the full development lifecycle)

**Cross-layer callbacks:**
- `swe-git` → L8 (graphs/DSA): "A git commit graph is a DAG — the same directed acyclic graph you studied in Layer 8."
- `swe-test` → L8 (complexity): "Unit tests are examples. Proof by induction covers all cases. Both matter."
- `swe-patterns` → L9 (OOP): "Design patterns are recurring OOP structures. Observer, Strategy, and Factory are three of the 23 from the Gang of Four."

**Easter eggs:**
- Write a test before the implementation in the TDD step (i.e., test fails red first) → "Red, green, refactor. You did it right."
- A CI pipeline all green on first push → "First time green. It won't always be this easy."

---

### Part V — Scale Systems And Face Their Consequences

#### LAYER 14 — Distributed Systems 🔄 (was 10, expanded)

**Chapter ID:** `distributed`
**Prereq:** Layer 13 (Software Engineering)
**Lesson:** `distributed-core` + `distributed-ops` — "Many machines, one system"

#### Part A — Core Distributed Concepts (was all of v4 Layer 10)

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `dist-replication` | build | Replication: copies everywhere | 3 database nodes. Write to one — see it replicate. Kill a node — data survives. |
| 1 | `dist-consensus` | observe | Consensus: agreeing on truth | 5 nodes. Watch Raft: leader election → log replication → commit. Partition — split-brain. Heal — recovery. |
| 2 | `dist-cap` | build | CAP: the impossible triangle | Toggle C, A, P. See which real systems match: CP (MongoDB), AP (Cassandra), CA (single-node Postgres). |
| 3 | `dist-loadbalance` | build | Load balancing: spreading the work | 4 servers. Requests arrive. Round-robin vs least-connections. Overload one — cascading failure. |
| 4 | `dist-mapreduce` | observe | MapReduce: divide and conquer | Word count: split → map (count per chunk) → shuffle → reduce (merge). "This is how Google indexed the internet." |

#### Part B — Modern Distributed Operations (new)

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 5 | `dist-sharding` | build | Sharding: splitting the database | **NEW.** A database of 1M user records. Student chooses a shard key (user ID, geographic region, hash). Watch queries route to the correct shard. Add a shard — see rebalancing. "Sharding is how databases scale past one machine." |
| 6 | `dist-queue` | observe | Message queues: decoupling at scale | **NEW.** Two services: Order Service and Email Service. Without a queue: Email Service goes down → Order Service crashes. With Kafka: orders queue up → Email Service recovers → processes the backlog. Student toggles service availability and watches the queue fill and drain. "The queue is the shock absorber of the internet." |
| 7 | `dist-observe` | build | Observability: seeing inside the black box | **NEW.** Three panels: (1) Logs — a stream of structured JSON events. Student filters by level and service. (2) Metrics — a Grafana-style chart of request latency over time. See a spike when a slow query is introduced. (3) Traces — a distributed trace across 4 microservices for one user request. See where 800ms of latency lives. "If you can't observe it, you can't debug it." |

**Connection card (end):**
> You've climbed the entire technical stack. One question remains: who is this all for?

**Devices unlocked:** `server-rack-cluster`

**Easter egg:** Survive a simulated network partition without data loss → "Your system stayed up. You're hired."

---

#### LAYER 15 — Ethics & Society 🆕 (NEW capstone)

**Chapter ID:** `ethics`
**Prereq:** Layer 14 (Distributed Systems)
**Lesson:** `responsibility` — "You built the stack. Now: who does it serve?"
**Connection:** "The most powerful systems in history run on the ideas you now understand. Their effects — intended and unintended — are a design decision."

| Step | ID | Mode | Title | What the student does |
|------|----|------|-------|-----------------------|
| 0 | `eth-scale` | observe | Scale changes everything | Three identical recommendation systems at 100, 10,000, and 1,000,000,000 users. At 100: a bias in the algorithm is annoying. At 10K: it changes which job listings people see. At 1B: it affects which political candidates people know exist. "A 0.1% error rate means nothing at 100. It means 1 million people at 1 billion." |
| 1 | `eth-bias` | build | Algorithmic bias: data is not neutral | **NEW.** A hiring classifier trained on historical data (85% male hires in tech). Student queries it with identical resumes, one with a male name and one with a female name. Different scores. Student retrains with a corrected dataset — see the gap narrow but not disappear. "The algorithm learned what was in the data. The data recorded what humans did." |
| 2 | `eth-privacy` | build | Privacy: the right to be left alone | **NEW.** A user table with names, emails, locations, purchase history. Student applies four techniques: (1) Pseudonymization — replace names with IDs. (2) Aggregation — show counts, not individuals. (3) Differential privacy — add calibrated noise so no individual is identifiable. (4) Data minimization — delete fields not needed. See a "re-identification risk" gauge drop with each step. |
| 3 | `eth-ai-safety` | observe | AI systems at scale: unintended consequences | **NEW.** Three historical case studies shown as animated timelines, facts only, no editorializing: (1) A content recommendation system optimized for engagement that amplified outrage content. (2) A facial recognition system with higher error rates on darker-skinned faces. (3) An LLM deployed in a medical context generating confident but incorrect dosage information. For each: what was optimized, what emerged, what the fix was. |
| 4 | `eth-accountability` | build | Who is responsible? | **NEW.** A bug in a self-driving car's path-planning algorithm (from L8's Dijkstra) leads to a pedestrian injury. Animated: the decision graph. Student traces accountability through: the engineer who wrote the algorithm → the team that approved it → the company that deployed it → the regulator that certified it. "Distributed systems distribute accountability. Someone still has to own it." |
| 5 | `eth-open-source` | observe | Open source and the commons | The software stack you just learned — how much of it is open source? Animate: Linux (L3 OS), OpenSSL (L11 security), PostgreSQL (L10 databases), PyTorch (L12 AI), Git (L13). "Every layer of this curriculum runs on code that thousands of people wrote for free and gave away. That is not an accident — it is a philosophy." |
| 6 | `eth-acm` | observe | Professional responsibility | The ACM Code of Ethics: seven principles, each illustrated with a scenario from the layers the student already knows. "An engineer who understands the stack and understands their obligations is the engineer the world needs." |

**Connection card (end — the final card):**
> You've climbed the entire stack. A bit on a wire became a gate, became a CPU,
> became memory, became an OS, crossed the ocean, served a web page, was compiled
> from code, reasoned about by mathematics, organized into algorithms, stored in a
> database, encrypted, modeled in a neural network, run across a thousand machines,
> built by a team with tests and version control — and now, looked at honestly.
>
> **You understand computing from the bottom up, and from the inside out.**
>
> Go back to any layer. Everything you revisit will be deeper now.

**Devices unlocked:** `robot-arm` (final device — only when ALL 16 layers complete)

**Easter egg:** Complete all six ethics steps in one session without skipping → "You stayed for the hard part. That's the first step."

---

### Note on mathematics clustering

Do not ship a separate "Track M" chapter. The content is stronger when it is
absorbed into Layer 7 and presented as three visible subclusters:

- **Discrete reasoning:** logic, proofs, sets, relations
- **Counting and uncertainty:** combinatorics, modular arithmetic, probability
- **Mathematical models of computation:** linear algebra in Layer 7, with
  recurrence analysis surfaced again inside Layer 8 complexity lessons

This keeps the product map honest: one math chapter, clearly structured, with
callbacks into algorithms, security, and AI.

---

## 4. Cross-layer connection map (v5)

| When you reach... | Callback to... | Message |
|---|---|---|
| Cache (L2) | Bits on wire (L0) | "The cache stores the same bits you sent down a wire — just closer to the CPU." |
| Virtual memory (L2) | Processes (L3) | "Every process gets its own virtual address space — the OS maps it to physical RAM." |
| Process memory (L3) | RAM hierarchy (L2) | "Each process gets a slice of the RAM you just explored." |
| Threads (L3) | Processes (L3, same layer) | "A thread is a process that shares memory with its siblings. That sharing is power and danger." |
| Packet wrapping (L4) | Byte on wire (L0) | "That byte on a wire? This is a billion of them, wrapped in headers." |
| TCP retransmit (L4) | File system (L3) | "The OS ensures files are intact on disk; TCP ensures packets are intact on the wire. Same idea." |
| HTTP request (L5) | System call (L3) | "Your browser calls the OS to send this request — the same syscall boundary you saw." |
| TLS certificate (L5) | PKI (L11) | "That certificate chain in the browser? You'll build it from scratch in Layer 11." |
| Lexer tokens (L6) | AI tokenizer (L12) | "GPT's tokenizer is a learned lexer. You just built the rule-based version." |
| AST nodes (L6) | BST (L8) | "An AST is a tree. Every BST operation you'll learn applies directly to it." |
| Logic gates (L7) | AND gate (L1) | "You built this gate in Layer 1. Now you can write a formal proof about it." |
| Modular arithmetic (L7) | RSA setup (L11) | "The math you just did is the foundation of RSA encryption." |
| Linear algebra (L7) | Attention math (L12) | "The matrix multiply you just animated is exactly what the transformer computes." |
| Hash table (L8) | Cache (L2) | "A hash table is a cache you control. A CPU cache is a hash table the hardware controls." |
| Dijkstra (L8) | Packet routing (L4) | "Routers run a distributed version of Dijkstra on the internet graph." |
| Dynamic programming (L8) | Memoization (L12 ML) | "Backpropagation is dynamic programming applied to a computation graph." |
| P vs NP (L8) | Distributed consensus (L14) | "Consensus is NP-hard in the asynchronous model. That's why Raft exists — it's an approximation." |
| B-tree (L10) | Binary search tree (L8) | "A B-tree is a BST designed for disks — wide nodes so each disk read returns more keys." |
| Database normalization (L10) | Functional programming (L9) | "Normalization eliminates redundancy. Immutability eliminates state. Same idea, different domain." |
| XOR cipher (L11) | AND gate (L1) | "XOR is a gate, just like AND. You can build it from NANDs." |
| SHA-256 (L11) | Full adder (L1) | "A hash function chains thousands of the same operations your adder performed." |
| OAuth flow (L11) | HTTP request (L5) | "OAuth is HTTP requests with a very specific sequence. You understand both now." |
| OOP encapsulation (L9) | OS process isolation (L3) | "A process is an OS-level capsule. An object is a language-level capsule. Same pattern, different layer." |
| Functional purity (L9) | Distributed stateless (L14) | "Stateless functions scale horizontally. Pure functions are stateless by definition." |
| Gradient descent (L12) | Dijkstra (L8) | "Both are search algorithms. Dijkstra finds shortest path in a graph. Gradient descent finds the minimum of a loss surface." |
| Attention math (L12) | Linear algebra (L7) | "This is the matrix multiply you animated in Layer 7 — at 10,000 dimensions." |
| Git commit graph (L13) | DAG (L8) | "A git history is a directed acyclic graph. Merge creates a node with two parents." |
| CI/CD pipeline (L13) | Distributed systems (L14) | "A CI/CD pipeline is a distributed system. Jobs run in parallel, artifacts flow through queues." |
| Kafka queue (L14) | OS scheduler (L3) | "A message queue is a scheduler for work that crosses machine boundaries." |
| MapReduce (L14) | Merge sort (L8) | "MapReduce is merge sort applied to a cluster instead of an array." |
| Algorithmic bias (L15) | ML training (L12) | "The model learned from the data. If the data is biased, the model is biased. You built the training loop." |
| Privacy and data (L15) | Databases (L10) | "The data in that normalized schema? Real people. Every query is an action in their life." |

---

## 5. Device unlock roadmap (v5)

| Layer completed | Devices unlocked |
|---|---|
| 0 — Fundamentals | (none — motivation to continue) |
| 1 — Foundations | `pc-starter`, `vacuum-tube` |
| 2 — Memory | `ssd-board` |
| 3 — OS | `terminal-retro` |
| 4 — Networks | `server-home`, `server-commercial` |
| 5 — Web | `browser-engine` |
| 6 — Compilers | `compiler-chip` |
| 7 — Mathematics | `math-engine` |
| 8 — DSA + Complexity | `algorithm-visualizer` |
| 9 — Programming Paradigms | `lang-tower` |
| 10 — Databases | `database-server` |
| 11 — Security | `hardware-key` |
| 12 — AI / LLM + ML | `phone-slim`, `gpu-card` |
| 13 — Software Engineering | `workstation` |
| 14 — Distributed | `server-rack-cluster` |
| 15 — Ethics | (no device — the lesson is the reward) |
| **ALL 16 layers** | `robot-arm` (ultimate unlock) |

**Total devices:** 18 (up from 14 in v4)

---

## 6. Addiction mechanics per layer (v5)

### The "One More Thing" hook

Every lesson's final step ends with a single sentence that creates an unanswered
question pointing to the next layer. Summaries close loops. Open questions don't.

### The "You've Seen This" callback

When a concept reappears in a new context, a subtle banner slides in:

> 🔗 **Connection unlocked** — You first saw this idea in [Layer N: Lesson Name].
> Same pattern, higher layer.

### Discovery layer (Easter eggs — full v5 list)

| Layer | Trigger | Reward |
|---|---|---|
| 0 | Set bits to spell "Hi" (ASCII 72, 105) | "You encoded your first message." |
| 1 | Get AND gate right on first try | "First try. You think in binary." |
| 2 | Achieve 100% cache hit rate | "You'd make a good cache controller." |
| 2 | Fill all physical frames with 3 processes without crashing | "You managed memory better than Windows 95." |
| 3 | Create a file called `hello.txt` | "Every journey starts with hello." |
| 3 | Trigger deadlock intentionally | "You broke it on purpose. That's a step above most engineers." |
| 4 | Draw a cable NA → EU → AS | "That's the actual path of the FLAG cable." |
| 5 | Send a GET request to `/` | "You just asked a server for its home page." |
| 6 | Constant-fold an expression to a single number | "Constant folding. Your compiler did that at compile time." |
| 7 | Prove merge sort is O(n log n) using the induction template | "You just did what CLRS does in Chapter 2." |
| 8 | Build a perfectly balanced BST | "Perfectly balanced, as all trees should be." |
| 8 | Reach n=25 on TSP brute-force | "That's why we have heuristics." |
| 8 | Solve knapsack DP without hints | "You think like a compiler optimizer." |
| 9 | Write a `reduce` that computes factorial with no loop | "Welcome to functional programming." |
| 10 | Query returns 0 rows | "No results — but the query was valid. That's debugging." |
| 11 | XOR-encrypt "hello" with key "world" | "You and every spy movie villain." |
| 11 | Complete all three OWASP labs | "You are now more dangerous than 90% of developers — and safer." |
| 12 | Generate a token that completes a real word | "You just did what GPT does 100 billion times a day." |
| 12 | Achieve a perfect decision boundary on training data | "Perfect. Now watch it fail on the test set." |
| 13 | CI pipeline all green on first push | "First time green. It won't always be this easy." |
| 13 | Write a failing test before implementation (TDD) | "Red, green, refactor. You did it right." |
| 14 | Survive a simulated network partition without data loss | "Your system stayed up. You're hired." |
| 15 | Complete all six ethics steps in one session | "You stayed for the hard part. That's the first step." |

### Progressive reveal

1. **Completed layers:** Full color, glow, connection lines drawn to adjacent layers
2. **Current layer:** Pulsing border, "Continue →" CTA
3. **Next available layer:** Slightly brighter than locked, teaser subtitle visible
4. **Locked layers:** Dimmed, title only, lock icon
5. **Layer 7 subclusters:** Show progress within the math chapter so the learner
   feels discrete reasoning, probability, and linear algebra as one coherent
   toolkit rather than three unrelated topics.

---

## 7. Content flow principles (v5 additions)

*All v4 principles are preserved. These are additive.*

8. **Mathematics is infrastructure, not a detour.** Layer 7 is not "extra
   credit." It is the reason that Big-O analysis, hash collisions, RSA, and
   transformer attention make *sense* rather than being memorized facts. Surface
   the math-to-concept connections aggressively.

9. **Programming is the output, not the input.** The curriculum teaches how
   computing works; the paradigms layer teaches how to *express* that understanding
   in code. Never let a student feel that the interactive simulations are a
   substitute for writing programs — add explicit "try this in real code" callouts
   at L9 onward.

10. **Ethics is not an epilogue — it is a lens.** Layer 15 should feel inevitable,
    not tacked on. The cross-layer callbacks from algorithmic bias to ML training,
    and from privacy to databases, should make the student feel that every technical
    decision has already been a human decision.

11. **Branches are not optional.** The four branches (L9–L12) are positioned as
    "choose your path" but all are required for Layer 13. The unlock gate is the
    honest framing: you can do them in any order, but you need all of them. Don't
    let students skip the paradigms or ethics layers.

---

## 8. Implementation priority (v5)

### Phase 1 — Close the existing gaps (v4 spine)
- Add virtual memory steps to Layer 2 (`mem-virtual`, `mem-paging`)
- Add threads, mutex, deadlock steps to Layer 3 (`os-threads`, `os-mutex`, `os-deadlock`)
- Add UDP step to Layer 4 (`net-udp`)
- Add cross-layer callbacks for all existing L0–L5 connections

### Phase 2 — Build the theory spine
- **Layer 6: Compilers & Languages** (6 steps, new)
- **Layer 7: Mathematics for CS** (7 steps, new)

### Phase 3 — Expand Layer 8 (DSA + Complexity)
- Part B: Advanced Structures (heap, AVL, trie, union-find)
- Part C: Algorithm Design Paradigms (greedy, Dijkstra, DP intro, DP classics)
- Part D: Complexity Theory (Big-O formal, P vs NP, halting problem)

### Phase 4 — The upper branches
- **Layer 9: Programming Paradigms** (6 steps, new)
- Expand Layer 10 (add ACID, normalization, NoSQL)
- Expand Layer 11 (add PKI, auth, OWASP)
- Expand Layer 12 (add ML foundations: supervised, gradient descent, overfitting, classification; add attention math, backprop)

### Phase 5 — The capstone layers
- **Layer 13: Software Engineering** (7 steps, new)
- Expand Layer 14 (add sharding, message queues, observability)
- **Layer 15: Ethics & Society** (6 steps, new)

---

## 9. Estimated scale (v5)

| Metric | v3 | v4 | v5 |
|---|---|---|---|
| Chapters | 4 | 11 | 16 |
| Lessons | 4 | 11 | 16 |
| Total steps | 9 | 42 | 93 |
| Devices | 6 | 14 | 18 |
| Cross-layer connections | 0 | 14 | 33 |
| Easter eggs | 0 | 11 | 23 |
| Missing CS pillars | — | 3 | 0 |

### The learning architecture, now clarified:

| Arc | v4 | v5 |
|---|---|---|
| **Make computation concrete** | Mixed into lower layers | L0-L1 explicitly grouped |
| **Make one machine feel real** | Mixed into lower layers | L2-L6 explicitly grouped |
| **Learn to reason about computing** | Absent | L7-L8 |
| **Learn to build software** | Absent | L9-L13 |
| **Scale systems and face responsibility** | Partially present | L14-L15 |

---

*This document is a living plan. Update it as lessons are built and playtested.*

