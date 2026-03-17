const uiCopy = {
  es: {
    localeLabel: 'Idioma',
    projectTitle: 'Plataforma colaborativa para la historia del cáncer de mama',
    projectFocus:
      'Encontrar todos los archivos donde se menciona cáncer de mama y comparar coincidencias entre menciones, contextos y vocabularios.',
    loadingEyebrow: 'Plataforma de investigación',
    loadingTitle: 'Cargando corpus, menciones y vectores contextuales.',
    heroEyebrow: 'Plataforma de investigación científica',
    heroNote:
      'El foco del estudio está fijado en el corpus completo: localizar todos los archivos donde aparece el vocabulario histórico del cáncer de mama, comparar coincidencias entre menciones y dejar trazable qué parte viene de lectura humana, qué parte de reglas simples y qué parte de vectorización contextual.',
    studySectionLabel: 'Perfil del estudio',
    evaName: 'Eva Guadalupe Hernández Avilez',
    evaBioLabel: 'Bio',
    evaBio:
      'Eva Guadalupe Hernández Avilez coordina la lectura visual de textos digitalizados, la ampliación del léxico histórico y la interpretación de hallazgos dentro de este proyecto.',
    purposeLabel: 'Propósito',
    purposeTitle: 'Propósito del estudio',
    purpose:
      'Reconstruir colaborativamente cómo se nombró, describió, trató, reportó y valoró económicamente el cáncer de mama antes de 1900, siguiendo la historia y evolución de las palabras en fuentes médicas, populares y archivísticas.',
    uploadCallout: 'La plataforma ya permite subir documentos y OCR para que Eva y la comunidad amplíen el corpus.',
    jumpToUpload: 'Ir a carga de documentos',
    stats: {
      documentsTotal: 'documentos en corpus',
      documentsWithMentions: 'documentos con menciones',
      totalMentions: 'menciones detectadas',
      configuredTerms: 'términos configurados',
      vectorizedContexts: 'fragmentos vectorizados',
      visibleMentions: 'menciones visibles por filtro',
      prospectedSources: 'fuentes prospectadas',
    },
    band: {
      sectionLabel: 'Marco metodológico',
      title: 'Lo que ya sabemos y cómo se produce',
      text:
        'Ya hay coincidencias detectadas en el corpus semilla: términos, síntomas, cirugía, puerperio y relaciones entre documentos. La plataforma ahora muestra esas coincidencias como estado del corpus y no como una consulta aislada. A la vez, abajo queda una capa de prospección con muchos más documentos localizados, pero todavía no curados.',
      loading: 'actualizando corpus',
      ready: 'corpus sincronizado',
    },
    algorithms: {
      sectionLabel: 'Capas de análisis',
      title: 'Manual, heurístico y vectorial',
      text:
        'La lectura exacta y el léxico curado siguen siendo la base. Encima de eso corren heurísticas de agrupación y una capa vectorial TF-IDF para contextos similares.',
      cards: [
        {
          tier: 'Manual + exacto',
          title: 'Léxico curado por investigación',
          description:
            'Eva y la comunidad agregan términos y variantes históricas. Esta capa equivale a una inspección documental controlada y trazable.',
        },
        {
          tier: 'Heurístico simple',
          title: 'Coincidencias y coocurrencias',
          description:
            'Agrupamos menciones por documento, tramo y década para ver dónde se repiten combinaciones de vocabulario y síntomas.',
        },
        {
          tier: 'Vectorización actual',
          title: 'TF-IDF contextual',
          description:
            'Cada fragmento del corpus se vectoriza para comparar contextos cercanos por distribución de palabras, no solo por coincidencia literal.',
        },
        {
          tier: 'Siguiente capa',
          title: 'Embeddings y alineación semántica',
          description:
            'La siguiente etapa puede sumar embeddings multilingües, entidades históricas y agrupamientos temáticos para corpus más grandes.',
        },
      ],
    },
    controls: {
      sectionLabel: 'Exploración del corpus',
      title: 'Filtrar menciones y coincidencias',
      text:
        'Esta capa no busca una sola palabra. Filtra el conjunto de menciones ya detectadas en todo el corpus para ver dónde se concentra la evidencia.',
      queryLabel: 'Consulta de trabajo',
      queryPlaceholder: 'p. ej. ulcerated breast, surgery, lying-in',
      configuredTerm: 'Término configurado',
      category: 'Categoría histórica',
      sourceType: 'Tipo de fuente',
      reviewStatus: 'Estado editorial',
      all: 'Todos',
      visibleMentions: 'menciones visibles',
      connectedDocuments: 'documentos conectados',
      cooccurrencePairs: 'pares de coocurrencia',
    },
    visuals: {
      timelineTitle: 'Cronología de documentos con menciones',
      timelineSubtitle:
        'Documentos del corpus filtrado contra documentos que efectivamente contienen menciones detectadas.',
      timelineTotalLabel: 'documentos en corpus filtrado',
      timelineMatchedLabel: 'documentos con menciones',
      topTermsTitle: 'Términos más presentes',
      topTermsSubtitle:
        'Las frecuencias salen de todas las menciones visibles bajo los filtros actuales.',
      topTermsMetric:
        'Cada barra indica cuántas veces aparece el término configurado en las menciones filtradas.',
      cooccurrenceTitle: 'Coocurrencias más fuertes',
      cooccurrenceSubtitle: 'Pares de términos que aparecen juntos dentro del mismo fragmento.',
      cooccurrenceMetric:
        'Esto sirve para detectar constelaciones de síntomas, tratamientos o nomenclaturas.',
      summaryLabel: 'Coincidencias ya detectadas',
      summaryTitle: 'Estado actual del corpus',
      sharedFragments: 'fragmentos comparten esta relación.',
      networkTitle: 'Mapa término-obra',
      networkSubtitle:
        'Izquierda: términos históricos. Derecha: obras donde aparecen. El grosor de la línea indica el peso de la relación.',
      networkEmpty: 'Aún no hay suficientes menciones filtradas para dibujar la red.',
      chartHint: 'La gráfica puede desplazarse en pantallas pequeñas.',
      networkHint:
        'Arrastra nodos si quieres reorganizar la lectura. La estructura base ya separa términos y obras.',
    },
    mentions: {
      sectionLabel: 'Menciones detectadas',
      title: 'Pruebas textuales',
      summary:
        'Selecciona una mención para ver su contexto y los fragmentos vectorialmente parecidos.',
      empty:
        'No hay menciones para los filtros actuales. Prueba otra categoría, otro tipo de fuente o agrega nuevos términos al léxico.',
      activeLabel: 'Mención activa',
      noSelection: 'Sin selección',
      noActive: 'No hay una mención activa para mostrar.',
      similarLabel: 'Contextos similares',
      similarTitle: 'Comparación vectorial desde la mención',
      similarNote:
        'Aquí ya no se exige la misma palabra. Se comparan distribuciones de vocabulario en fragmentos cercanos del corpus.',
      comparing: 'Comparando contextos…',
      noNeighbors:
        'Esta mención aún no devuelve vecinos contextuales suficientemente cercanos.',
      evaLabLabel: 'Laboratorio de Eva',
      evaLabTitle: 'Comparar un fragmento marcado manualmente',
      evaLabField: 'Contexto pegado desde OCR o lectura visual',
      evaLabPlaceholder:
        'Pega aquí el fragmento que Eva quiera comparar contra el corpus.',
      evaLabButton: 'Comparar contexto',
      evaLabButtonLoading: 'Comparando…',
    },
    lexicon: {
      sectionLabel: 'Estudio del léxico',
      title: 'Configurar términos y variantes',
      text:
        'Eva puede incorporar nuevas fórmulas históricas a partir de la inspección visual del texto digital. Esos términos entran de inmediato al análisis del corpus.',
      editButton: 'Editar',
      noMethodNote: 'Sin nota metodológica.',
      editTitle: 'Editar término',
      newTitle: 'Agregar término nuevo',
      cancelEdit: 'Cancelar edición',
      canonical: 'Forma canónica',
      category: 'Categoría',
      variants: 'Variantes históricas',
      variantsPlaceholder: 'Una por coma o por línea.',
      notes: 'Nota de investigación',
      notesPlaceholder: 'Por qué este término importa y cómo se usa históricamente.',
      saveNew: 'Agregar término',
      saveEdit: 'Actualizar término',
      saving: 'Guardando…',
    },
    upload: {
      sectionLabel: 'Ingreso de fuentes',
      title: 'Cargar documentos nuevos',
      text:
        'El mismo formulario sirve para Eva y para la comunidad. Se puede subir un archivo escaneado, pegar OCR y dejar metadatos mínimos para que el documento entre al flujo de investigación.',
      fieldTitle: 'Título',
      shortTitle: 'Título corto',
      year: 'Año',
      place: 'Lugar',
      language: 'Idioma',
      recordType: 'Tipo de fuente',
      recordTypePlaceholder: 'manual, prensa, registro médico, revista',
      sourceHost: 'Repositorio o procedencia',
      contributorName: 'Quién carga',
      contributorRole: 'Rol',
      contributorRolePlaceholder: 'Eva, comunidad, archivo',
      file: 'Archivo escaneado o transcrito',
      summary: 'Resumen curado',
      summaryPlaceholder: 'Qué es el documento y por qué importa.',
      notes: 'Notas de catalogación',
      notesPlaceholder: 'Estado del OCR, problemas paleográficos, dudas.',
      ocrText: 'OCR o transcripción en texto',
      ocrPlaceholder: 'Pega aquí el texto digitalizado para que entre directo a análisis.',
      submit: 'Agregar documento al corpus',
      submitting: 'Cargando…',
    },
    connected: {
      sectionLabel: 'Documentos conectados',
      title: 'Archivos con menciones detectadas',
      text:
        'Este listado sirve como reporte operativo de dónde ya apareció el vocabulario histórico dentro del corpus.',
      mentionsSuffix: 'menciones',
    },
    prospecting: {
      sectionLabel: 'Prospección masiva',
      title: 'Fuentes nuevas localizadas para incorporar',
      text:
        'Esta lista no está curada todavía dentro del corpus principal. Son documentos ya rastreados en archivos digitales, listos para priorizar, descargar OCR y pasar al flujo editorial.',
      source: 'fuente',
      remoteOcr: 'ocr remoto',
    },
    messages: {
      stateLoadError: 'No se pudo cargar el estado del corpus.',
      platformLoadError: 'No se pudo cargar la plataforma.',
      refreshError: 'No se pudo actualizar el corpus.',
      termSaveError: 'No se pudo guardar el término.',
      termUpdated: 'Término actualizado en el léxico.',
      termCreated: 'Nuevo término agregado al corpus.',
      documentError: 'No se pudo cargar el documento.',
      documentCreated: 'Documento cargado. Ya forma parte del corpus analizable.',
      contextError: 'No se pudo comparar el contexto.',
      contextCompared: 'Fragmento comparado contra el corpus vectorizado.',
      similarError: 'No se pudieron cargar contextos similares.',
    },
  },
  en: {
    localeLabel: 'Language',
    projectTitle: 'Collaborative platform for the history of breast cancer',
    projectFocus:
      'Find every archive where breast cancer is mentioned and compare matches across mentions, contexts, and vocabularies.',
    loadingEyebrow: 'Research platform',
    loadingTitle: 'Loading corpus, mentions, and contextual vectors.',
    heroEyebrow: 'Scientific research platform',
    heroNote:
      'The study is centered on the full corpus: locating every archive where historical breast-cancer vocabulary appears, comparing matches across mentions, and keeping it explicit which layer comes from human reading, simple rules, or contextual vectorization.',
    studySectionLabel: 'Study profile',
    evaName: 'Eva Guadalupe Hernández Avilez',
    evaBioLabel: 'Bio',
    evaBio:
      'Eva Guadalupe Hernández Avilez coordinates the visual reading of digitized texts, the expansion of the historical lexicon, and the interpretation of findings within this project.',
    purposeLabel: 'Purpose',
    purposeTitle: 'Purpose of the study',
    purpose:
      'Collaboratively reconstruct how breast cancer was named, described, treated, reported, and economically valued before 1900 by tracing the history and evolution of words across medical, popular, and archival sources.',
    uploadCallout:
      'The platform already supports document and OCR uploads so Eva and the wider community can expand the corpus.',
    jumpToUpload: 'Go to document upload',
    stats: {
      documentsTotal: 'documents in corpus',
      documentsWithMentions: 'documents with mentions',
      totalMentions: 'detected mentions',
      configuredTerms: 'configured terms',
      vectorizedContexts: 'vectorized passages',
      visibleMentions: 'visible mentions',
      prospectedSources: 'prospected sources',
    },
    band: {
      sectionLabel: 'Method frame',
      title: 'What we already know and how it is produced',
      text:
        'The seed corpus already contains detected matches for terms, symptoms, surgery, puerperium, and links across documents. The platform now presents those matches as corpus state rather than a single isolated query, while a separate prospecting layer keeps many more located documents ready for curation.',
      loading: 'updating corpus',
      ready: 'corpus synced',
    },
    algorithms: {
      sectionLabel: 'Analysis layers',
      title: 'Manual, heuristic, and vector',
      text:
        'Exact reading and the curated lexicon remain the base. On top of that sit grouping heuristics and a TF-IDF vector layer for similar contexts.',
      cards: [
        {
          tier: 'Manual + exact',
          title: 'Curated research lexicon',
          description:
            'Eva and the community add historical terms and variants. This layer is equivalent to controlled and traceable document inspection.',
        },
        {
          tier: 'Simple heuristic',
          title: 'Matches and co-occurrences',
          description:
            'Mentions are grouped by document, passage, and decade to show repeated vocabulary and symptom combinations.',
        },
        {
          tier: 'Current vectorization',
          title: 'Contextual TF-IDF',
          description:
            'Each passage is vectorized to compare nearby contexts by word distribution, not only by literal match.',
        },
        {
          tier: 'Next layer',
          title: 'Embeddings and semantic alignment',
          description:
            'The next stage can add multilingual embeddings, historical entities, and topic groupings for larger corpora.',
        },
      ],
    },
    controls: {
      sectionLabel: 'Corpus exploration',
      title: 'Filter mentions and matches',
      text:
        'This layer does not search for a single word. It filters the set of mentions already detected across the full corpus.',
      queryLabel: 'Working query',
      queryPlaceholder: 'e.g. ulcerated breast, surgery, lying-in',
      configuredTerm: 'Configured term',
      category: 'Historical category',
      sourceType: 'Source type',
      reviewStatus: 'Editorial status',
      all: 'All',
      visibleMentions: 'visible mentions',
      connectedDocuments: 'connected documents',
      cooccurrencePairs: 'co-occurrence pairs',
    },
    visuals: {
      timelineTitle: 'Timeline of documents with mentions',
      timelineSubtitle:
        'Documents in the filtered corpus against documents that actually contain detected mentions.',
      timelineTotalLabel: 'documents in filtered corpus',
      timelineMatchedLabel: 'documents with mentions',
      topTermsTitle: 'Most present terms',
      topTermsSubtitle:
        'Frequencies come from every visible mention under the current filters.',
      topTermsMetric:
        'Each bar shows how often the configured term appears in filtered mentions.',
      cooccurrenceTitle: 'Strongest co-occurrences',
      cooccurrenceSubtitle: 'Term pairs that appear together inside the same passage.',
      cooccurrenceMetric:
        'This helps detect constellations of symptoms, treatments, or nomenclatures.',
      summaryLabel: 'Matches already detected',
      summaryTitle: 'Current corpus state',
      sharedFragments: 'passages share this relation.',
      networkTitle: 'Term-to-work map',
      networkSubtitle:
        'Left: historical terms. Right: works where they appear. Line weight marks relation strength.',
      networkEmpty: 'There are not yet enough filtered mentions to draw the map.',
      chartHint: 'The chart can be dragged on smaller screens.',
      networkHint:
        'Drag nodes if you want to reorganize the reading. The base layout already separates terms and works.',
    },
    mentions: {
      sectionLabel: 'Detected mentions',
      title: 'Textual evidence',
      summary:
        'Select a mention to inspect its context and vectorially similar passages.',
      empty:
        'There are no mentions for the current filters. Try another category or add new terms to the lexicon.',
      activeLabel: 'Active mention',
      noSelection: 'No selection',
      noActive: 'There is no active mention to display.',
      similarLabel: 'Similar contexts',
      similarTitle: 'Vector comparison from the mention',
      similarNote:
        'This layer no longer requires the exact same word. It compares word distributions across nearby corpus passages.',
      comparing: 'Comparing contexts…',
      noNeighbors: 'This mention does not yet return sufficiently close contextual neighbors.',
      evaLabLabel: 'Eva lab',
      evaLabTitle: 'Compare a manually marked passage',
      evaLabField: 'Context pasted from OCR or visual reading',
      evaLabPlaceholder: 'Paste here the passage Eva wants to compare against the corpus.',
      evaLabButton: 'Compare context',
      evaLabButtonLoading: 'Comparing…',
    },
    lexicon: {
      sectionLabel: 'Lexicon study',
      title: 'Configure terms and variants',
      text:
        'Eva can add new historical formulas from visual inspection of digitized text. Those terms enter the corpus analysis immediately.',
      editButton: 'Edit',
      noMethodNote: 'No methodological note.',
      editTitle: 'Edit term',
      newTitle: 'Add new term',
      cancelEdit: 'Cancel edit',
      canonical: 'Canonical form',
      category: 'Category',
      variants: 'Historical variants',
      variantsPlaceholder: 'One per comma or one per line.',
      notes: 'Research note',
      notesPlaceholder: 'Why this term matters and how it is used historically.',
      saveNew: 'Add term',
      saveEdit: 'Update term',
      saving: 'Saving…',
    },
    upload: {
      sectionLabel: 'Source intake',
      title: 'Upload new documents',
      text:
        'The same form works for Eva and for the community. You can upload a scanned file, paste OCR, and leave minimum metadata so the document enters the research workflow.',
      fieldTitle: 'Title',
      shortTitle: 'Short title',
      year: 'Year',
      place: 'Place',
      language: 'Language',
      recordType: 'Source type',
      recordTypePlaceholder: 'manual, press, medical register, magazine',
      sourceHost: 'Repository or provenance',
      contributorName: 'Uploaded by',
      contributorRole: 'Role',
      contributorRolePlaceholder: 'Eva, community, archive',
      file: 'Scanned or transcribed file',
      summary: 'Curated summary',
      summaryPlaceholder: 'What the document is and why it matters.',
      notes: 'Cataloguing notes',
      notesPlaceholder: 'OCR quality, paleographic issues, doubts.',
      ocrText: 'OCR or plain-text transcription',
      ocrPlaceholder: 'Paste the digitized text here so it enters analysis directly.',
      submit: 'Add document to corpus',
      submitting: 'Uploading…',
    },
    connected: {
      sectionLabel: 'Connected documents',
      title: 'Archives with detected mentions',
      text:
        'This list works as an operational report of where historical vocabulary has already appeared inside the corpus.',
      mentionsSuffix: 'mentions',
    },
    prospecting: {
      sectionLabel: 'Mass prospecting',
      title: 'Newly located sources to incorporate',
      text:
        'This list is not yet curated inside the main corpus. These documents have already been located in digital archives and are ready to be prioritized, downloaded, and moved into the editorial workflow.',
      source: 'source',
      remoteOcr: 'remote OCR',
    },
    messages: {
      stateLoadError: 'Could not load corpus state.',
      platformLoadError: 'Could not load the platform.',
      refreshError: 'Could not refresh the corpus.',
      termSaveError: 'Could not save the term.',
      termUpdated: 'Term updated in the lexicon.',
      termCreated: 'New term added to the corpus.',
      documentError: 'Could not upload the document.',
      documentCreated: 'Document uploaded. It is now part of the analyzable corpus.',
      contextError: 'Could not compare the context.',
      contextCompared: 'Passage compared against the vectorized corpus.',
      similarError: 'Could not load similar contexts.',
    },
  },
  fr: {
    localeLabel: 'Langue',
    projectTitle: 'Plateforme collaborative pour l’histoire du cancer du sein',
    projectFocus:
      'Repérer toutes les archives où le cancer du sein est mentionné et comparer les concordances entre mentions, contextes et vocabulaires.',
    loadingEyebrow: 'Plateforme de recherche',
    loadingTitle: 'Chargement du corpus, des mentions et des vecteurs contextuels.',
    heroEyebrow: 'Plateforme de recherche scientifique',
    heroNote:
      'L’etude est centree sur l’ensemble du corpus: localiser toutes les archives ou apparait le vocabulaire historique du cancer du sein, comparer les concordances entre mentions, et rendre explicite ce qui vient de la lecture humaine, des regles simples ou de la vectorisation contextuelle.',
    studySectionLabel: 'Profil de l’etude',
    evaName: 'Eva Guadalupe Hernández Avilez',
    evaBioLabel: 'Bio',
    evaBio:
      'Eva Guadalupe Hernández Avilez coordonne la lecture visuelle des textes numerises, l’extension du lexique historique et l’interpretation des resultats dans ce projet.',
    purposeLabel: 'But',
    purposeTitle: 'But de l’etude',
    purpose:
      'Reconstruire de maniere collaborative la facon dont le cancer du sein a ete nomme, decrit, traite, signale et valorise economiquement avant 1900, en suivant l’histoire et l’evolution des mots dans les sources medicales, populaires et archivistiques.',
    uploadCallout:
      'La plateforme permet deja de televerser des documents et de l’OCR afin qu’Eva et la communaute puissent elargir le corpus.',
    jumpToUpload: 'Aller au televersement',
    stats: {
      documentsTotal: 'documents dans le corpus',
      documentsWithMentions: 'documents avec mentions',
      totalMentions: 'mentions detectees',
      configuredTerms: 'termes configures',
      vectorizedContexts: 'passages vectorises',
      visibleMentions: 'mentions visibles',
      prospectedSources: 'sources reperees',
    },
    band: {
      sectionLabel: 'Cadre methodologique',
      title: 'Ce que nous savons deja et comment cela se produit',
      text:
        'Le corpus de depart contient deja des concordances detectees pour les termes, les symptomes, la chirurgie, le puerperium et les relations entre documents. La plateforme presente desormais ces concordances comme un etat du corpus plutot qu’une recherche isolee, avec une couche distincte de prospection pour les documents supplementaires.',
      loading: 'mise a jour du corpus',
      ready: 'corpus synchronise',
    },
    algorithms: {
      sectionLabel: 'Couches d’analyse',
      title: 'Manuel, heuristique et vectoriel',
      text:
        'La lecture exacte et le lexique cure restent la base. Par-dessus s’ajoutent des heuristiques de regroupement et une couche vectorielle TF-IDF.',
      cards: [
        {
          tier: 'Manuel + exact',
          title: 'Lexique cure par la recherche',
          description:
            'Eva et la communaute ajoutent des termes et variantes historiques. Cette couche equivaut a une inspection documentaire controlee et tracable.',
        },
        {
          tier: 'Heuristique simple',
          title: 'Concordances et cooccurrences',
          description:
            'Les mentions sont regroupees par document, passage et decennie pour voir les combinaisons recurrentes.',
        },
        {
          tier: 'Vectorisation actuelle',
          title: 'TF-IDF contextuel',
          description:
            'Chaque passage est vectorise afin de comparer des contextes proches par distribution de mots et non seulement par coincidence litterale.',
        },
        {
          tier: 'Couche suivante',
          title: 'Embeddings et alignement semantique',
          description:
            'L’etape suivante peut ajouter des embeddings multilingues, des entites historiques et des regroupements thematiques.',
        },
      ],
    },
    controls: {
      sectionLabel: 'Exploration du corpus',
      title: 'Filtrer les mentions et les concordances',
      text:
        'Cette couche ne cherche pas un seul mot. Elle filtre l’ensemble des mentions deja detectees dans tout le corpus.',
      queryLabel: 'Requete de travail',
      queryPlaceholder: 'par ex. ulcerated breast, surgery, lying-in',
      configuredTerm: 'Terme configure',
      category: 'Categorie historique',
      sourceType: 'Type de source',
      reviewStatus: 'Statut editorial',
      all: 'Tous',
      visibleMentions: 'mentions visibles',
      connectedDocuments: 'documents connectes',
      cooccurrencePairs: 'paires de cooccurrence',
    },
    visuals: {
      timelineTitle: 'Chronologie des documents avec mentions',
      timelineSubtitle:
        'Documents du corpus filtre contre documents qui contiennent effectivement des mentions detectees.',
      timelineTotalLabel: 'documents du corpus filtre',
      timelineMatchedLabel: 'documents avec mentions',
      topTermsTitle: 'Termes les plus presents',
      topTermsSubtitle:
        'Les frequences proviennent de toutes les mentions visibles sous les filtres actuels.',
      topTermsMetric:
        'Chaque barre indique combien de fois le terme configure apparait dans les mentions filtrees.',
      cooccurrenceTitle: 'Cooccurrences les plus fortes',
      cooccurrenceSubtitle: 'Paires de termes apparaissant dans le meme passage.',
      cooccurrenceMetric:
        'Cela aide a detecter des constellations de symptomes, de traitements ou de nomenclatures.',
      summaryLabel: 'Concordances deja detectees',
      summaryTitle: 'Etat actuel du corpus',
      sharedFragments: 'passages partagent cette relation.',
      networkTitle: 'Carte terme-oeuvre',
      networkSubtitle:
        'A gauche: termes historiques. A droite: oeuvres ou ils apparaissent. L’epaisseur de la ligne indique le poids de la relation.',
      networkEmpty: 'Il n’y a pas encore assez de mentions filtrees pour dessiner la carte.',
      chartHint: 'Le graphique peut etre deplace sur les petits ecrans.',
      networkHint:
        'Faites glisser les noeuds si vous voulez reorganiser la lecture. La base separe deja termes et oeuvres.',
    },
    mentions: {
      sectionLabel: 'Mentions detectees',
      title: 'Preuves textuelles',
      summary:
        'Selectionnez une mention pour inspecter son contexte et les passages vectoriellement proches.',
      empty:
        'Aucune mention pour les filtres actuels. Essayez une autre categorie ou ajoutez de nouveaux termes au lexique.',
      activeLabel: 'Mention active',
      noSelection: 'Aucune selection',
      noActive: 'Aucune mention active a afficher.',
      similarLabel: 'Contextes similaires',
      similarTitle: 'Comparaison vectorielle a partir de la mention',
      similarNote:
        'Ici, le meme mot n’est plus obligatoire. On compare des distributions de vocabulaire entre passages voisins.',
      comparing: 'Comparaison des contextes…',
      noNeighbors: 'Cette mention ne renvoie pas encore de voisins suffisamment proches.',
      evaLabLabel: 'Laboratoire d’Eva',
      evaLabTitle: 'Comparer un passage marque manuellement',
      evaLabField: 'Contexte colle depuis l’OCR ou la lecture visuelle',
      evaLabPlaceholder:
        'Collez ici le passage qu’Eva souhaite comparer au corpus.',
      evaLabButton: 'Comparer le contexte',
      evaLabButtonLoading: 'Comparaison…',
    },
    lexicon: {
      sectionLabel: 'Etude du lexique',
      title: 'Configurer les termes et variantes',
      text:
        'Eva peut ajouter de nouvelles formules historiques a partir de l’inspection visuelle du texte numerise. Ces termes entrent immediatement dans l’analyse.',
      editButton: 'Modifier',
      noMethodNote: 'Sans note methodologique.',
      editTitle: 'Modifier le terme',
      newTitle: 'Ajouter un terme',
      cancelEdit: 'Annuler',
      canonical: 'Forme canonique',
      category: 'Categorie',
      variants: 'Variantes historiques',
      variantsPlaceholder: 'Une par virgule ou une par ligne.',
      notes: 'Note de recherche',
      notesPlaceholder: 'Pourquoi ce terme compte et comment il est utilise historiquement.',
      saveNew: 'Ajouter le terme',
      saveEdit: 'Mettre a jour le terme',
      saving: 'Enregistrement…',
    },
    upload: {
      sectionLabel: 'Entree des sources',
      title: 'Televerser de nouveaux documents',
      text:
        'Le meme formulaire sert a Eva et a la communaute. Il est possible d’envoyer un fichier numerise, de coller de l’OCR et de laisser des metadonnees minimales.',
      fieldTitle: 'Titre',
      shortTitle: 'Titre court',
      year: 'Annee',
      place: 'Lieu',
      language: 'Langue',
      recordType: 'Type de source',
      recordTypePlaceholder: 'manuel, presse, registre medical, revue',
      sourceHost: 'Depot ou provenance',
      contributorName: 'Depose par',
      contributorRole: 'Role',
      contributorRolePlaceholder: 'Eva, communaute, archive',
      file: 'Fichier numerise ou transcrit',
      summary: 'Resume cure',
      summaryPlaceholder: 'Ce qu’est le document et pourquoi il compte.',
      notes: 'Notes de catalogage',
      notesPlaceholder: 'Qualite OCR, problemes paleographiques, doutes.',
      ocrText: 'OCR ou transcription en texte',
      ocrPlaceholder: 'Collez ici le texte numerise pour l’ajouter directement a l’analyse.',
      submit: 'Ajouter le document au corpus',
      submitting: 'Televersement…',
    },
    connected: {
      sectionLabel: 'Documents connectes',
      title: 'Archives avec mentions detectees',
      text:
        'Cette liste fonctionne comme un rapport operationnel montrant ou le vocabulaire historique apparait deja dans le corpus.',
      mentionsSuffix: 'mentions',
    },
    prospecting: {
      sectionLabel: 'Prospection massive',
      title: 'Nouvelles sources localisees a incorporer',
      text:
        'Cette liste n’est pas encore curee dans le corpus principal. Ces documents ont deja ete reperes dans des archives numeriques et sont prets a etre priorises.',
      source: 'source',
      remoteOcr: 'OCR distant',
    },
    messages: {
      stateLoadError: 'Impossible de charger l’etat du corpus.',
      platformLoadError: 'Impossible de charger la plateforme.',
      refreshError: 'Impossible d’actualiser le corpus.',
      termSaveError: 'Impossible d’enregistrer le terme.',
      termUpdated: 'Terme mis a jour dans le lexique.',
      termCreated: 'Nouveau terme ajoute au corpus.',
      documentError: 'Impossible de televerser le document.',
      documentCreated: 'Document televerse. Il fait maintenant partie du corpus analysable.',
      contextError: 'Impossible de comparer le contexte.',
      contextCompared: 'Passage compare au corpus vectorise.',
      similarError: 'Impossible de charger les contextes similaires.',
    },
  },
  pt: {
    localeLabel: 'Idioma',
    projectTitle: 'Plataforma colaborativa para a historia do cancer de mama',
    projectFocus:
      'Encontrar todos os arquivos em que o cancer de mama e mencionado e comparar coincidencias entre mencoes, contextos e vocabularios.',
    loadingEyebrow: 'Plataforma de pesquisa',
    loadingTitle: 'Carregando corpus, mencoes e vetores contextuais.',
    heroEyebrow: 'Plataforma de pesquisa cientifica',
    heroNote:
      'O estudo esta centrado no corpus completo: localizar todos os arquivos onde aparece o vocabulario historico do cancer de mama, comparar coincidencias entre mencoes e deixar claro o que vem da leitura humana, de regras simples ou da vetorizacao contextual.',
    studySectionLabel: 'Perfil do estudo',
    evaName: 'Eva Guadalupe Hernández Avilez',
    evaBioLabel: 'Bio',
    evaBio:
      'Eva Guadalupe Hernández Avilez coordena a leitura visual de textos digitalizados, a ampliacao do lexico historico e a interpretacao dos achados dentro deste projeto.',
    purposeLabel: 'Proposito',
    purposeTitle: 'Proposito do estudo',
    purpose:
      'Reconstruir colaborativamente como o cancer de mama foi nomeado, descrito, tratado, registrado e valorizado economicamente antes de 1900, acompanhando a historia e a evolucao das palavras em fontes medicas, populares e arquivisticas.',
    uploadCallout:
      'A plataforma ja permite enviar documentos e OCR para que Eva e a comunidade ampliem o corpus.',
    jumpToUpload: 'Ir para o envio de documentos',
    stats: {
      documentsTotal: 'documentos no corpus',
      documentsWithMentions: 'documentos com mencoes',
      totalMentions: 'mencoes detectadas',
      configuredTerms: 'termos configurados',
      vectorizedContexts: 'trechos vetorizados',
      visibleMentions: 'mencoes visiveis',
      prospectedSources: 'fontes prospectadas',
    },
    band: {
      sectionLabel: 'Quadro metodologico',
      title: 'O que ja sabemos e como isso e produzido',
      text:
        'O corpus inicial ja contem coincidencias detectadas para termos, sintomas, cirurgia, puerperio e relacoes entre documentos. A plataforma agora apresenta essas coincidencias como estado do corpus e nao como uma consulta isolada, ao mesmo tempo em que mantem uma camada separada de prospeccao.',
      loading: 'atualizando corpus',
      ready: 'corpus sincronizado',
    },
    algorithms: {
      sectionLabel: 'Camadas de analise',
      title: 'Manual, heuristica e vetorial',
      text:
        'A leitura exata e o lexico curado continuam sendo a base. Sobre isso rodam heuristicas de agrupamento e uma camada vetorial TF-IDF.',
      cards: [
        {
          tier: 'Manual + exato',
          title: 'Lexico curado pela pesquisa',
          description:
            'Eva e a comunidade adicionam termos e variantes historicas. Esta camada equivale a uma inspecao documental controlada e rastreavel.',
        },
        {
          tier: 'Heuristica simples',
          title: 'Coincidencias e coocorrencias',
          description:
            'As mencoes sao agrupadas por documento, trecho e decada para mostrar combinacoes recorrentes.',
        },
        {
          tier: 'Vetorizacao atual',
          title: 'TF-IDF contextual',
          description:
            'Cada trecho e vetorizado para comparar contextos proximos pela distribuicao de palavras, e nao apenas por coincidencia literal.',
        },
        {
          tier: 'Proxima camada',
          title: 'Embeddings e alinhamento semantico',
          description:
            'A proxima etapa pode adicionar embeddings multilingues, entidades historicas e agrupamentos tematicos.',
        },
      ],
    },
    controls: {
      sectionLabel: 'Exploracao do corpus',
      title: 'Filtrar mencoes e coincidencias',
      text:
        'Esta camada nao procura uma unica palavra. Ela filtra o conjunto de mencoes ja detectadas em todo o corpus.',
      queryLabel: 'Consulta de trabalho',
      queryPlaceholder: 'ex. ulcerated breast, surgery, lying-in',
      configuredTerm: 'Termo configurado',
      category: 'Categoria historica',
      sourceType: 'Tipo de fonte',
      reviewStatus: 'Estado editorial',
      all: 'Todos',
      visibleMentions: 'mencoes visiveis',
      connectedDocuments: 'documentos conectados',
      cooccurrencePairs: 'pares de coocorrencia',
    },
    visuals: {
      timelineTitle: 'Cronologia de documentos com mencoes',
      timelineSubtitle:
        'Documentos do corpus filtrado contra documentos que realmente contem mencoes detectadas.',
      timelineTotalLabel: 'documentos no corpus filtrado',
      timelineMatchedLabel: 'documentos com mencoes',
      topTermsTitle: 'Termos mais presentes',
      topTermsSubtitle:
        'As frequencias saem de todas as mencoes visiveis sob os filtros atuais.',
      topTermsMetric:
        'Cada barra indica quantas vezes o termo configurado aparece nas mencoes filtradas.',
      cooccurrenceTitle: 'Coocorrencias mais fortes',
      cooccurrenceSubtitle: 'Pares de termos que aparecem juntos no mesmo trecho.',
      cooccurrenceMetric:
        'Isso ajuda a detectar constelacoes de sintomas, tratamentos ou nomenclaturas.',
      summaryLabel: 'Coincidencias ja detectadas',
      summaryTitle: 'Estado atual do corpus',
      sharedFragments: 'trechos compartilham esta relacao.',
      networkTitle: 'Mapa termo-obra',
      networkSubtitle:
        'Esquerda: termos historicos. Direita: obras onde aparecem. A espessura da linha indica o peso da relacao.',
      networkEmpty: 'Ainda nao ha mencoes filtradas suficientes para desenhar o mapa.',
      chartHint: 'O grafico pode ser arrastado em telas menores.',
      networkHint:
        'Arraste os nos se quiser reorganizar a leitura. A base ja separa termos e obras.',
    },
    mentions: {
      sectionLabel: 'Mencoes detectadas',
      title: 'Evidencia textual',
      summary:
        'Selecione uma mencao para ver o contexto e os trechos vetorialmente semelhantes.',
      empty:
        'Nao ha mencoes para os filtros atuais. Tente outra categoria ou adicione novos termos ao lexico.',
      activeLabel: 'Mencao ativa',
      noSelection: 'Sem selecao',
      noActive: 'Nao ha mencao ativa para exibir.',
      similarLabel: 'Contextos semelhantes',
      similarTitle: 'Comparacao vetorial a partir da mencao',
      similarNote:
        'Aqui ja nao se exige a mesma palavra. Sao comparadas distribuicoes de vocabulario entre trechos proximos do corpus.',
      comparing: 'Comparando contextos…',
      noNeighbors: 'Esta mencao ainda nao retorna vizinhos contextuais suficientemente proximos.',
      evaLabLabel: 'Laboratorio da Eva',
      evaLabTitle: 'Comparar um trecho marcado manualmente',
      evaLabField: 'Contexto colado do OCR ou da leitura visual',
      evaLabPlaceholder: 'Cole aqui o trecho que Eva deseja comparar com o corpus.',
      evaLabButton: 'Comparar contexto',
      evaLabButtonLoading: 'Comparando…',
    },
    lexicon: {
      sectionLabel: 'Estudo do lexico',
      title: 'Configurar termos e variantes',
      text:
        'Eva pode incorporar novas formulas historicas a partir da inspecao visual do texto digital. Esses termos entram imediatamente na analise do corpus.',
      editButton: 'Editar',
      noMethodNote: 'Sem nota metodologica.',
      editTitle: 'Editar termo',
      newTitle: 'Adicionar novo termo',
      cancelEdit: 'Cancelar edicao',
      canonical: 'Forma canonica',
      category: 'Categoria',
      variants: 'Variantes historicas',
      variantsPlaceholder: 'Uma por virgula ou uma por linha.',
      notes: 'Nota de pesquisa',
      notesPlaceholder: 'Por que este termo importa e como e usado historicamente.',
      saveNew: 'Adicionar termo',
      saveEdit: 'Atualizar termo',
      saving: 'Salvando…',
    },
    upload: {
      sectionLabel: 'Entrada de fontes',
      title: 'Enviar novos documentos',
      text:
        'O mesmo formulario serve para Eva e para a comunidade. E possivel enviar um arquivo digitalizado, colar OCR e registrar metadados minimos para que o documento entre no fluxo de pesquisa.',
      fieldTitle: 'Titulo',
      shortTitle: 'Titulo curto',
      year: 'Ano',
      place: 'Lugar',
      language: 'Idioma',
      recordType: 'Tipo de fonte',
      recordTypePlaceholder: 'manual, imprensa, registro medico, revista',
      sourceHost: 'Repositorio ou procedencia',
      contributorName: 'Quem envia',
      contributorRole: 'Papel',
      contributorRolePlaceholder: 'Eva, comunidade, arquivo',
      file: 'Arquivo digitalizado ou transcrito',
      summary: 'Resumo curado',
      summaryPlaceholder: 'O que e o documento e por que importa.',
      notes: 'Notas de catalogacao',
      notesPlaceholder: 'Estado do OCR, problemas paleograficos, duvidas.',
      ocrText: 'OCR ou transcricao em texto',
      ocrPlaceholder: 'Cole aqui o texto digitalizado para entrar direto na analise.',
      submit: 'Adicionar documento ao corpus',
      submitting: 'Enviando…',
    },
    connected: {
      sectionLabel: 'Documentos conectados',
      title: 'Arquivos com mencoes detectadas',
      text:
        'Esta lista funciona como um relatorio operacional de onde o vocabulario historico ja apareceu dentro do corpus.',
      mentionsSuffix: 'mencoes',
    },
    prospecting: {
      sectionLabel: 'Prospeccao massiva',
      title: 'Novas fontes localizadas para incorporar',
      text:
        'Esta lista ainda nao foi curada dentro do corpus principal. Esses documentos ja foram localizados em arquivos digitais e estao prontos para priorizacao.',
      source: 'fonte',
      remoteOcr: 'ocr remoto',
    },
    messages: {
      stateLoadError: 'Nao foi possivel carregar o estado do corpus.',
      platformLoadError: 'Nao foi possivel carregar a plataforma.',
      refreshError: 'Nao foi possivel atualizar o corpus.',
      termSaveError: 'Nao foi possivel salvar o termo.',
      termUpdated: 'Termo atualizado no lexico.',
      termCreated: 'Novo termo adicionado ao corpus.',
      documentError: 'Nao foi possivel enviar o documento.',
      documentCreated: 'Documento enviado. Agora faz parte do corpus analisavel.',
      contextError: 'Nao foi possivel comparar o contexto.',
      contextCompared: 'Trecho comparado com o corpus vetorizado.',
      similarError: 'Nao foi possivel carregar contextos semelhantes.',
    },
  },
}

export default uiCopy
