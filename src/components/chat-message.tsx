import { cn } from '@/lib/utils'

import type { ChatMessage } from '@/hooks/use-realtime-chat'

// Array of 20 random names
const RANDOM_NAMES = [
  'SunnyLion', 'BlueWhale', 'HappyFox', 'MightyBear', 'SwiftEagle',
  'BraveTiger', 'GentlePanda', 'CleverOtter', 'LuckyRabbit', 'WiseOwl',
  'ShyDeer', 'BoldWolf', 'TinyMouse', 'QuickSquirrel', 'CalmTurtle',
  'JollyFrog', 'KindElephant', 'PlayfulSeal', 'BrightStar', 'MagicPenguin'
];

// Deterministically assign a name to a userId
function getRandomName(userId?: string) {
  if (!userId) return 'Unknown User';
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) % RANDOM_NAMES.length;
  }
  return RANDOM_NAMES[Math.abs(hash) % RANDOM_NAMES.length];
}

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
}



export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  return (
    <div className={`flex mt-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
          'items-end': isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn('flex items-center gap-2 text-xs px-3', {
              'justify-end flex-row-reverse': isOwnMessage,
            })}
          >
            <span className={'font-medium'}>{getRandomName(message.userId)}</span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        )}
        <div
          className={cn(
            'py-2 px-3 rounded-xl text-sm w-fit',
            isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}
