// ========================================
// 🚀 GOOGLE APPS SCRIPT - SUIVI CONDUCTEURS
// Architecture multi-phases avec sessions
// ========================================

function doGet(e) {
  console.log('🚀 === DÉBUT doGet() ===');
  
  const phase = e.parameter.phase;
  const session = e.parameter.session;
  
  console.log('📥 Paramètres reçus:', e.parameter);
  console.log('📋 Phase demandée:', phase);
  console.log('🆔 Session demandée:', session);
  
  // 🚀 TOUJOURS SERVIR LE SPA FIGMA 2025 SAUF DEBUG
  console.log('🎨 === SPA FIGMA 2025 SERVING ===');
  
  if (phase === 'debug') {
    console.log('🔧 Mode Debug');
    return HtmlService.createTemplateFromFile('debug-sessions')
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  
  // ✅ SPA pour tout le reste
  console.log('🎨 Chargement SPA Figma 2025');
  console.log('📄 Serving index-spa.html');
  console.log('✅ === FIN doGet() SUCCESS ===');
  
  return HtmlService.createTemplateFromFile('index-spa')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');

}

// ========================================
// 📊 GESTION DES FEUILLES SHEETS
// ========================================

function getSheets() {
  try {
    console.log('📊 getSheets() - Début');
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('📊 Spreadsheet récupéré:', spreadsheet.getName());
    
    const sheets = {
      priseService: spreadsheet.getSheetByName('Prise_Service') || createSheet('Prise_Service'),
      suiviLivraisons: spreadsheet.getSheetByName('Suivi_Livraisons') || createSheet('Suivi_Livraisons'),
      finService: spreadsheet.getSheetByName('Fin_Service') || createSheet('Fin_Service'),
      sessions: spreadsheet.getSheetByName('Sessions') || createSheet('Sessions')
    };
    
    console.log('📊 Feuilles récupérées:', {
      priseService: !!sheets.priseService,
      suiviLivraisons: !!sheets.suiviLivraisons, 
      finService: !!sheets.finService,
      sessions: !!sheets.sessions
    });
    
    // ✅ VÉRIFIER ET CORRIGER LES EN-TÊTES
    checkAndFixHeaders(sheets);
    
    console.log('📊 getSheets() - Succès');
    return sheets;
    
  } catch (error) {
    console.error('❌ Erreur dans getSheets():', error);
    throw error;
  }
}

// ========================================
// 🔧 CORRECTION DES EN-TÊTES
// ========================================

function checkAndFixHeaders(sheets) {
  try {
    // Vérifier Prise_Service
    if (sheets.priseService.getLastRow() === 0 || isHeadersMissing(sheets.priseService, 'Prise_Service')) {
      console.log('🔧 Correction en-têtes Prise_Service');
      addHeaders(sheets.priseService, 'Prise_Service');
    }
    
    // Vérifier Suivi_Livraisons
    if (sheets.suiviLivraisons.getLastRow() === 0 || isHeadersMissing(sheets.suiviLivraisons, 'Suivi_Livraisons')) {
      console.log('🔧 Correction en-têtes Suivi_Livraisons');
      addHeaders(sheets.suiviLivraisons, 'Suivi_Livraisons');
    }
    
    // Vérifier Fin_Service
    if (sheets.finService.getLastRow() === 0 || isHeadersMissing(sheets.finService, 'Fin_Service')) {
      console.log('🔧 Correction en-têtes Fin_Service');
      addHeaders(sheets.finService, 'Fin_Service');
    }
    
    // Vérifier Sessions
    if (sheets.sessions.getLastRow() === 0 || isHeadersMissing(sheets.sessions, 'Sessions')) {
      console.log('🔧 Correction en-têtes Sessions');
      addHeaders(sheets.sessions, 'Sessions');
    }
    
    console.log('✅ Vérification en-têtes terminée');
    
  } catch (error) {
    console.error('❌ Erreur vérification en-têtes:', error);
  }
}

function isHeadersMissing(sheet, sheetType) {
  try {
    const firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    switch(sheetType) {
      case 'Prise_Service':
        return !firstRow.includes('Session_ID') || !firstRow.includes('Immat_Tracteur');
      case 'Suivi_Livraisons':
        return !firstRow.includes('Session_ID') || !firstRow.includes('Nom_Magasin') || !firstRow.includes('Commentaires_Livraison');
      case 'Fin_Service':
        return !firstRow.includes('Session_ID') || !firstRow.includes('Site_Affectation');
      case 'Sessions':
        return !firstRow.includes('Session_ID') || !firstRow.includes('Status');
      default:
        return true;
    }
  } catch (error) {
    return true; // Si erreur, on considère que les en-têtes manquent
  }
}

function addHeaders(sheet, sheetType) {
  try {
    // Si la feuille a des données, insérer une ligne en haut
    if (sheet.getLastRow() > 0) {
      sheet.insertRowBefore(1);
    }
    
    switch(sheetType) {
      case 'Prise_Service':
        // ✅ 26 colonnes au total (corrigé)
        sheet.getRange(1, 1, 1, 26).setValues([[
          'Session_ID', 'Timestamp', 'Tour', 'Site_Depart', 'Heure_Depart', 'Numero_Contrat',
          'Immat_Tracteur', 'Degats_Tracteur', 'Kilometrage', 'Commentaires_Tracteur',
          'Immat_Remorque', 'Degats_Remorque', 'Commentaires_Remorque',
          'Consignes_Lu', 'Heure_Top_Depart',
          'Photo_Carburant', 'Photo_Face_Avant', 'Photo_Cote_Conducteur', 'Photo_Cote_Passager',
          'Photo_Carburant_Remorque', 'Photo_Hayon', 'Photo_Remorque_Tablier', 
          'Photo_Remorque_Conducteur', 'Photo_Remorque_Passager', 'Photo_Chargement', 'Photo_Remorque_Portes'
        ]]);
        break;
        
      case 'Suivi_Livraisons':
        sheet.getRange(1, 1, 1, 18).setValues([[
          'Session_ID', 'Timestamp', 'Date_Depart', 'Cycle', 'Type', 'Site_Chargement',
          'Nom_Conducteur', 'Heure_Depart_Prevue', 'Magasins_A_Livrer',
          'Nom_Magasin', 'Statut_Livraison', 'Details_Livraison', 'Reprises_Contenants',
          'Anomalies', 'Commentaires_Livraison', 'Photo_Magasin', 'Photo_Reprises', 'Photo_Anomalies'
        ]]);
        break;
        
      case 'Fin_Service':
        sheet.getRange(1, 1, 1, 20).setValues([[
          'Session_ID', 'Timestamp', 'Site_Affectation', 'Tour_Contrat', 'Heure_Fin_Tournee',
          'Nombre_Livraisons', 'Nombre_Reprises', 'Magasins_Sans_Reprise',
          'Photo_PDA_Reprises', 'Photo_Caisse_Vides', 'Photo_Lettre_Voiture',
          'Immat_Remorque_Fin', 'Photo_Caisse_Nettoyee', 'Photo_Carburant_Remorque_Fin',
          'Immat_Tracteur_Fin', 'Kilometrage_Retour', 'Photo_Carburant_Tracteur_Fin',
          'Commentaires_Finaux', 'Tournee_Complete', 'Total_Photos'
        ]]);
        break;
        
      case 'Sessions':
        sheet.getRange(1, 1, 1, 10).setValues([[
          'Session_ID', 'Created_At', 'Phase1_Completed', 'Phase2_Completed', 'Phase3_Completed',
          'Conducteur', 'Site', 'Tour', 'Status', 'Last_Updated'
        ]]);
        break;
    }
    
    // Formater les en-têtes
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#148BA6');
    headerRange.setFontColor('white');
    headerRange.setWrap(true);
    
    console.log(`✅ En-têtes ajoutés pour ${sheetType}`);
    
  } catch (error) {
    console.error(`❌ Erreur ajout en-têtes ${sheetType}:`, error);
  }
}

function createSheet(name) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.insertSheet(name);
  
  // En-têtes selon le type de feuille
  switch(name) {
    case 'Prise_Service':
      // ✅ 26 colonnes au total (corrigé aussi ici)
      sheet.getRange(1, 1, 1, 26).setValues([[
        'Session_ID', 'Timestamp', 'Tour', 'Site_Depart', 'Heure_Depart', 'Numero_Contrat',
        'Immat_Tracteur', 'Degats_Tracteur', 'Kilometrage', 'Commentaires_Tracteur',
        'Immat_Remorque', 'Degats_Remorque', 'Commentaires_Remorque',
        'Consignes_Lu', 'Heure_Top_Depart',
        'Photo_Carburant', 'Photo_Face_Avant', 'Photo_Cote_Conducteur', 'Photo_Cote_Passager',
        'Photo_Carburant_Remorque', 'Photo_Hayon', 'Photo_Remorque_Tablier', 
        'Photo_Remorque_Conducteur', 'Photo_Remorque_Passager', 'Photo_Chargement', 'Photo_Remorque_Portes'
      ]]);
      break;
      
    case 'Suivi_Livraisons':
      sheet.getRange(1, 1, 1, 18).setValues([[
        'Session_ID', 'Timestamp', 'Date_Depart', 'Cycle', 'Type', 'Site_Chargement',
        'Nom_Conducteur', 'Heure_Depart_Prevue', 'Magasins_A_Livrer',
        'Nom_Magasin', 'Statut_Livraison', 'Details_Livraison', 'Reprises_Contenants',
        'Anomalies', 'Commentaires_Livraison', 'Photo_Magasin', 'Photo_Reprises', 'Photo_Anomalies'
      ]]);
      break;
      
    case 'Fin_Service':
      sheet.getRange(1, 1, 1, 20).setValues([[
        'Session_ID', 'Timestamp', 'Site_Affectation', 'Tour_Contrat', 'Heure_Fin_Tournee',
        'Nombre_Livraisons', 'Nombre_Reprises', 'Magasins_Sans_Reprise',
        'Photo_PDA_Reprises', 'Photo_Caisse_Vides', 'Photo_Lettre_Voiture',
        'Immat_Remorque_Fin', 'Photo_Caisse_Nettoyee', 'Photo_Carburant_Remorque_Fin',
        'Immat_Tracteur_Fin', 'Kilometrage_Retour', 'Photo_Carburant_Tracteur_Fin',
        'Commentaires_Finaux', 'Tournee_Complete', 'Total_Photos'
      ]]);
      break;
      
    case 'Sessions':
      sheet.getRange(1, 1, 1, 10).setValues([[
        'Session_ID', 'Created_At', 'Phase1_Completed', 'Phase2_Completed', 'Phase3_Completed',
        'Conducteur', 'Site', 'Tour', 'Status', 'Last_Updated'
      ]]);
      break;
  }
  
  return sheet;
}

