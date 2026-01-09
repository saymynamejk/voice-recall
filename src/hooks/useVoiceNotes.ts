import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BucketType, NoteStatus } from '@/types';

export interface VoiceNote {
  id: string;
  user_id: string;
  project_id: string;
  bucket_type: BucketType;
  status: NoteStatus;
  title: string | null;
  transcription: string | null;
  audio_url: string | null;
  duration: number;
  quality: string;
  tags: string[];
  log_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVoiceNoteInput {
  project_id: string;
  bucket_type: BucketType;
  audio_blob: Blob;
  duration: number;
  title?: string;
  log_date?: string;
}

export function useVoiceNotes(projectId?: string, bucketType?: BucketType) {
  return useQuery({
    queryKey: ['voice-notes', projectId, bucketType],
    queryFn: async () => {
      let query = supabase
        .from('voice_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      if (bucketType) {
        query = query.eq('bucket_type', bucketType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VoiceNote[];
    },
    enabled: !!projectId || !projectId,
  });
}

export function useVoiceNote(noteId: string | undefined) {
  return useQuery({
    queryKey: ['voice-notes', 'single', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      
      const { data, error } = await supabase
        .from('voice_notes')
        .select('*')
        .eq('id', noteId)
        .maybeSingle();

      if (error) throw error;
      return data as VoiceNote | null;
    },
    enabled: !!noteId,
  });
}

export function useCreateVoiceNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateVoiceNoteInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload audio file
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, input.audio_blob, {
          contentType: 'audio/webm',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(fileName);

      // Create voice note record
      const { data, error } = await supabase
        .from('voice_notes')
        .insert({
          user_id: user.id,
          project_id: input.project_id,
          bucket_type: input.bucket_type,
          audio_url: publicUrl,
          duration: Math.round(input.duration),
          title: input.title || null,
          log_date: input.log_date || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as VoiceNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voice-notes'] });
      toast({ title: 'Voice note saved!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error saving voice note', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });
}

export function useUpdateVoiceNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<VoiceNote> & { id: string }) => {
      const { data, error } = await supabase
        .from('voice_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as VoiceNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voice-notes'] });
    },
    onError: (error) => {
      toast({ 
        title: 'Error updating voice note', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });
}

export function useDeleteVoiceNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('voice_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voice-notes'] });
      toast({ title: 'Voice note deleted' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting voice note', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });
}
