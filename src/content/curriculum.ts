import type { Curriculum } from './schema'

/**
 * Narrative shaped by a serious CS roadmap (intro programming, math for CS, algorithms,
 * systems, software construction, advanced topics). Interactives are still small; copy
 * stresses how pieces connect and why the order matters.
 */
export const curriculum: Curriculum = {
  version: 6,
  chapters: [
    {
      id: 'fundamentals',
      title: 'How computers think',
      summary:
        'See what a computer is doing in plain language, then play with on and off as numbers and a row of bits. No code yet, just motion and cause and effect.',
      connection:
        'Strong intro courses start with how you break a problem into steps and what it means for a machine to remember values. We skip syntax on purpose so those habits land before the keyboard gets noisy.',
      lessonIds: ['fundamentals-start'],
    },
    {
      id: 'foundations',
      title: 'Building with logic',
      summary:
        'Wire real logic, chain it into addition, then watch a tiny CPU pull an instruction apart. Each step answers why the next one exists.',
      connection:
        'This is the same story MIT tells when it moves from Boolean logic up to a real instruction set. When you have seen gates and fetch in miniature, memory, caches, and compilers later feel like upgrades to a story you already know.',
      lessonIds: ['foundations-golden-path'],
    },
    {
      id: 'networks',
      title: 'Network fundamentals',
      summary:
        'Walk the OSI model from copper to application, see how Ethernet frames carry MAC addresses across switches, learn how VLANs segment a network, and lay cables on a world map to feel why distance matters.',
      connection:
        'Every CCNA topic builds on the OSI model and switching. Once you see how frames move at layer 2, routing at layer 3 and TCP at layer 4 are upgrades to a story you already know.',
      lessonIds: ['network-fundamentals'],
    },
    {
      id: 'iprouting',
      title: 'IP addressing and routing',
      summary:
        'Calculate subnets, read routing tables, configure static routes, and watch OSPF discover the shortest path. This is the layer that makes the internet work.',
      connection:
        'IP addressing and routing are the core of CCNA. Every packet you send crosses multiple routers, and each one makes a forwarding decision using exactly the logic you will practice here.',
      lessonIds: ['ip-routing-core'],
    },
    {
      id: 'netservices',
      title: 'Transport, services and security',
      summary:
        'Compare TCP and UDP, assign ports, watch DHCP hand out addresses, see NAT translate private IPs, configure ACLs, connect over a VPN, and troubleshoot with ping and traceroute.',
      connection:
        'Transport and network services complete the CCNA picture. Every web request, every DNS lookup, every VPN tunnel depends on the protocols and tools in this chapter.',
      lessonIds: ['net-services-core'],
    },
    {
      id: 'ai',
      title: 'Machine intelligence',
      summary:
        'Play with attention between toy words, then contrast training weights with answering a prompt. Honest scope: gut feeling first, equations later.',
      connection:
        'Modern ML sits on linear algebra and probability, but you still deserve a concrete picture of what training changes versus what inference reuses. This track is that picture.',
      lessonIds: ['llm-intuition'],
    },
    {
      id: 'memory',
      title: 'Memory and storage',
      summary:
        'Follow data as it moves between registers, caches, RAM, and disk. Build a direct-mapped cache, trigger page faults, and place pages in physical frames. Speed and cost form a hierarchy that every program lives inside.',
      connection:
        'Cache behavior, virtual memory, and page replacement policies appear in every OS course and every performance-sensitive system. Understanding the hierarchy first makes every later conversation about latency concrete rather than abstract.',
      lessonIds: ['memory-hierarchy'],
    },
    {
      id: 'os',
      title: 'Operating systems',
      summary:
        'Run processes, schedule the CPU, navigate a filesystem, cross the user–kernel boundary, and finally provoke a deadlock then resolve it. The OS is the invisible manager your code always talks through.',
      connection:
        'Operating systems courses are famously hard because they span five different problem domains at once. Seeing each domain as its own interactive before the lecture makes the full picture cohere much faster.',
      lessonIds: ['os-core'],
    },
    {
      id: 'web',
      title: 'The web stack',
      summary:
        'Trace a URL from keypress to painted pixel: DNS, HTTP, TLS handshake, and browser rendering pipeline. Every layer adds a reason why the next one exists.',
      connection:
        'Web courses jump straight to frameworks, but the frameworks only make sense once you know what problem each protocol was designed to solve. This chapter builds that foundation in four focused steps.',
      lessonIds: ['web-stack'],
    },
    {
      id: 'compilers',
      title: 'Compilers and languages',
      summary:
        'Take source text all the way to machine instructions: characters to tokens, tokens to a parse tree, parse tree to an AST, AST to code, then optimize. You will never look at a syntax error the same way again.',
      connection:
        'Compiler design is where theory meets systems. Once you have walked the pipeline yourself, programming language features — closures, types, inlining — become engineering decisions rather than mysterious magic.',
      lessonIds: ['compilers-core'],
    },
    {
      id: 'mathcs',
      title: 'Math for computer science',
      summary:
        'Logic, proof, sets, counting, modular arithmetic, probability, and a taste of linear algebra. Not a course replacement — a visual bridge so the symbols in textbooks have somewhere to land.',
      connection:
        'Discrete math is the prerequisite that trips up more students than any other. Seeing why each concept matters for computing — before you encounter it in a proof — changes it from an obstacle into a tool.',
      lessonIds: ['math-foundations'],
    },
    {
      id: 'dsa',
      title: 'Data structures and algorithms',
      summary:
        'From arrays to tries, from sorting to dynamic programming, from Big-O to the halting problem. Build intuition for why the choice of data structure changes everything.',
      connection:
        'Algorithms is the subject where CS becomes rigorous. This chapter gives you a visual and interactive pass through every structure and technique that shows up in technical interviews and production codebases alike.',
      lessonIds: ['dsa-core'],
    },
    {
      id: 'databases',
      title: 'Databases',
      summary:
        'Open a B-tree, plan a query, commit a transaction, understand ACID, add an index, normalize a schema, then compare SQL and NoSQL. Data persistence is a craft with decades of hard-won lessons.',
      connection:
        'Every application that outlives a browser tab stores data. Database internals — storage engines, query planners, isolation levels — determine whether that storage is fast, correct, and recoverable when things go wrong.',
      lessonIds: ['db-core'],
    },
    {
      id: 'security',
      title: 'Security and cryptography',
      summary:
        'XOR your first cipher, hash a password, exchange keys without meeting, sign a message, build a certificate chain, model an authentication flow, and audit the OWASP top ten. Security is reasoning about adversaries.',
      connection:
        'Security is not a feature you add at the end — it is a mental model you need from the start. This chapter gives you the cryptographic primitives and the attacker mindset before you encounter them in the wild.',
      lessonIds: ['security-core'],
    },
    {
      id: 'paradigms',
      title: 'Programming paradigms',
      summary:
        'Think imperatively, then object-oriented, then functional. Each paradigm is a different answer to the same question: how do we manage complexity as programs grow? Memory ownership models tie the story to hardware.',
      connection:
        'Most developers pick up a second paradigm by accident and struggle because they never saw the first one clearly. Understanding why each style exists — what problem it solved — makes switching between them deliberate rather than confusing.',
      lessonIds: ['paradigms-core'],
    },
    {
      id: 'swe',
      title: 'Software engineering',
      summary:
        'Version control, testing, TDD, SOLID, design patterns, CI/CD, and debugging methodology. The craft layer that turns working code into maintainable systems.',
      connection:
        'These practices exist because every large codebase is a collaboration across time — with future versions of yourself and with colleagues you have not met yet. Each technique is a solution to a failure mode that real teams hit at scale.',
      lessonIds: ['swe-core'],
    },
    {
      id: 'distributed',
      title: 'Distributed systems',
      summary:
        'Replicate data, reach consensus, navigate the CAP theorem, balance load, split work with MapReduce, shard a database, queue messages, and add observability. The internet runs on these patterns.',
      connection:
        'Once you add a second machine, every assumption about time, consistency, and failure changes. Distributed systems thinking is what separates engineers who debug production incidents from those who are baffled by them.',
      lessonIds: ['distributed-core'],
    },
    {
      id: 'cloud-foundations',
      title: 'Cloud foundations',
      summary:
        'See how the shared responsibility model splits work between you and the provider, why regions and zones exist, how IaaS, PaaS, and SaaS differ, and how multi-tenancy and elasticity change operations.',
      connection:
        'Distributed systems explain failure across machines; cloud explains how those machines are provisioned, isolated, and billed. This chapter is vendor-neutral — the same ideas appear in every major provider.',
      lessonIds: ['cloud-foundations-core'],
    },
    {
      id: 'cloud-identity',
      title: 'Identity and access in the cloud',
      summary:
        'Model principals, resources, and policies. Practice least privilege with roles instead of long-lived keys, understand federation at a high level, and see why secrets are never just another config value.',
      connection:
        'Everything in production is an API call authenticated by identity. Nailing IAM-style thinking early prevents the class of outages where one leaked key owns the whole account.',
      lessonIds: ['cloud-identity-core'],
    },
    {
      id: 'cloud-networking',
      title: 'Networking in the cloud',
      summary:
        'Isolate workloads in a virtual private network, carve subnets and routes, place load balancers and health checks, terminate TLS at the edge, and enforce segmentation with policy — all without naming a vendor console.',
      connection:
        'You already studied packets and routing on the wire. In the cloud, those ideas become software-defined boundaries, quotas, and APIs — same physics, different control plane.',
      lessonIds: ['cloud-networking-core'],
    },
    {
      id: 'cloud-production',
      title: 'Production patterns',
      summary:
        'Choose among VMs, containers, and serverless for different workloads, map storage classes to durability needs, wire logs, metrics, and traces, scale under load, and design for failure domains and recovery.',
      connection:
        'This is where networks, distributed systems, databases, and SWE meet the runtime environment most teams actually deploy to. The goal is transferable judgment, not a single logo on a certificate.',
      lessonIds: ['cloud-production-core'],
    },
    {
      id: 'ethics',
      title: 'Ethics and responsibility',
      summary:
        'Scale amplifies every decision. This chapter examines algorithmic bias, privacy, AI safety, accountability, open-source stewardship, and the ACM Code of Ethics — not as philosophy, but as engineering constraints.',
      connection:
        'Technical skill without ethical reasoning produces systems that harm people at scale. This chapter treats ethics as the final engineering discipline: the one where the specification is written by the people who live with the consequences.',
      lessonIds: ['ethics-core'],
    },
  ],
  lessons: [
    {
      id: 'fundamentals-start',
      chapterId: 'fundamentals',
      title: 'Computers, binary, and a byte on a wire',
      description:
        'Tap the diagram, flip switches, and watch a byte travel. Short notes appear next to what you touch so jargon never runs ahead of the picture.',
      connection:
        'Later, when someone says "memory" or "instruction," you will picture signals moving and storage holding patterns. That image is the payoff of this lesson.',
      steps: [
        { id: 'fund-io', title: 'What is a computer?', mode: 'mixed' },
        { id: 'fund-binary', title: 'On, off, counting', mode: 'build' },
        { id: 'fund-wire', title: 'Bits on a wire', mode: 'observe' },
      ],
    },
    {
      id: 'foundations-golden-path',
      chapterId: 'foundations',
      title: 'Logic, addition, then fetch',
      description:
        'You drive inputs, watch lines light up, then open a toy CPU on fetch and decode. Saves live in this browser so you can leave and come back.',
      connection:
        'Real CPUs add more pipeline stages and caches, but fetch and decode never disappear. Here you learn the rhythm once, slowly enough to see it.',
      steps: [
        { id: 'step-gates', title: 'Light the LED with AND', mode: 'build' },
        { id: 'step-adder', title: 'Build a one bit full adder', mode: 'build' },
        { id: 'step-fetch', title: 'Watch fetch and decode', mode: 'observe' },
      ],
    },
    {
      id: 'network-fundamentals',
      chapterId: 'networks',
      title: 'From cables to switches',
      description:
        'Walk data through the OSI model, inspect physical cables and signals, build Ethernet frames, configure a switch with VLANs, resolve MAC addresses with ARP, and connect regions on a world map.',
      connection:
        'The OSI model is the mental framework every network engineer uses. Once you see how layers 1–2 work, everything above — IP, TCP, HTTP — becomes a logical extension.',
      steps: [
        { id: 'net-osi', title: 'The OSI model', mode: 'observe' },
        { id: 'net-physical', title: 'Physical layer and cabling', mode: 'observe' },
        { id: 'net-ethernet', title: 'Ethernet and MAC addresses', mode: 'build' },
        { id: 'net-switching', title: 'Switching and VLANs', mode: 'build' },
        { id: 'net-arp', title: 'ARP: finding MAC addresses', mode: 'build' },
        { id: 'net-worldmap', title: 'World map lab', mode: 'mixed' },
      ],
    },
    {
      id: 'ip-routing-core',
      chapterId: 'iprouting',
      title: 'Addresses, subnets, and routes',
      description:
        'Break an IPv4 address into network and host, practice subnetting, meet IPv6, read a routing table, add static routes, and watch OSPF build a topology map.',
      connection:
        'IP addressing and routing are what make the internet scale. Every packet crosses routers that make forwarding decisions using exactly the logic you will practice here.',
      steps: [
        { id: 'ip-v4', title: 'IPv4 addressing', mode: 'build' },
        { id: 'ip-subnet', title: 'Subnetting and CIDR', mode: 'build' },
        { id: 'ip-v6', title: 'IPv6 fundamentals', mode: 'observe' },
        { id: 'ip-routing-table', title: 'Routing tables and forwarding', mode: 'observe' },
        { id: 'ip-static', title: 'Static and default routes', mode: 'build' },
        { id: 'ip-ospf', title: 'Dynamic routing with OSPF', mode: 'observe' },
      ],
    },
    {
      id: 'net-services-core',
      chapterId: 'netservices',
      title: 'Protocols, services, and troubleshooting',
      description:
        'See TCP build a reliable connection and UDP skip the overhead, assign well-known ports, watch DHCP hand out addresses, translate private IPs with NAT, filter traffic with ACLs, tunnel through a VPN, and diagnose problems with ping and traceroute.',
      connection:
        'These protocols and tools are the daily vocabulary of a network engineer. Every web request, DNS lookup, and VPN tunnel depends on the concepts in this chapter.',
      steps: [
        { id: 'ns-tcp', title: 'TCP and the three-way handshake', mode: 'observe' },
        { id: 'ns-udp', title: 'UDP and when to use it', mode: 'mixed' },
        { id: 'ns-ports', title: 'Ports and sockets', mode: 'build' },
        { id: 'ns-dhcp', title: 'DHCP address assignment', mode: 'observe' },
        { id: 'ns-nat', title: 'NAT and PAT', mode: 'build' },
        { id: 'ns-wireless', title: 'Wireless networking', mode: 'observe' },
        { id: 'ns-acl', title: 'ACLs and firewalls', mode: 'build' },
        { id: 'ns-troubleshoot', title: 'Network troubleshooting', mode: 'build' },
      ],
    },
    {
      id: 'llm-intuition',
      chapterId: 'ai',
      title: 'Transformer intuition',
      description:
        'See tokens pay attention to each other, then compare long training runs with a quick answer pass. The goal is intuition, not a substitute for coursework.',
      connection:
        'Courses in statistical learning spend weeks on loss and gradients. You get a visual anchor first so those symbols have somewhere to land.',
      steps: [
        { id: 'llm-attention', title: 'Attention', mode: 'observe' },
        { id: 'llm-train-inf', title: 'Train and infer', mode: 'observe' },
      ],
    },
    {
      id: 'memory-hierarchy',
      chapterId: 'memory',
      title: 'From registers to disk',
      description:
        'Build intuition for where data lives and why each storage tier exists. You will load values into registers, watch a cache fill and evict, tour the full hierarchy, practice LRU replacement, step through virtual address translation, and finally place process pages into physical frames.',
      connection:
        'Cache misses and page faults are the hidden cost in almost every performance problem. Once you can visualize the hierarchy, profiler output starts to make sense.',
      steps: [
        { id: 'mem-register', title: 'Registers and the ALU', mode: 'build' },
        { id: 'mem-cache', title: 'Direct-mapped cache', mode: 'build' },
        { id: 'mem-ram', title: 'The memory hierarchy', mode: 'observe' },
        { id: 'mem-eviction', title: 'LRU eviction policy', mode: 'build' },
        { id: 'mem-virtual', title: 'Virtual memory and the MMU', mode: 'observe' },
        { id: 'mem-paging', title: 'Paging and the TLB', mode: 'build' },
      ],
    },
    {
      id: 'os-core',
      chapterId: 'os',
      title: 'Processes, scheduling, and the kernel',
      description:
        'Walk through the seven core concepts every OS textbook covers: process state machines, CPU schedulers, filesystems and inodes, the user–kernel boundary via system calls, threads sharing memory, mutexes preventing races, and the four conditions that cause deadlock.',
      connection:
        'Every program you write runs inside an OS. Understanding what the OS is doing on your behalf — and what it costs — changes how you write programs that perform well under load.',
      steps: [
        { id: 'os-process', title: 'Processes and state', mode: 'build' },
        { id: 'os-scheduler', title: 'CPU scheduling', mode: 'build' },
        { id: 'os-filesystem', title: 'Files and inodes', mode: 'build' },
        { id: 'os-syscall', title: 'System calls', mode: 'observe' },
        { id: 'os-threads', title: 'Threads and race conditions', mode: 'build' },
        { id: 'os-mutex', title: 'Mutexes and locking', mode: 'build' },
        { id: 'os-deadlock', title: 'Deadlock conditions', mode: 'observe' },
      ],
    },
    {
      id: 'web-stack',
      chapterId: 'web',
      title: 'URL to painted pixel',
      description:
        'Trace a single browser request through every layer of the web: DNS turns a name into an address, HTTP carries the request and response, TLS keeps it private, and the browser renders the result into what you see.',
      connection:
        'Web frameworks hide all four of these layers. But when something breaks — slow first load, certificate error, layout shift — you need to know which layer to look at.',
      steps: [
        { id: 'web-dns', title: 'DNS resolution', mode: 'observe' },
        { id: 'web-http', title: 'HTTP request-response', mode: 'build' },
        { id: 'web-tls', title: 'TLS handshake', mode: 'observe' },
        { id: 'web-render', title: 'Browser rendering pipeline', mode: 'observe' },
      ],
    },
    {
      id: 'compilers-core',
      chapterId: 'compilers',
      title: 'Source text to machine instructions',
      description:
        'Take a tiny program through every stage a real compiler runs: scan characters into tokens, parse tokens against grammar rules, build an AST, generate target instructions, then apply optimization passes to make them faster.',
      connection:
        'Every language feature — closures, generics, tail-call optimization — is an engineering decision made at one of these pipeline stages. Knowing the pipeline makes you a better reader of error messages and a better designer of APIs.',
      steps: [
        { id: 'comp-source', title: 'Source code and characters', mode: 'observe' },
        { id: 'comp-lex', title: 'Lexing into tokens', mode: 'build' },
        { id: 'comp-parse', title: 'Parsing grammar', mode: 'observe' },
        { id: 'comp-ast', title: 'Abstract syntax tree', mode: 'build' },
        { id: 'comp-codegen', title: 'Code generation', mode: 'observe' },
        { id: 'comp-optimize', title: 'Optimization passes', mode: 'mixed' },
      ],
    },
    {
      id: 'math-foundations',
      chapterId: 'mathcs',
      title: 'The math that makes CS rigorous',
      description:
        'Seven visual stops through the mathematics that underpins all of computing: propositional logic for conditions, proof techniques for correctness, sets for data relationships, counting for complexity, modular arithmetic for cryptography, probability for ML, and linear algebra for transformations.',
      connection:
        'Every algorithm analysis, every cryptographic claim, every ML paper assumes you know this math. This lesson does not replace a course — it gives you the picture that makes the course stick.',
      steps: [
        { id: 'math-logic', title: 'Propositional logic', mode: 'build' },
        { id: 'math-proof', title: 'Proof techniques', mode: 'observe' },
        { id: 'math-sets', title: 'Sets and relations', mode: 'build' },
        { id: 'math-counting', title: 'Counting and combinatorics', mode: 'mixed' },
        { id: 'math-modular', title: 'Modular arithmetic', mode: 'build' },
        { id: 'math-prob', title: 'Probability basics', mode: 'mixed' },
        { id: 'math-linalg', title: 'Linear algebra intuition', mode: 'observe' },
      ],
    },
    {
      id: 'dsa-core',
      chapterId: 'dsa',
      title: 'Every structure and algorithm you need to know',
      description:
        'A complete visual tour from the simplest array to the halting problem. Build and query every major data structure, watch every classic algorithm run step by step, and develop the complexity intuition that makes technical decisions defensible.',
      connection:
        'Data structures and algorithms are the shared vocabulary of software engineering. Every technical interview, every performance review, every architecture discussion assumes fluency here. This lesson builds that fluency visually before you write a line of code.',
      steps: [
        { id: 'dsa-array-list', title: 'Arrays and linked lists', mode: 'build' },
        { id: 'dsa-tree', title: 'Binary search trees', mode: 'build' },
        { id: 'dsa-hash', title: 'Hash tables', mode: 'build' },
        { id: 'dsa-sorting', title: 'Sorting algorithms', mode: 'observe' },
        { id: 'dsa-graph', title: 'Graphs and traversal', mode: 'build' },
        { id: 'dsa-heap', title: 'Heaps and priority queues', mode: 'build' },
        { id: 'dsa-avl', title: 'Balanced trees (AVL)', mode: 'observe' },
        { id: 'dsa-trie', title: 'Tries and prefix search', mode: 'build' },
        { id: 'dsa-union-find', title: 'Union-Find', mode: 'build' },
        { id: 'dsa-greedy', title: 'Greedy algorithms', mode: 'mixed' },
        { id: 'dsa-dijkstra', title: "Dijkstra's shortest path", mode: 'observe' },
        { id: 'dsa-dp-intro', title: 'Dynamic programming intro', mode: 'observe' },
        { id: 'dsa-dp-classic', title: 'Classic DP problems', mode: 'build' },
        { id: 'dsa-bigo', title: 'Big-O notation', mode: 'mixed' },
        { id: 'dsa-complexity', title: 'P, NP, and complexity classes', mode: 'observe' },
        { id: 'dsa-halting', title: 'The halting problem', mode: 'observe' },
      ],
    },
    {
      id: 'db-core',
      chapterId: 'databases',
      title: 'How databases store, query, and protect data',
      description:
        'Open the storage engine and find a B-tree. Plan a query, execute a transaction, apply ACID guarantees, add an index and watch queries accelerate, normalize a schema to eliminate anomalies, then compare the consistency tradeoffs in NoSQL systems.',
      connection:
        'Every web application eventually hits a database performance wall or a data integrity bug. Knowing the internals — why indexes help, why transactions are expensive, why NoSQL sacrifices consistency — turns debugging from guesswork into engineering.',
      steps: [
        { id: 'db-btree', title: 'B-tree storage', mode: 'observe' },
        { id: 'db-query', title: 'Query execution', mode: 'build' },
        { id: 'db-transaction', title: 'Transactions', mode: 'build' },
        { id: 'db-acid', title: 'ACID properties', mode: 'mixed' },
        { id: 'db-index', title: 'Indexes', mode: 'build' },
        { id: 'db-normalize', title: 'Normalization', mode: 'mixed' },
        { id: 'db-nosql', title: 'NoSQL tradeoffs', mode: 'observe' },
      ],
    },
    {
      id: 'security-core',
      chapterId: 'security',
      title: 'Cryptographic primitives to secure systems',
      description:
        'Build every layer of modern security from scratch: XOR ciphers and one-time pads, one-way hashing, asymmetric key pairs, digital signatures, a certificate chain, an authentication flow, and the OWASP top vulnerabilities with their defenses.',
      connection:
        'Security is a chain — every link must hold. This lesson shows you each link separately before you see how they connect to form HTTPS, password systems, and code signing.',
      steps: [
        { id: 'sec-xor', title: 'XOR and one-time pads', mode: 'build' },
        { id: 'sec-hash', title: 'Cryptographic hashing', mode: 'build' },
        { id: 'sec-keypair', title: 'Public-key cryptography', mode: 'observe' },
        { id: 'sec-signature', title: 'Digital signatures', mode: 'build' },
        { id: 'sec-pki', title: 'PKI and certificates', mode: 'observe' },
        { id: 'sec-auth', title: 'Authentication flows', mode: 'mixed' },
        { id: 'sec-owasp', title: 'OWASP top vulnerabilities', mode: 'build' },
      ],
    },
    {
      id: 'paradigms-core',
      chapterId: 'paradigms',
      title: 'How languages shape how you think',
      description:
        'Step through six paradigms back to back: imperative control flow, object-oriented design, encapsulation and interfaces, functional transformations, type system guarantees, and memory ownership models. Each one is a different lever for controlling complexity.',
      connection:
        'Most programmers learn one paradigm deeply and treat the others as curiosities. This lesson shows you what each paradigm is protecting you from — which makes it instantly clear when to reach for it.',
      steps: [
        { id: 'par-imperative', title: 'Imperative programming', mode: 'build' },
        { id: 'par-oop', title: 'Object-oriented design', mode: 'build' },
        { id: 'par-encapsulation', title: 'Encapsulation and interfaces', mode: 'mixed' },
        { id: 'par-functional', title: 'Functional programming', mode: 'build' },
        { id: 'par-types', title: 'Type systems', mode: 'observe' },
        { id: 'par-memory', title: 'Memory ownership models', mode: 'observe' },
      ],
    },
    {
      id: 'swe-core',
      chapterId: 'swe',
      title: 'The craft of building software that lasts',
      description:
        'Seven practices every professional team relies on: Git for collaborative history, testing strategies, test-driven development, SOLID design principles, classic patterns, CI/CD pipelines that deploy with confidence, and a systematic debugging methodology.',
      connection:
        'Solo projects can survive without these practices. Team projects at scale cannot. Each technique here is a solution to a real failure mode — a bug that escaped, a merge conflict that caused an outage, a design that could not be changed.',
      steps: [
        { id: 'swe-git', title: 'Version control with Git', mode: 'build' },
        { id: 'swe-test', title: 'Testing strategies', mode: 'mixed' },
        { id: 'swe-tdd', title: 'Test-driven development', mode: 'build' },
        { id: 'swe-solid', title: 'SOLID principles', mode: 'observe' },
        { id: 'swe-patterns', title: 'Design patterns', mode: 'mixed' },
        { id: 'swe-cicd', title: 'CI/CD pipelines', mode: 'observe' },
        { id: 'swe-debug', title: 'Debugging methodology', mode: 'build' },
      ],
    },
    {
      id: 'distributed-core',
      chapterId: 'distributed',
      title: 'Systems that span many machines',
      description:
        'Eight concepts that govern how distributed systems behave: replication for durability, consensus for agreement, CAP for understanding consistency tradeoffs, load balancing for scale, MapReduce for large data, sharding for horizontal growth, queues for decoupling, and observability for debugging in production.',
      connection:
        'Once your system spans more than one process, everything changes: clocks drift, networks drop packets, and partial failure is the normal state. These eight concepts are the vocabulary every distributed systems engineer uses to reason about those failures.',
      steps: [
        { id: 'dist-replication', title: 'Data replication', mode: 'observe' },
        { id: 'dist-consensus', title: 'Consensus algorithms', mode: 'observe' },
        { id: 'dist-cap', title: 'CAP theorem', mode: 'mixed' },
        { id: 'dist-loadbalance', title: 'Load balancing', mode: 'build' },
        { id: 'dist-mapreduce', title: 'MapReduce', mode: 'observe' },
        { id: 'dist-sharding', title: 'Sharding', mode: 'build' },
        { id: 'dist-queue', title: 'Message queues', mode: 'build' },
        { id: 'dist-observe', title: 'Observability', mode: 'mixed' },
      ],
    },
    {
      id: 'cloud-foundations-core',
      chapterId: 'cloud-foundations',
      title: 'What “the cloud” adds on top of the network',
      description:
        'Separate hype from architecture: shared responsibility, geography of regions and availability zones, service models from raw VMs to managed software, isolation between tenants, and why elasticity changes how you think about capacity.',
      connection:
        'Networks move bits; cloud control planes provision, isolate, and bill for resources. This lesson names the contracts and boundaries every production system inherits.',
      steps: [
        { id: 'cfound-shared', title: 'Shared responsibility', mode: 'observe' },
        { id: 'cfound-regions', title: 'Regions and zones', mode: 'observe' },
        { id: 'cfound-models', title: 'IaaS, PaaS, and SaaS', mode: 'mixed' },
        { id: 'cfound-tenant', title: 'Multi-tenancy and isolation', mode: 'observe' },
        { id: 'cfound-elastic', title: 'Elasticity and operational shift', mode: 'mixed' },
      ],
    },
    {
      id: 'cloud-identity-core',
      chapterId: 'cloud-identity',
      title: 'Who is allowed to do what',
      description:
        'Represent every actor as a principal, attach least-privilege policies, prefer short-lived credentials and roles over static keys, sketch federation, and treat secrets as high-risk state.',
      connection:
        'Identity is the real perimeter in the cloud. The rest of security is detail on top of “who can call which API on what resource.”',
      steps: [
        { id: 'cident-subjects', title: 'Principals and resources', mode: 'observe' },
        { id: 'cident-roles', title: 'Roles and delegation', mode: 'build' },
        { id: 'cident-policies', title: 'Policies as code', mode: 'build' },
        { id: 'cident-federation', title: 'Federation and trust', mode: 'observe' },
        { id: 'cident-secrets', title: 'Secrets and rotation', mode: 'mixed' },
      ],
    },
    {
      id: 'cloud-networking-core',
      chapterId: 'cloud-networking',
      title: 'Software-defined boundaries',
      description:
        'Draw a private network in software, subnet it for blast radius, route traffic intentionally, load-balance with health checks, terminate TLS at the edge, and segment traffic with policy as code.',
      connection:
        'This is the same routing and TLS story you already know — expressed as APIs and quotas instead of a rack of routers.',
      steps: [
        { id: 'cnet-vpc', title: 'Virtual private networks', mode: 'observe' },
        { id: 'cnet-subnets', title: 'Subnets and routing intent', mode: 'build' },
        { id: 'cnet-lb', title: 'Load balancing and health', mode: 'observe' },
        { id: 'cnet-edge', title: 'Ingress and TLS termination', mode: 'mixed' },
        { id: 'cnet-segment', title: 'Segmentation and policy', mode: 'build' },
      ],
    },
    {
      id: 'cloud-production-core',
      chapterId: 'cloud-production',
      title: 'Running workloads for real',
      description:
        'Pick compute models for the job, align storage to durability and cost, observe the three pillars, scale with limits in mind, and design for failure across zones and backups.',
      connection:
        'Production is where abstractions meet money: every choice here shows up in latency, bills, and incident reports.',
      steps: [
        { id: 'cprod-compute', title: 'Compute models compared', mode: 'mixed' },
        { id: 'cprod-storage', title: 'Storage classes and services', mode: 'observe' },
        { id: 'cprod-observe', title: 'Logs, metrics, traces', mode: 'observe' },
        { id: 'cprod-scale', title: 'Scaling and quotas', mode: 'build' },
        { id: 'cprod-resilience', title: 'Failure domains and recovery', mode: 'mixed' },
      ],
    },
    {
      id: 'ethics-core',
      chapterId: 'ethics',
      title: 'Engineering at the scale of human lives',
      description:
        'Seven ethical dimensions of computing: what scale does to decisions, how bias enters algorithmic systems, what privacy means as an engineering constraint, the special challenges of AI safety, accountability in complex systems, open-source stewardship, and the ACM Code of Ethics as a practical checklist.',
      connection:
        'Technical decisions are ethical decisions. A database schema determines who can audit whom. An ML training set determines who the system works well for. This chapter gives you the vocabulary to name those consequences before you ship.',
      steps: [
        { id: 'eth-scale', title: 'Impact at scale', mode: 'observe' },
        { id: 'eth-bias', title: 'Algorithmic bias', mode: 'mixed' },
        { id: 'eth-privacy', title: 'Privacy and data rights', mode: 'build' },
        { id: 'eth-ai-safety', title: 'AI safety', mode: 'observe' },
        { id: 'eth-accountability', title: 'Accountability', mode: 'mixed' },
        { id: 'eth-open-source', title: 'Open-source stewardship', mode: 'observe' },
        { id: 'eth-acm', title: 'ACM Code of Ethics', mode: 'build' },
      ],
    },
  ],
}