// ========================================
// 📸 GESTION DES PHOTOS
// ========================================

function savePhotosToDrive(photos, sessionId, phase) {
  console.log('🚀 DÉBUT savePhotosToDrive pour:', sessionId, 'phase:', phase);
  const photoUrls = {};
  
  if (!photos || Object.keys(photos).length === 0) {
    console.log('❌ Aucune photo à traiter');
    return photoUrls;
  }
  
  console.log('📷 Nombre de photos à traiter:', Object.keys(photos).length);
  
  // Créer un dossier pour la session si nécessaire
  const sessionFolder = getOrCreateSessionFolder(sessionId);
  
  Object.keys(photos).forEach((photoType, index) => {
    try {
      console.log(`📷 Traitement photo ${index + 1}/${Object.keys(photos).length}: ${photoType}`);
      const photo = photos[photoType];
      
        const blob = Utilities.newBlob(
          Utilities.base64Decode(photo.data), 
        photo.type || 'image/jpeg', 
        photo.name || `${photoType}_${sessionId}_${Date.now()}.jpg`
      );
      
      console.log(`💾 Création fichier pour: ${photoType}`);
      const file = sessionFolder.createFile(blob);
      photoUrls[photoType] = file.getUrl();
      
      console.log(`✅ Photo sauvegardée: ${photoType} -> ${file.getId()}`);
    } catch (error) {
      console.error(`❌ Erreur sauvegarde photo ${photoType}:`, error);
      photoUrls[photoType] = 'ERREUR: ' + error.toString();
    }
  });
  
  console.log('🏁 FIN savePhotosToDrive, URLs générées:', Object.keys(photoUrls).length);
  return photoUrls;
}

function getOrCreateSessionFolder(sessionId) {
  const rootFolder = DriveApp.getRootFolder();
  let appFolder;
  
  try {
    appFolder = DriveApp.getFoldersByName('Suivi_Conducteurs').next();
  } catch (e) {
    appFolder = rootFolder.createFolder('Suivi_Conducteurs');
  }
  
  let sessionFolder;
  try {
    sessionFolder = appFolder.getFoldersByName(sessionId).next();
  } catch (e) {
    sessionFolder = appFolder.createFolder(sessionId);
  }
  
  return sessionFolder;
}

// ========================================
// 🏁 PHASE 1 - PRISE DE SERVICE
// ========================================

// Variable globale pour éviter les conflits de concurrence
var processingPhase1 = {};

