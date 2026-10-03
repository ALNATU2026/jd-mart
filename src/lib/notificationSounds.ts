// Web Audio API Synthesizer & Web Notification Engine for JD Mart Chat

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a pleasant, crisp 2-tone melodic notification chime (C6 -> E6 harmonic bell)
 * Works universally on mobile browsers, iOS/Safari, Android/Chrome, and desktop.
 */
export function playMessageSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Primary Tone: A5 rising to C6 bell
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.08); // C6

    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.38);

    // Harmonic Over-Tone: High crystalline chime E6
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now + 0.1); // E6

    gain2.gain.setValueAtTime(0.32, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.6);
  } catch (err) {
    console.warn('[Audio Chime Notice]', err);
  }
}

/**
 * Triggers physical vibration on supported mobile devices
 */
export function vibratePhone(pattern: number[] = [180, 80, 180]): void {
  try {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // vibration not allowed or unsupported
  }
}

/**
 * Requests browser/phone system notification permissions
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return Notification.permission;
  }
}

/**
 * Triggers a native system notification that pops up on the user's phone / desktop
 */
export function showPhonePopUpNotification(
  title: string,
  body: string,
  options?: {
    tag?: string;
    icon?: string;
    onClick?: () => void;
    data?: Record<string, unknown>;
  }
): void {
  // Always sound and vibrate first
  playMessageSound();
  vibratePhone([200, 100, 200]);

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon: options?.icon || '/assets/logos/jdmart_logo.png',
        badge: '/assets/logos/jdmart_logo.png',
        tag: options?.tag || `jdmart-msg-${Date.now()}`,
        // @ts-expect-error vibrate is standard in mobile Notification spec
        vibrate: [200, 100, 200],
        silent: false,
        data: options?.data,
      });

      if (options?.onClick) {
        notif.onclick = () => {
          window.focus();
          options.onClick?.();
          notif.close();
        };
      }
    } catch (err) {
      console.warn('[Notification Pop-up Notice]', err);
    }
  }
}
