import { TonAppBadge } from './ton-app-badge';

/**
 * Full-width row holding nothing but the badge. Used on the index page in the
 * gap between the converter and the FAQ, where it reads as a divider rather than
 * as something competing with the tool.
 */
export const TonAppBadgeStrip = () => (
  <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-10 flex justify-center">
    <TonAppBadge />
  </div>
);
