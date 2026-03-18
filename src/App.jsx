import React, { useState, useEffect } from 'react';
import { Trophy, Target, Clock, CheckCircle2, Circle, ChevronDown, ChevronUp, Zap, TrendingUp, BookOpen, Users, DollarSign } from 'lucide-react';

const ROADMAP_DATA = [
  {
    id: 'phase1',
    title: 'Phase 1 : Restructuration (J1 - J14)',
    color: 'bg-blue-500',
    icon: <BookOpen className="w-5 h-5 text-white" />,
    tasks: [
      {
        id: 't1_1',
        title: 'Créer le Pack "Grand Oral"',
        time: '3h',
        xp: 100,
        steps: [
          'Lister les 5 piliers de votre méthode d\'accompagnement.',
          'Rédiger la promesse (ex: "Mention assurée ou remboursé").',
          'Fixer le prix forfaitaire (ex: 550€) et non plus un taux horaire.',
          'Créer un PDF de présentation simple sur Canva.'
        ],
        deliverable: 'Fiche Produit PDF (1 page) prête à être envoyée.',
        tools: 'Canva, Notion'
      },
      {
        id: 't1_2',
        title: 'Arbitrage du Portefeuille (Purge)',
        time: '1h30',
        xp: 150,
        steps: [
          'Identifier les 2-3 clients les moins rentables ou les plus chronophages.',
          'Adapter le template email "Pivot Tarifaire".',
          'Envoyer l\'email pour annoncer la montée en gamme (+30% ou forfait).',
          'Gérer les réponses (acceptation ou rupture amiable).'
        ],
        deliverable: 'Agenda libéré de 3 à 5h/semaine ou CA augmenté.',
        tools: 'Gmail'
      },
      {
        id: 't1_3',
        title: 'Setup de la Bibliothèque Notion',
        time: '4h',
        xp: 100,
        steps: [
          'Créer une base de données Notion "Bibliothèque de Savoirs".',
          'Capitaliser vos 5 meilleures analyses de textes déjà faites.',
          'Créer 3 templates de fiches méthodes réutilisables.',
        ],
        deliverable: 'Espace de travail centralisé (fini la page blanche).',
        tools: 'Notion'
      },
      {
        id: 't1_4',
        title: 'Automatisation Calendly',
        time: '1h30',
        xp: 50,
        steps: [
          'Créer un compte Calendly et lier votre agenda.',
          'Définir des créneaux stricts pour les appels de diagnostic (15 min).',
          'Ajouter le lien dans votre signature email et vos profils.',
        ],
        deliverable: 'Lien de réservation fonctionnel (zéro mail pour booker un RDV).',
        tools: 'Calendly'
      }
    ]
  },
  {
    id: 'phase2',
    title: 'Phase 2 : Acquisition & Autorité (J15 - J45)',
    color: 'bg-orange-500',
    icon: <Users className="w-5 h-5 text-white" />,
    tasks: [
      {
        id: 't2_1',
        title: 'Refonte Vitrines (LinkedIn & Superprof)',
        time: '2h',
        xp: 100,
        steps: [
          'Changer la bannière LinkedIn pour afficher votre promesse.',
          'Modifier le titre : "J\'aide vos enfants à décrocher la mention au Bac".',
          'Réécrire l\'annonce Superprof en se focalisant sur la douleur du stress oral.'
        ],
        deliverable: 'Profils optimisés pour la conversion Premium.',
        tools: 'LinkedIn, Superprof'
      },
      {
        id: 't2_2',
        title: 'Création du Lead Magnet',
        time: '3h',
        xp: 150,
        steps: [
          'Rédiger "Les 10 erreurs qui coûtent 5 points au Grand Oral".',
          'Mettre en page de façon professionnelle.',
          'Héberger le fichier sur Google Drive (lien public).'
        ],
        deliverable: 'PDF téléchargeable prêt à capturer des leads.',
        tools: 'Canva, Google Drive'
      },
      {
        id: 't2_3',
        title: 'Routine de Contenu Organique',
        time: '2h/sem',
        xp: 100,
        steps: [
          'Bloquer 2h le dimanche matin.',
          'Rédiger 1 post "Douleur/Solution" et 1 post "Témoignage/Résultat".',
          'Programmer les publications pour le mardi et jeudi 8h.'
        ],
        deliverable: '2 contenus publiés par semaine systématiquement.',
        tools: 'LinkedIn'
      },
      {
        id: 't2_4',
        title: 'Prospection Prescripteurs',
        time: '3h/sem',
        xp: 150,
        steps: [
          'Lister 10 conseillers d\'orientation ou orthophonistes locaux.',
          'Leur envoyer un message personnalisé sur LinkedIn.',
          'Proposer un appel de 10 min pour un échange de visibilité.'
        ],
        deliverable: 'Au moins 2 partenariats de recommandation activés.',
        tools: 'LinkedIn, Réseau local'
      }
    ]
  },
  {
    id: 'phase3',
    title: 'Phase 3 : Conversion & Scalabilité (J46 - J90)',
    color: 'bg-emerald-500',
    icon: <DollarSign className="w-5 h-5 text-white" />,
    tasks: [
      {
        id: 't3_1',
        title: 'Lancement du Collectif (Bootcamp)',
        time: '2h',
        xp: 100,
        steps: [
          'Fixer 2 dates de "Stage Intensif" le samedi matin.',
          'Créer un lien de paiement pour 4 places maximum.',
          'Envoyer l\'offre par mail à tous vos prospects tièdes.'
        ],
        deliverable: '1er groupe rempli générant 240€/h.',
        tools: 'Stripe, Zoom/Présentiel'
      },
      {
        id: 't3_2',
        title: 'Closing des Leads (PDF)',
        time: '3h/sem',
        xp: 100,
        steps: [
          'Contacter tous ceux qui ont téléchargé le Lead Magnet en MP.',
          'Poser la question : "Quelle est la plus grande difficulté de [Prénom] ?".',
          'Proposer un appel de diagnostic gratuit de 15 min.'
        ],
        deliverable: '3 à 5 appels de vente bookés par semaine.',
        tools: 'Notion (CRM), Messages LinkedIn'
      },
      {
        id: 't3_3',
        title: 'Appels de Diagnostic & Vente',
        time: '4h/sem',
        xp: 200,
        steps: [
          'Mener l\'appel en écoutant à 80% (focus sur le stress du parent).',
          'Présenter le "Pack Grand Oral" comme la seule solution sécurisante.',
          'Traiter les objections et envoyer le lien de paiement en direct.'
        ],
        deliverable: '5 Nouveaux clients Premium signés.',
        tools: 'Google Meet, Script de vente'
      }
    ]
  }
];

