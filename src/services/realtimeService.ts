import supabase from '../lib/supabaseClient';

export type RealtimeEvent = {
  table: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  oldRecord: any;
  newRecord: any;
};

type RealtimeCallback = (payload: RealtimeEvent) => void;

class RealtimeService {
  private channels: Map<string, any> = new Map();

  subscribeToTable(
    tableName: string,
    callback: RealtimeCallback,
    filter?: { column: string; value: string }
  ) {
    const channelName = `${tableName}-${filter?.column || 'all'}-${filter?.value || 'all'}`;

    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
        },
        (payload) => {
          callback({
            table: tableName,
            eventType: payload.eventType,
            oldRecord: payload.old ?? null,
            newRecord: payload.new ?? null,
          });
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  unsubscribeAll() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  subscribeToApplications(callback: RealtimeCallback, status?: string) {
    return this.subscribeToTable(
      'applications',
      callback,
      status ? { column: 'status', value: status } : undefined
    );
  }

  subscribeToPublications(callback: RealtimeCallback, status?: string) {
    return this.subscribeToTable(
      'publications',
      callback,
      status ? { column: 'status', value: status } : undefined
    );
  }

  subscribeToProfiles(callback: RealtimeCallback) {
    return this.subscribeToTable('profiles', callback);
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;