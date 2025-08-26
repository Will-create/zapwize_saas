import { forwardRef, HTMLAttributes } from 'react';

const Avatar = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span ref={ref} className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props} />
));
Avatar.displayName = 'Avatar';

const AvatarImage = forwardRef<HTMLImageElement, HTMLAttributes<HTMLImageElement>>(({ className, ...props }, ref) => (
  <img ref={ref} className={`aspect-square h-full w-full ${className}`} {...props} />
));
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ${className}`}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