function savePhase1Data(data) {
  try {
    console.log('💾 Sauvegarde Phase 1:', data.sessionId);
    
    // Protection contre les appels concurrents
    if (processingPhase1[data.sessionId]) {
      console.log('⚠️ Traitement déjà en cours pour cette session, abandon');
      return { success: false, message: 'Traitement en cours', id: data.sessionId };
    }
    
    processingPhase1[data.sessionId] = true;
    
    console.log('🚀 DÉBUT savePhase1Data pour:', data.sessionId);
    
    const sheets = getSheets();
    console.log('✅ Sheets récupérées');
    
    console.log('📷 Début savePhotosToDrive...');
    const photoUrls = savePhotosToDrive(data.photos, data.sessionId, 'phase1');
    console.log('✅ savePhotosToDrive terminé, URLs:', Object.keys(photoUrls).length);
    
    // Extraction des données du formulaire
    const formData = data.formData;
    
    console.log('🚀 SAUVEGARDE SIMPLIFIÉE - Session:', data.sessionId);
    
    const rowData = [
      data.sessionId,
      new Date(),
      formData.tour || '',
      formData.siteDepart || '',
      formData.heureDepart || '',
      formData.numeroContrat || '',
      formData.immatTracteur || '',
      formData.degatsTracteur || '',
      formData.kilometrage || '',
      formData.commentairesTracteur || '',
      formData.immatRemorque || '',
      formData.degatsRemorque || '',
      formData.commentairesRemorque || '',
      formData.consignes ? 'Oui' : 'Non',
      formData.heureTopDepart || '',
      photoUrls.photoCarburant || '',
      photoUrls.photoFaceAvant || '',
      photoUrls.photoCoteConducteur || '',
      photoUrls.photoCotePassager || '',
      photoUrls.photoCarburantRemorque || '',
      photoUrls.photoHayon || '',
      photoUrls.photoRemorqueTableau || '',
      photoUrls.photoRemorqueConducteur || '',
      photoUrls.photoRemorquePassager || '',
      photoUrls.photoChargement || '',
      photoUrls.photoRemorquePortes || ''
    ];
    
    // NE PAS SAUVEGARDER DANS SHEETS ICI
    // Seulement préparer les données pour plus tard
    console.log('📷 photoUrls préparées:', Object.keys(photoUrls).length, 'photos');
    console.log('📋 formData reçu pour preparation:', formData.tour);
    console.log('⏳ Sauvegarde Sheets différée jusqu\'après upload photos');
    
    // Mettre à jour la session
    updateSession(data.sessionId, { phase1Completed: true });
    
    // Libérer le verrou
    delete processingPhase1[data.sessionId];
    
    return { 
      success: true, 
      id: data.sessionId,
      phase: 'prise-service',
      photosCount: Object.keys(photoUrls).length
    };
    
  } catch (error) {
    console.error('❌ Erreur Phase 1:', error);
    // Libérer le verrou même en cas d'erreur
    delete processingPhase1[data.sessionId];
    return { 
      success: false, 
      error: error.toString(),
      sessionId: data.sessionId 
    };
  }
}

