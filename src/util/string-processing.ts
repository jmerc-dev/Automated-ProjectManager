// Notification Type

export function NotificationTypeToReadableString(type: string): string {
  const typeStringArray = type.split("_");
  for (let i = 0; i < typeStringArray.length; i++) {
    typeStringArray[i] =
      typeStringArray[i].charAt(0).toUpperCase() + typeStringArray[i].slice(1);
  }
  return typeStringArray.join(" ");
}
