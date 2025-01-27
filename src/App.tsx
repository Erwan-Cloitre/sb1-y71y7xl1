import React, { useState } from 'react';
import { GraduationCap, Euro, ArrowRight, Calculator } from 'lucide-react';

type EnseignementType = '6-3' | 'prepa' | 'apprenti' | 'classique' | 'technique' | 'superieur';
type HebergementType = 'domicile' | 'horsdomicile' | 'superieur';
type ForfaitType = 'non' | 'prive' | 'pupille';

function App() {
  const [revenuFiscal, setRevenuFiscal] = useState<string>('');
  const [enseignement, setEnseignement] = useState<EnseignementType | ''>('');
  const [hebergement, setHebergement] = useState<HebergementType | ''>('');
  const [forfait, setForfait] = useState<ForfaitType | ''>('');
  const [resultat, setResultat] = useState<{
    montantBrut: number;
    participationFamiliale: number;
    montantNet: number;
  } | null>(null);

  const MONTANTS = {
    enseignement: {
      '6-3': 140.46,
      'prepa': 140.46,
      'apprenti': 165.84,
      'classique': 218.02,
      'technique': 249.42,
      'superieur': 401.94
    },
    hebergement: {
      'domicile': 473.17,
      'horsdomicile': 1185.14,
      'superieur': 1980.94
    },
    forfait: {
      'non': 0,
      'prive': 370.27,
      'pupille': 412.62
    },
    participation: {
      'domicile': 0.025,
      'horsdomicile': 0.0425,
      'superieur': 0.053
    }
  };

  const PLAFOND_MONTANT_NET = 700;

  const calculerDroits = () => {
    if (revenuFiscal && enseignement && hebergement) {
      const revenu = parseFloat(revenuFiscal);
      const montantEnseignement = MONTANTS.enseignement[enseignement];
      const montantHebergement = MONTANTS.hebergement[hebergement];
      const montantForfait = MONTANTS.forfait[forfait || 'non'];
      
      const montantBrut = montantEnseignement + montantHebergement + montantForfait;
      const tauxParticipation = MONTANTS.participation[hebergement];
      const participationFamiliale = revenu * tauxParticipation;
      let montantNet = Math.max(0, montantBrut - participationFamiliale);
      
      // Arrondir à l'euro supérieur
      montantNet = Math.ceil(montantNet);
      
      // Plafonnement à 700€
      montantNet = Math.min(montantNet, PLAFOND_MONTANT_NET);

      setResultat({
        montantBrut,
        participationFamiliale,
        montantNet
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Simulateur d'Indemnités Pour Frais d'Etudes (I.F.E)
          </h1>
          <p className="text-gray-600">
            Calculez les indemnités pour les frais d'études en fonction de votre situation
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label 
                  htmlFor="enseignement" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Type d'enseignement suivi
                </label>
                <select
                  id="enseignement"
                  value={enseignement}
                  onChange={(e) => setEnseignement(e.target.value as EnseignementType)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Sélectionnez le type d'enseignement</option>
                  <option value="6-3">De la 6ème à la 3ème</option>
                  <option value="prepa">Classes préparatoires (CCPN / CPA)</option>
                  <option value="apprenti">Apprentis sous contrat</option>
                  <option value="classique">Seconde à Terminale (Enseignement classique)</option>
                  <option value="technique">Enseignement technique ou professionnel court</option>
                  <option value="superieur">Enseignement supérieur (au-delà du bac)</option>
                </select>
              </div>

              <div>
                <label 
                  htmlFor="hebergement" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Type d'hébergement
                </label>
                <select
                  id="hebergement"
                  value={hebergement}
                  onChange={(e) => setHebergement(e.target.value as HebergementType)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Sélectionnez le type d'hébergement</option>
                  <option value="domicile">Étudiant hébergé au domicile familial</option>
                  <option value="horsdomicile">Étudiant hébergé hors du domicile familial - études autres que supérieures</option>
                  <option value="superieur">Étudiant hébergé hors du domicile familial - études supérieures</option>
                </select>
              </div>

              <div>
                <label 
                  htmlFor="forfait" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Forfait Enseignement Sup - Pupille
                </label>
                <select
                  id="forfait"
                  value={forfait}
                  onChange={(e) => setForfait(e.target.value as ForfaitType)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="non">Non</option>
                  <option value="prive">Plafond "enseignements supérieur privé"</option>
                  <option value="pupille">Forfait Pupilles</option>
                </select>
              </div>

              <div>
                <label 
                  htmlFor="revenu" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Revenu fiscal de référence
                </label>
                <div className="relative">
                  <input
                    id="revenu"
                    type="number"
                    value={revenuFiscal}
                    onChange={(e) => setRevenuFiscal(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 30000"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Euro className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <button
                onClick={calculerDroits}
                disabled={!revenuFiscal || !enseignement || !hebergement}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Calculer les droits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Résultat de la simulation
              </h2>
              {resultat ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Montant brut des droits</p>
                        <p className="text-xl font-bold text-gray-900">
                          {resultat.montantBrut.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Participation familiale</p>
                        <p className="text-xl font-bold text-red-600">
                          -{resultat.participationFamiliale.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </p>
                      </div>
                      <div className="pt-3 border-t">
                        <p className="text-sm text-gray-600">Montant net à percevoir</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {resultat.montantNet.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </p>
                        {resultat.montantNet === PLAFOND_MONTANT_NET && (
                          <p className="text-sm text-gray-500 mt-1">
                            * Le montant a été plafonné à {PLAFOND_MONTANT_NET.toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    * Cette estimation est calculée selon les barèmes en vigueur et votre situation spécifique.
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Remplissez tous les champs pour obtenir une estimation de vos droits</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>
            Ce simulateur fournit une estimation basée sur les barèmes officiels.
            Pour plus de précisions, veuillez consulter votre organisme de référence.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;