// Nouvelle fonction pour sauvegarder dans Sheets APRÈS upload photos
function savePhase1ToSheetsWithUrls(data, photoUrls) {
  try {
    console.log('📊 SAUVEGARDE FINALE PHASE 1 AVEC URLS');
    console.log('📷 URLs reçues:', Object.keys(photoUrls || {}).length);
    console.log('🆔 SessionId reçu:', data.sessionId);
    console.log('📋 Data complète:', data);
    
    const sheets = getSheets();
    const formData = data.formData || data;
    
    const rowData = [
      data.sessionId,
      new Date(),
      formData.tour || '',
      formData.siteDepart || '',
      formData.heureDepart || '',
      formData.numeroContrat || '',
      formData.immatTracteur || '',
      formData.degatsTracteur || '',
      formData.kilometrage || '',
      formData.commentairesTracteur || '',
      formData.immatRemorque || '',
      formData.degatsRemorque || '',
      formData.commentairesRemorque || '',
      formData.consignes ? 'Oui' : 'Non',
      formData.heureTopDepart || '',
      photoUrls.photoCarburant || '',
      photoUrls.photoFaceAvant || '',
      photoUrls.photoCoteConducteur || '',
      photoUrls.photoCotePassager || '',
      photoUrls.photoCarburantRemorque || '',
      photoUrls.photoHayon || '',
      photoUrls.photoRemorqueTableau || '',
      photoUrls.photoRemorqueConducteur || '',
      photoUrls.photoRemorquePassager || '',
      photoUrls.photoChargement || '',
      photoUrls.photoRemorquePortes || ''
    ];
    
    console.log('📊 Ligne avec URLs complète:', rowData);
    
    try {
      sheets.priseService.appendRow(rowData);
      console.log('✅ SAUVEGARDE SHEETS FINALE RÉUSSIE');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur sauvegarde finale Sheets:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Erreur savePhase1ToSheetsWithUrls:', error);
    return { success: false, error: error.toString() };
  }
}

// ========================================
// 🚛 PHASE 2 - SUIVI LIVRAISONS
// ========================================

function saveSingleMagasin(data) {
  try {
    console.log('💾 Sauvegarde magasin individuel:', data.magasin ? data.magasin.nomMagasin : 'Nom manquant');
    console.log('📋 Data reçue:', data);
    
    const sheets = getSheets();
    const photoUrls = data.magasin && data.magasin.photos ? 
      savePhotosToDrive(data.magasin.photos, data.sessionId, `phase2_magasin_${data.magasin.index + 1}`) : {};
    
    // Données générales avec fallbacks
    const generalData = data.generalData || {};
    const magasin = data.magasin || {};
    
    // Insertion dans la feuille Suivi_Livraisons
    try {
      sheets.suiviLivraisons.appendRow([
        data.sessionId,
        new Date(),
        generalData.dateDepart || new Date().toLocaleDateString('fr-FR'),
        generalData.cycle || '',
        generalData.typeLivraison || '',
        generalData.siteChargement || '',
        generalData.nomConducteur || '',
        generalData.heureDepartPrevue || '',
        generalData.magasinsALivrer || '1',
        magasin.nomMagasin || '',
        magasin.statutLivraison || '',
        magasin.detailsLivraison || '',
        magasin.reprisesContenants || '',
        magasin.anomalies || '',
        magasin.commentaireLivraison || '',
        photoUrls.photoMagasin || '',
        photoUrls.photoReprises || '',
        photoUrls.photoAnomalies || ''
      ]);
      console.log('✅ Magasin sauvegardé dans Sheets');
    } catch (sheetError) {
      console.error('❌ Erreur sauvegarde Sheets magasin:', sheetError);
    }
    
    return { 
      success: true, 
      id: data.sessionId,
      magasin: magasin.nomMagasin,
      index: magasin.index + 1
    };
    
  } catch (error) {
    console.error('❌ Erreur sauvegarde magasin:', error);
    return { 
      success: false, 
      error: error.toString(),
      sessionId: data.sessionId 
    };
  }
}

function finalizePhase2Data(data) {
  try {
    console.log('🏁 Finalisation Phase 2:', data.sessionId, `${data.magasinsCount} magasins`);
    
    // Mettre à jour la session pour marquer Phase 2 comme complète
    updateSession(data.sessionId, { 
      phase2Completed: true,
      magasinsCount: data.magasinsCount,
      conducteur: data.generalData.nomConducteur || ''
    });
    
    return { 
      success: true, 
      id: data.sessionId,
      phase: 'suivi-livraisons',
      magasinsCount: data.magasinsCount,
      message: 'Phase 2 finalisée avec succès'
    };
    
  } catch (error) {
    console.error('❌ Erreur finalisation Phase 2:', error);
    return { 
      success: false, 
      error: error.toString(),
      sessionId: data.sessionId 
    };
  }
}

function savePhase2Data(data) {
  try {
    console.log('💾 Sauvegarde Phase 2 (legacy):', data.sessionId);
    
    const sheets = getSheets();
    
    // Données générales
    const generalData = data.generalData;
    
    // Sauvegarde de chaque magasin
    data.magasins.forEach((magasin, index) => {
      const photoUrls = savePhotosToDrive(magasin.photos, data.sessionId, `phase2_magasin${index + 1}`);
      
      sheets.suiviLivraisons.appendRow([
        data.sessionId,
        new Date(),
        generalData.dateDepart || '',
        generalData.cycle || '',
        generalData.type || '',
        generalData.siteChargement || '',
        generalData.nomConducteur || '',
        generalData.heureDepartPrevue || '',
        generalData.magasinsALivrer || '',
        magasin.nomMagasin || '',
        magasin.statutLivraison || '',
        magasin.detailsLivraison || '',
        magasin.reprisesContenants || '',
        magasin.anomalies || '',
        photoUrls.magasinPhoto || ''
      ]);
    });
    
    // Mettre à jour la session
    updateSession(data.sessionId, { phase2Completed: true });
    
    return { 
      success: true, 
      id: data.sessionId,
      phase: 'suivi-livraisons',
      magasinsCount: data.magasins.length
    };
    
  } catch (error) {
    console.error('❌ Erreur Phase 2:', error);
    return { 
      success: false, 
      error: error.toString(),
      sessionId: data.sessionId 
    };
  }
}

// ========================================
// 🏁 PHASE 3 - FIN DE SERVICE
// ========================================

function savePhase3Data(data) {
  try {
    console.log('💾 Sauvegarde Phase 3:', data.sessionId);
    
    const sheets = getSheets();
    const photoUrls = savePhotosToDrive(data.photos, data.sessionId, 'phase3');
    
    const formData = data.formData || data;
    console.log('📋 FormData Phase 3:', formData);
    
    // Insertion dans la feuille Fin_Service
    sheets.finService.appendRow([
      data.sessionId,
      new Date(),
      formData.siteAffectation || '',
      formData.tourContratFin || '',
      formData.heureRetour || '',
      formData.nombreLivraisons ? formData.nombreLivraisons.join(',') : '',
      formData.nombreReprises ? formData.nombreReprises.join(',') : '',
      formData.magasinsSansReprise || '',
      photoUrls.pdaReprises || '',
      photoUrls.caisseVides || '',
      photoUrls.lettreVoiture || '',
      formData.immatRemorqueFin || '',
      photoUrls.caisseNettoyee || '',
      photoUrls.carburantRemorqueFin || '',
      formData.immatTracteurFin || '',
      formData.kilometrageFinal || '',
      photoUrls.carburantTracteurFin || '',
      formData.commentairesFinaux || '',
      'COMPLETE',
      Object.keys(photoUrls).length
    ]);
    
    // Finaliser la session
    updateSession(data.sessionId, { 
      phase3Completed: true, 
      status: 'COMPLETE',
      completedAt: new Date().toISOString()
    });
    
    return { 
      success: true, 
      id: data.sessionId,
      phase: 'fin-service',
      status: 'COMPLETE'
    };
    
  } catch (error) {
    console.error('❌ Erreur Phase 3:', error);
    return { 
      success: false, 
      error: error.toString(),
      sessionId: data.sessionId 
    };
  }
}

// ========================================
// 📋 GESTION DES SESSIONS
// ========================================

function updateSession(sessionId, updates) {
  try {
    const sheets = getSheets();
    const sessionSheet = sheets.sessions;
    
    // Chercher la session existante
    const data = sessionSheet.getDataRange().getValues();
    let sessionRow = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sessionId) {
        sessionRow = i + 1;
        break;
      }
    }
    
    if (sessionRow === -1) {
      // Créer nouvelle session
      sessionSheet.appendRow([
        sessionId,
        new Date(),
        updates.phase1Completed || false,
        updates.phase2Completed || false,
        updates.phase3Completed || false,
        updates.conducteur || '',
        updates.site || '',
        updates.tour || '',
        updates.status || 'IN_PROGRESS',
        new Date()
      ]);
    } else {
      // Mettre à jour session existante
      if (updates.phase1Completed) sessionSheet.getRange(sessionRow, 3).setValue(true);
      if (updates.phase2Completed) sessionSheet.getRange(sessionRow, 4).setValue(true);
      if (updates.phase3Completed) sessionSheet.getRange(sessionRow, 5).setValue(true);
      if (updates.status) sessionSheet.getRange(sessionRow, 9).setValue(updates.status);
      sessionSheet.getRange(sessionRow, 10).setValue(new Date());
    }
    
    console.log('✅ Session mise à jour:', sessionId);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur mise à jour session:', error);
    return false;
  }
}

function getSessionData(sessionId) {
  try {
    console.log('🔍 Recherche session:', sessionId);
    
    const sheets = getSheets();
    const sessionSheet = sheets.sessions;
    
    // Vérifier que la feuille existe
    if (!sessionSheet) {
      console.error('❌ Feuille Sessions introuvable');
      return null;
    }
    
    const data = sessionSheet.getDataRange().getValues();
    console.log('📊 Données Sessions trouvées:', data.length - 1, 'lignes');
    
    // Normaliser la recherche (insensible à la casse)
    const sessionIdLower = sessionId.toLowerCase();
    console.log('🔍 Recherche normalisée:', sessionIdLower);
    
    // Afficher les IDs disponibles pour debug
    const availableIds = [];
    for (let i = 1; i < data.length; i++) {
      const currentId = data[i][0];
      availableIds.push(currentId);
      
      // Comparaison insensible à la casse
      if (currentId && currentId.toLowerCase() === sessionIdLower) {
        console.log('✅ Session trouvée à la ligne', i);
        const result = {
          sessionId: data[i][0],
          createdAt: data[i][1] ? new Date(data[i][1]).toLocaleString('fr-FR') : 'N/A',
          phase1Completed: data[i][2],
          phase2Completed: data[i][3],
          phase3Completed: data[i][4],
          conducteur: data[i][5] || 'Non renseigné',
          site: data[i][6] || 'Non renseigné',
          tour: data[i][7] || 'Non renseigné',
          status: data[i][8] || 'Inconnu',
          lastUpdated: data[i][9] ? new Date(data[i][9]).toLocaleString('fr-FR') : 'N/A'
        };
        console.log('📤 Retour session sérialisée:', result);
        return result;
      }
    }
    
    console.log('❌ Session non trouvée. IDs disponibles:', availableIds);
    return null;
    
  } catch (error) {
    console.error('❌ Erreur getSessionData:', error);
    throw error; // Remonter l'erreur pour debug
  }
}

// ========================================
// 🔄 SYNCHRONISATION OFFLINE
// ========================================

