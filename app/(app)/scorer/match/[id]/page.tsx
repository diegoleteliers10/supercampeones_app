"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { 
  Plus, Minus, Play, Square, Flag, 
  Trash2, Edit2, X, Check, Clock
} from "lucide-react";
import Link from "next/link";

interface Goal {
  id: string;
  teamId: string;
  playerName: string;
  minute: number;
}

interface FairplayCard {
  id: string;
  teamId: string;
  note?: string;
}

// Demo data
const matchData: {
  id: string;
  localTeam: { id: string; name: string; primaryColor: string };
  visitorTeam: { id: string; name: string; primaryColor: string };
  status: "upcoming" | "live" | "completed" | "blocked";
  scoreLocal: number;
  scoreVisitor: number;
  time: string;
  field: string;
  startedAt?: number;
  roundNumber?: number;
} = {
  id: "1",
  localTeam: { id: "1", name: "Atlético Chiquito", primaryColor: "#10B981" },
  visitorTeam: { id: "2", name: "Barcelona Kids", primaryColor: "#DC2626" },
  status: "live",
  scoreLocal: 0,
  scoreVisitor: 0,
  time: "11:00",
  field: "Campo 2",
  startedAt: Date.now() - 15 * 60 * 1000, // 15 minutes ago
};

// Demo players
const localPlayers = [
  { id: "1", name: "Carlos García", number: 1 },
  { id: "2", name: "Diego Fernández", number: 3 },
  { id: "3", name: "Miguel Rodríguez", number: 5 },
  { id: "4", name: "Andrés Martínez", number: 7 },
  { id: "5", name: "Lucas Sánchez", number: 9 },
  { id: "6", name: "Pablo Torres", number: 11 },
];

