export interface FluidCloudPayload {
  title: string;
  subtitle?: string;
  icon?: 'check' | 'info' | 'alert' | 'sparkles' | 'shield' | 'smartphone' | 'newspaper' | 'contact' | 'download';
  type?: 'default' | 'success' | 'warning' | 'info';
  duration?: number;
}

// Global dispatcher to trigger Fluid Cloud notification from any component
export function triggerFluidCloud(payload: FluidCloudPayload) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent<FluidCloudPayload>('fluid-cloud-event', { detail: payload });
    window.dispatchEvent(event);
  }
}
