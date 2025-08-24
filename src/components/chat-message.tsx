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
  // Try to parse message content as JSON to support structured messages
  let parsed: any = null;
  try {
    parsed = typeof message.content === 'string' ? JSON.parse(message.content) : null;
  } catch {}

  const contentStr = typeof message.content === 'string' ? message.content : ''

  const isImageUrl = (url: string) => /^(https?:)?\/\/.*\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url) || /^data:image\//.test(url);
  const jsonHasImage = parsed && typeof parsed === 'object' && typeof parsed.imageUrl === 'string';
  const imageUrl: string | null = jsonHasImage ? parsed.imageUrl : (isImageUrl(contentStr) ? contentStr : null);
  const caption: string | undefined = jsonHasImage && typeof parsed.text === 'string' ? parsed.text : undefined;

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
        {imageUrl ? (
          <div className={cn('overflow-hidden rounded-xl border w-fit', isOwnMessage ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-border')}>
            <a href={imageUrl} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={caption || 'image'}
                className="block max-w-[260px] md:max-w-[320px] max-h-[280px] object-contain"
                loading="lazy"
              />
            </a>
            {caption && (
              <div className={cn('px-3 py-2 text-xs', isOwnMessage ? 'text-foreground' : 'text-foreground')}>{caption}</div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              'py-2 px-3 rounded-xl text-sm w-fit',
              isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
            )}
          >
            {contentStr}
          </div>
        )}
      </div>
    </div>
  )
}
