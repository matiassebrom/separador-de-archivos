import { ChatMessage } from '@/lib/types';

interface Props {
  message: ChatMessage;
}

/**
 * Burbuja del usuario – aparece alineada a la derecha.
 * Componente de display puro (no necesita 'use client' porque no usa hooks).
 */
export function UserMessage({ message }: Props) {
  return (
    <div className="flex justify-end my-2">
      <div className="max-w-[75%] bg-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-sm shadow-sm">
        {message.text}
      </div>
    </div>
  );
}
