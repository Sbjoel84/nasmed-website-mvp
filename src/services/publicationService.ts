import supabase from '../lib/supabaseClient';

export interface Publication {
  id: string;
  created_at: string;
  title: string;
  type: 'Guidelines' | 'Journal' | 'Protocol' | 'Research' | 'Newsletter' | 'Report';
  description: string;
  file_url?: string;
  file_name?: string;
  downloads: number;
  status: 'draft' | 'published';
  author_id?: string;
  access?: string;
  price?: string;
}

export const publicationService = {
  async getAll(): Promise<Publication[]> {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getPublished(): Promise<Publication[]> {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Publication | null> {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async create(publication: Omit<Publication, 'id' | 'created_at' | 'downloads'>, file?: File): Promise<Publication> {
    let fileUrl = '';

    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('publications')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('publications')
        .getPublicUrl(fileName);

      fileUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from('publications')
      .insert({
        title: publication.title,
        type: publication.type,
        description: publication.description,
        file_url: fileUrl || null,
        status: publication.status,
        author_id: publication.author_id || null,
        downloads: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Publication>): Promise<void> {
    const { error } = await supabase
      .from('publications')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async incrementDownloads(id: string): Promise<void> {
    const { data } = await supabase
      .from('publications')
      .select('downloads')
      .eq('id', id)
      .single();

    if (data) {
      await supabase
        .from('publications')
        .update({ downloads: data.downloads + 1 })
        .eq('id', id);
    }
  },

  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('publications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'publications' }, callback)
      .subscribe();
  },
};

export default publicationService;