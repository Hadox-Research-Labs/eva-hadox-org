# Research Methodology

## Purpose

This project is not only a web application. It is an interdisciplinary research instrument for studying the historical formation of breast cancer as an object of description, classification, treatment, and public meaning before 1900.

The platform is designed for work at the intersection of:

- history of medicine;
- philosophy of language and concepts;
- digital humanities;
- corpus-based computational analysis.

## Research Problem

The project investigates how breast cancer became legible across historical sources through changing vocabularies, classifications, symptoms, institutional practices, and material conditions of record production.

The central research problem is not simply whether a phrase appears in a document. It is how disease language is historically stabilized and transformed across:

- diagnostic naming;
- symptom description;
- surgical reasoning;
- gendered embodiment;
- archival mediation;
- economic and institutional context.

## Main Research Questions

The platform is suited to questions such as:

1. How was breast cancer named before modern standardization?
2. Which symptom clusters and descriptive vocabularies recur across periods and source types?
3. How do medical, surgical, domestic, journalistic, and archival sources differ in the way they render the disease?
4. How do categories such as `scirrhus`, ulceration, induration, puerperal conditions, and operative intervention shift over time?
5. What do these textual patterns reveal about historical regimes of observation, authority, and classification?
6. How can computational corpus methods assist interpretation without replacing close historical reading?

## Interdisciplinary Method

The project uses a layered mixed-methods design.

### 1. Historical Method

The historical component focuses on:

- source criticism;
- provenance and archival context;
- chronology;
- genre differences between source types;
- institutional and social setting of publication;
- interpretation of historical actors, concepts, and practices in context.

In practice, this means the platform treats documents not as isolated strings but as historically situated artifacts with metadata, source type, and research notes.

### 2. Philosophical Method

The philosophical component focuses on:

- conceptual history;
- philosophy of classification;
- epistemology of evidence;
- the relation between words, symptoms, and disease entities;
- how categories become naturalized or contested over time.

This matters because a historical disease label is not assumed to be equivalent to a modern stable biomedical category. The platform therefore supports lexicon curation, variant tracking, and notes on why terms matter methodologically.

### 3. Computational Method

The computational component focuses on:

- corpus ingestion and normalization;
- lexical matching over curated canonical terms and variants;
- co-occurrence analysis within local textual chunks;
- temporal aggregation;
- contextual similarity via TF-IDF vectors;
- visual exploration of relations among terms, documents, and time slices.

These methods help scale exploration and comparison, but they are not treated as self-sufficient explanations.

## Methodological Principle

The core principle is:

computational detection supports interpretation, but does not substitute for historical judgment.

That principle is reflected in the current architecture:

- curated lexicon first;
- exact or phrase-level matching second;
- contextual comparison as an exploratory layer;
- editorial notes and metadata retained alongside computational output.

## Current Analytical Layers

### Curated Lexicon

Researchers define canonical terms and historical variants.

This layer corresponds to explicit interpretive judgment. It is the project’s most controlled and accountable analytical layer.

### Heuristic Mention Detection

The platform detects exact and phrase-level matches for canonical terms and variants across the corpus.

This supports:

- locating candidate evidence;
- counting distributions;
- comparing source types and decades;
- tracing vocabulary recurrence.

### Co-occurrence Analysis

Terms found within the same textual chunk are analyzed together.

This helps identify:

- recurring symptom constellations;
- treatment-description clusters;
- recurring associations between pathology and intervention.

### Contextual Similarity

The current similarity layer uses TF-IDF chunk vectors and cosine similarity.

Methodologically, this is an exploratory retrieval layer, not a claim of semantic identity. It helps surface passages that share nearby distributions of vocabulary, even when they do not repeat exactly the same phrase.

## Source Criticism In The Platform

The platform embeds source criticism through its data model:

- place;
- year;
- language;
- source host;
- record type;
- contributor information;
- notes and summary;
- prospecting versus curated corpus distinction.

This matters because historical meaning depends on where, when, and by whom a document was produced and preserved.

## Why This Is History, Philosophy, And Computer Science

### History

The project reconstructs change over time in disease language and practice using contextualized primary sources.

### Philosophy

The project examines how disease categories are constituted through naming, description, observation, and institutional judgment.

### Computer Science

The project implements formal procedures for corpus management, text normalization, mention detection, contextual comparison, and interface design for exploratory analysis.

The project is strongest when those three dimensions remain connected rather than being treated as separate tracks.

## Limits Of Inference

The platform can support discovery, comparison, and structured interpretation, but it cannot by itself determine:

- whether a historical term maps exactly onto a modern diagnosis;
- whether frequency equals importance;
- whether textual proximity implies causal or conceptual equivalence;
- whether OCR output preserves source meaning faithfully.

These limits should always be stated in research outputs derived from the platform.

## Validity Considerations

The project’s validity depends on multiple layers:

### Corpus Validity

- representativeness of sources;
- transparency of inclusion criteria;
- clarity about what is absent or underrepresented.

### Lexical Validity

- quality of canonical terms and variants;
- historical appropriateness of term grouping;
- explicit treatment of spelling, translation, and period usage.

### Computational Validity

- correct implementation of matching and vectorization;
- awareness of OCR noise;
- awareness that chunk size and overlap shape results.

### Interpretive Validity

- disciplined contextual reading;
- explicit claims and uncertainty;
- refusal to confuse retrieval output with final historical explanation.

## Research Workflow Supported By The Platform

A sound workflow for this platform is:

1. formulate a historical or conceptual question;
2. curate or refine the relevant lexicon;
3. inspect detected mentions and co-occurrences;
4. compare patterns across decades, places, and source types;
5. use contextual similarity to locate adjacent passages;
6. return to close reading of the underlying documents;
7. revise categories, notes, and source selection as interpretation improves.

This is iterative by design.

## Reproducibility

The platform improves research reproducibility by making several layers explicit:

- seed corpus data in the repository;
- visible lexicon terms and variants;
- stored document metadata;
- deterministic API-accessible analysis outputs for a given runtime state;
- persistent runtime edits in JSON files.

It does not yet provide full scholarly reproducibility because it still lacks:

- formal dataset versioning for runtime edits;
- audit history for changes;
- fixed release snapshots for corpora;
- test coverage for analytical correctness.

## Ethical And Scholarly Cautions

Researchers using this platform should remain cautious about:

- anachronistic diagnosis;
- over-reading computational proximity as conceptual identity;
- OCR distortions;
- archive access inequalities;
- rights restrictions on source redistribution;
- the asymmetry between institutional records and lived experience.

## Future Methodological Extensions

Promising next steps include:

1. multilingual embeddings with explicit evaluation against historical corpora;
2. entity layers for persons, hospitals, procedures, and places;
3. editorial status workflows for source confidence and curation maturity;
4. provenance and rights metadata integrated at record level;
5. exportable research dossiers with citation-ready evidence trails.

## Recommended Citation Framing

When describing the platform in scholarly or grant contexts, it is most accurate to call it:

- a collaborative historical corpus research platform;
- a digital humanities and computational history instrument;
- an interdisciplinary system for studying the historical language and classification of breast cancer.

It is less accurate to describe it as:

- an AI historian;
- a semantic truth engine;
- a clinical analysis system.