function syncOfflineData(dataArray) {
  const results = [];
  
  dataArray.forEach(data => {
    try {
      switch(data.phase) {
        case 'prise-service':
          results.push(savePhase1Data(data));
          break;
        case 'suivi-livraisons':
          results.push(savePhase2Data(data));
          break;
        case 'fin-service':
          results.push(savePhase3Data(data));
          break;
        default:
          results.push({ success: false, error: 'Phase inconnue', data });
      }
    } catch (error) {
      results.push({ success: false, error: error.toString(), data });
    }
  });
  
  return results;
}

// ========================================
// 🛠️ FONCTIONS UTILITAIRES
// ========================================

function forceFixHeaders() {
  /**
   * 🔧 FONCTION MANUELLE DE CORRECTION DES EN-TÊTES
   * Appelez cette fonction dans l'éditeur de script pour forcer
   * la correction des en-têtes si nécessaire
   */
  try {
    console.log('🔧 === CORRECTION FORCÉE DES EN-TÊTES ===');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = {
      priseService: spreadsheet.getSheetByName('Prise_Service'),
      suiviLivraisons: spreadsheet.getSheetByName('Suivi_Livraisons'),
      finService: spreadsheet.getSheetByName('Fin_Service'),
      sessions: spreadsheet.getSheetByName('Sessions')
    };
    
    Object.keys(sheets).forEach(key => {
      const sheet = sheets[key];
      const sheetType = key === 'priseService' ? 'Prise_Service' :
                       key === 'suiviLivraisons' ? 'Suivi_Livraisons' :
                       key === 'finService' ? 'Fin_Service' : 'Sessions';
      
      if (sheet) {
        console.log(`🔧 Correction forcée: ${sheetType}`);
        addHeaders(sheet, sheetType);
      } else {
        console.log(`⚠️ Feuille ${sheetType} introuvable`);
      }
    });
    
    console.log('✅ Correction forcée terminée');
    return 'Correction des en-têtes terminée avec succès';
    
  } catch (error) {
    console.error('❌ Erreur correction forcée:', error);
    return 'Erreur: ' + error.toString();
  }
}

function recreateAllSheets() {
  /**
   * 🗑️ FONCTION DE RECRÉATION COMPLÈTE
   * ⚠️ ATTENTION: Supprime toutes les données existantes
   */
  try {
    console.log('🗑️ === RECRÉATION COMPLÈTE DES FEUILLES ===');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheetNames = ['Prise_Service', 'Suivi_Livraisons', 'Fin_Service', 'Sessions'];
    
    // Supprimer les feuilles existantes
    sheetNames.forEach(name => {
      const sheet = spreadsheet.getSheetByName(name);
      if (sheet) {
        console.log(`🗑️ Suppression: ${name}`);
        spreadsheet.deleteSheet(sheet);
      }
    });
    
    // Recréer les feuilles
    sheetNames.forEach(name => {
      console.log(`✨ Création: ${name}`);
      createSheet(name);
    });
    
    console.log('✅ Recréation complète terminée');
    return 'Toutes les feuilles ont été recréées avec succès';
    
  } catch (error) {
    console.error('❌ Erreur recréation:', error);
    return 'Erreur: ' + error.toString();
  }
}