const DAILY_HABITS = [
  { id: 'd1', label: 'Production : J\'ai créé ou amélioré 1 template/module.', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'd2', label: 'Visibilité : J\'ai interagi avec 5 cibles ou posté du contenu.', icon: <Target className="w-4 h-4" /> },
  { id: 'd3', label: 'Vente : J\'ai relancé un prospect ou proposé un appel.', icon: <TrendingUp className="w-4 h-4" /> }
];

export default function Dashboard() {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [expandedPhase, setExpandedPhase] = useState('phase1');
  const [expandedTask, setExpandedTask] = useState(null);
  const [dailyState, setDailyState] = useState({ d1: false, d2: false, d3: false });
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate XP and Progress
  const totalXPRequired = ROADMAP_DATA.flatMap(p => p.tasks).reduce((acc, task) => acc + task.xp, 0);
  const currentXP = Array.from(completedTasks).reduce((acc, taskId) => {
    const task = ROADMAP_DATA.flatMap(p => p.tasks).find(t => t.id === taskId);
    return acc + (task ? task.xp : 0);
  }, 0);

  const progressPercentage = Math.round((currentXP / totalXPRequired) * 100);
  
  // Gamification Levels
  let level = "Artisan du Savoir (Niv. 1)";
  let levelColor = "text-gray-600";
  if (currentXP >= 400) { level = "Stratège de la Mention (Niv. 2)"; levelColor = "text-blue-600"; }
  if (currentXP >= 900) { level = "Architecte Haut de Gamme (Niv. 3)"; levelColor = "text-emerald-600"; }

  const projectedCA = 2500 + Math.floor(currentXP / 100) * 200; // Simulated CA growth

  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
      triggerConfetti();
    }
    setCompletedTasks(newCompleted);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const toggleDaily = (id) => {
    setDailyState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      {/* Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 overflow-hidden">
           <div className="absolute animate-bounce text-6xl">🌟</div>
           <div className="absolute animate-ping text-6xl text-yellow-400 opacity-75">🏆</div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER STATS */}
        <header className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Tracker Stratégique 90 Jours</h1>
            <p className="text-slate-500 mt-1">Objectif : +5 Clients Premium | Objectif CA : 5 000€</p>
            <div className={`mt-3 font-semibold text-lg flex items-center gap-2 ${levelColor}`}>
              <Trophy className="w-5 h-5" />
              {level}
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-slate-600">Expérience (XP)</span>
                <span className="text-slate-800">{currentXP} / {totalXPRequired} XP</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div 
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 flex items-center justify-between">
              <span className="text-emerald-800 font-medium text-sm flex items-center gap-1">
                <DollarSign className="w-4 h-4" /> CA Mensuel Projeté
              </span>
              <span className="text-emerald-700 font-bold text-lg">{projectedCA} €</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: DAILY STANDUP */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                Daily Stand-up
              </h2>
              <p className="text-xs text-slate-500 mb-4">Vos 3 priorités quotidiennes pour maintenir l'élan de croissance.</p>
              
              <div className="space-y-3">
                {DAILY_HABITS.map(habit => (
                  <button 
                    key={habit.id}
                    onClick={() => toggleDaily(habit.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${
                      dailyState[habit.id] 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-800' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {dailyState[habit.id] ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{habit.label}</div>
                    </div>
                  </button>
                ))}
              </div>
              {Object.values(dailyState).every(Boolean) && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 text-center font-medium animate-pulse">
                  Excellente journée ! Vous avez fait avancer le business. 🚀
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ROADMAP */}
          <div className="lg:col-span-2 space-y-4">
            {ROADMAP_DATA.map((phase) => (
              <div key={phase.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Phase Header */}
                <button 
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${phase.color}`}>
                      {phase.icon}
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">{phase.title}</h2>
                  </div>
                  {expandedPhase === phase.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {/* Phase Tasks */}
                {expandedPhase === phase.id && (
                  <div className="px-5 pb-5 space-y-3">
                    {phase.tasks.map(task => {
                      const isCompleted = completedTasks.has(task.id);
                      const isExpanded = expandedTask === task.id;

                      return (
                        <div key={task.id} className={`border rounded-xl transition-all ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-white'}`}>
                          
                          {/* Task Header */}
                          <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpandedTask(isExpanded ? null : task.id)}>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                                className="focus:outline-none"
                              >
                                {isCompleted ? 
                                  <CheckCircle2 className="w-6 h-6 text-green-500" /> : 
                                  <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-400" />
                                }
                              </button>
                              <div>
                                <h3 className={`font-semibold ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                  {task.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time}</span>
                                  <span className="flex items-center gap-1 font-medium text-indigo-600">+{task.xp} XP</span>
                                </div>
                              </div>
                            </div>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>

                          {/* Task Details */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-slate-100 ml-10">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pas à pas</h4>
                                  <ul className="space-y-1">
                                    {task.steps.map((step, idx) => (
                                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                        <span className="text-indigo-400 mt-0.5">•</span>
                                        {step}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Livrable Attendu</h4>
                                  <p className="text-sm font-medium text-slate-800">{task.deliverable}</p>
                                </div>

                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                  <span className="font-semibold">Outils :</span> {task.tools}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
