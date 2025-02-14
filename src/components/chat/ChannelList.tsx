import { Hash } from 'lucide-react';
import type { Channel } from '../../types';
import { CATEGORY_ORDER } from '../../utils/constants';

interface ChannelListProps {
  groupedChannels: Record<string, Channel[]>;
  selectedChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
}

export function ChannelList({
  groupedChannels,
  selectedChannel,
  onChannelSelect
}: ChannelListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {CATEGORY_ORDER.map(category => {
        const channelList = groupedChannels[category];
        if (!channelList) return null;

        return (
          <div key={category}>
            <h3 className="text-xs font-semibold text-primary-dark uppercase tracking-wider mb-2">
              {category}
            </h3>
            <div className="space-y-1">
              {channelList.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => onChannelSelect(channel)}
                  className={`w-full flex items-center px-2 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
                    selectedChannel?.id === channel.id
                      ? 'bg-accent text-white'
                      : 'text-primary hover:bg-sage/10'
                  }`}
                >
                  <Hash className="h-4 w-4 flex-shrink-0 mr-2" />
                  <div className="flex-1 text-left">
                    <div>{channel.name}</div>
                    {channel.lastMessage && (
                      <div className="text-xs truncate opacity-75">
                        {channel.lastMessage.userDisplayName}: {channel.lastMessage.content}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}