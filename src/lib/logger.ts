import { supabase } from './supabase';

export type LogLevel = 'error' | 'warning' | 'info';

export const logSystemEvent = async (
  message: string, 
  source: string = 'frontend', 
  level: LogLevel = 'error', 
  error?: any
) => {
  try {
    const { error: insertError } = await supabase
      .from('system_logs')
      .insert({
        message,
        source,
        level,
        stack_trace: error?.stack || null,
        metadata: error ? { name: error.name, message: error.message } : null
      });

    if (insertError) {
      console.error('Failed to log to database:', insertError);
    } else if (level === 'error') {
      // 🚀 Explicitly trigger the notification function for critical errors
      // This ensures you get an email for EVERY error immediately
      await supabase.functions.invoke('send-error-notification', {
        body: { message, source, stack: error?.stack }
      }).catch(err => console.error('Notification trigger failed:', err));
    }
  } catch (err) {
    console.error('Logger failed:', err);
  }
};
