/** Full-screen beats between steps (Duolingo-style interstitial). Keys match parent state ids. */
export const CONNECTION_MOMENTS: Record<
  string,
  { title: string; body: string; hook?: string; cta?: string }
> = {
  // ── Fundamentals ──────────────────────────────────────────────────────────
  'fund-0': {
    title: 'You mapped input, work, and output',
    body:
      'Every program ever written is still doing that dance. Next you will give the machine digits it can count with.',
    hook: 'Same story, smaller pieces.',
    cta: 'Show me binary',
  },
  'fund-1': {
    title: 'You can write numbers with switches',
    body:
      'That is the bridge between "human idea" and "silicon." Next you pack eight switches into one byte and watch a value travel.',
    hook: 'Same bits, now in a row.',
    cta: 'Open the wire lab',
  },
  'fund-2': {
    title: 'Ready to finish Fundamentals',
    body:
      'You are about to mark this track complete. The home stack will light a new thread toward Foundations, where wires become gates.',
    hook: 'The climb continues.',
    cta: 'Finish this track',
  },

  // ── Foundations ───────────────────────────────────────────────────────────
  'found-0': {
    title: 'You proved a gate with your hands',
    body:
      'Software conditions and CPU control paths still reduce to tests like that AND. Next you chain ideas into a full adder.',
    hook: 'Carry is coming.',
    cta: 'Build the adder',
  },
  'found-1': {
    title: 'You built a one-bit adder',
    body:
      'Real CPUs stack thousands of these in parallel. Next you watch fetch and decode, the heartbeat you will recognize in every chip.',
    hook: 'From math to motion.',
    cta: 'Watch fetch and decode',
  },
  'found-2': {
    title: 'Ready to finish Foundations',
    body:
      'Completing this unlocks new machines in Devices and draws a line on the home stack toward the map lab.',
    hook: 'Networks next.',
    cta: 'Finish this chapter',
  },

  // ── Memory ────────────────────────────────────────────────────────────────
  'mem-0': {
    title: 'You operated the CPU\'s fastest storage',
    body:
      'Registers live inside the chip itself — no bus, no wait. Every arithmetic operation you will ever write touches them billions of times per second. Next: what happens when the CPU needs more data than registers can hold.',
    hook: 'Caches to the rescue.',
    cta: 'See the cache',
  },
  'mem-1': {
    title: 'You experienced cache hits and misses',
    body:
      'That hit/miss ratio determines whether your loop runs in nanoseconds or microseconds. The difference is often the reason one program is ten times faster than another. Next: the full five-layer hierarchy.',
    hook: 'Registers were just layer one.',
    cta: 'Tour the hierarchy',
  },
  'mem-2': {
    title: 'You traced data through every storage tier',
    body:
      'That animated dot falling through layers is what your CPU does on every cache miss. Each tier is slower but larger — the tradeoff never changes. Next: what happens when the cache is full.',
    hook: 'Someone has to leave.',
    cta: 'Learn eviction',
  },
  'mem-3': {
    title: 'You mastered least-recently-used eviction',
    body:
      'LRU is elegant because it bets on the future using the past. Your CPU cache, your browser, and your DNS resolver all use this idea. Next: how programs see more memory than physically exists.',
    hook: 'Virtual is not fake.',
    cta: 'Enter virtual memory',
  },
  'mem-4': {
    title: 'You watched the MMU translate addresses',
    body:
      'Every pointer in every program you write is a virtual address. The hardware silently translates it on every single memory access. Next: place physical pages yourself and feel why the TLB exists.',
    hook: 'One more indirection.',
    cta: 'Place pages',
  },
  'mem-5': {
    title: 'Ready to finish Memory and Storage',
    body:
      'You now understand why cache-friendly code is faster, why virtual memory enables multitasking, and why the TLB exists. Completing this unlocks the SSD Board in Devices.',
    hook: 'The OS layer is next.',
    cta: 'Finish this chapter',
  },

  // ── OS ────────────────────────────────────────────────────────────────────
  'os-0': {
    title: 'You managed process state with your hands',
    body:
      'Ready, running, blocked — every app on your device cycles through those states thousands of times per second. The OS makes it look seamless. Next: who decides which process runs and when.',
    hook: 'Order out of chaos.',
    cta: 'Meet the scheduler',
  },
  'os-1': {
    title: 'You ran two scheduling algorithms',
    body:
      'Round-robin is fair. Shortest-job-first is optimal. Neither is perfect for all workloads — which is why Linux invented CFS, a weighted fair-share scheduler. Next: where programs keep their files.',
    hook: 'Persistence next.',
    cta: 'Open the filesystem',
  },
  'os-2': {
    title: 'You created, moved, and deleted files',
    body:
      'That inode number staying visible after deletion is not a bug — it is how file recovery software works, and why you should overwrite sensitive data before selling a drive. Next: how programs ask the OS for anything at all.',
    hook: 'The invisible boundary.',
    cta: 'Cross the syscall line',
  },
  'os-3': {
    title: 'You watched a system call cross the kernel boundary',
    body:
      'Every file read, network request, and print statement you write crosses that boundary. The mode switch is microseconds — and it is why kernel code must be impeccably correct. Next: sharing memory between threads.',
    hook: 'Same process, two paths.',
    cta: 'Meet threads',
  },
  'os-4': {
    title: 'You triggered a real race condition',
    body:
      'That lost increment is not bad luck — it is a deterministic consequence of unsynchronized shared state. Production systems have failed for exactly this reason. Next: the fix.',
    hook: 'Locks exist for a reason.',
    cta: 'Add the mutex',
  },
  'os-5': {
    title: 'You prevented a race — and caused a deadlock',
    body:
      'Mutexes fix races. But acquire two mutexes in opposite order and you get a different kind of freeze. Next: the four conditions that make deadlock possible, and how to break any one of them.',
    hook: 'Four switches, one system.',
    cta: 'Study deadlock',
  },
  'os-6': {
    title: 'Ready to finish Operating Systems',
    body:
      'You have seen processes, schedulers, filesystems, syscalls, threads, mutexes, and deadlock. Completing this unlocks the Retro Terminal in Devices and opens the Web Stack chapter.',
    hook: 'The stack goes higher.',
    cta: 'Finish this chapter',
  },

  // ── Web ───────────────────────────────────────────────────────────────────
  'web-0': {
    title: 'You followed a name to an address',
    body:
      'DNS is a distributed database that the entire internet queries billions of times per second. That lookup is why the first request after a cold boot is always slightly slower. Next: what travels over that connection.',
    hook: 'The request is next.',
    cta: 'Send an HTTP request',
  },
  'web-1': {
    title: 'You built an HTTP request and read the response',
    body:
      'HTTP is remarkably human-readable for a protocol that powers all of the web. Headers, status codes, and bodies are the vocabulary every web developer needs. Next: how that conversation stays private.',
    hook: 'Enter TLS.',
    cta: 'Watch the handshake',
  },
  'web-2': {
    title: 'You watched TLS negotiate a secret',
    body:
      'Two strangers — your browser and a server — agreed on a shared secret without ever sharing it in the clear. That is the cryptographic miracle that makes online commerce possible. Next: what the browser does with the response.',
    hook: 'Pixels from bytes.',
    cta: 'See the render pipeline',
  },
  'web-3': {
    title: 'Ready to finish the Web Stack',
    body:
      'You traced a URL from keypress to pixel: DNS, HTTP, TLS, and the render pipeline. Completing this unlocks the Browser Engine in Devices.',
    hook: 'Compilers are next.',
    cta: 'Finish this chapter',
  },

  // ── Compilers ─────────────────────────────────────────────────────────────
  'comp-0': {
    title: 'You saw source code as just characters',
    body:
      'Every program starts as text. The compiler\'s first job is to make meaning out of that stream. Next: the first pass that groups characters into words the compiler can reason about.',
    hook: 'Tokens are the atoms.',
    cta: 'Run the lexer',
  },
  'comp-1': {
    title: 'You turned source into tokens',
    body:
      'Lexer errors — "unexpected character", "unterminated string" — are all caught at this stage. A good error message here saves hours of debugging. Next: how tokens become structure.',
    hook: 'Grammar gives order.',
    cta: 'Parse the tokens',
  },
  'comp-2': {
    title: 'You parsed tokens against a grammar',
    body:
      'A grammar is a formal description of every valid sentence in a language. Parsing finds the structure — which is why "missing semicolon" errors point to where structure breaks down. Next: the tree that encodes that structure.',
    hook: 'The AST holds everything.',
    cta: 'Build the AST',
  },
  'comp-3': {
    title: 'You built an abstract syntax tree',
    body:
      'The AST is what every tool that "understands" code — linters, formatters, type checkers — actually operates on. Source code is for humans; the AST is for compilers. Next: turning that tree into instructions.',
    hook: 'Instructions from a tree.',
    cta: 'Generate code',
  },
  'comp-4': {
    title: 'You generated machine instructions from an AST',
    body:
      'Code generation is where the abstraction collapses into something the CPU can actually execute. The gap between high-level language and machine code is now visible. Next: making that code faster without changing what it does.',
    hook: 'Same semantics, better performance.',
    cta: 'Optimize',
  },
  'comp-5': {
    title: 'Ready to finish Compilers',
    body:
      'You walked the full pipeline: source → tokens → parse tree → AST → instructions → optimized output. Completing this unlocks the Compiler Chip in Devices.',
    hook: 'Math for CS is next.',
    cta: 'Finish this chapter',
  },

  // ── Math ──────────────────────────────────────────────────────────────────
  'math-0': {
    title: 'You reasoned with formal logic',
    body:
      'Every if-statement you write is propositional logic. Every type system is predicate logic. You have been doing this — now you know the names. Next: how we know something is true.',
    hook: 'Proof is precision.',
    cta: 'Learn to prove',
  },
  'math-1': {
    title: 'You followed a formal proof',
    body:
      'Direct proof, contradiction, induction — these are the three tools that build all of mathematics. Algorithm correctness proofs use all three. Next: the objects that proofs operate on.',
    hook: 'Sets are everywhere.',
    cta: 'Meet sets',
  },
  'math-2': {
    title: 'You worked with sets and relations',
    body:
      'Database joins are set intersections. Graph edges are relations. Type hierarchies are partial orders. The vocabulary you just learned runs through all of CS. Next: counting those relationships.',
    hook: 'How many ways?',
    cta: 'Count combinations',
  },
  'math-3': {
    title: 'You counted arrangements and combinations',
    body:
      'Combinatorics is why hash table load factors matter, why birthday attacks work in cryptography, and why some search spaces are exponentially large. Next: arithmetic with a clock face.',
    hook: 'Modular is the key.',
    cta: 'Try modular arithmetic',
  },
  'math-4': {
    title: 'You computed in modular arithmetic',
    body:
      'RSA encryption runs on this arithmetic. So do hash functions, checksums, and random number generators. The circle you just traced is inside every secure system. Next: reasoning under uncertainty.',
    hook: 'Not everything is certain.',
    cta: 'Learn probability',
  },
  'math-5': {
    title: 'You quantified uncertainty with probability',
    body:
      'Expected value, independence, conditional probability — these are the building blocks of every ML model and every load balancer. Next: the math of transformation and representation.',
    hook: 'Vectors transform.',
    cta: 'See linear algebra',
  },
  'math-6': {
    title: 'Ready to finish Math for CS',
    body:
      'Logic, proof, sets, counting, modular arithmetic, probability, and linear algebra — the seven pillars. Completing this unlocks the Math Engine in Devices.',
    hook: 'Algorithms next.',
    cta: 'Finish this chapter',
  },

  // ── DSA ───────────────────────────────────────────────────────────────────
  'dsa-0': {
    title: 'You compared arrays and linked lists',
    body:
      'Index in O(1) or insert in O(1) — you can rarely have both. That tradeoff appears in every data structure choice you will ever make. Next: adding order and search.',
    hook: 'Trees give you log time.',
    cta: 'Build a BST',
  },
  'dsa-1': {
    title: 'You inserted and searched a binary search tree',
    body:
      'Logarithmic search time is why BSTs power database indexes. But unbalanced trees degrade to O(n) — which is why balanced variants exist. Next: O(1) average lookup.',
    hook: 'Hash it.',
    cta: 'Build a hash table',
  },
  'dsa-2': {
    title: 'You built a hash table with chaining',
    body:
      'Every dictionary in Python, every object in JavaScript, every map in Go is a hash table. Load factor, collision handling, and rehashing are what separate fast implementations from slow ones. Next: putting things in order efficiently.',
    hook: 'Sorting changes everything.',
    cta: 'Watch sorting algorithms',
  },
  'dsa-3': {
    title: 'You compared sorting algorithms visually',
    body:
      'Merge sort is stable and predictable. Quicksort is fast in practice. Timsort hybridizes both for real data. Every language standard library made a choice here — now you know why. Next: connected data.',
    hook: 'Graphs model relationships.',
    cta: 'Traverse a graph',
  },
  'dsa-4': {
    title: 'You traversed a graph with BFS and DFS',
    body:
      'BFS finds shortest paths in unweighted graphs. DFS detects cycles and topological order. Every social network, every map, every dependency resolver is a graph problem. Next: priority.',
    hook: 'Heaps give the minimum instantly.',
    cta: 'Build a heap',
  },
  'dsa-5': {
    title: 'You operated a heap',
    body:
      'The heap is the data structure behind every priority queue — task schedulers, Dijkstra\'s algorithm, merge-k-sorted-lists. Insert and extract in O(log n), minimum in O(1). Next: trees that stay balanced.',
    hook: 'AVL rotates to stay fast.',
    cta: 'See AVL rotations',
  },
  'dsa-6': {
    title: 'You watched AVL rotations restore balance',
    body:
      'Every self-balancing tree — AVL, Red-Black, B-tree — uses rotations to guarantee O(log n) worst case. Database indexes depend on this guarantee. Next: string-prefix search.',
    hook: 'Tries are prefix machines.',
    cta: 'Build a trie',
  },
  'dsa-7': {
    title: 'You built a trie and searched by prefix',
    body:
      'Autocomplete, spell checkers, IP routing tables — all tries. The shared-prefix compression makes string lookups faster than any hash table for prefix queries. Next: merging disjoint sets.',
    hook: 'Union-Find connects components.',
    cta: 'Try union-find',
  },
  'dsa-8': {
    title: 'You merged components with Union-Find',
    body:
      'Path compression and union by rank give you near-O(1) operations. Kruskal\'s MST algorithm, network connectivity checks, and image segmentation all rely on this structure. Next: greedy choices.',
    hook: 'Take the best now.',
    cta: 'See greedy algorithms',
  },
  'dsa-9': {
    title: 'You solved a problem with a greedy algorithm',
    body:
      'Greedy works when the locally optimal choice is globally optimal — activity selection, Huffman coding, fractional knapsack. When it fails, dynamic programming steps in. Next: shortest weighted paths.',
    hook: "Dijkstra always finds the way.",
    cta: "Run Dijkstra's",
  },
  'dsa-10': {
    title: "You ran Dijkstra's algorithm step by step",
    body:
      'Every GPS navigation system, every network routing protocol, every game pathfinder runs a variant of Dijkstra. The priority queue you built two steps ago is the engine. Next: overlapping subproblems.',
    hook: 'DP remembers.',
    cta: 'Meet dynamic programming',
  },
  'dsa-11': {
    title: 'You saw overlapping subproblems become DP',
    body:
      'Memoization turns exponential recursion into polynomial solutions. Recognizing overlapping subproblems is the skill — once you see it, you cannot unsee it. Next: the classic problems.',
    hook: 'Knapsack and LCS.',
    cta: 'Solve classic DP',
  },
  'dsa-12': {
    title: 'You solved classic DP problems',
    body:
      'Longest common subsequence, knapsack, coin change — these appear in interviews and in production (diff algorithms, resource allocation, sequence alignment). Next: measuring how hard problems are.',
    hook: 'Big-O is your ruler.',
    cta: 'Learn Big-O',
  },
  'dsa-13': {
    title: 'You measured algorithmic complexity',
    body:
      'Big-O is the shared language of algorithm analysis. O(n log n) sorting vs O(n²) sorting does not matter at n=10. It determines whether your system handles a million users or crashes trying. Next: the limits of computation.',
    hook: 'Some problems are hard by nature.',
    cta: 'Meet P and NP',
  },
  'dsa-14': {
    title: 'You mapped the landscape of hard problems',
    body:
      'P vs NP is the deepest open question in computer science. Recognizing NP-hard problems means knowing when to stop searching for an exact algorithm and start approximating. Next: a problem no algorithm can solve.',
    hook: 'The halting problem is undecidable.',
    cta: 'See the halting problem',
  },
  'dsa-15': {
    title: 'Ready to finish Data Structures and Algorithms',
    body:
      'Sixteen structures and algorithms from arrays to undecidability. Completing this unlocks the Algorithm Visualizer in Devices and opens the AI chapter.',
    hook: 'Databases next.',
    cta: 'Finish this chapter',
  },

  // ── Databases ─────────────────────────────────────────────────────────────
  'db-0': {
    title: 'You navigated a B-tree',
    body:
      'B-trees keep data sorted and balanced on disk, which is why database reads are O(log n) even over billions of rows. Every major SQL database uses this structure at its core. Next: how queries become plans.',
    hook: 'The planner decides everything.',
    cta: 'Plan a query',
  },
  'db-1': {
    title: 'You watched a query plan execute',
    body:
      'The query planner rewrites your SQL into a physical execution plan — choosing join algorithms, index scans, and sort strategies. EXPLAIN is the lens that makes this visible. Next: atomicity.',
    hook: 'All or nothing.',
    cta: 'Start a transaction',
  },
  'db-2': {
    title: 'You committed and rolled back a transaction',
    body:
      'Transactions give you the right to assume the database is always consistent, even when hardware fails mid-write. That assumption is worth its weight in debugging time. Next: why it holds.',
    hook: 'ACID spells it out.',
    cta: 'Meet ACID',
  },
  'db-3': {
    title: 'You tested each ACID property',
    body:
      'Atomicity, Consistency, Isolation, Durability — four separate guarantees that database engineers work hard to maintain. NoSQL systems trade some of these for speed or scale. Next: making queries fast.',
    hook: 'Indexes are the shortcut.',
    cta: 'Add an index',
  },
  'db-4': {
    title: 'You added an index and watched queries accelerate',
    body:
      'An index trades write speed and storage for read speed. Over-indexing slows inserts. Under-indexing slows reads. Knowing which columns to index is a core DBA skill. Next: schema design.',
    hook: 'Normalize to avoid anomalies.',
    cta: 'Normalize a schema',
  },
  'db-5': {
    title: 'You normalized a schema to third normal form',
    body:
      'Normalization eliminates update anomalies by removing redundancy. But fully normalized schemas require more joins — which is why data warehouses often deliberately denormalize. Next: when SQL is not the answer.',
    hook: 'NoSQL for different tradeoffs.',
    cta: 'Compare NoSQL',
  },
  'db-6': {
    title: 'Ready to finish Databases',
    body:
      'B-trees, query plans, transactions, ACID, indexes, normalization, NoSQL — the full spectrum of database engineering. Completing this unlocks the Database Server in Devices.',
    hook: 'Security is next.',
    cta: 'Finish this chapter',
  },

  // ── Security ──────────────────────────────────────────────────────────────
  'sec-0': {
    title: 'You encrypted with XOR',
    body:
      'XOR with a truly random key is theoretically unbreakable — the one-time pad. The practical problem is key distribution. Every more complex cipher you will ever meet is a solution to that problem. Next: one-way functions.',
    hook: 'Hashing goes one way.',
    cta: 'Hash something',
  },
  'sec-1': {
    title: 'You hashed data and saw avalanche effect',
    body:
      'One bit changes the input — half the bits change the output. That property makes hash functions useful for integrity checking, password storage, and digital signatures. Next: sharing a key without sharing.',
    hook: 'Public key is the breakthrough.',
    cta: 'Meet asymmetric crypto',
  },
  'sec-2': {
    title: 'You exchanged keys without a shared secret',
    body:
      'The Diffie-Hellman key exchange, invented in 1976, changed everything. For the first time, two strangers could establish a private channel over a public network. Every HTTPS connection starts here. Next: proving authorship.',
    hook: 'Signatures are unforgeable.',
    cta: 'Sign a message',
  },
  'sec-3': {
    title: 'You signed and verified a message',
    body:
      'Digital signatures give you authentication, non-repudiation, and integrity in one operation. They underpin code signing, email authentication, and cryptocurrency transactions. Next: trusting the key.',
    hook: 'Who vouches for whom?',
    cta: 'Build a certificate chain',
  },
  'sec-4': {
    title: 'You built a certificate chain',
    body:
      'Every HTTPS padlock you see represents a chain of trust from a root CA to the server certificate. PKI is the reason you can trust a server you have never met. Next: how identity works in practice.',
    hook: 'Authentication is its own problem.',
    cta: 'Model an auth flow',
  },
  'sec-5': {
    title: 'You modeled an authentication flow',
    body:
      'Passwords, tokens, sessions, OAuth — these are engineering solutions to the problem of proving identity over a stateless protocol. Each one has a different threat model. Next: the attacks to defend against.',
    hook: 'OWASP names the top ten.',
    cta: 'Audit vulnerabilities',
  },
  'sec-6': {
    title: 'Ready to finish Security',
    body:
      'XOR, hashing, public-key crypto, signatures, PKI, auth, OWASP — the full security stack from primitives to practice. Completing this unlocks the Hardware Key in Devices.',
    hook: 'Paradigms are next.',
    cta: 'Finish this chapter',
  },

  // ── Paradigms ─────────────────────────────────────────────────────────────
  'par-0': {
    title: 'You wrote imperative code step by step',
    body:
      'Imperative programming is the direct mapping of algorithm to instruction. It gives you total control — and total responsibility for state. Next: grouping state and behavior together.',
    hook: 'Objects manage complexity.',
    cta: 'Meet OOP',
  },
  'par-1': {
    title: 'You designed objects and their relationships',
    body:
      'Object-oriented design is a way of drawing boxes around complexity so you can reason about each box independently. Inheritance and polymorphism let boxes share behavior without sharing code. Next: hiding the internals.',
    hook: 'Encapsulation is a contract.',
    cta: 'Draw the interface',
  },
  'par-2': {
    title: 'You drew a clean public interface',
    body:
      'Encapsulation is the promise: "You do not need to know how this works, only what it does." Good APIs are encapsulation taken seriously. Next: a completely different model of computation.',
    hook: 'Functions are values.',
    cta: 'Try functional programming',
  },
  'par-3': {
    title: 'You transformed data without mutating it',
    body:
      'Functional programming eliminates a whole class of bugs by forbidding shared mutable state. Map, filter, reduce are the vocabulary. Immutability is the discipline. Next: how types encode contracts.',
    hook: 'Types catch errors at compile time.',
    cta: 'Explore type systems',
  },
  'par-4': {
    title: 'You saw types prevent runtime errors',
    body:
      'A type system is a lightweight formal verification tool that runs for free at compile time. The stricter the type system, the fewer tests you need for certain classes of bugs. Next: who owns memory.',
    hook: 'Ownership prevents use-after-free.',
    cta: 'Study ownership models',
  },
  'par-5': {
    title: 'Ready to finish Programming Paradigms',
    body:
      'Imperative, OOP, encapsulation, functional, types, memory ownership — six lenses on the same problem of managing complexity. Completing this opens the Software Engineering chapter.',
    hook: 'The craft layer is next.',
    cta: 'Finish this chapter',
  },

  // ── SWE ───────────────────────────────────────────────────────────────────
  'swe-0': {
    title: 'You committed and branched with Git',
    body:
      'Version control is a time machine and a collaboration protocol. Every professional software project uses it. The mental model — commits, branches, merges — scales from one developer to thousands. Next: making confidence explicit.',
    hook: 'Tests are specifications.',
    cta: 'Write tests',
  },
  'swe-1': {
    title: 'You compared unit, integration, and e2e tests',
    body:
      'The test pyramid is not a religious rule — it is an observation that small tests are cheaper to run and easier to fix. The goal is fast feedback when something breaks. Next: writing tests before code.',
    hook: 'TDD inverts the order.',
    cta: 'Try TDD',
  },
  'swe-2': {
    title: 'You wrote a test before the code it exercises',
    body:
      'TDD forces you to think about the interface before the implementation. The failing test is a specification. The passing test is a proof. The refactoring step is where design happens. Next: designing for change.',
    hook: 'SOLID keeps code flexible.',
    cta: 'Learn SOLID',
  },
  'swe-3': {
    title: 'You applied the SOLID principles',
    body:
      'Single responsibility, open-closed, Liskov substitution, interface segregation, dependency inversion — five principles that make large codebases changeable rather than brittle. Next: proven solutions to recurring problems.',
    hook: 'Patterns name the solutions.',
    cta: 'Meet design patterns',
  },
  'swe-4': {
    title: 'You recognized classic design patterns',
    body:
      'Factory, Observer, Strategy, Decorator — patterns are a vocabulary for design conversations. When your team says "use a factory here," everyone immediately understands the intent. Next: deploying with confidence.',
    hook: 'CI/CD is the pipeline.',
    cta: 'Build a CI/CD pipeline',
  },
  'swe-5': {
    title: 'You configured a CI/CD pipeline',
    body:
      'Continuous integration catches broken builds within minutes. Continuous deployment ships working code to users automatically. The pipeline is the assembly line of software. Next: finding what is broken.',
    hook: 'Debugging is a skill.',
    cta: 'Debug systematically',
  },
  'swe-6': {
    title: 'Ready to finish Software Engineering',
    body:
      'Git, testing, TDD, SOLID, patterns, CI/CD, and debugging — the full craft layer. Completing this unlocks the Workstation in Devices and opens Distributed Systems.',
    hook: 'Many machines now.',
    cta: 'Finish this chapter',
  },

  // ── Distributed ───────────────────────────────────────────────────────────
  'dist-0': {
    title: 'You replicated data across nodes',
    body:
      'Replication gives you durability and read throughput — but now you have to keep copies in sync. Every distributed system starts here and immediately confronts consistency. Next: agreeing when the network lies.',
    hook: 'Consensus is agreement under failure.',
    cta: 'Watch consensus',
  },
  'dist-1': {
    title: 'You watched Raft reach consensus despite failures',
    body:
      'Leader election, log replication, majority quorums — Raft makes consensus understandable. Etcd, CockroachDB, and Kafka all build on these ideas. Next: the fundamental constraint.',
    hook: 'CAP says you must choose.',
    cta: 'Navigate the CAP theorem',
  },
  'dist-2': {
    title: 'You chose between consistency and availability',
    body:
      'CAP is not a theorem you memorize — it is a tool for understanding why distributed databases behave differently during network partitions. Every "eventually consistent" system made a CAP tradeoff. Next: spreading the load.',
    hook: 'Load balancing hides complexity.',
    cta: 'Balance a load',
  },
  'dist-3': {
    title: 'You routed requests across multiple servers',
    body:
      'Round-robin, least-connections, consistent hashing — each strategy optimizes for a different failure mode. The load balancer is the traffic director that makes horizontal scale invisible to users. Next: parallel data processing.',
    hook: 'MapReduce splits the work.',
    cta: 'Run MapReduce',
  },
  'dist-4': {
    title: 'You processed data with MapReduce',
    body:
      'Map in parallel, then reduce to a summary. That pattern — scatter, gather — underlies Spark, Hadoop, and every large-scale data pipeline. The key insight: move computation to data, not data to computation. Next: splitting the database itself.',
    hook: 'Sharding scales writes.',
    cta: 'Shard a database',
  },
  'dist-5': {
    title: 'You sharded a database across nodes',
    body:
      'Horizontal sharding lets you write to multiple nodes simultaneously — but now cross-shard queries and rebalancing become your problems. Every multi-tenant SaaS product eventually shards. Next: decoupling producers from consumers.',
    hook: 'Queues absorb spikes.',
    cta: 'Add a message queue',
  },
  'dist-6': {
    title: 'You decoupled services with a message queue',
    body:
      'Queues smooth out traffic spikes, decouple services that evolve at different rates, and provide a durable audit log of work. Kafka, RabbitMQ, and SQS all implement this pattern. Next: seeing inside the system.',
    hook: 'Observability is production visibility.',
    cta: 'Add observability',
  },
  'dist-7': {
    title: 'Ready to finish Distributed Systems',
    body:
      'Replication, consensus, CAP, load balancing, MapReduce, sharding, queues, and observability — the canonical eight. Completing this unlocks the Server Rack Cluster in Devices.',
    hook: 'One chapter remains.',
    cta: 'Finish this chapter',
  },

  // ── Ethics ────────────────────────────────────────────────────────────────
  'eth-0': {
    title: 'You felt what scale does to decisions',
    body:
      'A design choice that affects ten users is a UX issue. The same choice affecting a billion users is a policy. Scale is a multiplier on every consequence — good and bad. Next: consequences that compound invisibly.',
    hook: 'Bias hides in data.',
    cta: 'Examine algorithmic bias',
  },
  'eth-1': {
    title: 'You traced bias from training data to output',
    body:
      'Bias is not always intentional — it is often the shape of historical data reflected forward. Detecting it requires asking "who is not in this dataset?" before the model ships. Next: whose data is it anyway.',
    hook: 'Privacy is a design constraint.',
    cta: 'Design for privacy',
  },
  'eth-2': {
    title: 'You applied privacy by design',
    body:
      'Data minimization, purpose limitation, consent — these are engineering constraints, not just legal ones. The database schema you design determines what your company can and cannot do with user data. Next: a different kind of safety.',
    hook: 'AI safety is about alignment.',
    cta: 'Study AI safety',
  },
  'eth-3': {
    title: 'You grappled with AI alignment',
    body:
      'Specification gaming, reward hacking, distributional shift — these failure modes are not science fiction. They are documented behaviors in deployed systems. Understanding them is the first step to preventing them. Next: when things go wrong, who is responsible.',
    hook: 'Accountability closes the loop.',
    cta: 'Assign accountability',
  },
  'eth-4': {
    title: 'You mapped accountability in a complex system',
    body:
      'When a system has many contributors — model, data, deployment, interface — responsibility can diffuse until no one is accountable. Designing for accountability means making that chain explicit before something fails. Next: knowledge as a commons.',
    hook: 'Open source is a social contract.',
    cta: 'Study open-source stewardship',
  },
  'eth-5': {
    title: 'You thought through open-source stewardship',
    body:
      'Licensing, maintenance, security disclosure, governance — open source creates obligations alongside freedoms. The software commons is maintained by people who choose to show up. Next: the professional code.',
    hook: 'The ACM sets the standard.',
    cta: 'Review the ACM Code',
  },
  'eth-6': {
    title: 'Ready to finish Ethics and Responsibility',
    body:
      'Scale, bias, privacy, AI safety, accountability, open source, and the ACM Code — the full ethical toolkit. Completing this chapter finishes the ILP Lab curriculum.',
    hook: 'You made it to the top of the stack.',
    cta: 'Finish this chapter',
  },
}
