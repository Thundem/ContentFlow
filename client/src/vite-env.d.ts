/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    prompt(): Promise<void>;
}

interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
}

interface NavigatorExtended extends Navigator {
    standalone?: boolean;
}