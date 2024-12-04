export function takeUntilRemainderStartsWith(
  fragment: string,
  text: string,
): [string, string]  {
  const occurrence = text.indexOf(fragment)
  return occurrence >= 0 ? [text.substring(0, occurrence), text.substring(occurrence)] : [text, ""]
}
