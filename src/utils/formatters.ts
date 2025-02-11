import { formatDistanceToNow } from 'date-fns';

export function formatTimeAgo(timestamp: number | null): string {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
}

export function formatTextForCopy(text: string): string {
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  
  formattedText = formattedText
    .replace(/\*/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1')
    .replace(/`([^`]+)`/g, '$1');

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = formattedText;

  const boldElements = tempDiv.getElementsByTagName('b');
  Array.from(boldElements).forEach(element => {
    element.style.fontWeight = 'bold';
  });

  return tempDiv.innerText;
}