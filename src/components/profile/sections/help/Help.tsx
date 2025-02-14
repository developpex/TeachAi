import { GettingStarted } from './GettingStarted';
import { FAQ } from './FAQ';

export function Help() {
  return (
    <div className="space-y-6">
      <GettingStarted />
      <FAQ />
    </div>
  );
}