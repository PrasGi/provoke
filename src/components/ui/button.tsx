import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button-variants';

function Button({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const setPointerVars = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`);
  };

  const setPressVars = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`);
  };

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onPointerMove={setPointerVars}
      onPointerDown={setPressVars}
      {...props}
    >
      {children}
      <span className="provoke-button-ripple" aria-hidden="true" />
    </ButtonPrimitive>
  );
}

export { Button };
