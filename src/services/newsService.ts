import supabase from '../lib/supabaseClient';

export interface NewsPost {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  category_label: string;
  date_label: string;
  read_time: string;
  image_url?: string;
  published: boolean;
}

export interface NewsEvent {
  id: string;
  created_at: string;
  title: string;
  description: string;
  location: string;
  event_date?: string;
  day_label: string;
  month_label: string;
  cta_text: string;
  cta_style: 'filled' | 'outline';
  published: boolean;
}

export const newsService = {
  async getAllPosts(): Promise<NewsPost[]> {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAllPostsAdmin(): Promise<NewsPost[]> {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAllEvents(): Promise<NewsEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('published', true)
      .order('event_date', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getAllEventsAdmin(): Promise<NewsEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createPost(post: Omit<NewsPost, 'id' | 'created_at'>): Promise<NewsPost> {
    const { data, error } = await supabase
      .from('news_posts')
      .insert(post)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updatePost(id: string, updates: Partial<NewsPost>): Promise<void> {
    const { error } = await supabase
      .from('news_posts')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('news_posts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async createEvent(event: Omit<NewsEvent, 'id' | 'created_at'>): Promise<NewsEvent> {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateEvent(id: string, updates: Partial<NewsEvent>): Promise<void> {
    const { error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  subscribeToPostChanges(callback: (payload: unknown) => void) {
    return supabase
      .channel('news-posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news_posts' }, callback)
      .subscribe();
  },

  subscribeToEventChanges(callback: (payload: unknown) => void) {
    return supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, callback)
      .subscribe();
  },
};

export default newsService;
