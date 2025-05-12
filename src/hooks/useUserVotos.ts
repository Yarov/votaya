import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

export interface UserVoto {
  _id: string;
  candidatoId: string;
  timestamp: string;
  [key: string]: any;
}

interface UseUserVotosResult {
  userVotedIds: Set<string>;
  votos: UserVoto[];
  hasVoted: (candidatoId: string) => boolean;
  loading: boolean;
  error: string;
  refetch: () => void;
}

export function useUserVotos(): UseUserVotosResult {
  const { user, isSignedIn } = useUser();
  const [votos, setVotos] = useState<UserVoto[]>([]);
  const [userVotedIds, setUserVotedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVotos = useCallback(async () => {
    if (!isSignedIn || !user?.id) {
      setVotos([]);
      setUserVotedIds(new Set());
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/votos/usuario');
      if (!response.ok) throw new Error('No se pudieron obtener los votos del usuario');
      const data = await response.json();
      setVotos(data.votos || []);
      setUserVotedIds(new Set((data.votos || []).map((v: any) => v.candidatoId)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setVotos([]);
      setUserVotedIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, user?.id]);

  useEffect(() => {
    fetchVotos();
  }, [fetchVotos]);

  const hasVoted = useCallback((candidatoId: string) => userVotedIds.has(candidatoId), [userVotedIds]);

  return { userVotedIds, votos, hasVoted, loading, error, refetch: fetchVotos };
}
