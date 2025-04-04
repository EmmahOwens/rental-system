
import React from 'react';

declare module '@/components/NeumorphicCard' {
  export interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    title?: string;
    value?: string | number;
  }
  
  export function NeumorphicCard(props: NeumorphicCardProps): JSX.Element;
}