function cleanupOldSessions() {
  // Nettoyer les sessions de plus de 30 jours
  try {
    const sheets = getSheets();
    const sessionSheet = sheets.sessions;
    const data = sessionSheet.getDataRange().getValues();
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    for (let i = data.length - 1; i >= 1; i--) {
      const createdAt = new Date(data[i][1]);
      if (createdAt < thirtyDaysAgo) {
        sessionSheet.deleteRow(i + 1);
        console.log('🗑️ Session supprimée:', data[i][0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur nettoyage sessions:', error);
  }
}

function listAllSessions() {
  /**
   * 🔍 FONCTION DE DEBUG - LISTER TOUTES LES SESSIONS
   * Appelez cette fonction pour voir toutes les sessions disponibles
   */
  try {
    console.log('🔍 === LISTE DE TOUTES LES SESSIONS ===');
    
    const sheets = getSheets();
    const sessionSheet = sheets.sessions;
    
    if (!sessionSheet) {
      console.log('❌ Feuille Sessions introuvable');
      return 'Erreur: Feuille Sessions introuvable';
    }
    
    const data = sessionSheet.getDataRange().getValues();
    console.log('📊 Nombre total de lignes:', data.length);
    
    if (data.length <= 1) {
      console.log('⚠️ Aucune session trouvée');
      return 'Aucune session trouvée';
    }
    
    // Afficher les en-têtes
    console.log('📋 En-têtes:', data[0]);
    
    // Lister toutes les sessions
    const sessions = [];
    for (let i = 1; i < data.length; i++) {
      const sessionInfo = {
        ligne: i + 1,
        sessionId: data[i][0],
        createdAt: data[i][1] ? new Date(data[i][1]).toLocaleString('fr-FR') : 'N/A',
        phase1: data[i][2],
        phase2: data[i][3],
        phase3: data[i][4],
        conducteur: data[i][5] || 'Non renseigné',
        site: data[i][6] || 'Non renseigné',
        tour: data[i][7] || 'Non renseigné',
        status: data[i][8] || 'Inconnu',
        lastUpdated: data[i][9] ? new Date(data[i][9]).toLocaleString('fr-FR') : 'N/A'
      };
      sessions.push(sessionInfo);
      console.log(`🎯 Session ${i}:`, sessionInfo);
    }
    
    console.log('✅ Liste terminée');
    console.log('📤 Retour de', sessions.length, 'sessions sérialisées');
    return sessions;
    
  } catch (error) {
    console.error('❌ Erreur listAllSessions:', error);
    return 'Erreur: ' + error.toString();
  }
}

function testSessionSearch(sessionId) {
  /**
   * 🧪 FONCTION DE TEST - RECHERCHER UNE SESSION SPÉCIFIQUE
   * Appelez cette fonction avec un ID pour tester la recherche
   */
  try {
    console.log('🧪 === TEST RECHERCHE SESSION ===');
    console.log('🔍 Session recherchée:', sessionId);
    
    const result = getSessionData(sessionId);
    
    if (result) {
      console.log('✅ Session trouvée:', result);
      return result;
    } else {
      console.log('❌ Session non trouvée');
      // Lister toutes les sessions pour comparaison
      listAllSessions();
      return null;
    }
    
  } catch (error) {
    console.error('❌ Erreur testSessionSearch:', error);
    return 'Erreur: ' + error.toString();
  }
}

// ========================================
// 🏗️ CRÉATION STRUCTURE DONNÉES OPTIMISÉE
// ========================================

function createNewDataStructure() {
  /**
   * 🏗️ CRÉER TOUTE LA NOUVELLE STRUCTURE DE DONNÉES
   * Crée les 3 nouveaux onglets et les peuple avec des données d'exemple
   */
  try {
    console.log('🏗️ === CRÉATION STRUCTURE DONNÉES ===');
    
    // Créer les 3 onglets
    createConducteursSheet();
    createVehiculesSheet(); 
    createSitesSheet();
    
    console.log('✅ Structure de données créée avec succès');
    return 'Structure créée: CONDUCTEURS, VEHICULES, SITES avec données d\'exemple';
    
  } catch (error) {
    console.error('❌ Erreur création structure:', error);
    return 'Erreur: ' + error.toString();
  }
}

function createConducteursSheet() {
  try {
    console.log('👥 Création onglet CONDUCTEURS');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Supprimer l'onglet s'il existe déjà
    const existingSheet = spreadsheet.getSheetByName('CONDUCTEURS');
    if (existingSheet) {
      spreadsheet.deleteSheet(existingSheet);
    }
    
    // Créer le nouvel onglet
    const sheet = spreadsheet.insertSheet('CONDUCTEURS');
    
    // En-têtes
    sheet.getRange(1, 1, 1, 8).setValues([[
      'ID_Conducteur', 'Nom', 'Prenom', 'Email', 'Telephone', 'Site_Affectation', 'Statut', 'Date_Embauche'
    ]]);
    
    // Données d'exemple
    const donnees = [
      ['1001', 'conducteur_exemple1', 'Jean', 'jean.exemple1@transport.com', '0601020304', 'LIDL-Chanteloup', 'Actif', '2023-01-15'],
      ['1002', 'conducteur_exemple2', 'Marie', 'marie.exemple2@transport.com', '0605060708', 'ITM-Louviers', 'Actif', '2023-03-20'],
      ['1003', 'conducteur_exemple3', 'Pierre', 'pierre.exemple3@transport.com', '0609101112', 'LIDL-Chanteloup', 'Actif', '2023-05-10'],
      ['1004', 'conducteur_exemple4', 'Sophie', 'sophie.exemple4@transport.com', '0612131415', 'ITM-Heudebouville', 'Actif', '2023-07-25'],
      ['1005', 'conducteur_exemple5', 'Luc', 'luc.exemple5@transport.com', '0616171819', 'LIDL-Meaux', 'Actif', '2023-09-12'],
      ['1006', 'conducteur_exemple6', 'Emma', 'emma.exemple6@transport.com', '0620212223', 'ITM-Bourges', 'Actif', '2023-11-08'],
      ['1007', 'conducteur_exemple7', 'Thomas', 'thomas.exemple7@transport.com', '0624252627', 'LIDL-Chanteloup', 'Inactif', '2022-12-01'],
      ['1008', 'conducteur_exemple8', 'Claire', 'claire.exemple8@transport.com', '0628293031', 'ITM-Louviers', 'Actif', '2024-01-20']
    ];
    
    sheet.getRange(2, 1, donnees.length, 8).setValues(donnees);
    
    // Formatage
    const headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4CAF50');
    headerRange.setFontColor('white');
    
    // Auto-ajuster colonnes
    sheet.autoResizeColumns(1, 8);
    
    console.log('✅ Onglet CONDUCTEURS créé avec', donnees.length, 'exemples');
    
  } catch (error) {
    console.error('❌ Erreur création CONDUCTEURS:', error);
    throw error;
  }
}

function createVehiculesSheet() {
  try {
    console.log('🚛 Création onglet VEHICULES');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Supprimer l'onglet s'il existe déjà
    const existingSheet = spreadsheet.getSheetByName('VEHICULES');
    if (existingSheet) {
      spreadsheet.deleteSheet(existingSheet);
    }
    
    // Créer le nouvel onglet
    const sheet = spreadsheet.insertSheet('VEHICULES');
    
    // En-têtes
    sheet.getRange(1, 1, 1, 6).setValues([[
      'Immatriculation', 'Type', 'Site_Affectation', 'Statut', 'Kilometrage_Actuel', 'Date_Revision'
    ]]);
    
    // Données d'exemple (basées sur vos vraies données)
    const donnees = [
      // LIDL-Chanteloup
      ['CL-532-ZD', 'Tracteur', 'LIDL-Chanteloup', 'Disponible', '245680', '2024-12-01'],
      ['FG-193-WS', 'Remorque', 'LIDL-Chanteloup', 'Disponible', '0', '2024-11-15'],
      ['FP-675-MT', 'Remorque', 'LIDL-Chanteloup', 'Disponible', '0', '2024-10-20'],
      ['GC-454-QW', 'Tracteur', 'LIDL-Chanteloup', 'Disponible', '198456', '2024-11-30'],
      
      // ITM-Louviers  
      ['EH-725-XC', 'Tracteur', 'ITM-Louviers', 'Maintenance', '267890', '2024-12-15'],
      ['FM-155-YL', 'Remorque', 'ITM-Louviers', 'Disponible', '0', '2024-11-10'],
      ['FP-672-MT', 'Remorque', 'ITM-Louviers', 'Disponible', '0', '2024-10-25'],
      ['GA-767-AB', 'Tracteur', 'ITM-Louviers', 'Disponible', '156789', '2024-12-05'],
      
      // LIDL-Meaux
      ['FX-691-BJ', 'Tracteur', 'LIDL-Meaux', 'Disponible', '234567', '2024-11-20'],
      ['FP-678-MT', 'Remorque', 'LIDL-Meaux', 'Disponible', '0', '2024-10-30'],
      ['GH-351-EA', 'Tracteur', 'LIDL-Meaux', 'HS', '289456', '2024-12-10'],
      
      // ITM-Heudebouville
      ['GB-451-QB', 'Tracteur', 'ITM-Heudebouville', 'Disponible', '178923', '2024-11-25'],
      ['FP-683-MT', 'Remorque', 'ITM-Heudebouville', 'Disponible', '0', '2024-11-05'],
      
      // ITM-Bourges
      ['GM-572-AC', 'Tracteur', 'ITM-Bourges', 'Disponible', '203456', '2024-12-08'],
      ['FP-690-MT', 'Remorque', 'ITM-Bourges', 'Disponible', '0', '2024-10-15'],
      
      // Véhicules exemple supplémentaires
      ['VEHICULE-EX1', 'Tracteur', 'LIDL-Chanteloup', 'Disponible', '150000', '2024-12-01'],
      ['VEHICULE-EX2', 'Remorque', 'ITM-Louviers', 'Disponible', '0', '2024-11-01'],
      ['VEHICULE-EX3', 'Porteur', 'LIDL-Meaux', 'Disponible', '89000', '2024-10-01']
    ];
    
    sheet.getRange(2, 1, donnees.length, 6).setValues(donnees);
    
    // Formatage
    const headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2196F3');
    headerRange.setFontColor('white');
    
    // Auto-ajuster colonnes
    sheet.autoResizeColumns(1, 6);
    
    console.log('✅ Onglet VEHICULES créé avec', donnees.length, 'exemples');
    
  } catch (error) {
    console.error('❌ Erreur création VEHICULES:', error);
    throw error;
  }
}

function createSitesSheet() {
  try {
    console.log('🏢 Création onglet SITES');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Supprimer l'onglet s'il existe déjà
    const existingSheet = spreadsheet.getSheetByName('SITES');
    if (existingSheet) {
      spreadsheet.deleteSheet(existingSheet);
    }
    
    // Créer le nouvel onglet
    const sheet = spreadsheet.insertSheet('SITES');
    
    // En-têtes
    sheet.getRange(1, 1, 1, 5).setValues([[
      'Code_Site', 'Nom_Site', 'Adresse', 'Responsable', 'Telephone'
    ]]);
    
    // Données d'exemple (basées sur vos vraies données)
    const donnees = [
      ['LIDL-Chanteloup', 'LIDL Centre Chanteloup', '123 Avenue des Transports, 78570 Chanteloup', 'responsable_exemple1', '0145678901'],
      ['ITM-Louviers', 'ITM Plateforme Louviers', '456 Route Industrielle, 27400 Louviers', 'responsable_exemple2', '0245678902'], 
      ['LIDL-Meaux', 'LIDL Distribution Meaux', '789 Boulevard Logistique, 77100 Meaux', 'responsable_exemple3', '0145678903'],
      ['ITM-Heudebouville', 'ITM Base Heudebouville', '321 Rue des Entrepôts, 27400 Heudebouville', 'responsable_exemple4', '0245678904'],
      ['ITM-Bourges', 'ITM Centre Bourges', '654 Zone Industrielle, 18000 Bourges', 'responsable_exemple5', '0248678905'],
      ['SITE-EXEMPLE1', 'Site Exemple 1', '111 Rue Test, 75001 Paris', 'responsable_exemple6', '0145678906'],
      ['SITE-EXEMPLE2', 'Site Exemple 2', '222 Avenue Demo, 69000 Lyon', 'responsable_exemple7', '0445678907']
    ];
    
    sheet.getRange(2, 1, donnees.length, 5).setValues(donnees);
    
    // Formatage
    const headerRange = sheet.getRange(1, 1, 1, 5);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#FF9800');
    headerRange.setFontColor('white');
    
    // Auto-ajuster colonnes
    sheet.autoResizeColumns(1, 5);
    
    console.log('✅ Onglet SITES créé avec', donnees.length, 'exemples');
    
  } catch (error) {
    console.error('❌ Erreur création SITES:', error);
    throw error;
  }
}

// Fonction de test simple pour débugger
function testConducteur1001() {
  console.log('🧪 === TEST SIMPLE 1001 ===');
  return getConducteurInfo('1001');
}

function testConducteur1003() {
  console.log('🧪 === TEST SIMPLE 1003 ===');
  return getConducteurInfo('1003');
}

// Nouvelle fonction pour récupérer l'URL de déploiement
function getDeploymentInfo() {
  try {
    // Récupérer l'URL du service web déployé
    const webAppUrl = ScriptApp.getService().getUrl();
    
    console.log('🔗 URL de déploiement récupérée:', webAppUrl);
    
    return {
      webAppUrl: webAppUrl,
      scriptId: ScriptApp.getScriptId(),
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Erreur récupération URL déploiement:', error);
    
    // Fallback : retourner une structure avec l'erreur
    return {
      webAppUrl: null,
      scriptId: ScriptApp.getScriptId(),
      error: error.toString(),
      timestamp: new Date().toISOString()
    };
  }
}

// ========================================
// 🚀 PHASE 0 - NOUVELLES FONCTIONS
// ========================================

function getConducteurInfo(codeConducteur) {
  try {
    console.log('🔐 === DEBUG RECHERCHE CONDUCTEUR ===');
    console.log('🔐 Code recherché:', codeConducteur, 'Type:', typeof codeConducteur);
    
    // Vérifier que le paramètre n'est pas undefined ou null
    if (codeConducteur === undefined || codeConducteur === null || codeConducteur === '') {
      console.log('❌ Code conducteur manquant ou vide');
      return {
        error: 'Code manquant',
        message: 'Aucun code conducteur fourni. Veuillez saisir un code valide.'
      };
    }
    
    // Convertir en string pour être sûr
    codeConducteur = codeConducteur.toString().trim();
    
    // Récupérer le conducteur depuis l'onglet CONDUCTEURS
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let conducteursSheet = spreadsheet.getSheetByName('CONDUCTEURS');
    
    console.log('📊 Nom du spreadsheet:', spreadsheet.getName());
    console.log('📋 Onglet CONDUCTEURS trouvé:', !!conducteursSheet);
    
    // Si l'onglet n'existe pas, le créer
    if (!conducteursSheet) {
      console.log('📋 Onglet CONDUCTEURS introuvable, création...');
      createConducteursSheet();
      conducteursSheet = spreadsheet.getSheetByName('CONDUCTEURS');
      console.log('📋 Onglet CONDUCTEURS créé:', !!conducteursSheet);
    }
    
    // Lire toutes les données conducteurs
    const lastRow = conducteursSheet.getLastRow();
    console.log('📊 Nombre de lignes total:', lastRow);
    
    if (lastRow <= 1) {
      console.log('❌ Aucun conducteur dans l\'onglet CONDUCTEURS');
      // Essayer de créer des données d'exemple
      console.log('🔧 Tentative de création de données d\'exemple...');
      createConducteursSheet(); // Recréer avec des données
      return getConducteurInfo(codeConducteur); // Réessayer
    }
    
    // Lire en-têtes pour debug
    const headers = conducteursSheet.getRange(1, 1, 1, 8).getValues()[0];
    console.log('📋 En-têtes:', headers);
    
    const data = conducteursSheet.getRange(2, 1, lastRow - 1, 8).getValues();
    console.log('📊 Nombre de conducteurs:', data.length);
    
    // Debug: afficher tous les IDs disponibles
    const allIds = data.map(row => row[0].toString());
    console.log('🆔 IDs disponibles:', allIds);
    
    // Chercher le conducteur par ID avec debug
    console.log('🔍 Recherche de:', codeConducteur.toString());
    const conducteurRow = data.find(row => {
      const rowId = row[0].toString();
      console.log('🔍 Comparaison:', rowId, '===', codeConducteur.toString(), '?', rowId === codeConducteur.toString());
      return rowId === codeConducteur.toString();
    });
    
    if (!conducteurRow) {
      console.log('❌ Conducteur non trouvé:', codeConducteur);
      console.log('❌ Codes disponibles:', allIds.join(', '));
      return {
        error: 'Conducteur non trouvé',
        message: `Code ${codeConducteur} introuvable. Codes disponibles: ${allIds.join(', ')}`,
        availableIds: allIds
      };
    }
    
    console.log('✅ Ligne conducteur trouvée:', conducteurRow);
    
    // Construire l'objet conducteur avec sérialisation des dates
    const conducteur = {
      id: conducteurRow[0].toString(),
      nom: conducteurRow[1],
      prenom: conducteurRow[2], 
      email: conducteurRow[3],
      telephone: conducteurRow[4],
      site: conducteurRow[5],
      statut: conducteurRow[6],
      dateEmbauche: conducteurRow[7] instanceof Date ? conducteurRow[7].toLocaleDateString('fr-FR') : conducteurRow[7]
    };
    
    console.log('👤 Objet conducteur sérialisé:', conducteur);
    
    // Vérifier que le conducteur est actif
    if (conducteur.statut !== 'Actif') {
      console.log('❌ Conducteur inactif:', codeConducteur);
      return {
        error: 'Conducteur inactif',
        message: 'Votre compte est désactivé. Contactez votre responsable.'
      };
    }
    
    // Récupérer les véhicules disponibles pour ce site
    const vehicules = getVehiculesForSite(conducteur.site);
    
    console.log('✅ Conducteur trouvé:', conducteur.nom, conducteur.prenom, '- Site:', conducteur.site, '- Véhicules:', vehicules.length);
    
    const result = {
      conducteur: conducteur,
      vehicules: vehicules
    };
    
    console.log('📤 Résultat final à retourner:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ Erreur getConducteurInfo:', error);
    console.error('❌ Stack:', error.stack);
    throw error;
  }
}

function getVehiculesForSite(site) {
  try {
    console.log('🚛 Recherche véhicules pour site:', site);
    
    // Récupérer les véhicules depuis l'onglet VEHICULES
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let vehiculesSheet = spreadsheet.getSheetByName('VEHICULES');
    
    // Si l'onglet n'existe pas, le créer
    if (!vehiculesSheet) {
      console.log('📋 Onglet VEHICULES introuvable, création...');
      createVehiculesSheet();
      vehiculesSheet = spreadsheet.getSheetByName('VEHICULES');
    }
    
    // Lire toutes les données véhicules
    const lastRow = vehiculesSheet.getLastRow();
    if (lastRow <= 1) {
      console.log('⚠️ Aucun véhicule dans l\'onglet VEHICULES');
      return [];
    }
    
    const data = vehiculesSheet.getRange(2, 1, lastRow - 1, 6).getValues();
    
    // Filtrer les véhicules par site et statut disponible
    const vehicules = data
      .filter(row => row[2] === site && row[3] === 'Disponible') // Site_Affectation et Statut
      .map(row => ({
        immatriculation: row[0],
        type: row[1],
        site: row[2],
        statut: row[3],
        kilometrage: row[4] || 0,
        dateRevision: row[5] instanceof Date ? row[5].toLocaleDateString('fr-FR') : (row[5] || 'Non renseigné')
      }));
    
    console.log('🚛 Véhicules trouvés pour', site, ':', vehicules.length);
    
    return vehicules;
    
  } catch (error) {
    console.error('❌ Erreur getVehiculesForSite:', error);
    
    // Fallback avec quelques véhicules par défaut
    console.log('⚠️ Utilisation des véhicules par défaut');
    return [
      { immatriculation: 'CL-532-ZD', type: 'Tracteur', site: site, statut: 'Disponible', kilometrage: 245680 },
      { immatriculation: 'FG-193-WS', type: 'Remorque', site: site, statut: 'Disponible', kilometrage: 0 }
    ];
  }
}

function savePhase0Data(data) {
  try {
    console.log('📊 === SAUVEGARDE PHASE 0 ===');
    console.log('📥 Données reçues:', data);
    console.log('🆔 Session ID:', data?.sessionId);
    console.log('👤 Conducteur:', data?.conducteur?.nom);
    console.log('💾 Début sauvegarde Phase 0:', data.sessionId);
    
    // Créer ou récupérer l'onglet Sessions
    const sheets = getSheets();
    const sessionsSheet = sheets.sessions;
    
    // Préparer les données pour insertion
    const sessionRow = [
      data.sessionId,                           // Session_ID
      new Date(),                              // Created_At
      false,                                   // Phase1_Completed
      false,                                   // Phase2_Completed  
      false,                                   // Phase3_Completed
      data.conducteur.nom + ' ' + data.conducteur.prenom, // Conducteur
      data.conducteur.site,                    // Site
      data.tournee.typeTour,                   // Tour
      'PHASE0_COMPLETED',                      // Status
      new Date()                               // Last_Updated
    ];
    
    // Ajouter la ligne
    sessionsSheet.appendRow(sessionRow);
    
    // Sauvegarder les détails dans localStorage côté client
    // (Les données détaillées seront transmises aux phases suivantes)
    
    console.log('✅ Phase 0 sauvegardée avec succès');
    console.log('📊 === FIN SAUVEGARDE PHASE 0 SUCCESS ===');
    
    return {
      success: true,
      sessionId: data.sessionId,
      message: 'Phase 0 sauvegardée avec succès',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Erreur sauvegarde Phase 0:', error);
    throw error;
  }
}

// ========================================
// 🧪 TESTS FONCTIONS SPA
// ========================================

function testSavePhase0Data() {
  console.log('🧪 === TEST SAUVEGARDE PHASE 0 ===');
  
  const testData = {
    sessionId: 'TEST_' + Date.now(),
    conducteur: {
      id: '1001',
      nom: 'Test',
      prenom: 'Conducteur', 
      site: 'Test Site'
    },
    tournee: {
      date: '2025-01-15',
      heure: '08:00',
      type: '1er Tour',
      livraison: 'Frais'
    },
    vehiculesSelected: {
      tracteur: 'TEST-123-AB',
      remorque: 'TEST-456-CD',
      commentaires: 'Test véhicules'
    },
    timestamp: new Date().toISOString()
  };
  
  try {
    const result = savePhase0Data(testData);
    console.log('✅ Test savePhase0Data réussi:', result);
    return result;
  } catch (error) {
    console.error('❌ Test savePhase0Data échoué:', error);
    return { success: false, error: error.toString() };
  }
}

function testJavaScriptLoading() {
  console.log('🧪 === TEST CHARGEMENT JAVASCRIPT ===');
  
  try {
    // Test de serving du fichier HTML
    const htmlOutput = HtmlService.createTemplateFromFile('index-spa')
      .evaluate()
      .getContent();
      
    console.log('📄 HTML généré - longueur:', htmlOutput.length);
    
    // Vérifier la présence de JavaScript
    const hasScript = htmlOutput.includes('<script>');
    const hasShowSection = htmlOutput.includes('function showSection');
    const hasStartNewTour = htmlOutput.includes('function startNewTour');
    
    console.log('✅ Checks JavaScript:');
    console.log('📜 Balise <script>:', hasScript);
    console.log('🧭 fonction showSection:', hasShowSection);
    console.log('🚀 fonction startNewTour:', hasStartNewTour);
    
    return {
      success: true,
      htmlLength: htmlOutput.length,
      hasScript: hasScript,
      hasShowSection: hasShowSection,
      hasStartNewTour: hasStartNewTour
    };
    
  } catch (error) {
    console.error('❌ Test JavaScript loading échoué:', error);
    return { success: false, error: error.toString() };
  }
}

function runAllTests() {
  console.log('🧪 === EXÉCUTION DE TOUS LES TESTS ===');
  
  const results = {};
  
  // Test 1: Chargement JavaScript
  results.javascriptLoading = testJavaScriptLoading();
  
  // Test 2: Sauvegarde Phase 0
  results.savePhase0 = testSavePhase0Data();
  
  // Test 3: Connexion conducteur
  results.conducteur1001 = testConducteur1001();
  
  console.log('📊 === RÉSULTATS TESTS ===');
  console.log(results);
  
  return results;
}