const visitorPlayers = [
  { id: "7", name: "Sergio Jiménez", number: 1 },
  { id: "8", name: "Jorge López", number: 4 },
  { id: "9", name: "Raúl González", number: 6 },
  { id: "10", name: "David Martín", number: 8 },
  { id: "11", name: "Antonio Ruiz", number: 10 },
];

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState(matchData);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [fairplayCards, setFairplayCards] = useState<FairplayCard[]>([]);
  const [showGoalForm, setShowGoalForm] = useState<"local" | "visitor" | null>(null);
  const [showCardForm, setShowCardForm] = useState<"local" | "visitor" | null>(null);
  const [goalForm, setGoalForm] = useState({ playerName: "", minute: "" });
  const [cardForm, setCardForm] = useState({ note: "" });

  // Timer effect
  useEffect(() => {
    if (match.status === "live" && match.startedAt) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - match.startedAt!) / 60000);
        setElapsedMinutes(elapsed);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [match.status, match.startedAt]);

  const handleScoreChange = (team: "local" | "visitor", delta: number) => {
    setMatch(prev => ({
      ...prev,
      scoreLocal: team === "local" ? Math.max(0, prev.scoreLocal + delta) : prev.scoreLocal,
      scoreVisitor: team === "visitor" ? Math.max(0, prev.scoreVisitor + delta) : prev.scoreVisitor,
    }));
  };

  const handleAddGoal = (team: "local" | "visitor") => {
    if (!goalForm.playerName || !goalForm.minute) return;
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      teamId: team === "local" ? match.localTeam.id : match.visitorTeam.id,
      playerName: goalForm.playerName,
      minute: parseInt(goalForm.minute),
    };
    
    setGoals(prev => [...prev, newGoal]);
    setGoalForm({ playerName: "", minute: "" });
    setShowGoalForm(null);
  };

  const handleAddFairplayCard = (team: "local" | "visitor") => {
    const newCard: FairplayCard = {
      id: Date.now().toString(),
      teamId: team === "local" ? match.localTeam.id : match.visitorTeam.id,
      note: cardForm.note || undefined,
    };
    
    setFairplayCards(prev => [...prev, newCard]);
    setCardForm({ note: "" });
    setShowCardForm(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const handleDeleteFairplayCard = (cardId: string) => {
    setFairplayCards(prev => prev.filter(c => c.id !== cardId));
  };

  const handleStartMatch = () => {
    setMatch(prev => ({ ...prev, status: "live", startedAt: Date.now() }));
  };

  const handleFinishMatch = () => {
    setMatch(prev => ({ ...prev, status: "completed" }));
  };

  const isMatchActive = match.status === "live";
  const isMatchCompleted = match.status === "completed";

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header 
        title={`Partido ${match.field}`}
        subtitle={`Fecha ${match.roundNumber || 1}`}
      />

      <div className="p-4 space-y-4">
        {/* Match Header Card */}
        <Card className="overflow-hidden">
          <div 
            className="h-2"
            style={{ backgroundColor: match.status === "live" ? "#10B981" : "#2563EB" }}
          />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Badge variant={match.status}>
                {match.status === "live" && (
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />
                )}
                {match.status === "upcoming" ? "Próximo" : 
                 match.status === "live" ? "En Vivo" : "Finalizado"}
              </Badge>
              {isMatchActive && (
                <div className="flex items-center gap-1 text-sm font-mono text-text-secondary">
                  <Clock className="w-4 h-4" />
                  {elapsedMinutes}'
                </div>
              )}
            </div>

            {/* Teams and Score */}
            <div className="flex items-center justify-between">
              {/* Local Team */}
              <div className="flex-1">
                <Avatar 
                  name={match.localTeam.name}
                  size="lg"
                  className="mb-2 text-white"
                  style={{ backgroundColor: match.localTeam.primaryColor }}
                />
                <p className="font-semibold text-text-primary text-sm text-center">
                  {match.localTeam.name}
                </p>
              </div>

              {/* Score */}
              <div className="px-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => isMatchActive && handleScoreChange("local", -1)}
                    disabled={!isMatchActive || match.scoreLocal === 0}
                    className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center disabled:opacity-30 hover:bg-bg-secondary transition-colors"
                  >
                    <Minus className="w-5 h-5 text-text-secondary" />
                  </button>
                  <div className="text-center">
                    <span className="text-4xl font-bold font-mono text-text-primary">
                      {match.scoreLocal}
                    </span>
                    <span className="text-2xl text-text-muted mx-1">-</span>
                    <span className="text-4xl font-bold font-mono text-text-primary">
                      {match.scoreVisitor}
                    </span>
                  </div>
                  <button
                    onClick={() => isMatchActive && handleScoreChange("visitor", -1)}
                    disabled={!isMatchActive || match.scoreVisitor === 0}
                    className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center disabled:opacity-30 hover:bg-bg-secondary transition-colors"
                  >
                    <Minus className="w-5 h-5 text-text-secondary" />
                  </button>
                </div>
              </div>

              {/* Visitor Team */}
              <div className="flex-1 text-center">
                <Avatar 
                  name={match.visitorTeam.name}
                  size="lg"
                  className="mb-2 mx-auto text-white"
                  style={{ backgroundColor: match.visitorTeam.primaryColor }}
                />
                <p className="font-semibold text-text-primary text-sm">
                  {match.visitorTeam.name}
                </p>
              </div>
            </div>

            {/* Score increment buttons */}
            {isMatchActive && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleScoreChange("local", 1)}
                >
                  <Plus className="w-4 h-4" />
                  Gol Local
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleScoreChange("visitor", 1)}
                >
                  <Plus className="w-4 h-4" />
                  Gol Visita
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Match Controls */}
        {!isMatchActive && !isMatchCompleted && (
          <Button onClick={handleStartMatch} size="lg" className="w-full">
            <Play className="w-5 h-5" />
            Iniciar Partido
          </Button>
        )}

        {isMatchActive && (
          <Button onClick={handleFinishMatch} variant="secondary" size="lg" className="w-full">
            <Square className="w-5 h-5" />
            Finalizar Partido
          </Button>
        )}

        {/* Goals Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <Flag className="w-5 h-5 text-accent" />
              Goles
            </h2>
            {isMatchActive && (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowGoalForm("local")}
                >
                  <Plus className="w-4 h-4" />
                  Local
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowGoalForm("visitor")}
                >
                  <Plus className="w-4 h-4" />
                  Visita
                </Button>
              </div>
            )}
          </div>

          {/* Add Goal Forms */}
          {showGoalForm && (
            <Card className="mb-3">
              <CardHeader className="pb-2">
                <p className="text-sm font-medium">
                  Agregar Gol - {showGoalForm === "local" ? match.localTeam.name : match.visitorTeam.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input 
                  placeholder="Nombre del jugador"
                  value={goalForm.playerName}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, playerName: e.target.value }))}
                />
                <Input 
                  placeholder="Minuto"
                  type="number"
                  value={goalForm.minute}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, minute: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setShowGoalForm(null);
                      setGoalForm({ playerName: "", minute: "" });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddGoal(showGoalForm)}
                  >
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Goals List */}
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {goals.length > 0 ? (
                goals.map((goal) => {
                  const team = goal.teamId === match.localTeam.id ? match.localTeam : match.visitorTeam;
                  return (
                    <div key={goal.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={team.name} size="sm" style={{ backgroundColor: team.primaryColor }} className="text-white" />
                        <div>
                          <p className="font-medium text-text-primary text-sm">{goal.playerName}</p>
                          <p className="text-xs text-text-muted">{team.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-accent">
                          {goal.minute}'
                        </span>
                        {isMatchActive && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-error hover:text-error hover:bg-error/10"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <Flag className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                  <p className="text-sm text-text-muted">No hay goles registrados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fairplay Cards Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              Tarjetas Fairplay
            </h2>
            {isMatchActive && (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCardForm("local")}
                >
                  <Plus className="w-4 h-4" />
                  Local
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCardForm("visitor")}
                >
                  <Plus className="w-4 h-4" />
                  Visita
                </Button>
              </div>
            )}
          </div>

          {/* Add Fairplay Card Forms */}
          {showCardForm && (
            <Card className="mb-3">
              <CardHeader className="pb-2">
                <p className="text-sm font-medium">
                  Tarjeta Fairplay - {showCardForm === "local" ? match.localTeam.name : match.visitorTeam.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input 
                  placeholder="Nota (opcional)"
                  value={cardForm.note}
                  onChange={(e) => setCardForm(prev => ({ ...prev, note: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setShowCardForm(null);
                      setCardForm({ note: "" });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddFairplayCard(showCardForm)}
                  >
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fairplay Cards List */}
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {fairplayCards.length > 0 ? (
                fairplayCards.map((card) => {
                  const team = card.teamId === match.localTeam.id ? match.localTeam : match.visitorTeam;
                  return (
                    <div key={card.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                          <Card className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary text-sm">{team.name}</p>
                          {card.note && (
                            <p className="text-xs text-text-muted">{card.note}</p>
                          )}
                        </div>
                      </div>
                      {isMatchActive && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-error hover:text-error hover:bg-error/10"
                          onClick={() => handleDeleteFairplayCard(card.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <Card className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                  <p className="text-sm text-text-muted">No hay tarjetas fairplay</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
